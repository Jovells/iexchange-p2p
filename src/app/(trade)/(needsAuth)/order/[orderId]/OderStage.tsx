"use client";
import { Timer } from "./timer";
import React, { lazy, Suspense, useState } from "react";
import { BOT_MERCHANT_ID, offerTypes } from "@/common/constants";
import fetchAccountDetails from "@/common/api/fetchAccountDetails";
import fetchOrder from "@/common/api/fetchOrder";
import { useContracts } from "@/common/contexts/ContractContext";
import Loader from "@/components/loader/Loader";
import Button from "@/components/ui/Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useReadContract } from "wagmi";
import { OrderState, WriteContractWithToastReturnType } from "@/common/api/types";
import { formatCurrency, formatBlockTimesamp, shortenAddress, getUserConfig } from "@/lib/utils";
import useWriteContractWithToast from "@/common/hooks/useWriteContractWithToast";
import CediH from "@/common/abis/CediH";
import Link from "next/link";
import fetchOrderStatus from "@/common/api/fetchOrderStatus";
import { ixToast as toast } from "@/lib/utils";
import { useModal } from "@/common/contexts/ModalContext";
import OrderCancellationWarning from "@/components/modals/OrderCancellationWarning";
import PaymentConfirmation from "@/components/modals/PaymentConfirmation";
import ReleaseConfirmation from "@/components/modals/ReleaseConfirmation";
import BuyerReleaseModal from "@/components/modals/BuyerReleaseModal";
import { useUser } from "@/common/contexts/UserContext";
import SellerPaymentConfirmedModal from "@/components/modals/SellerPaymentConfirmedModal";
import OrderCancellationModal from "@/components/modals/OrderCancelledModal";
import { MessageCircle, ToggleLeft, ToggleRight, X } from "lucide-react";
import { ORDER, ORDER_STATUS, TOKEN_BALANCE } from "@/common/constants/queryKeys";
import InfoBlock from "../infoBlock";
import DetailBlock from "./detailBlock";
import { CachedConversation, useSendMessage } from "@xmtp/react-sdk";
import Image from "next/image";
import { formatEther } from "viem";

const ChatWithMerchant = lazy(() => import("@/components/merchant/ChatWithMerchant"));

// Later in your component, when you use ChatWithMerchant:

const POLLING_INTERVAL = 5000;
const toastId = "order-status";

function OrderStage({ orderId, toggleExpand }: { orderId: string; toggleExpand: () => void }) {
  const { indexerUrl, p2p, tokens, currentChain } = useContracts();
  const [conversation, setConversation] = useState<CachedConversation | undefined>();
  const queryClient = useQueryClient();
  const { address, isConnected } = useUser();
  const { writeContractAsync, isPending: isWriteContractPending } = useWriteContractWithToast();
  const [pollToggle, setPollToggle] = React.useState(true);
  const { sendMessage } = useSendMessage();
  const {
    writeContractAsync: writeToken,
    data: approveHash,
    isSuccess: isApproveSuccess,
    isPending: isP2pWritePending,
  } = useWriteContractWithToast();
  const [transactionHashes, setTransactionHashes] = React.useState<{ hash: string; status: string }[] | null>(null);
  const { showModal } = useModal();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const {
    data: order,
    error: orderError,
    isLoading: orderLoading,
  } = useQuery({
    queryKey: ORDER({ orderId, indexerUrl }),
    queryFn: () => fetchOrder(indexerUrl, orderId),
    retry: 3,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  console.log("Order orderstage", order);

  const userConfig =
    order &&
    getUserConfig({
      trader: order.trader,
      merchant: order?.offer.merchant,
      userAddress: address!,
      orderType: order.orderType!,
    });

  const fiatAmount =
    order && formatCurrency(Number(order?.quantity) * Number(order?.offer.rate), order.offer.currency.currency);
  const cryptoAmount = order && formatCurrency(Number(order?.quantity), order.offer.token.symbol);
  console.log("Is Buyer", userConfig?.isBuyer);

  const { data: allowance } = useReadContract({
    abi: CediH,
    address: order?.offer.token.id,
    functionName: "allowance",
    args: [address!, p2p.address],
    query: {
      enabled: !!order && !userConfig?.isBuyer,
    },
  });

  const { data: accountDetails, error: accountDetailsError } = useQuery({
    queryKey: ["fetchAccountDetails", order?.accountHash],
    queryFn: () => fetchAccountDetails(order?.accountHash as string),
    enabled: !!order,
    staleTime: 0,
  });

  const getButtonConfig = () => {
    if (!order) return { text: "", buttonText: "", onClick: () => {}, disabled: true, shouldPoll: false };

    const getDisabledAction = (buttonText: string, text: string, shouldPoll = true) => ({
      buttonText,
      text,
      onClick: () => {},
      disabled: true,
      shouldPoll,
    });
    const getEnabledAction = (buttonText: string, text: string, onClick: () => {}, shouldPoll = false) => ({
      buttonText,
      text,
      onClick,
      disabled: false,
      shouldPoll,
    });
    const isBuyer = userConfig?.isBuyer;

    console.log("qwOrder Status", order.status, isBuyer, order);

    switch (order.status) {
      case OrderState.Pending:
        if (isBuyer) {
          return order.offer.offerType === offerTypes.buy
            ? getDisabledAction(
                "Waiting for Merchant",
                "Please wait for the merchant to accept your order and put the funds in escrow",
              )
            : getEnabledAction(
                "Done With Payment",
                "Click “Done with Payment” to notify the Seller or click “Cancel” to stop the Order",
                handlePayOrder,
              );
        } else {
          return order.offer.offerType === offerTypes.sell
            ? getDisabledAction("Waiting for Buyer", "Please wait for the buyer to make payment")
            : getEnabledAction(
                "Accept Order",
                "Click “Accept Order” accept the order and put the funds in escrow",
                handleAcceptOrder,
              );
        }
      case OrderState.Accepted:
        return isBuyer
          ? getEnabledAction(
              "Done With Payment",
              "Click “Done with Payment” to notify the Seller or click “Cancel” to stop the Order",
              handlePayOrder,
            )
          : getDisabledAction("Waiting for Buyer", "Please wait for the buyer to make payment");
      case OrderState.Paid:
        return isBuyer
          ? getDisabledAction("Waiting for Seller to Release", "Please wait for the seller to release")
          : getEnabledAction(
              "Release Funds",
              "Click “Release Funds” to release the funds to the buyer",
              handleReleaseFunds,
            );
      case OrderState.Released:
        return getDisabledAction("Completed", "Order has been completed", false);
      case OrderState.Cancelled:
        return getDisabledAction("Cancelled", "Order has been cancelled", false);
      default:
        console.log("qw default", order.status);
        return getDisabledAction("", "", false);
    }
  };

  const handleReleaseFunds = async () => {
    showModal(<ReleaseConfirmation cryptoAmount={cryptoAmount!} fiatAmount={fiatAmount!} onClick={release} />);

    async function release() {
      console.log("Release funds");
      const writeResult = await writeContractAsync(
        { toastId, waitForReceipt: true },
        {
          address: p2p.address,
          abi: p2p.abi,
          functionName: "releaseOrder",
          args: [BigInt(orderId)],
        },
      );
      conversation && sendMessage(conversation, "Released. TxHash: " + writeResult.txHash);
      handleOptimisticUpdate(OrderState.Released, writeResult);
      return writeResult.txHash;
      // Optimistically update the order status
    }
  };

  const handlePayOrder = async () => {
    console.log("Transfer funds");
    showModal(
      <PaymentConfirmation
        amount={cryptoAmount!}
        accountName={accountDetails?.name!}
        accountNumber={accountDetails?.number!}
        extraDetails={accountDetails?.details}
        onClick={pay}
      />,
    );

    async function pay() {
      const writeResult = await writeContractAsync(
        { toastId, waitForReceipt: true },
        {
          address: p2p.address,
          abi: p2p.abi,
          functionName: "payOrder",
          args: [BigInt(orderId)],
        },
      );
      // Optimistically update the order status
      handleOptimisticUpdate(OrderState.Paid, writeResult);
      conversation && sendMessage(conversation, "Paid. TxHash: " + writeResult.txHash);
      return writeResult.txHash;
    }
  };

  const handleAcceptOrder = async () => {
    console.log("Accept order");

    const alreadyApproved = allowance! >= BigInt(order?.quantity || 0);
    console.log("qwAllowance", formatEther(allowance!), formatEther(BigInt(order?.quantity || 0)), alreadyApproved);

    if (!alreadyApproved) {
      const approveHash = await writeToken(
        {},
        {
          abi: tokens[0].abi,
          address: order?.offer.token.id as `0x${string}`,
          functionName: "approve",
          args: [p2p.address, order?.quantity],
        },
      );
    }

    const writeResult = await writeContractAsync(
      { toastId, waitForReceipt: true },
      {
        address: p2p.address,
        abi: p2p.abi,
        functionName: "acceptOrder",
        args: [BigInt(orderId)],
      },
    );
    // Optimistically update the order status
    handleOptimisticUpdate(OrderState.Accepted, writeResult);
    conversation && sendMessage(conversation, "Accepted. TxHash: " + writeResult.txHash);
  };

  function handleOptimisticUpdate(status: OrderState, writeResult: WriteContractWithToastReturnType) {
    const updatedStatus = { ...orderStatus, status };
    if (status === OrderState.Released || status === OrderState.Accepted || status === OrderState.Cancelled) {
      queryClient.refetchQueries({ queryKey: TOKEN_BALANCE({ address: order?.offer.token.id! }) });
    }
    console.log("qworderStatusQueryKey", orderStatusQueryKey);
    // queryClient.setQueryData(orderStatusQueryKey, (data: any) => {
    //   console.log("qwOptimisticUpdate", data, status, writeResult);
    //   const newD = [...data];
    //   newD[7] = status;
    //   return newD;
    // });
    refetchOrderStatus();
    setTransactionHashes([...(transactionHashes || []), { hash: writeResult.txHash, status: OrderState[status] }]);
  }

  const handleCancelOrder = async () => {
    console.log("Cancel Order", orderId, order);
    showModal(
      <OrderCancellationWarning
        onClick={cancel}
        // TODO @Jovells @baahkusi: GET THE NUMBER OF CANCELLATIONS REMAINING FROM THE CONTRACT
        cancellationsRemaining={10}
      />,
    );

    async function cancel() {
      const writeResult = await writeContractAsync(
        { toastId },
        {
          address: p2p.address,
          abi: p2p.abi,
          functionName: "cancelOrder",
          args: [orderId],
        },
      );
      // Optimistically update the order status
      handleOptimisticUpdate(OrderState.Cancelled, writeResult);
      return writeResult.txHash;
    }
  };

  const { text, onClick, disabled, buttonText, shouldPoll } = getButtonConfig();

  // poll order status
  const {
    data: orderStatusContract,
    queryKey: orderStatusQueryKey,
    refetch: refetchOrderStatus,
  } = useReadContract({
    abi: p2p.abi,
    address: p2p.address,
    functionName: "orders",
    args: [BigInt(orderId)],
    query: {
      enabled: shouldPoll && pollToggle,
      refetchInterval: q => {
        console.log("qeRefetching order status", q);
        const fetchedStatus = q.state.data?.[7];
        q.state;
        if (fetchedStatus === order?.status || fetchedStatus === undefined) return POLLING_INTERVAL;

        const updatedOrder = { ...order, status: fetchedStatus };
        if (fetchedStatus === OrderState.Cancelled) {
          //TODO@Jovells replace address with correct txhash
          showModal(<OrderCancellationModal txHash={address!} />);
        } else if (fetchedStatus === OrderState.Released) {
          isBuyer &&
            showModal(<BuyerReleaseModal txHash={address!} cryptoAmount={cryptoAmount!} fiatAmount={fiatAmount!} />);
        } else if (fetchedStatus === OrderState.Paid) {
          isSeller && showModal(<SellerPaymentConfirmedModal txHash={address!} fiatAmount={fiatAmount!} />);
        } else if (fetchedStatus === OrderState.Accepted) {
          isBuyer &&
            toast.success(
              t => {
                return (
                  <div>
                    <div className="text-gray-500">Order Accepted</div>
                    <div className="text-gray-500">Please Proceed to pay</div>
                  </div>
                );
              },
              {
                duration: 5000,
              },
            );
        } else {
          toast.success("Order Status Updated: " + fetchedStatus, { id: toastId });
        }

        queryClient.setQueryData(ORDER({ indexerUrl, orderId }), updatedOrder);
        console.log("qeRefetching order status", order?.status, updatedOrder.status);

        return POLLING_INTERVAL;
      },
    },
  });
  const orderStatus = { status: orderStatusContract?.[7] };
  // const { data: orderStatus } = useQuery({
  //   queryKey: ORDER_STATUS({ orderId, indexerUrl }),
  //   queryFn: () => fetchOrderStatus(indexerUrl, orderId),
  //   retry: 3,
  //   enabled: shouldPoll && pollToggle,
  //   refetchInterval: q => {
  //     console.log("qeRefetching order status", q);
  //     const fetchedStatus = q.state.data?.status;
  //     q.state;
  //     if (fetchedStatus === order?.status || fetchedStatus === undefined) return POLLING_INTERVAL;

  //     const updatedOrder = { ...order, status: fetchedStatus };
  //     if (fetchedStatus === OrderState.Cancelled) {
  //       //TODO@Jovells replace address with correct txhash
  //       showModal(<OrderCancellationModal txHash={address!} />);
  //     } else if (fetchedStatus === OrderState.Released) {
  //       showModal(<BuyerReleaseModal txHash={address!} cryptoAmount={cryptoAmount!} fiatAmount={fiatAmount!} />);
  //     } else if (fetchedStatus === OrderState.Paid) {
  //       showModal(<SellerPaymentConfirmedModal txHash={address!} fiatAmount={fiatAmount!} />);
  //     } else if (fetchedStatus === OrderState.Accepted) {
  //       isBuyer &&
  //         toast.success(
  //           t => {
  //             return (
  //               <div>
  //                 <div className="text-gray-500">Order Accepted</div>
  //                 <div className="text-gray-500">Please Proceed to pay</div>
  //               </div>
  //             );
  //           },
  //           {
  //             duration: 5000,
  //           },
  //         );
  //     } else {
  //       toast.success("Order Status Updated: " + fetchedStatus, { id: toastId });
  //     }

  //     queryClient.setQueryData(ORDER({ indexerUrl, orderId }), updatedOrder);
  //     console.log("qeRefetching order status", order?.status, updatedOrder.status);

  //     return POLLING_INTERVAL;
  //   },
  // });

  if (!order && orderLoading) {
    console.log("Loading order", order, orderLoading);
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold text-gray-700">Order Not Found</h2>
        <p className="text-gray-500 mt-2">The order you are looking for does not exist</p>
        <Link href="/" className="mt-4 bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-[#01a2e4]">
          Go Home
        </Link>
      </div>
    );
  }

  const { isTrader, isMerchant, isBuy, isSell, isBuyer, isSeller, otherParty } = userConfig!;
  if (orderError) {
    console.log("Error fetching order", orderError);
  }
  if (accountDetailsError) {
    console.log("Error fetching account details", accountDetailsError);
  }
  // console.log("OrderData", order);
  // console.log("qyaccountDetails", accountDetails);

  if (isConnected && !(isTrader || isMerchant)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold text-gray-700">Unauthorized Access</h2>
        <p className="text-gray-500 mt-2">You are not authorized to view this page.</p>
        <Link href="/" className="mt-4 bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-[#01a2e4]">
          Go Home
        </Link>
      </div>
    );
  }

  const isCancellable =
    (order.status === OrderState.Pending && isMerchant) || (order.status === OrderState.Accepted && isTrader);

  const isBuyerAndNotYetAccepted = order?.status === OrderState.Pending && isBuyer && isTrader;
  const isPending = order?.status === OrderState.Pending;
  const isPaid = order?.status === OrderState.Paid;
  const isAccepted = order?.status === OrderState.Accepted || order.status === OrderState.Paid;
  const isCompleted = order?.status === OrderState.Released || order?.status === OrderState.Cancelled;
  const sellerText = {
    1: {
      head: "Order Information",
      sub: isAccepted ? "Order Accepted" : text,
    },
    2: {
      head: "Confirm Payment",
      sub: isPaid ? "Please confirm that the payment has been made" : "Wait for buyer  to pay",
    },
    3: {
      head: "Release",
      sub: isPaid ? text : "After confirming the payment has been made, release crypto",
    },
  };
  const buyerText = {
    1: {
      head: "Order Information",
      sub: isAccepted ? "Order Accepted" : text,
    },
    2: {
      head: "Make payment",
      sub: isPaid
        ? "You have made Payment"
        : isAccepted
        ? text
        : "Please make payment after merchant accepts your order",
    },
    3: {
      head: "Wait for Release",
      sub: isPaid ? text : "After payment, wait for release",
    },
  };
  const isBot = order.offer.merchant.id === BOT_MERCHANT_ID;
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      }
    >
      <div className="w-full bg-[#CCE0F6] dark:bg-gray-800 px-6">
        <div className="w-full lg:container lg:mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between py-10 lg:px-0">
          <div className="gap-3">
            <span className="font-bold text-gray-600 dark:text-gray-300">Order Created</span>
            <div className="flex flex-row space-x-2">
              {order.status === OrderState.Pending && (
                <>
                  <span className="text-gray-500 dark:text-gray-400">Time Limit Exhaustion:</span>
                  <Timer timestamp={order.blockTimestamp} seconds={30 * 60} />
                </>
              )}
            </div>
          </div>
          <div className="space-y-0 lg:space-y-2">
            <div className="flex flex-row items-center space-x-2">
              <span className="text-gray-500 dark:text-gray-400">Order number:</span>
              <span className="text-black dark:text-white text-sm">{orderId}</span>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <span className="text-gray-500 dark:text-gray-400">Date created:</span>
              <span className="text-black dark:text-white text-sm">{formatBlockTimesamp(order?.blockTimestamp)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-0 py-4 ">
        <div className="w-full h-auto grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-20">
          {/* Chat Section */}
          <div className="hidden lg:block">
            <ChatWithMerchant conversation={conversation} setConversation={setConversation} otherParty={otherParty} />
          </div>

          {/* Order Information Section */}
          {!isCompleted ? (
            <div className="p-6 h-full shadow-lg border border-gray-300 dark:border-gray-700 rounded-xl">
              {/* Header */}
              <div className="flex justify-between mb-6">
                <div className="flex items-center gap-2">
                  {isBot && <span className="rounded text-gray-100 font-bold text-sm p-1 bg-primary">BOT ORDER</span>}{" "}
                  <h2 className="text-lg text-gray-500 dark:text-gray-400">Order in Progress</h2>
                  {shouldPoll && isBot && (
                    <>
                      {" "}
                      <span className="text-gray-500 dark:text-gray-400">Bot will respond in </span>
                      <Timer timestamp={order.blockTimestamp} seconds={3 * 60} />{" "}
                    </>
                  )}
                </div>

                <div
                  className={`px-2 py-1 text-sm text-gray-100 rounded-xl ${isBuyer ? " bg-[#4ade80]" : "bg-[#f6465d]"}`}
                >
                  {isBuyer ? "Buy" : "Sell"}
                </div>
              </div>

              {/* Order Details */}
              <div className="flex flex-col items-start gap-8">
                <div className="flex w-full">
                  <div className="flex flex-col items-center">
                    <div
                      className={` ${
                        isPending ? "bg-primary" : "bg-lightGray dark:bg-lightGray-dark"
                      } text-white rounded-full w-10 h-12 flex items-center justify-center font-bold`}
                    >
                      1
                    </div>
                    <div
                      className={`h-full border-l-2   ${
                        isPending ? "border-primary" : "border-lightGray dark:border-lightGray-dark"
                      }`}
                    ></div>
                  </div>
                  <div className="ml-4 flex-grow">
                    <span className="text-darkGray dark:text-darkGray-dark font-semibold">Order Information</span>
                    <p className="text-gray-500 dark:text-gray-400">{isBuyer ? buyerText[1].sub : sellerText[1].sub}</p>

                    <div className="flex border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 mt-2 flex-col justify-start items-start gap-1 w-full">
                      <InfoBlock
                        isAmount
                        label="Fiat Amount"
                        value={isBuyer ? fiatAmount : cryptoAmount}
                        isBuyer={isBuyer}
                      />
                      <InfoBlock label="Price" value={order?.offer.rate} />
                      <InfoBlock label="Receive Quantity" value={isBuyer ? cryptoAmount : fiatAmount} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="flex flex-col items-start gap-8">
                <div className="flex flex-row w-full">
                  <div className="flex flex-col items-center">
                    <div
                      className={` ${
                        isPaid ? "bg-lightGray dark:bg-lightGray-dark" : "bg-primary"
                      } text-white rounded-full w-10 h-12 flex items-center justify-center font-bold`}
                    >
                      2
                    </div>
                    <div
                      className={`h-full border-l-2   ${
                        isPaid ? "border-lightGray dark:border-lightGray-dark" : "border-primary"
                      }`}
                    ></div>
                  </div>
                  <div className="ml-4 flex-grow">
                    <span className="text-darkGray dark:text-darkGray-dark font-semibold">
                      {isBuyer ? buyerText[2].head : sellerText[2].head}
                    </span>
                    <p className="text-gray-500 dark:text-gray-400">{isBuyer ? buyerText[2].sub : sellerText[2].sub}</p>
                    <div className="w-full border  mb-4 mt-2 flex rounded-xl p-4 h-auto border-gray-200 dark:border-gray-700">
                      <div className="w-full  flex flex-col gap-4">
                        <DetailBlock label="Payment Method" value={order?.offer.paymentMethod.method} />
                        <DetailBlock
                          label="Account Name"
                          value={isBuyerAndNotYetAccepted ? "********" : accountDetails?.name}
                        />
                        <DetailBlock
                          label="Account Number"
                          value={isBuyerAndNotYetAccepted ? "********" : accountDetails?.number}
                        />
                      </div>

                      {accountDetails?.details && (
                        <div className="w-full">
                          <DetailBlock
                            label="Extra Details"
                            value={isBuyerAndNotYetAccepted ? "********" : accountDetails?.details}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Proceed Information */}
              <div className="flex flex-col items-start gap-8 mb-12">
                <div className="flex flex-row w-full">
                  <div className="flex flex-col items-center">
                    <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                      3
                    </div>
                  </div>
                  <div className="ml-4 flex-grow">
                    <span className="text-darkGray dark:text-darkGray-dark font-semibold">
                      {isBuyer ? buyerText[3].head : sellerText[3].head}
                    </span>
                    <p className="text-gray-500 dark:text-gray-400">{isBuyer ? buyerText[3].sub : sellerText[3].sub}</p>
                  </div>
                </div>
              </div>

              {/* Transactions */}
              {transactionHashes && (
                <div>
                  <h2 className="text-gray-700 dark:text-gray-300">Transactions:</h2>
                  {transactionHashes.map((hash, index) => (
                    <div key={index} className="flex flex-row items-center space-x-2">
                      <div className="text-gray-500 dark:text-gray-400">{hash.status} :</div>
                      <a
                        href={`${currentChain?.blockExplorers?.default.url}/tx/${hash.hash}`}
                        target="_blank"
                        className="text-blue-500 dark:text-blue-300"
                      >
                        {shortenAddress(hash.hash, 8)}
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col lg:flex-row gap-6 my-6">
                <Button
                  loading={isWriteContractPending}
                  text={buttonText}
                  className={`${
                    disabled
                      ? "bg-slate-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400"
                      : "bg-black dark:bg-slate-100 dark:text-gray-900 text-white hover:bg-gray-400 dark:hover:bg-gray-400 transition duration-300 ease-in-out"
                  } rounded-xl px-4 py-2`}
                  onClick={onClick}
                  disabled={disabled}
                />
                {isCancellable && (
                  <Button
                    text="Cancel Order"
                    className="text-black dark:text-white hover:text-red-500 dark:hover:text-red-500 rounded-xl px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 ease-in-out"
                    onClick={handleCancelOrder}
                  />
                )}
                <Button
                  text="Chat With Merchant"
                  icon={<MessageCircle />}
                  className="block lg:hidden bg-[#01a2e4] text-black dark:text-white rounded-xl px-4 py-2 hover:bg-[#01a2e4] dark:hover:bg-blue-500 transition duration-300 ease-in-out"
                  onClick={() => setIsChatModalOpen(true)}
                />
              </div>
            </div>
          ) : (
            /* Order completed sections */
            <div className="p-6 h-full shadow-lg border border-gray-300 dark:border-gray-700 rounded-xl flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-gray-500 font-bold dark:text-gray-400">Order {buttonText}</h2>
                {order.status === OrderState.Cancelled ? (
                  <Image src="/images/icons/cancelled.svg" alt="success" width={60} height={60} />
                ) : (
                  <Image src="/images/icons/success.svg" alt="success" width={60} height={60} />
                )}
              </div>
              <div className=" flex-grow">
                <span className="text-black dark:text-white ">
                  {isBuyer ? "Buy" + " " + order.offer.token.symbol : "Sell" + " " + order.offer.token.symbol}
                </span>
                <div className="flex border border-lightGray dark:border-lightGray-dark rounded-xl p-4 flex-col justify-start items-start gap-1 w-full mt-6">
                  <InfoBlock isAmount label="Fiat Amount" value={fiatAmount} isBuyer={isBuyer} />
                  <InfoBlock label="Price" value={order?.offer.rate} />
                  <InfoBlock label="Total Quantity" value={formatCurrency(order.quantity, order.offer.token.symbol)} />
                  {/* <InfoBlock label="Time created" value={isBuyer ? cryptoAmount : fiatAmount} /> */}
                  <InfoBlock label="Payment method" value={order.offer.paymentMethod.method} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isChatModalOpen && (
        <div className="fixed inset-0 flex items-end bg-black bg-opacity-50 z-50">
          <div className="w-full bg-white dark:bg-gray-800 rounded-t-xl p-4">
            <div className="flex flex-row justify-between items-center px-0 py-2 mb-3">
              <div className="text-gray-400 dark:text-white">Chat</div>
              <X className="text-gray-400 dark:text-white" onClick={() => setIsChatModalOpen(false)} />
            </div>
            <ChatWithMerchant setConversation={setConversation} conversation={conversation} otherParty={otherParty} />
          </div>
        </div>
      )}
    </Suspense>
  );
}

export default OrderStage;

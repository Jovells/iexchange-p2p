import { Timer } from './timer';
import React from "react";
import { offerTypes } from "@/common/api/constants";
import fetchAccountDetails from "@/common/api/fetchAccountDetails";
import fetchOrder from "@/common/api/fetchOrder";
import { useContracts } from "@/common/contexts/ContractContext";
import Loader from "@/components/loader/Loader";
import ChatWithMerchant from "@/components/merchant/ChatWithMerchant";
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
import { ToggleLeft, ToggleRight } from "lucide-react";

const POLLING_INTERVAL = 5000;
const toastId = "order-status";

function OrderStage({ orderId, toggleExpand }: { orderId: string; toggleExpand: () => void }) {
  const { indexerUrl, p2p, tokens, currentChain } = useContracts();
  const queryClient = useQueryClient();
  const { address } = useUser();
  const { writeContractAsync, isPending } = useWriteContractWithToast();
  const [pollToggle, setPollToggle] = React.useState(true);
  const {
    writeContractAsync: writeToken,
    data: approveHash,
    isSuccess: isApproveSuccess,
    isPending: isP2pWritePending,
  } = useWriteContractWithToast();
  const [transactionHashes, setTransactionHashes] = React.useState<{ hash: string; status: string }[] | null>(null);
  const { showModal } = useModal();

  const {
    data: order,
    error: orderError,
    isLoading: orderLoading,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(indexerUrl, orderId),
    retry: 3,
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
    if (!order) return { text: "", buttonText: "", onClick: () => { }, disabled: true, shouldPoll: false };

    const getDisabledAction = (buttonText: string, text: string, shouldPoll = true) => ({
      buttonText,
      text,
      onClick: () => { },
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
              "Please wait for the merchant to accept your order and send the tokens to the escrow account",
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
              "Click “Accept Order” your order and send the tokens to the escrow account ",
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
        { toastId },
        {
          address: p2p.address,
          abi: p2p.abi,
          functionName: "releaseOrder",
          args: [BigInt(orderId)],
        },
      );
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
        { toastId },
        {
          address: p2p.address,
          abi: p2p.abi,
          functionName: "payOrder",
          args: [BigInt(orderId)],
        },
      );
      // Optimistically update the order status
      handleOptimisticUpdate(OrderState.Paid, writeResult);
      return writeResult.txHash;
    }
  };

  const handleAcceptOrder = async () => {
    console.log("Accept order");

    const alreadyApproved = allowance! >= BigInt(order?.quantity || 0);

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
      { toastId },
      {
        address: p2p.address,
        abi: p2p.abi,
        functionName: "acceptOrder",
        args: [BigInt(orderId)],
      },
    );
    // Optimistically update the order status
    handleOptimisticUpdate(OrderState.Accepted, writeResult);
  };

  function handleOptimisticUpdate(status: OrderState, writeResult: WriteContractWithToastReturnType) {
    const updatedStatus = { ...orderStatus, status };
    if (status === OrderState.Released || status === OrderState.Accepted || status === OrderState.Cancelled) {
      queryClient.refetchQueries({ queryKey: ["balance", order?.offer.token.id] });
    }
    queryClient.setQueryData(["orderStatus", orderId], updatedStatus);
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

  //poll order status
  const { data: orderStatus } = useQuery({
    queryKey: ["orderStatus", orderId],
    queryFn: () => fetchOrderStatus(indexerUrl, orderId),
    retry: 3,
    enabled: shouldPoll && pollToggle,
    refetchInterval: q => {
      console.log("qeRefetching order status", q);
      const fetchedStatus = q.state.data?.status;
      q.state;
      if (fetchedStatus === order?.status || fetchedStatus === undefined) return POLLING_INTERVAL;

      const updatedOrder = { ...order, status: fetchedStatus };
      if (fetchedStatus === OrderState.Cancelled) {
        //TODO@Jovells replace address with correct txhash
        showModal(<OrderCancellationModal txHash={address!} />);
      } else if (fetchedStatus === OrderState.Released) {
        showModal(<BuyerReleaseModal txHash={address!} cryptoAmount={cryptoAmount!} fiatAmount={fiatAmount!} />);
      } else if (fetchedStatus === OrderState.Paid) {
        showModal(<SellerPaymentConfirmedModal txHash={address!} fiatAmount={fiatAmount!} />);
      } else if (fetchedStatus === OrderState.Accepted && isBuyer) {
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
        toast.success("Order Status Updated", { id: toastId });
      }

      queryClient.setQueryData(["order", orderId], updatedOrder);
      console.log("qeRefetching order status", order?.status, updatedOrder.status);

      return POLLING_INTERVAL;
    },
  });

  if (!order && orderLoading) {
    console.log("Loading order", order, orderLoading);
    return <Loader />;
  }

  if (!order) {
    //TODO@mbawon Add a 404 page
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold text-gray-700">Order Not Found</h2>
        <p className="text-gray-500 mt-2">The order you are looking for does not exist</p>
        <Link href="/" className="mt-4 bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-600">
          Go Home
        </Link>
      </div>
    );
  }

  const { isTrader, isMerchant, isBuy, isSell, isBuyer, otherParty } = userConfig!;
  if (orderError) {
    console.log("Error fetching order", orderError);
  }
  if (accountDetailsError) {
    console.log("Error fetching account details", accountDetailsError);
  }
  console.log("OrderData", order);
  console.log("qyaccountDetails", accountDetails);

  if (!(isTrader || isMerchant)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold text-gray-700">Unauthorized Access</h2>
        <p className="text-gray-500 mt-2">You are not authorized to view this page.</p>
        <Link href="/" className="mt-4 bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-600">
          Go Home
        </Link>
      </div>
    );
  }

  const isCancellable =
    (order.status === OrderState.Pending && isMerchant) || (order.status === OrderState.Accepted && isTrader);

  const isBuyerAndNotYetAccepted = order?.status === OrderState.Pending && isBuyer && isTrader;
  return (
    <>
<div className="w-full py-6 bg-[#CCE0F6] dark:bg-gray-800">
  <div className="w-full lg:container lg:mx-auto px-0 lg:px-0 flex flex-col lg:flex-row lg:items-center lg:justify-between">
    <div className="space-y-3">
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

      <div className="container mx-auto px-0 py-4">
        <div className="w-full h-[500px] grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-20">
          <ChatWithMerchant otherParty={otherParty} />
          <div className="p-6 h-full shadow-lg border border-gray-300 dark:border-gray-700 rounded-xl space-y-6">
            <div className="flex justify-between">
              <h2 className="text-lg text-gray-500 dark:text-gray-400">Order Info</h2>
              <div className={`px-4 py-1 rounded-xl ${isBuyer ? "bg-green-200 dark:bg-green-700" : "bg-red-200 dark:bg-red-700"}`}>
                {isBuyer ? "Buy" : "Sell"}
              </div>
            </div>

            <div className="flex flex-col justify-start items-start lg:flex-row lg:justify-between gap-3 lg:gap-10 mt-6">
              <div className="flex flex-row lg:flex-col gap-4 lg:gap-0">
                <div className="text-sm text-gray-600 dark:text-gray-400 font-light">Amount</div>
                <div className={`text-lg font-medium ${isBuyer ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                  {isBuyer ? fiatAmount : cryptoAmount}
                </div>
              </div>

              <div className="flex flex-row lg:flex-col gap-4 lg:gap-0">
                <div className="text-sm text-gray-600 dark:text-gray-400 font-light">Price</div>
                <div className="text-gray-700 dark:text-gray-300 text-lg font-light">{order?.offer.rate}</div>
              </div>

              <div className="flex flex-row lg:flex-col gap-4 lg:gap-0">
                <div className="text-sm text-gray-600 dark:text-gray-400 font-light">Receive Quantity</div>
                <div className="text-gray-700 dark:text-gray-300 text-lg font-light">{isBuyer ? cryptoAmount : fiatAmount}</div>
              </div>
            </div>

            <div>
              <h2 className="text-gray-500 dark:text-gray-400 mb-1">Payment Details</h2>
              <div className="w-full flex gap-10 border rounded-xl p-4 h-auto border-gray-300 dark:border-gray-700">
                <div className="w-full space-y-4">
                  <div>
                    <div className="font-light text-gray-500 dark:text-gray-400 text-sm">Payment Method</div>
                    <div className="text-gray-600 dark:text-gray-300">{order?.offer.paymentMethod.method}</div>
                  </div>

                  <div>
                    <div className="font-light text-gray-500 dark:text-gray-400 text-sm">Account Name</div>
                    <div className="text-gray-600 dark:text-gray-300">{isBuyerAndNotYetAccepted ? "********" : accountDetails?.name}</div>
                  </div>

                  <div>
                    <div className="font-light text-gray-500 dark:text-gray-400 text-sm">Account Number</div>
                    <div className="text-gray-600 dark:text-gray-300">{isBuyerAndNotYetAccepted ? "********" : accountDetails?.number}</div>
                  </div>
                </div>

                {accountDetails?.details && (
                  <div className="w-full">
                    <div className="font-light text-gray-500 dark:text-gray-400 text-sm">Extra Details</div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {isBuyerAndNotYetAccepted ? "********" : accountDetails?.details}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-gray-700 dark:text-gray-300">Proceed:</h2>
              <p className="text-gray-500 dark:text-gray-400">{text}</p>
            </div>

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

            <div className="flex flex-col lg:flex-row gap-6">
              <Button
                loading={isPending}
                text={buttonText}
                className={`${disabled ? "bg-slate-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400" : "bg-[#000000] text-white"
                  } rounded-xl px-4 py-2`}
                onClick={onClick}
                disabled={disabled}
              />
              {isCancellable && (
                <Button
                  text="Cancel Order"
                  className="bg-red-200 dark:bg-red-700 text-black dark:text-white rounded-xl px-4 py-2 hover:bg-red-300 dark:hover:bg-red-600"
                  onClick={handleCancelOrder}
                />
              )}
              {pollToggle ? (
                <ToggleLeft onClick={() => setPollToggle(!pollToggle)}>On</ToggleLeft>
              ) : (
                <ToggleRight onClick={() => setPollToggle(!pollToggle)}>Off</ToggleRight>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default OrderStage;
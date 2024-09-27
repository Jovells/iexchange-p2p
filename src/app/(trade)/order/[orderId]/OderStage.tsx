import { Timer } from './timer';
import React, { useEffect } from "react";
import { offerTypes } from "@/common/api/constants";
import fetchAccountDetails from "@/common/api/fetchAccountDetails";
import fetchOrder from "@/common/api/fetchOrder";
import { useContracts } from "@/common/contexts/ContractContext";
import Loader from "@/components/loader/Loader";
import ChatWithMerchant from "@/components/merchant/ChatWithMerchant";
import Button from "@/components/ui/Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { Order, OrderState } from "@/common/api/types";
import { formatCurrency, formatBlockTimesamp } from "@/lib/utils";
import useWriteContractWithToast from "@/common/hooks/useWriteContractWithToast";
import ModalAlert from "@/components/modals";
import CediH from "@/common/abis/CediH";
import Link from "next/link";
import { config } from "@/common/configs";

function OrderStage({ orderId, toggleExpand }: { orderId: string, toggleExpand: () => void }) {
  const { indexerUrl, p2p, tokens } = useContracts();
  const queryClient = useQueryClient();
  const account = useAccount();
  const { writeContractAsync, isPending } = useWriteContractWithToast();
  const { writeContractAsync: writeToken, data: approveHash, isSuccess: isApproveSuccess, isPending: isP2pWritePending } = useWriteContractWithToast();
  
  const { data: order, error: orderError, refetch, isLoading: orderLoading} = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(indexerUrl, orderId),
    retry: 3,
  });

  const { data: allowance } = useReadContract({
    abi: CediH,
    address: order?.offer.token.id,
    functionName: "allowance",
    args: [account.address!, p2p.address],
  });


  const { data: accountDetails, error: accountDetailsError } = useQuery({
    queryKey: ["fetchAccountDetails", order?.accountHash],
    queryFn: () => fetchAccountDetails(order?.accountHash as string),
    enabled: !!order,
    staleTime: 0,
  });




  
  const handlePayOrder = async () => {
    console.log("Transfer funds");
    const txHash = await writeContractAsync(
      { },
      {
      address: p2p.address,
      abi: p2p.abi,
      functionName: "payOrder",
      args: [BigInt(orderId)],
    }, 
  );
  // Optimistically update the order status
  const updatedOrder = { ...order, status: OrderState.paid };
  queryClient.setQueryData(["order", orderId], updatedOrder);
    console.log("Transaction Hash", txHash);
  };

  const handleReleaseFunds = async () => {
    console.log("Release funds");
    const txHash = await writeContractAsync({},{
      address: p2p.address,
      abi: p2p.abi,
      functionName: "releaseOrder",
      args: [BigInt(orderId)],
    }, 
  );
  // Optimistically update the order status
  const updatedOrder = { ...order, status: OrderState.released };
  queryClient.setQueryData(["order", orderId], updatedOrder);

    console.log("Transaction Hash", txHash);
  };

  const handleAcceptOrder = async () => {
    console.log("Accept order");

    const alreadyApproved = (allowance! >= BigInt(order?.quantity||0));  


    if (!alreadyApproved) {
      const approveHash = await writeToken({
      },{
        abi: tokens[0].abi,
        address: order?.offer.token.id as `0x${string}`,
        functionName: "approve",
        args: [p2p.address, order?.quantity],
      });
    } 

    const txHash = await writeContractAsync({},{
      address: p2p.address,
      abi: p2p.abi,
      functionName: "acceptOrder",
      args: [BigInt(orderId)],
    }
  );
  // Optimistically update the order status
  const updatedOrder = { ...order, status: OrderState.accepted };
  queryClient.setQueryData(["order", orderId], updatedOrder);

    console.log("Transaction Hash", txHash);
  };

  const handleCancelOrder = async () => {
    console.log("Cancel Order", orderId, order);
    const txHash = await writeContractAsync({},{
      address: p2p.address,
      abi: p2p.abi,
      functionName: "cancelOrder",
      args: [orderId],
    }, 
  );
  // Optimistically update the order status
  const updatedOrder = { ...order, status: OrderState.cancelled };
  queryClient.setQueryData(["order", orderId], updatedOrder);

    console.log("Transaction Hash", txHash);
  };

  if (!order && (orderLoading)) {
    console.log("Loading order", order, orderLoading);
    return <Loader />;
  }

  if(!order) {
    //TODO@mbawon Add a 404 page 
   return  <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-semibold text-gray-700">Order Not Found</h2>
      <p className="text-gray-500 mt-2">The order you are looking for does not exist</p>
      <Link href="/" className="mt-4 bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-600">
        Go Home
      </Link>
    </div>
  }





  const isTrader = order.trader.id.toLowerCase() === account.address?.toLowerCase();
  const isMerchant = order.offer.merchant.id.toLowerCase() === account.address?.toLowerCase();
  const isBuy = order.offer.offerType === offerTypes.buy;
  const isSell = order.offer.offerType === offerTypes.sell;

  const isBuyer = (isBuy && isTrader) || (isSell && isMerchant);

  console.log("Is Buyer", isBuyer);

  const getButtonConfig = () => {
    if (!order) return { text: "", buttonText: "", onClick: () => {}, disabled: true };

      const getDisabledAction = (buttonText: string, text: string) => ({ buttonText, text, onClick: () => {}, disabled: true });
      const getEnabledAction = (buttonText: string, text: string, onClick : ()=>{}) => ({ buttonText, text, onClick, disabled: false });
    
      switch (order.status) {
        case OrderState.pending:
          if (isBuyer) {
            return order.offer.offerType === offerTypes.buy
              ? getDisabledAction("Waiting for Merchant", "Please wait for the merchant to accept your order and send the tokens to the escrow account")
              : getEnabledAction("Done With Payment","Click “Done with Payment” to notify the Seller or click “Cancel” to stop the Order", handlePayOrder);
          } else {
            return order.offer.offerType === offerTypes.sell
              ? getDisabledAction("Waiting for Buyer", "Please wait for the buyer to make payment")
              : getEnabledAction("Accept Order", "Click “Accept Order” your order and send the tokens to the escrow account ", handleAcceptOrder);
          }
        case OrderState.accepted:
          return isBuyer
            ? getEnabledAction("Done With Payment", "Click “Done with Payment” to notify the Seller or click “Cancel” to stop the Order", handlePayOrder)
            : getDisabledAction("Waiting for Buyer", "Please wait for the buyer to make payment");
        case OrderState.paid:
            return isBuyer
            ? getDisabledAction("Waiting for Seller to Release", "Please wait for the seller to release")
            : getEnabledAction("Release Funds", "Click “Release Funds” to release the funds to the buyer", handleReleaseFunds);
        case OrderState.released:
          return getDisabledAction("Completed", "Order has been completed");
        case OrderState.cancelled:
          return getDisabledAction("Cancelled", "Order has been cancelled");
        default:
          return getDisabledAction("", "");
      }
    };

  if (orderError) {
    console.log("Error fetching order", orderError);
  }
  if (accountDetailsError) {
    console.log("Error fetching account details", accountDetailsError);
  }
  console.log("OrderData", order);

 

  if (!(isTrader || isMerchant)) {
   return <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-semibold text-gray-700">Unauthorized Access</h2>
      <p className="text-gray-500 mt-2">You are not authorized to view this page.</p>
      <Link href="/" className="mt-4 bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-600">
        Go Home
      </Link>
    </div>;
  }


  const { text, onClick, disabled, buttonText  } = getButtonConfig();
  const buyAmount = formatCurrency(Number(order?.quantity) * Number(order?.offer.rate), isBuyer ? order.offer.currency.currency : order.offer.token.symbol)
  const sellAmount = formatCurrency(Number(order?.quantity), isBuyer ? order?.offer.token.symbol : order.offer.currency.currency)

  const isCancellable = (order.status === OrderState.pending && isMerchant) || (order.status === OrderState.accepted && isTrader);

  //TODO: @Jovells implement timer
  return (
    <>
      <div className="w-full py-6 bg-[#CCE0F6]">
        <div className="w-full lg:container lg:mx-auto px-4 lg:px-0 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <span className="font-bold text-gray-600">Order Created</span>
            <div className="flex flex-row space-x-2">
              <span className="text-gray-500">Time Limit Exhaustion:</span>
            <Timer timestamp={order.blockTimestamp} seconds={30*60}     />
            </div>
          </div>
          <div className="space-y-0 lg:space-y-2">
            <div className="flex flex-row items-center space-x-2">
              <span className="text-gray-500">Order number:</span>
              <span className="text-black text-sm">{orderId}</span>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <span className="text-gray-500">Date created:</span>
              <span className="text-black text-sm">{formatBlockTimesamp(order?.blockTimestamp)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-0 py-4">
        <div className="w-full h-[500px] grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-20">
          <ChatWithMerchant otherParty = {isTrader? order.offer.merchant : order.trader} />
          <div className="p-6 h-full shadow-lg border border-gray-300 rounded-xl space-y-6">
            <div className="flex justify-between">
            <h2 className="text-lg text-gray-500">Order Info</h2>
            <div className={`px-4 py-1 rounded-xl ${isBuyer ? "bg-green-200" : "bg-red-200"}`}>
              {isBuyer ? "Buying" : "Selling"}
            </div>
            </div>
            <div className="flex flex-col justify-start items-start lg:flex-row lg:justify-between gap-3 lg:gap-10 mt-6">
              <div className="flex flex-row lg:flex-col gap-4 lg:gap-0">
                <div className="text-sm text-gray-600 font-light">Amount</div>
                <div className="text-green-700 text-lg font-medium">
                  {isBuyer ? buyAmount : sellAmount}
                </div>
              </div>
              <div className="flex flex-row lg:flex-col gap-4 lg:gap-0">
                <div className="text-sm text-gray-600 font-light">Price</div>
                <div className="text-gray-700 text-lg font-light">{order?.offer.rate}</div>
              </div>
              <div className="flex flex-row lg:flex-col gap-4 lg:gap-0">
                <div className="text-sm text-gray-600 font-light">Receive Quantity</div>
                <div className="text-gray-700 text-lg font-light">{isBuyer? sellAmount : buyAmount}</div>
              </div>
            </div>
            <div>
              <h2 className=" text-gray-500 mb-1">Payment Details</h2>
                <div className="w-full flex gap-10  border rounded-xl p-4 h-auto ">
                <div className=" w-full space-y-4">
                  <div>
                  <div className="font-light text-gray-500 text-sm">Payment Method</div>
                  <div className="text-gray-600">
                  {order?.status === OrderState.pending && isBuyer ? "********" : order?.offer.paymentMethod.method}
                  </div>
                </div>
                <div>
                  <div className="font-light text-gray-500 text-sm">Account Name</div>
                  <div className="text-gray-600">
                  {order?.status === OrderState.pending && isBuyer ? "********" : accountDetails?.name}
                  </div>
                </div>
                <div>
                  <div className="font-light text-gray-500 text-sm">Account Number</div>
                  <div className="text-gray-600">
                  {order?.status === OrderState.pending && isBuyer ? "********" : accountDetails?.number}
                  </div>
                </div></div>
                {accountDetails?.details && <div className="w-full">
                  <div className="font-light text-gray-500 text-sm">Extra Details</div>
                  <div className="text-gray-600">
                    {accountDetails?.details}
                  </div>
                </div>}
                </div>
            </div>
            <div>
              <h2 className="text-gray-700">Proceed:</h2>
              <p className="text-gray-500">
                {text}
              </p>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              <Button loading ={isPending} text={buttonText} className={`${disabled ? "bg-slate-100 text-gray-500" :"bg-[#000000] text-white"}  rounded-xl px-4 py-2`} onClick={onClick} disabled={disabled} />
                {isCancellable  && (
                <Button text="Cancel Order" className="bg-red-200 text-black rounded-xl px-4 py-2 hover:bg-red-300" onClick={handleCancelOrder} />
                )}
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderStage;
"use client";
import { offerTypes } from "@/common/api/constants";
import { fetchOrders } from "@/common/api/fetchOrders";
import { Order, OrderState } from "@/common/api/types";
import { useContracts } from "@/common/contexts/ContractContext";
import { useUser } from "@/common/contexts/UserContext";
import { ORDER_PAGE } from "@/common/page-links";
import Loader from "@/components/loader/Loader";
import { formatBlockTimesamp, formatCurrency, getUserConfig, shortenAddress } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

export function OrdersDropdown() {
  const { indexerUrl } = useContracts();
  const { address: userAddress } = useUser();
  const options = {
    page: 0,
    quantity: 10,
    merchant: userAddress,
    trader: userAddress,
    status_not: OrderState.Released,
  };
  const { data: myOrders, isFetching } = useQuery({
    queryKey: ["orders", options],
    queryFn: () => fetchOrders(indexerUrl, options),
    enabled: !!userAddress,
  });

  console.log("myOrders", myOrders);

  if (!myOrders && !isFetching) {
    return <Loader />;
  }

  if (!myOrders) {
    return null;
  }

  return (
    <div className="w-full rounded-[8px] border border-gray-200">
      <div className="flex flex-row justify-between items-center p-4 border-b">
        <h2 className="text-black font-bold">Processing</h2>
        <Link href="/dashboard/history/orders" className="text-blue-600">
          View more
        </Link>
      </div>
      {myOrders.map((item: Order, index: any) => {
        const { isTrader, isMerchant, isBuy, isSell, isBuyer, otherParty } = getUserConfig({
          trader: item.trader,
          merchant: item.offer.merchant,
          userAddress: userAddress!,
          orderType: item.orderType,
        });

        const barColor = isBuyer ? "bg-green-500" : "bg-red-500";
        const textColor = isBuyer ? "text-green-500" : "text-red-500";

        return (
          <Link
            href={ORDER_PAGE(item.id)}
            key={index}
            className="flex grid-cols-1 lg:grid-cols-2 gap-4 border-b p-4 hover:bg-gray-100 transition-colors duration-200 w-full"
          >
            <div className="w-full flex flex-row justify-between items-start space-y-2 ">
              <div className="flex flex-row">
                <div className={`w-2 ${barColor} mr-4`}></div>
                <div>
                  <h3 className={`font-bold text-left ${textColor}`}>
                    {(isBuyer ? "Buy " : "Sell ") + item.offer.token.symbol}
                  </h3>
                  <p className="text-lg font-medium text-left">
                    {formatCurrency(Number(item.quantity) * Number(item.offer.rate), item.offer.currency.currency)}
                  </p>
                  {/* <p className="text-sm text-gray-500">{OrderState[item.status]}</p> */}
                  <p className="text-sm text-gray-500 text-left">{shortenAddress(otherParty.id)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 text-right">Price: {item.offer.rate}</p>
                <p className="text-sm text-gray-500 text-right">Date: {formatBlockTimesamp(item.blockTimestamp)}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
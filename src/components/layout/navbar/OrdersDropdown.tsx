"use client";
import { offerTypes } from "@/common/api/constants";
import { fetchOrders } from "@/common/api/fetchOrders";
import { OrderState } from "@/common/api/types";
import { useContracts } from "@/common/contexts/ContractContext";
import { useUser } from "@/common/contexts/UserContext";
import { ORDER_PAGE } from "@/common/page-links";
import Loader from "@/components/loader/Loader";
import { formatBlockTimesamp, formatCurrency, shortenAddress } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { useAccount } from "wagmi";

export function OrdersDropdown() {
  const { indexerUrl } = useContracts();
  const {address: userAddress} = useUser();
  const options = {
    page: 0,
    quantity: 10,
    merchant: userAddress,
    trader: userAddress,
    status_not: OrderState.released
  };
  const { data: myOrders, isFetching } = useQuery({
    queryKey: ["orders", options],
    queryFn: () => fetchOrders(indexerUrl, options),
    enabled: !!userAddress,
  });

  console.log("myOrders", myOrders);

  if (!myOrders && !isFetching  ) {
    return <Loader />;
  }

  if (!myOrders) {
    return <div>No orders</div>;
  }

  return (
    <div className="w-[400px] p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {myOrders.map((item, index) => {
        const isTrader =  item.trader.id === userAddress;
        const isMerchant = item.offer.merchant.id === userAddress;
        const isBuy = item.orderType === offerTypes.buy;
        const isSell = item.orderType === offerTypes.sell;
        const isBuyer =
          isTrader && isBuy;
        const barColor = isBuyer ? "bg-green-500" : "bg-red-500";
        const otherPartyAddress = isBuyer
          ? item.offer.merchant.id
          : item.trader.id;

        return (
            <Link href={ORDER_PAGE(item.id)} key={index}>
            <div className="border-b p-4 flex hover:bg-gray-100 transition-colors duration-200">
              <div className={`w-2 ${barColor} mr-4`}></div>
              <div className="flex flex-col space-y-2">
              <h3 className=" font-bold">
                {(item.orderType === offerTypes.buy && isBuyer
                ? "Buy "
                : "Sell ") + item.offer.token.symbol}
              </h3>
              <p className="text-sm text-gray-500">{OrderState[item.status]}</p>
              <p className="text-lg font-medium">
                {formatCurrency(Number(item.quantity) * Number(item.offer.rate), item.offer.currency.currency)}
              </p>
              <p className="text-sm text-gray-500">Rate: {item.offer.rate}</p>
              <p className="text-sm text-gray-500">Date: {formatBlockTimesamp(item.blockTimestamp)}</p>
              <p className="text-sm text-gray-500">Other Party: {shortenAddress(otherPartyAddress)}</p>
              </div>
            </div>
            </Link>
        );
      })}
    </div>
  );
}
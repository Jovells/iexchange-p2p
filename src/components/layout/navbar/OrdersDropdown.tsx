"use client";
import { offerTypes } from "@/common/api/constants";
import { fetchOrders } from "@/common/api/fetchOrders";
import { OrderState } from "@/common/api/types";
import { useContracts } from "@/common/contexts/ContractContext";
import { ORDER_PAGE } from "@/common/page-links";
import Loader from "@/components/loader/Loader";
import { formatBlockTimesamp, formatCurrency, shortenAddress } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { useAccount } from "wagmi";

export function OrdersDropdown() {
  const { indexerUrl } = useContracts();
  const account = useAccount();
  const options = {
    page: 0,
    quantity: 10,
    merchant: account.address,
    trader: account.address,
  };
  const { data: myOrders } = useQuery({
    queryKey: ["orders", options],
    queryFn: () => fetchOrders(indexerUrl, options),
    enabled: !!account.address,
  });

  if (!myOrders) {
    return <Loader />;
  }

  return (
    <div className="w-[400px] p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {myOrders.map((item, index) => {
        const isBuyer =
          (item.trader as unknown as string ===
            account?.address?.toLowerCase()) &&
          item.orderType === offerTypes.buy;
        const barColor = isBuyer ? "bg-green-500" : "bg-red-500";
        const otherPartyAddress = isBuyer
          ? item.offer.merchant.id
          : item.trader.id;

        return (
          <Link href={ORDER_PAGE(item.id)} key={index}>
            <div className="border-b p-4 flex">
              <div className={`w-2 ${barColor} mr-4`}></div>
              <div>
                <h3 className="text-lg font-semibold">
                  {(item.orderType === offerTypes.buy && isBuyer
                    ? "Buy "
                    : "Sell ") + item.offer.token.symbol}
                </h3>
                <p className="text-gray-600">{OrderState[item.status]}</p>
                <p>{formatCurrency(Number(item.quantity) * Number(item.offer.rate), item.offer.currency.currency)}</p>
                <p className="text-gray-600">Rate: {item.offer.rate}</p>
                <p className="text-gray-600">Date: {formatBlockTimesamp(item.blockTimestamp)}</p>
                <p className="text-gray-600">Other Party: {shortenAddress(otherPartyAddress)}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
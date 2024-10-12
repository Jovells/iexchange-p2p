"use client";
import ExpandableTable from "@/components/data-grid";
import { useSearchParams } from "next/navigation";
import React, { FC, Suspense, useRef, useState } from "react";
import CreateOrder from "@/app/(trade)/create-order";
import { useQuery } from "@tanstack/react-query";
import { fetchAds } from "@/common/api/fetchAds";
import { useContracts } from "@/common/contexts/ContractContext";
import { Currency, Offer, PaymentMethod, PreparedCurrency, Token } from "@/common/api/types";
import { formatCurrency, getPaymentMethodColor, shortenAddress } from "@/lib/utils";
import { BOT_MERCHANT_ID, offerTypes } from "@/common/constants";
import { fetchTotalAds } from "@/common/api/fetchTotalAds";

const columns: any = [
  {
    key: "advertisers",
    label: "Advertiser",
    render: (row: Offer) => (
      <div className="flex items-center">
        <div className="w-6 h-6 rounded-full bg-gray-800 dark:bg-white flex items-center justify-center mr-2">
          {row.merchant.id === BOT_MERCHANT_ID ? (
            <span className="text-xs rounded bg-gray-200 p-1 font-semibold text-blue-500 mr-1">BOT</span>
          ) : (
            <span className="text-white dark:text-gray-800 text-[10px] font-bold">
              {row.merchant.name?.charAt(0).toUpperCase() || row.merchant.id.substring(0, 3)}
            </span>
          )}
        </div>
        <span className="">{(row.merchant.name || "") + " (" + shortenAddress(row.merchant.id, 2) + ")"}</span>
      </div>
    ),
  },
  {
    key: "price",
    label: "Price",
    render: (row: Offer) => {
      return (
        <div className="">
          <span className="font-bold text-2xl">{row.rate}</span>
          <span className="ml-2 text-sm">{row.currency.currency}</span>
        </div>
      );
    },
  },
  {
    key: "funds",
    label: "Limits",
    render: (row: Offer) => (
      <span className=" text-sm text-gray-700 dark:text-gray-300">
        {formatCurrency(row.minOrder, "")} - {formatCurrency(row.maxOrder, row.token.symbol)}
      </span>
    ),
  },
  {
    key: "payment",
    label: "Payment Options",
    render: (row: Offer) => (
      <span
        className={`text-sm dark:text-gray-300 text-gray-700 border-l-4 pl-1 ${getPaymentMethodColor(
          row.paymentMethod.method.toLowerCase(),
        )}`}
      >
        {row.paymentMethod.method}
      </span>
    ),
  },
];

interface Props {
  offerType: string;
  token?: Token;
  paymentMethod?: PaymentMethod;
  currency?: Currency;
  amount?: string;
  isActive?: boolean;
}
const P2PAds: FC<Props> = ({ offerType, token, currency, amount, paymentMethod, isActive }) => {
  const { indexerUrl } = useContracts();
  const tableRef = useRef<{ closeExpandedRow: () => void } | null>(null);
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(0);

  const trade = searchParams.get("trade") || "Buy";
  // const crypto = searchParams.get("crypto") || "";

  const options = {
    page: currentPage,
    isActive,
    offerType,
    tokenId: token?.id,
    currency: currency?.id,
    amount,
    paymentMethod: paymentMethod?.id,
    quantity: 10,
  };

  const { isPending, error, data } = useQuery({
    queryKey: ["ads", indexerUrl, options],
    queryFn: () => fetchAds(indexerUrl, options),
    //TODO: add retry logic
    retry: 0,
  });
  const {
    isPending: totalAdsPendning,
    error: totalAdsError,
    data: totalRecords,
  } = useQuery({
    queryKey: ["totalAds", indexerUrl, options],
    queryFn: () => fetchTotalAds(indexerUrl, options),
    //TODO: add retry logic
    retry: 0,
  });

  function moveBotMerchantOffersToTop(offers: Offer[]) {
    const botOffers = offers.filter(offer => offer.merchant.id === BOT_MERCHANT_ID);
    const nonBotOffers = offers.filter(offer => offer.merchant.id !== BOT_MERCHANT_ID);
    return [...botOffers, ...nonBotOffers];
  }

  const offers = data ? moveBotMerchantOffersToTop(data.offers) : [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const actions = [
    {
      label: (row: Offer) => (row.offerType === offerTypes.buy ? "Buy " : "Sell ") + row.token.symbol,
      onClick: (row: any) => console.log(row),
    },
  ];

  if (error) {
    console.log("error:", error);
  }

  return (
    <Suspense>
      <div className="w-full">
        <ExpandableTable
          requiresAuthToOpen
          ref={tableRef}
          columns={columns}
          data={offers}
          actions={actions}
          isLoading={isPending}
          page={currentPage}
          pageSize={options.quantity}
          totalRecords={totalRecords}
          onPageChange={handlePageChange}
        >
          {(row, toggleExpand) => <CreateOrder data={row} toggleExpand={toggleExpand} orderType={trade} />}
        </ExpandableTable>
      </div>
    </Suspense>
  );
};

export default P2PAds;

"use client";
import ExpandableTable from "@/components/data-grid";
import { useSearchParams } from "next/navigation";
import React, { FC, Suspense, useRef, useState } from "react";
import CreateOrder from "@/app/(trade)/create-order";
import { useQuery } from "@tanstack/react-query";
import { fetchAds } from "@/common/api/fetchAds";
import { useContracts } from "@/common/contexts/ContractContext";
import { Currency, Offer, PaymentMethod, PreparedCurrency, Token } from "@/common/api/types";
import { formatCurrency, shortenAddress } from "@/lib/utils";
import { offerTypes } from "@/common/constants";

const columns: any = [
  {
    key: "advertisers",
    label: "Advertiser",
    render: (row: Offer) => (
      <span className="font-bold">{row.merchant.name + " (" + shortenAddress(row.merchant.id, 2) + ")"}</span>
    ),
  },
  {
    key: "price",
    label: "Price",
    render: (row: Offer) => <span className="font-bold">{row.rate}</span>,
  },
  {
    key: "funds",
    label: "Limits",
    render: (row: Offer) => (
      <span className="italic">
        {formatCurrency(row.minOrder, row.token.symbol)} - {formatCurrency(row.maxOrder, row.token.symbol)}
      </span>
    ),
  },
  {
    key: "payment",
    label: "Payment Options",
    render: (row: Offer) => <span className="italic">{row.paymentMethod.method}</span>,
  },
];

interface Props {
  offerType: string;
  token?: Token;
  paymentMethod?: PaymentMethod;
  currency?: PreparedCurrency;
  amount?: string;
  isActive?: boolean;
}
const P2PAds: FC<Props> = ({ offerType, token, currency, amount, paymentMethod, isActive }) => {
  const { indexerUrl } = useContracts();
  const tableRef = useRef<{ closeExpandedRow: () => void } | null>(null);
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(0);

  const trade = searchParams.get("trade") || "Buy";
  const crypto = searchParams.get("crypto") || "";

  console.log("paymentMethod", paymentMethod);

  const options = {
    page: currentPage,
    isActive,
    offerType,
    tokenId: token?.id,
    currency: currency?.id,
    amount,
    paymentMethod: paymentMethod?.id,
  };

  const { isPending, error, data } = useQuery({
    queryKey: ["ads", indexerUrl, options],
    queryFn: () => fetchAds(indexerUrl, options),
    //TODO: add retry logic
    retry: 0,
  });

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
          ref={tableRef}
          columns={columns}
          data={data?.offers || []}
          actions={actions}
          isLoading={isPending}
          page={currentPage}
          pageSize={10}
          onPageChange={handlePageChange}
        >
          {(row, toggleExpand) => <CreateOrder data={row} toggleExpand={toggleExpand} orderType={trade} />}
        </ExpandableTable>
      </div>
    </Suspense>
  );
};

export default P2PAds;

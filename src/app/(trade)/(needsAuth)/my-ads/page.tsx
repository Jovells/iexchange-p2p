'use client'
import GridTable from '@/components/datatable';
import FaqsSection from '@/components/sections/Faqs';
import { CircleCheck, Eye, Trash2 } from 'lucide-react';
import ExpandableTable from '@/components/data-grid'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FC, Suspense, useRef, useState } from 'react'
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchAds } from "@/common/api/fetchAds";
import Button from "@/components/ui/Button";
import { useContracts } from "@/common/contexts/ContractContext";
import TradeLayout from "../layout";
import { Offer } from "@/common/api/types";
import { offerTypes } from "@/common/constants";
import { useUser } from "@/common/contexts/UserContext";
import { formatCurrency } from "@/lib/utils";
import { MY_ADS } from "@/common/constants/queryKeys";

const columns: any = [
  {
    key: "id",
    label: "Id",
    render: (row: Offer) => <span className="font-bold">{row.id}</span>,
  },
  {
    key: "rate",
    label: "Rate",
    render: (row: Offer) => <span className="font-bold">{row.rate}</span>,
  },
  {
    key: "amounts",
    label: "Amounts",
    render: (row: Offer) => (
      <span className="font-bold">
        {formatCurrency(row.minOrder, row.token.symbol)} - {formatCurrency(row.maxOrder, row.token.symbol)}
      </span>
    ),
  },
  {
    key: "paymentMethod",
    label: "Payment Method",
    render: (row: Offer) => <span className="italic">{row.paymentMethod.method}</span>,
  },
  {
    key: "status",
    label: "Status",
    render: (row: Offer) => <span className="italic">{row.active ? "Active" : "Deactivated"}</span>,
  },
  {
    key: "offerType",
    label: "offerType",
    render: (row: Offer) => <span className="italic">{row.offerType === offerTypes.buy ? "buy" : "sell"}</span>,
  },
];

const MyAds = () => {
  const { indexerUrl } = useContracts();
  const tableRef = useRef<{ closeExpandedRow: () => void } | null>(null);
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { address } = useUser();
  const trade = searchParams.get("trade") || "Buy";
  const crypto = searchParams.get("crypto") || "USDT";

  const options = { page: currentPage, merchant: address?.toLowerCase() };

  const { isPending, isError, error, data, isFetching, isPlaceholderData } = useQuery({
    queryKey: MY_ADS({ indexerUrl, options }),
    queryFn: () => fetchAds(indexerUrl, options),
    // placeholderData: keepPreviousData,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  if (error) {
    console.log("error:", error);
  }

  const actions = [
    { onClick: (row: any) => router.push("/order/order"), classNames: "bg-transparent text-black", icon: <Eye /> },
    { onClick: (row: any) => router.push("/appeal/order"), classNames: "bg-transparent text-black", icon: <Trash2 /> },
    {
      onClick: (row: any) => router.push("/appeal/order"),
      classNames: "bg-transparent text-black",
      icon: <CircleCheck />,
    },
  ];

  // if (isPending) {
  //   return null;
  // }

  //TODO: @mbawon doesnt match figma design
  return (
    <div className="container mx-auto p-0 py-4">
      <div className="py-12 flex flex-col gap-10">
        <GridTable
          columns={columns}
          data={data?.offers || []}
          actions={actions}
          itemsPerPage={50}
          isLoading={isFetching}
        />
      </div>
    </div>
  );
};



export default MyAds;

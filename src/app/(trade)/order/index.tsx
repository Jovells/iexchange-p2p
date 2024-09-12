'use client'
import ExpandableTable from '@/components/data-grid'
import { useSearchParams } from 'next/navigation';
import React, { FC, Suspense, useRef, useState } from 'react'
import CreateOrder from './create-order';
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchAds } from "@/common/api";
import Button from "@/components/ui/Button";

const columns: any = [
  {
    key: "advertisers",
    label: "Advertiser",
    render: (row: Offer) => (
      <span className="font-bold">{row.merchant.name}</span>
    ),
  },
  {
    key: "price",
    label: "Price",
    render: (row: Offer) => <span className="font-bold">{row.rate}</span>,
  },
  {
    key: "funds",
    label: "Available Funds",
    render: (row: Offer) => <span className="italic">{row.maxOrder}</span>,
  },
  {
    key: "payment",
    label: "Payment Options",
    render: (row: Offer) => (
      <span className="italic">{row.paymentMethod.method}</span>
    ),
  },
];

interface Props {
  offerType: string;
}
const P2POrder: FC<Props> = ({ offerType }) => {
  const tableRef = useRef<{ closeExpandedRow: () => void } | null>(null);
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const trade = searchParams.get("trade") || "Buy";
  const crypto = searchParams.get("crypto") || "USDT";


  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useQuery({
      queryKey: ["ads", currentPage, offerType],
      queryFn: () => fetchAds(currentPage, offerType),
      // placeholderData: keepPreviousData,
    });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log('Page changed to:', page);
  };

  const actions = [
    { label: trade + " " + crypto, onClick: (row: any) => console.log(row) },
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
          pageSize={50}
          onPageChange={handlePageChange}>
          {(row, toggleExpand) => (
            <CreateOrder
              data={row}
              toggleExpand={toggleExpand}
              orderType={trade}
            />
          )}
        </ExpandableTable>

      </div>
    </Suspense>

  );
};

export default P2POrder
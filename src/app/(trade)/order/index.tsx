'use client'
import ExpandableTable from '@/components/data-grid'
import { useSearchParams } from 'next/navigation';
import React, { FC, Suspense } from 'react'
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
  const searchParams = useSearchParams();

  const trade = searchParams.get("trade") || "Buy";
  const crypto = searchParams.get("crypto") || "USDT";

  const [page, setPage] = React.useState(0);

  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useQuery({
      queryKey: ["ads", page],
      queryFn: () => fetchAds(page, offerType),
      placeholderData: keepPreviousData,
    });

  console.log("data:", data);

  // const data = [
  //     { advertisers: 'John Doe', price: 28, funds: 'New York', payment: 'New York' },
  //     { advertisers: 'Jane Smith', price: 34, funds: 'San Francisco', payment: 'New York' },
  //     { advertisers: 'Michael Johnson', price: 45, funds: 'Chicago', payment: 'New York' },
  // ];

  const actions = [
    { label: trade + " " + crypto, onClick: (row: any) => console.log(row) },
  ];

  if (error) {
    console.log("error:", error);
  }

  const hasMore = data?.offers?.length === 10;

  return (
    <Suspense>
    <div className="w-full">
      <ExpandableTable
        columns={columns}
        data={data?.offers || []}
        actions={actions}
        isLoading={false}>
        {(row, toggleExpand) => (
          <CreateOrder
            data={row}
            toggleExpand={toggleExpand}
            orderType={trade}
          />
        )}
      </ExpandableTable>
      <span>Current Page: {page + 1}</span>
      <Button
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 0}>
        Previous Page
      </Button>
      <Button
        onClick={() => {
          if (!isPlaceholderData && hasMore) {
            setPage((old) => old + 1);
          }
        }}
        // Disable the Next Page button until we know a next page is available
        disabled={isPlaceholderData || !hasMore}>
        Next Page
      </Button>
      {isFetching ? <span> Loading...</span> : null}
    </div>
    </Suspense>

  );
};

export default P2POrder
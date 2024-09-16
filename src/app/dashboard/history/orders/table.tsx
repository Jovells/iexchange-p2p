'use client'
import ExpandableTable from '@/components/data-grid'
import { useSearchParams } from 'next/navigation';
import React, { FC, Suspense, useRef, useState } from 'react'
import {  useQuery } from "@tanstack/react-query";
import { fetchAds } from "@/common/api/fetchAds";
import Button from "@/components/ui/Button";
import { useContracts } from '@/common/contexts/ContractContext';
import OrderStage from '@/app/(trade)/order/[orderId]/OderStage';
import { fetchOrders } from '@/common/api/fetchOrders';
import { useAccount } from 'wagmi';
import { Order, OrderOptions, OrderState } from '@/common/api/types';

const columns: any = [
  {
    key: "type",
    label: "Type",
    render: (row: Order) => (
      <span className="font-bold">{row.orderType}</span>
    ),
  },
  {
    key: "price",
    label: "Price",
    render: (row: Order) => <span className="font-bold">{row.offer.rate}</span>,
  },
  {
    key: "funds",
    label: "Available Funds",
    render: (row: Order) => <span className="italic">{"not"}</span>,
  },
  {
    key: "orderNumber",
    label: "Order Number",
    render: (row: Order) => (
      <span className="italic">{row.id}</span>
    ),
  },
  {
    key: "paymentOption",
    label: "Payment Option",
    render: (row: Order) => (
      <span className="italic">{row.offer.paymentMethod.method}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row: Order) => (
      <span className="italic">{OrderState[row.status]}</span>
    ),
  },
];


const OrdersTable: FC<Partial<OrderOptions>> = ({orderType, }) => {
  const {indexerUrl} = useContracts();
  const tableRef = useRef<{ closeExpandedRow: () => void } | null>(null);
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const account = useAccount();

  const trade = searchParams.get("trade") || "Buy";
  const crypto = searchParams.get("crypto") || "USDT";
  const options = {page: currentPage,
    orderType: orderType,
    merchant: account.address?.toLowerCase(),
    trader: account.address?.toLowerCase(),
  }

  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useQuery({
      queryKey: ["orders", currentPage, orderType, options],
      queryFn: () => fetchOrders(indexerUrl, options ),
      // placeholderData: keepPreviousData,
    });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log('Page changed to:', page);
  };

  const actions = [
    { label: "expand", onClick: (row: any) => console.log(row) },
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
          data={data || []}
          actions={actions}
          isLoading={isPending}
          pageSize={50}
          onPageChange={handlePageChange}>
          {(row, toggleExpand) => (
            <OrderStage
              orderId={row.id}
              toggleExpand={toggleExpand}
            />
          )}
        </ExpandableTable>

      </div>
    </Suspense>

  );
};

export default OrdersTable
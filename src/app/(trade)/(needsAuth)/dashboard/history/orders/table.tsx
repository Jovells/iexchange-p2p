'use client'
import ExpandableTable from '@/components/data-grid'
import { useSearchParams } from 'next/navigation';
import React, { FC, Suspense, useRef, useState } from 'react'
import {  useQuery } from "@tanstack/react-query";
import { fetchAds } from "@/common/api/fetchAds";
import Button from "@/components/ui/Button";
import { useContracts } from '@/common/contexts/ContractContext';
import OrderStage from "@/app/(trade)/(needsAuth)/order/[orderId]/OderStage";
import { fetchOrders } from "@/common/api/fetchOrders";
import { OfferType, Order, OrderOptions, OrderState } from "@/common/api/types";
import { formatEther } from "ethers";
import { useUser } from "@/common/contexts/UserContext";
import { ORDERS } from "@/common/constants/queryKeys";
import GridTable from "@/components/datatable";
import { useRouter } from "next/navigation";
import { ORDER_PAGE } from "@/common/page-links";
import { formatCurrency } from "@/lib/utils";

const columns: any = [
  {
    key: "orderNumber",
    label: "Order Number",
    render: (row: Order) => <span className="">{row.id}</span>,
  },
  {
    key: "type",
    label: "Type",
    render: (row: Order) => <span className="">{OfferType[row.orderType]}</span>,
  },
  {
    key: "price",
    label: "Price",
    render: (row: Order) => <span className="">{row.offer.rate}</span>,
  },
  {
    key: "funds",
    label: "Quantity",
    render: (row: Order) => <span className="">{formatCurrency(row.quantity, row.offer.token.symbol)}</span>,
  },
  {
    key: "paymentOption",
    label: "Payment Option",
    render: (row: Order) => <span className="">{row.offer.paymentMethod.method}</span>,
  },
  {
    key: "status",
    label: "Status",
    render: (row: Order) => <span className="">{OrderState[row.status]}</span>,
  },
];

const OrdersTable: FC<Partial<OrderOptions>> = ({ orderType, status }) => {
  const { indexerUrl } = useContracts();
  const tableRef = useRef<{ closeExpandedRow: () => void } | null>(null);
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { address } = useUser();
  const router = useRouter();

  const trade = searchParams.get("trade") || "Buy";
  const crypto = searchParams.get("crypto") || "USDT";
  const options: Partial<OrderOptions> = {
    page: currentPage,
    status: status,
    orderType: orderType,
    merchant: address?.toLowerCase(),
    trader: address?.toLowerCase(),
  };

  const { isPending, isError, error, data, isFetching, isPlaceholderData } = useQuery({
    queryKey: ORDERS({ indexerUrl, currentPage, orderType, options }),
    queryFn: () => fetchOrders(indexerUrl, options),
    //TODO @Jovells: add retry logic
    retry: false,
    // placeholderData: keepPreviousData,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const actions = [{ label: "View Details", onClick: (row: any) => router.push(ORDER_PAGE(row.id)) }];

  if (error) {
    console.log("error:", error);
  }

  return (
    <Suspense>
      <div className="w-full">
        <GridTable
          columns={columns}
          data={data || []}
          actions={actions}
          isLoading={isPending}
          itemsPerPage={50}
        ></GridTable>
      </div>
    </Suspense>
  );
};

export default OrdersTable
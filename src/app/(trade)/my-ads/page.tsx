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
import { useContracts } from '@/common/contexts/ContractContext';
import { useAccount } from 'wagmi';


const columns: any = [
  {
    key: "rate",
    label: "Rate",
    render: (row: Offer) => (
      <span className="font-bold">{row.rate}</span>
    ),
  },
  {
    key: "amounts",
    label: "Amounts",
    //TODO: REPLACE WITH CURRENCY
    render: (row: Offer) => <span className="font-bold"> GHS {Number(row.minOrder) / 10 ** 18
    } - GHS {Number(row.maxOrder) / 10 ** 18}</span>,
  },
  {
    key: "paymentMethod",
    label: "Payment Method",
    render: (row: Offer) => <span className="italic">{row.paymentMethod.method}</span>,
  },
  {
    key: "status",
    label: "Status",
    render: (row: Offer) => (
      <span className="italic">{row.active? "Active" : "Deactivated"}</span>
    ),
  },
];

interface Props {
  offerType: string;
  merchant?: string;
}
const MyAds: FC<Props> = () => {
  const {indexerUrl} = useContracts();
  const tableRef = useRef<{ closeExpandedRow: () => void } | null>(null);
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const account = useAccount();
  const [offerType, setOfferType] = useState<string>("buy");

  const trade = searchParams.get("trade") || "Buy";
  const crypto = searchParams.get("crypto") || "USDT";


  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useQuery({
      queryKey: ["ads", currentPage, offerType, {merchant: account.address}],
      queryFn: () => fetchAds(indexerUrl, currentPage, offerType, {
        merchant: account.address?.toLowerCase()
      }),
      // placeholderData: keepPreviousData,
    });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log('Page changed to:', page);
  };

  if (error) {
    console.log("error:", error);
  }

  const actions = [
    { onClick: (row: any) => router.push('/appeal/order'), classNames: "bg-transparent text-black", icon: <Eye /> },
    { onClick: (row: any) => router.push('/appeal/order'), classNames: "bg-transparent text-black", icon: <Trash2 /> },
    { onClick: (row: any) => router.push('/appeal/order'), classNames: "bg-transparent text-black", icon: <CircleCheck /> },
  ]



  return (
    <div className="container mx-auto p-0 py-4">
      <div className='py-12 flex flex-col gap-10'>
        <GridTable columns={columns} data={data?.offers || []} actions={actions} itemsPerPage={50} />
      </div>
    </div>
  );
};



export default MyAds;

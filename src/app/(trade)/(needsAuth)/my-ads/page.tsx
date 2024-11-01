'use client'
import GridTable from '@/components/datatable';
import { CircleX, Pencil } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAds } from "@/common/api/fetchAds";
import { useContracts } from "@/common/contexts/ContractContext";
import { FetchAdsOptions, Offer, Token } from "@/common/api/types";
import { offerTypes } from "@/common/constants";
import { useUser } from "@/common/contexts/UserContext";
import { formatCurrency, getPaymentMethodColor } from "@/lib/utils";
import { ACCEPTED_CURRENCIES, ACCEPTED_TOKENS, MY_ADS, PAYMENT_METHODS } from "@/common/constants/queryKeys";
import InputSelect from "@/components/ui/InputSelect";
import InputWithSelect from "@/components/ui/InputWithSelect";
import CryptoSelector from "../../cryptoSelector";
import { fetchTokens } from "@/common/api/fetchTokens";
import { fetchCurrencies } from "@/common/api/fetchCurrencies";
import fetchContractPaymentMethods from "@/common/api/fetchContractPaymentMethods";
import Wrapper from '@/components/layout/Wrapper';
import { currencyIcons } from "@/common/data/currencies";
import useMarketData from "@/common/hooks/useMarketData";

const BuySellOptions = [
  {
    label: "All Ads",
    value: "all",
  },
  {
    label: "Buy",
    value: "buy",
  },
  {
    label: "Sell",
    value: "sell",
  },
];

const columns: any = [
  {
    key: "id",
    label: "Id",
    render: (row: Offer) => <span className="">{row.id}</span>,
  },
  {
    key: "rate",
    label: "Rate",
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
    key: "amounts",
    label: "Amounts",
    render: (row: Offer) => (
      <span className=" text-sm text-gray-700 dark:text-gray-300">
        {formatCurrency(row.minOrder, "")} - {formatCurrency(row.maxOrder, row.token.symbol)}
      </span>
      // <span className="">
      //   {formatCurrency(row.minOrder, row.token.symbol)} - {formatCurrency(row.maxOrder, row.token.symbol)}
      // </span>
    ),
  },
  {
    key: "paymentMethod",
    label: "Payment Method",
    render: (row: Offer) => {
      return (
        <span
          className={`text-sm dark:text-gray-300 text-gray-700 border-l-4 pl-1 ${getPaymentMethodColor(
            row.paymentMethod.method.toLowerCase(),
          )}`}
        >
          {row.paymentMethod.method}
        </span>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    render: (row: Offer) => <span className="">{row.active ? "Active" : "Deactivated"}</span>,
  },
  {
    key: "offerType",
    label: "Offer Type",
    render: (row: Offer) => <span className="">{row.offerType === offerTypes.buy ? "buy" : "sell"}</span>,
  },
];

const MyAds = () => {
  const { indexerUrl } = useContracts();
  const tableRef = useRef<{ closeExpandedRow: () => void } | null>(null);
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>();
  const [offerType, setOfferType] = useState<string>();
  const [currencyAmount, setCurrencyAmount] = useState<{
    currency: string;
    id: string | null;
    amount: string;
  }>();

  const router = useRouter();
  const { address } = useUser();
  const trade = searchParams.get("trade") || "Buy";
  const crypto = searchParams.get("crypto") || "USDT";
  const isOptimistic = searchParams.get("optimistic") === "true";

  const { tokens, currencies, paymentMethods } = useMarketData();

  const [selectedCrypto, setSelectedCrypto] = useState(
    tokens?.find(t => t.symbol === searchParams.get("crypto") || ""),
  );

  const options: FetchAdsOptions = {
    page: currentPage,
    offerType,
    tokenId: selectedCrypto?.id,
    currency: currencyAmount?.id !== "0x0" ? currencyAmount?.id || undefined : undefined,
    amount: currencyAmount?.amount,
    paymentMethod: paymentMethods?.find((method: { method: string }) => method.method === paymentMethod)?.id,
    quantity: 10,
    merchant: address,
  };

  const { isPending, isError, error, data, isFetching, isPlaceholderData } = useQuery({
    queryKey: MY_ADS({ indexerUrl, options }),
    queryFn: () => fetchAds(indexerUrl, options),
    enabled: !isOptimistic,
    // placeholderData: keepPreviousData,
  });


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    console.log("error:", error);
  }

  const actions = [
    {
      onClick: (row: any) => router.push("/order/order"),
      classNames: "bg-transparent text-black dark:text-white",
      icon: <Pencil className="w-4 h-4" />,
    },
    {
      onClick: (row: any) => router.push("/appeal/order"),
      classNames: "bg-transparent text-black dark:text-white",
      icon: <CircleX className="w-4 h-4" />,
    },
  ];

  const isAvailable = !!(tokens && currencies && paymentMethods);

  if (!isAvailable) {
    return null;
  }

  return (
    <Suspense>
      <Wrapper>
        <div className="container mx-auto p-0 py-4">
          <div className="py-12 flex flex-col gap-10">
            <div className="flex flex-row justify-between items-center w-full flex-wrap lg:flex-nowrap gap-4">
              <InputSelect
                initialValue="all"
                onValueChange={setOfferType}
                options={BuySellOptions}
                selectType="normal"
                style={{ paddingTop: "14px", padding: "14px" }}
              />
              <div className="w-full">
                <CryptoSelector
                  tokens={tokens}
                  selectedCrypto={selectedCrypto}
                  setSelectedCrypto={setSelectedCrypto}
                  showFaucet={false}
                />
              </div>
              <InputWithSelect
                onValueChange={setCurrencyAmount}
                currencies={currencies}
                placeholder="Enter amount"
                readOnly={false}
              />
              <InputSelect
                showLabel={false}
                initialValue="usd"
                placeholder="All Payment Methods"
                options={paymentMethods.map((method: any) => ({
                  value: method.method,
                  label: method.method,
                }))}
                onValueChange={setPaymentMethod}
                className="bg-white dark:bg-gray-800 text-black dark:text-white"
                style={{ paddingTop: "14px", padding: "14px" }}
              />
            </div>
            <GridTable
              columns={columns}
              data={data?.offers || []}
              actions={actions}
              itemsPerPage={50}
              isLoading={isFetching}
            />
          </div>
        </div>
      </Wrapper>
    </Suspense>
  );
};



export default MyAds;

"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import WalletConnectSection from "@/components/sections/WalletConnectSection";
import IExchangeGuide from "@/components/sections/IExchangeGuide";
import { useContracts } from "@/common/contexts/ContractContext";
import { useQuery } from "@tanstack/react-query";
import { fetchTokens } from "@/common/api/fetchTokens";
import { PreparedCurrency } from "@/common/api/types";
import { fetchCurrencies } from "@/common/api/fetchCurrencies";
import fetchContractPaymentMethods from "@/common/api/fetchContractPaymentMethods";


const Faqs = React.lazy(() => import('@/components/sections/Faqs'));
const P2PAds = React.lazy(() => import("./P2PAds"));
const InputAmount = React.lazy(() => import('@/components/ui/InputWithSelect'));
const SelectPaymentMethod = React.lazy(() => import('@/components/ui/InputSelect'));
import Loader from "@/components/loader/Loader";
import CryptoSelector from "./cryptoSelector";
import { useUser } from "@/common/contexts/UserContext";
import { ACCEPTED_TOKENS } from "@/common/constants/queryKeys";

interface P2PMarketProps {}

const P2PMarket: React.FC<P2PMarketProps> = () => {
  const { session } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { currentChain, indexerUrl } = useContracts();
  const [paymentMethod, setPaymentMethod] = useState("");
  const { data: tokens } = useQuery({
    queryKey: ACCEPTED_TOKENS(indexerUrl),
    queryFn: () => fetchTokens(indexerUrl),
    enabled: !!indexerUrl,
  });
  const [selectedCrypto, setSelectedCrypto] = useState(
    tokens?.find(t => t.symbol === searchParams.get("crypto") || ""),
  );

  const [activeTab, setActiveTab] = useState<"buy" | "sell" | string>(
    searchParams.get("trade")?.toLowerCase() || "buy",
  );

  const { data: acceptedCurrencies } = useQuery({
    queryKey: ["acceptedCurrencies"],
    queryFn: () => fetchCurrencies(indexerUrl),
    enabled: !!indexerUrl,
  });

  const currencies = acceptedCurrencies?.map(currency => ({
    symbol: currency.currency,
    name: currency.currency,
    id: currency.id,
    icon: currency.currency === "GHS" ? <p>₵</p> : currency.currency === "NGN" ? <p>₦</p> : <p>KSh</p>,
  }));

  const currencyFromUrl = acceptedCurrencies?.find(c => c.currency === searchParams.get("fiat") || "GHS");
  const [currencyAmount, setCurrencyAmount] = useState({
    currency: currencyFromUrl?.currency || "GHS",
    id: currencyFromUrl?.id,
    amount: "",
  });

  const { data: paymentMethods } = useQuery({
    queryKey: ["paymentOptions"],
    queryFn: () => fetchContractPaymentMethods(indexerUrl),
    enabled: !!indexerUrl,
  });

  const handleTabChange = (tab: "buy" | "sell" | string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fiat: string = currencyAmount.currency || "GHS";
    const query = activeTab
      ? `trade=${activeTab}&crypto=${selectedCrypto?.symbol || ""}&fiat=${fiat}`
      : `crypto=${selectedCrypto?.symbol || ""}&fiat=${fiat}`;
    router.push(`${pathname}?${query}`);
  }, [selectedCrypto, activeTab]);

  const isAvailable = !!(tokens && currencies && paymentMethods);

  if (!isAvailable) {
    return null;
  }

  // console.log("qiAllp2pcurrencies", currencies);

  return (
    <>
      <WalletConnectSection />
      <div className="container mx-auto  p-0 flex flex-col items-start space-y-4">
        <div className="flex flex-row justify-between items-center w-full flex-wrap lg:flex-nowrap gap-4">
          <TabSelector activeTab={activeTab} handleTabChange={handleTabChange} />
          <div className="w-full ">
            <CryptoSelector tokens={tokens} selectedCrypto={selectedCrypto} setSelectedCrypto={setSelectedCrypto} />
          </div>
          <div className="w-full">
            <PaymentsSection
              currencyAmount={currencyAmount}
              setCurrencyAmount={setCurrencyAmount}
              setPaymentMethod={setPaymentMethod}
              currencies={currencies}
              paymentMethods={paymentMethods}
              currentChain={currentChain}
            />
          </div>
        </div>

        <Suspense fallback={<Loader loaderType="text" className="mt-24" />}>
          <P2PAds
            offerType={activeTab}
            isActive={true}
            paymentMethod={paymentMethods.find((method: { method: string }) => method.method === paymentMethod)}
            amount={currencyAmount.amount}
            currency={currencies.find(c => c.id === currencyAmount.id)}
            token={selectedCrypto}
          />
        </Suspense>
        <IExchangeGuide />
        <Suspense fallback={<Loader loaderType="text" />}>
          <Faqs />
        </Suspense>
      </div>
    </>
  );
};

export default P2PMarket;

interface TabSelectorProps {
  activeTab: string;
  handleTabChange: (tab: "buy" | "sell" | string) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, handleTabChange }) => {
  return (
    <div className="flex flex-row items-center bg-white border border-gray-200 rounded-[10px] p-2 min-w-full lg:min-w-[150px] dark:bg-gray-800 dark:border-gray-700">
      <button
        onClick={() => handleTabChange("buy")}
        className={`w-full rounded-[5px] text-center text-[14px] font-[400] p-2 px-6 transition-all duration-300 ease-in-out ${
          activeTab.toLowerCase() === "buy"
            ? "text-black bg-gray-200 dark:text-white dark:bg-gray-600"
            : "text-gray-400 dark:text-gray-400 hover:text-black hover:bg-gray-200 dark:hover:text-white dark:hover:bg-gray-700"
        }`}
      >
        Buy
      </button>
      <button
        onClick={() => handleTabChange("sell")}
        className={`w-full rounded-[5px] text-center text-[14px] font-[400] p-2 px-6 transition-all duration-300 ease-in-out ${
          activeTab.toLowerCase() === "sell"
            ? "text-black bg-gray-200 dark:text-white dark:bg-gray-600"
            : "text-gray-400 dark:text-gray-400 hover:text-black hover:bg-gray-200 dark:hover:text-white dark:hover:bg-gray-700"
        }`}
      >
        Sell
      </button>
    </div>
  );
};


interface PaymentsSectionProps {
  currencies: PreparedCurrency[];
  paymentMethods: any;
  setCurrencyAmount: (value: { currency: string; amount: string; id: `0x${string}` }) => void;
  setPaymentMethod: (value: string) => void;
  currencyAmount: { currency: string; amount: string; id: `0x${string}` | undefined };
  currentChain: any;
}

const PaymentsSection: React.FC<PaymentsSectionProps> = ({
  currencies,
  paymentMethods,
  currencyAmount,
  setCurrencyAmount,
  setPaymentMethod,
}) => {
  const { session } = useUser();
  return (
    <div className="flex flex-row justify-between items-center space-x-0 lg:space-x-3 space-y-3 lg:space-y-0 flex-wrap lg:flex-nowrap mt-0 w-full">
      <div className="flex flex-row justify-between items-center space-x-0 gap-3 space-y-3 lg:space-y-0 flex-wrap lg:flex-nowrap w-full">
        {/* {session.status === "authenticated" && (
          <div className="w-full block lg:hidden">
            <NetworkSwitcher />
          </div>
        )} */}
        <div className="w-full lg:w-1/2">
          <InputAmount
            label=""
            placeholder="Enter amount"
            initialCurrencyName={currencyAmount.currency}
            currencies={currencies}
            //@ts-ignore
            onValueChange={(value: { currency: string; amount: string; id: `0x${string}` }) => {
              setCurrencyAmount(value);
              console.log(value);
            }}
            readOnly={false}
            className="bg-white dark:bg-gray-800 text-black dark:text-white" // Adding dark mode styles
          />
        </div>
        <div className="w-full lg:w-1/2">
          <SelectPaymentMethod
            label=""
            initialValue="usd"
            placeholder="All Payment Methods"
            options={paymentMethods.map((method: any) => ({
              value: method.method,
              label: method.method,
            }))}
            onValueChange={value => setPaymentMethod(value)}
            className="bg-white dark:bg-gray-800 text-black dark:text-white" // Adding dark mode styles
          />
        </div>
        {/* <Filter className="hidden lg:block cursor-pointer" onClick={() => { }} /> */}
      </div>
      {/* {session.status === "authenticated" && (
        <div className="lg:w-auto lg:flex hidden lg:block">
          <NetworkSwitcher />
        </div>
      )} */}
    </div>
  );
};

"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import WalletConnectSection from "@/components/sections/WalletConnectSection";
import IExchangeGuide from "@/components/sections/IExchangeGuide";
import { useChainModal } from "@rainbow-me/rainbowkit";
import { useContracts } from "@/common/contexts/ContractContext";
import { useQuery } from "@tanstack/react-query";
import { fetchTokens } from "@/common/api/fetchTokens";
import { PreparedCurrency } from "@/common/api/types";
import { fetchCurrencies } from "@/common/api/fetchCurrencies";
import fetchContractPaymentMethods from "@/common/api/fetchContractPaymentMethods";


const Button = React.lazy(() => import('@/components/ui/Button'));
const Faqs = React.lazy(() => import('@/components/sections/Faqs'));
const P2PAds = React.lazy(() => import('./order/P2PAds'));
const InputAmount = React.lazy(() => import('@/components/ui/InputWithSelect'));
const SelectPaymentMethod = React.lazy(() => import('@/components/ui/InputSelect'));
import Loader from "@/components/loader/Loader";
import CryptoSelector from "./cryptoSelector";
import NetworkSwitcher from "@/components/networkSwitcher";
import { useUser } from "@/common/contexts/UserContext";

interface P2PMarketProps { }

const P2PMarket: React.FC<P2PMarketProps> = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { openChainModal } = useChainModal();
  const { currentChain, indexerUrl } = useContracts();
  const [paymentMethod, setPaymentMethod] = useState("");
  const { data: tokens } = useQuery({
    queryKey: ["tokens"],
    queryFn: () => fetchTokens(indexerUrl),
    enabled: !!indexerUrl,
  });
  const [selectedCrypto, setSelectedCrypto] = useState(
    tokens?.find((t) => t.symbol === searchParams.get("crypto") || "CEDIH")
  );

  const [activeTab, setActiveTab] = useState<"buy" | "sell" | string>(
    searchParams.get("trade")?.toLowerCase() || "buy"
  );

  const { data: acceptedCurrencies } = useQuery({
    queryKey: ["acceptedCurrencies"],
    queryFn: () => fetchCurrencies(indexerUrl),
    enabled: !!indexerUrl,
  });

  const currencies = acceptedCurrencies?.map((currency) => ({
    symbol: currency.currency,
    name: currency.currency,
    id: currency.id,
    icon: currency.currency === "GHS" ? <p>₵</p> : currency.currency === "NGN" ? <p>₦</p> : <p>KSh</p>
  }));

  const currencyFromUrl = acceptedCurrencies?.find(c => c.currency = searchParams.get("fiat") || "GHS");
  const [currencyAmount, setCurrencyAmount] = useState({ currency: currencyFromUrl?.currency || "GHS", id: currencyFromUrl?.id, amount: "" });



  const { data: paymentMethods } = useQuery({
    queryKey: ["paymentOptions"],
    queryFn: () => fetchContractPaymentMethods(indexerUrl),
    enabled: !!indexerUrl,
  });



  const handleTabChange = (
    tab: "buy" | "sell" | string,
  ) => {

    setActiveTab(tab);
  };

  useEffect(() => {
    const fiat: string = currencyAmount.currency || "CEDIH"
    const query = activeTab
      ? `trade=${activeTab}&crypto=${selectedCrypto?.symbol || ""}&fiat=${fiat}`
      : `crypto=${selectedCrypto?.symbol}&fiat=${fiat}`;
    router.push(`${pathname}?${query}`);

  }, [selectedCrypto, activeTab]);


  const isAvailable = !!(tokens && currencies && paymentMethods);

  if (!isAvailable) {
    return null;
  }

  return (
    <>
      <WalletConnectSection />
      <div className="container mx-auto p-4 lg:p-0 lg:py-10 flex flex-col items-start space-y-4">
        <div className="flex flex-row items-start gap-4">
          <TabSelector activeTab={activeTab} handleTabChange={handleTabChange} />
          <CryptoSelector
            tokens={tokens}
            selectedCrypto={selectedCrypto}
            setSelectedCrypto={setSelectedCrypto}
          />
        </div>
        <PaymentsSection
          setCurrencyAmount={setCurrencyAmount}
          setPaymentMethod={setPaymentMethod}
          currencies={currencies}
          paymentMethods={paymentMethods}
          currentChain={currentChain}
        />
        <Suspense fallback={<Loader loaderType="text" className="mt-24" />}>
          <P2PAds offerType={activeTab}
            isActive={true}
            paymentMethod={paymentMethods.find(method => method.method === paymentMethod)}
            amount={currencyAmount.amount}
            currency={currencies.find(c => c.id === currencyAmount.id)}
            token={selectedCrypto} />
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

const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  handleTabChange,
}) => (
  <div className="flex flex-row items-center bg-white border border-gray-200 rounded-xl p-1 min-w-[150px]">
    <button
      onClick={() => handleTabChange("buy")}
      className={`w-full rounded-xl text-center text-md p-1 ${activeTab.toLowerCase() === "buy"
        ? "text-black bg-gray-300"
        : "text-gray-600"
        }`}
    >
      Buy
    </button>
    <button
      onClick={() => handleTabChange("sell")}
      className={`w-full rounded-xl text-center text-md p-1 ${activeTab.toLowerCase() === "sell"
        ? "text-black bg-gray-300"
        : "text-gray-600"
        }`}
    >
      Sell
    </button>
  </div>
);



interface PaymentsSectionProps {
  currencies: PreparedCurrency[];
  paymentMethods: any;
  setCurrencyAmount: (value: { currency: string; amount: string; id: `0x${string}` }) => void;
  setPaymentMethod: (value: string) => void;
  currentChain: any;
}

const PaymentsSection: React.FC<PaymentsSectionProps> = ({
  currencies,
  paymentMethods,
  setCurrencyAmount,
  setPaymentMethod,
}) => {
  const { session } = useUser()
  return (
    <div className="flex flex-row justify-between items-center space-x-0 lg:space-x-3 space-y-3 lg:space-y-0 flex-wrap lg:flex-nowrap mt-6 w-full">
      <div className="flex flex-row justify-between items-center space-x-0 lg:space-x-3 space-y-3 lg:space-y-0 flex-wrap lg:flex-nowrap">
        <div className="w-full block lg:hidden">
          <NetworkSwitcher />
        </div>
        <div className="w-full lg:w-[300px]">
          <InputAmount
            label=""
            placeholder="Enter amount"
            initialCurrency={currencies[0].symbol}
            currencies={currencies}
            //@ts-ignore
            onValueChange={(value: { currency: string; amount: string, id: `0x${string}` }) => {
              setCurrencyAmount(value);
              console.log(value)
            }
            }
            readOnly={false}
          />
        </div>
        <div className="w-full lg:w-[300px]">
          <SelectPaymentMethod
            label=""
            initialValue="usd"
            placeholder="All Payment Methods"
            options={paymentMethods.map((method: any) => ({
              value: method.method,
              label: method.method,
            }))}
            onValueChange={(value) => setPaymentMethod(value)}
          />
        </div>
        <Filter className="hidden lg:block cursor-pointer" onClick={() => { }} />
      </div>
      {session.status === "authenticated" && (
        <div className="lg:w-auto hidden lg:flex">
          <NetworkSwitcher />
        </div>
      )}
    </div>

  )

};
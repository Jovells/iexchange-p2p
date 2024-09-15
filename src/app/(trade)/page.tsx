"use client";

import React, { Fragment, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronsUpDown, DollarSign, Euro, Filter, MoveVertical } from "lucide-react";
import SelectPaymentMethod from "@/components/ui/InputSelect";
import InputAmount from "@/components/ui/InputWithSelect";
import P2PAds from "./order/P2PAds";
import WalletConnectSection from "@/components/sections/WalletConnectSection";
import Faqs from "@/components/sections/Faqs";
import IExchangeGuide from "@/components/sections/IExchangeGuide";
import Loader from "@/components/loader/Loader";
import { useChainModal } from "@rainbow-me/rainbowkit";
import { useContracts } from "@/common/contexts/ContractContext";
import Button from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { fetchTokens } from "@/common/api/fetchTokens";
import { PreparedCurrency, Token } from "@/common/api/types";
import { fetchCurrencies } from "@/common/api/fetchCurrencies";
import { fetchPaymentMethods } from "@/common/api/fetchPaymentMethods";
import { useAccount } from "wagmi";

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
  ;

  console.log("paymentMethodpage", paymentMethod);



  const { data: acceptedCurrencies } = useQuery({
    queryKey: ["acceptedCurrencies"],
    queryFn: () => fetchCurrencies(indexerUrl),
    enabled: !!indexerUrl,
  });

  const currencies = acceptedCurrencies?.map((currency) => ({
    symbol: currency.currency,
    name: currency.currency,
    id: currency.id,
    icon: currency.currency === "GHS" ? <p>₵</p> :currency.currency === "NGN" ? <p>₦</p> : <p>KSh</p> 
  }));

  const currencyFromUrl = acceptedCurrencies?.find(c => c.currency = searchParams.get("fiat") || "GHS");
  const [currencyAmount, setCurrencyAmount] = useState({ currency: currencyFromUrl?.currency || "GHS", id: currencyFromUrl?.id, amount: "" });

  

  const { data: paymentMethods } = useQuery({
    queryKey: ["paymentOptions"],
    queryFn: () => fetchPaymentMethods(indexerUrl),
    enabled: !!indexerUrl,
  });



  const handleTabChange = (
    tab: "buy" | "sell" | string,
  ) => {
    const fiat: string = currencyAmount.currency || "CEDIH"
    const query = tab
      ? `trade=${tab}&crypto=${selectedCrypto?.symbol}&fiat=${fiat}`
      : `crypto=${selectedCrypto?.symbol}&fiat=${fiat}`;

    router.push(`${pathname}?${query}`);
    setActiveTab(tab);
  };

  const handleOpenChainModal = () => {
    console.log("open chain modal", openChainModal);
    openChainModal?.();
  };

  const isAvailable = !!(tokens && currencies && paymentMethods);

  if (!isAvailable) {
    return <Loader className="mt-20" />;
  }


  return (
    <Fragment>
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
          handleOpenChainModal={handleOpenChainModal}
          currentChain={currentChain}
        />
        <P2PAds offerType={activeTab}
          paymentMethod={paymentMethods.find(method => method.method === paymentMethod)}
          amount={currencyAmount.amount}
          currency={currencies.find(c => c.id === currencyAmount.id)}
          token={selectedCrypto} />
        <IExchangeGuide />
        <Faqs />
      </div>
    </Fragment>
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

interface CryptoSelectorProps {
  tokens: Token[];
  selectedCrypto?: Token;
  setSelectedCrypto: (token: Token) => void;
}

const CryptoSelector: React.FC<CryptoSelectorProps> = ({
  tokens,
  selectedCrypto,
  setSelectedCrypto,
}) => (
  <div className="bg-white border-0 border-gray-200 rounded-xl">
    <div className="hidden sm:flex justify-start items-center space-x-4 p-1 px-3">
      {tokens.map((token) => (
        <button
          key={token.id}
          onClick={() => setSelectedCrypto(token)}
          className={`p-1 rounded-full text-md ${selectedCrypto?.symbol === token.symbol ? " text-blue-500" : "text-black"
            }`}
        >
          {token.symbol}
        </button>
      ))}
    </div>
    <div className="sm:hidden flex flex-row items-center space-x-6">
      <select
        value={selectedCrypto?.symbol}
        onChange={(e) =>
          setSelectedCrypto(tokens.find((t) => t.symbol === e.target.value)!)
        }
        className="w-full px-6 py-2 rounded-xl text-md bg-white border border-gray-300 text-gray-600 outline-none"
      >
        {tokens.map((crypto) => (
          <option key={crypto.id} value={crypto.symbol}>
            {crypto.symbol}
          </option>
        ))}
      </select>
      <Filter className="cursor-pointer w-10 h-10" onClick={() => { }} />
    </div>
  </div>
);

interface PaymentsSectionProps {
  currencies: PreparedCurrency[];
  paymentMethods: any;
  setCurrencyAmount: (value: { currency: string; amount: string; id: `0x${string}` }) => void;
  setPaymentMethod: (value: string) => void;
  handleOpenChainModal: () => void;
  currentChain: any;
}

const PaymentsSection: React.FC<PaymentsSectionProps> = ({
  currencies,
  paymentMethods,
  handleOpenChainModal,
  setCurrencyAmount,
  setPaymentMethod,
  currentChain,
}) => {
  const { isConnected } = useAccount()
  return (
    <div className="flex flex-row justify-between items-center space-x-0 lg:space-x-3 space-y-3 lg:space-y-0 flex-wrap lg:flex-nowrap mt-6 w-full">
      <div className="flex flex-row justify-between items-center space-x-0 lg:space-x-3 space-y-3 lg:space-y-0 flex-wrap lg:flex-nowrap">
        <Button text={currentChain.name} className="bg-transparent border border-blue-300 px-4 py-2 w-full block lg:hidden" onClick={handleOpenChainModal} icon={<MoveVertical />} />
        <div className="w-full lg:w-[300px]">
          <InputAmount
            label=""
            placeholder="Enter amount"
            initialCurrency={currencies[0].symbol}
            currencies={currencies}
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
      {isConnected && <Button text={currentChain.name} className="justify-end bg-transparent border border-blue-300 px-4 py-2 w-full lg:w-auto hidden lg:flex" onClick={handleOpenChainModal} icon={<ChevronsUpDown />} />}
    </div>

  )
};
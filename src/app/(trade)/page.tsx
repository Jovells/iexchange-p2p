"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DollarSign, Euro, Filter } from "lucide-react";
import SelectPaymentMethod from "@/components/ui/InputSelect";
import InputAmount from "@/components/ui/InputWithSelect";
import P2POffers from "./order";
import WalletConnectSection from "@/components/sections/WalletConnectSection";
import Faqs from "@/components/sections/Faqs";
import IExchangeGuide from "@/components/sections/IExchangeGuide";

interface P2PMarketProps {}

const P2PMarket: React.FC<P2PMarketProps> = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab: any = searchParams.get("trade")?.toLowerCase();
  const [activeTab, setActiveTab] = useState<"buy" | "sell" | string>(
    tab === "sell" ? "sell" : "buy"
  );
  const [selectedCrypto, setSelectedCrypto] = useState("USDT");

  const options = [
    {
      value: "usd",
      label: "US Dollar",
      icon: <DollarSign className="w-4 h-4" />,
    },
    { value: "eur", label: "Euro", icon: <Euro className="w-4 h-4" /> },
    {
      value: "gbp",
      label: "British Pound",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      value: "shopping",
      label: "Shopping",
      icon: <DollarSign className="w-4 h-4" />,
    },
  ];
  const currencies = [
    { symbol: "GHS", name: "BTC", icon: <DollarSign className="w-4 h-4" /> },
    { symbol: "USD", name: "ETH", icon: <DollarSign className="w-4 h-4" /> },
    { symbol: "EUR", name: "USD", icon: <Euro className="w-4 h-4" /> },
  ];

  const cryptos = ["USDT", "BTC", "USDC", "ETH"];

  useEffect(() => {
    if (tab === "buy" || tab === "sell") {
      setActiveTab(tab);
    }
  }, [tab]);

  const handleTabChange = (
    tab: "buy" | "sell" | string,
    cryptocurrency: string = "USDT",
    fiat: string = "MDL"
  ) => {
    const query = tab
      ? `trade=${tab}&crypto=${cryptocurrency}&fiat=${fiat}`
      : `crypto=${selectedCrypto}&fiat=${fiat}`;

    router.push(`${pathname}?${query}`);
  };

  return (
    <>
      <WalletConnectSection />
      <div className="w-full lg:w-auto lg:container lg:mx-auto bg-white flex flex-col justify-start items-start space-y-4">
        {/* trading parameters */}
        <div className="w-full">
          <div className="flex flex-row justify-between lg:justify-start items-center flex-wrap lg:flex-nowrap w-full lg:w-auto">
            {/* buy or sell option */}
            <div className="flex flex-row items-center bg-white border border-gray-200 rounded-xl p-1 min-w-[150px]">
              <button
                onClick={() => handleTabChange("Buy")}
                className={`w-full rounded-xl text-center text-md p-1 ${
                  activeTab.toLowerCase() === "buy"
                    ? "text-black bg-gray-300"
                    : "text-gray-600"
                }`}>
                Buy
              </button>
              <button
                onClick={() => handleTabChange("Sell")}
                className={`w-full rounded-xl text-center text-md p-1 ${
                  activeTab.toLowerCase() === "sell"
                    ? "text-black bg-gray-300"
                    : "text-gray-600"
                }`}>
                Sell
              </button>
            </div>
            {/* crypto currency options */}
            <div className="bg-white border-0 border-gray-200 rounded-xl">
              <div className="hidden sm:flex justify-start items-center space-x-4 p-1 px-3">
                {cryptos.map((crypto) => (
                  <button
                    key={crypto}
                    onClick={() => setSelectedCrypto(crypto)}
                    className={`p-1 rounded-full text-md ${
                      selectedCrypto === crypto
                        ? " text-blue-500"
                        : "text-black"
                    }`}>
                    {crypto}
                  </button>
                ))}
              </div>
              <div className="sm:hidden flex flex-row items-center space-x-6">
                <select
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  className="w-full px-6 py-2 rounded-xl text-md bg-white border border-gray-300 text-gray-600">
                  {cryptos.map((crypto) => (
                    <option key={crypto} value={crypto}>
                      {crypto}
                    </option>
                  ))}
                </select>
                <Filter
                  className="cursor-pointer w-10 h-10"
                  onClick={() => {}}
                />
              </div>
            </div>
          </div>
          {/* filter options to apply */}
          <div className="flex flex-row justify-start items-center space-x-0 lg:space-x-3 space-y-3 lg:space-y-0 flex-wrap lg:flex-nowrap mt-6">
            {/* amount options */}
            <div className="w-full lg:w-[300px]">
              <InputAmount
                label=""
                initialCurrency="USD"
                currencies={currencies}
                onValueChange={(value: { currency: string; amount: string }) =>
                  console.log(value)
                }
                readOnly={false}
                placeholder="Enter amount"
              />
            </div>
            {/* payment options */}
            <div className="w-full lg:w-[300px]">
              <SelectPaymentMethod
                label=""
                initialValue="usd"
                options={options}
                onValueChange={(value) => console.log(value)}
              />
            </div>
            {/* additional filter */}
            <Filter
              className="hidden lg:block cursor-pointer"
              onClick={() => {}}
            />
          </div>
        </div>

        <div className="w-full mt-4">
          <P2POffers offerType={tab} />
        </div>

        <IExchangeGuide />

        <Faqs />
      </div>
    </>
  );
};

export default P2PMarket;

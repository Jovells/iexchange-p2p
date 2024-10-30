"use client";

import { fetchAds } from "@/common/api/fetchAds";
import { FetchAdsOptions, Token } from "@/common/api/types";
import { useContracts } from "@/common/contexts/ContractContext";
import useMarketData from "@/common/hooks/useMarketData";
import Loader from "@/components/loader/Loader";
import ToolTip from "@/components/toolTip";
import InputSelect from "@/components/ui/InputSelect";
import Select from "@/components/ui/Select";
import { useQueries, useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { formatEther } from "ethers";
import { formatCurrency } from "@/lib/utils";
import { set, z } from "zod";
import Claim from "../claim";
import NetworkSwitcher from "@/components/networkSwitcher";
import { useUser } from "@/common/contexts/UserContext";
import WalletConnect from "@/components/wallet";

interface CurrencyInput {
  amount: string;
  currency: string;
}

export default function QuickTradePage() {
  const { currencies, tokens } = useMarketData();
  const { isConnected } = useUser();
  const { indexerUrl } = useContracts();
  const [currency, setCurrency] = useState(currencies?.[0]);
  const [token, setToken] = useState(tokens?.[0]);
  const [offerType, setOfferType] = useState("buy");
  const [lastChanged, setLastChanged] = useState<"cryptoAmount" | "fiatAmount">();
  const [formErrors, setFormErrors] = useState<{ fiatAmount?: string; cryptoAmount?: string }>({});

  const isBuy = offerType === "buy";

  const options: FetchAdsOptions = { currency: currencies?.[0].id, quantity: 10, tokenId: token?.id, offerType };

  const { data: estimatedRate } = useQuery({
    queryKey: ["estimatedRate", options],
    queryFn: async () => {
      const response = await fetchAds(indexerUrl, options);
      return Number(
        response.offers.reduce((acc, offer) => acc + Number(offer.rate), 0) / response.offers.length,
      ).toPrecision(4);
    },
  });

  const nonBotOptions: FetchAdsOptions = {
    ...options,
    quantity: 1,
    isActive: true,
    withoutBots: true,
  };

  const { data: minAndMax, isLoading } = useQueries({
    queries:
      [
        { orderBy: "minOrder", orderDirection: "asc" },
        { orderBy: "maxOrder", orderDirection: "desc" },
      ].map(method => ({
        queryKey: ["ads", { ...nonBotOptions, ...method }],
        queryFn: () => fetchAds(indexerUrl, { ...nonBotOptions, ...method }),
      })) || [],
    combine: results => {
      const min = Number(results[0].data?.offers[0].minOrder || 0);
      const max = Number(results[1].data?.offers[0].maxOrder || 0);
      const minRate = Number(results[0].data?.offers[0].rate || 0);
      const maxRate = Number(results[1].data?.offers[0].rate || 0);

      return {
        data: {
          minCrypto: formatCurrency(min, ""),
          maxCrypto: formatCurrency(max, "", 5),
          minFiat: formatCurrency(min * minRate, ""),
          maxFiat: formatCurrency(max * maxRate, "", 5),
        },
        isPending: results.some(result => result.isPending),
        isLoading: results.some(result => result.isLoading),
      };
    },
  });

  const formSchema = z.object({
    fiatAmount: z
      .string()
      .refine(val => /^\d*\.?\d*$/.test(val), {
        message: "Amount must be a number",
      })
      .refine(val => Number(val) >= Number(minAndMax.minFiat) && Number(val) <= Number(minAndMax.maxFiat), {
        message: `Amount must be between ${minAndMax.minFiat} and ${minAndMax.maxFiat}`,
      }),
    cryptoAmount: z
      .string()
      .refine(val => /^\d*\.?\d*$/.test(val), {
        message: "Crypto amount must be a number",
      })
      .refine(val => Number(val) >= Number(minAndMax.minCrypto) && Number(val) <= Number(minAndMax.maxCrypto), {
        message: `Crypto amount must be between ${minAndMax.minCrypto} and ${minAndMax.maxCrypto}`,
      }),
  });

  const [{ fiatAmount, fiatAmountForContract, cryptoAmount, cryptoAmountForContract }, setFormData] = useState({
    fiatAmount: "",
    fiatAmountForContract: "",
    cryptoAmount: "",
    cryptoAmountForContract: "",
  });

  function handleFormDataChange(name: "cryptoAmount" | "fiatAmount", value: string) {
    setLastChanged(name);
    console.log("name", name, "orderType");
    // Prevent non-numeric input for fiatAmount and cryptoAmount fields
    if ((name === "fiatAmount" || name === "cryptoAmount") && !/^\d*\.?\d*$/.test(value as string)) {
      return;
    }

    if (name === "fiatAmount") {
      let newCryptoAmount;

      newCryptoAmount = Number(value) / Number(estimatedRate);

      setFormData(prev => ({
        ...prev,
        fiatAmount: value as string,
        cryptoAmount: Number(newCryptoAmount.toPrecision(4)).toString(), //TODO: @Jovells GET DECIMAL PLACES FROM TOKEN/CURRENCY
        cryptoAmountForContract: newCryptoAmount.toString(),
      }));
    } else if (name === "cryptoAmount") {
      let newFiatAmount;

      newFiatAmount = Number(value) * Number(estimatedRate);

      setFormData(prev => ({
        ...prev,
        cryptoAmount: value as string,
        fiatAmount: Number(newFiatAmount.toPrecision(4)).toString(), //TODO: @Jovells GET DECIMAL PLACES FROM TOKEN/CURRENCY
        fiatAmountForContract: newFiatAmount.toString(),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Validate form data
    const validationResult = formSchema.safeParse({ [name]: value });
    if (!validationResult.success) {
      const errors = validationResult.error.format();
      setFormErrors({
        [name]: errors[name]?._errors[0],
      });
    } else {
      setFormErrors({});
    }
  }

  if (!currency && currencies && currencies.length > 0) {
    setCurrency(currencies[0]);
  }

  if (!token && tokens && tokens.length > 0) {
    setToken(tokens.find(t => t.symbol === "USDT") || tokens[0]);
  }

  if (!token || !currency) {
    return <Loader />;
  }

  console.log("ql", "curr", minAndMax, "tok", tokens, "cu", currency, "to", token, "esr", estimatedRate);

  const searchParams = new URLSearchParams({
    currencyId: currency.id,
    tokenId: token.id,
    fiatAmount: fiatAmount,
    cryptoAmount: cryptoAmount,
    lastChanged: lastChanged as string,
    offerType,
  }).toString();
  console.log("qk", searchParams);

  const enabled = fiatAmount && cryptoAmount && !formErrors.fiatAmount && !formErrors.cryptoAmount;

  return (
    <div className="flex flex-col lg:flex-row gap-10 p-4 lg:p-10">
      {/* Main Content */}
      <div className="self-center mb-8 lg:mb-0">
        <h1 className="text-4xl lg:text-8xl font-bold mb-2 text-gray-900 dark:text-white">
          <span className="gradient-text">P2P</span> Quick trade
        </h1>
        <h2 className="text-xl lg:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {isBuy ? "Buy" : "Sell"} {token?.symbol} {isBuy ? "with" : "for"} {currency?.symbol} onchain
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Quickly Buy and Sell Crypto with various payment methods</p>
        <div className="flex flex-row mt-4 items-center gap-4">
          {isConnected && (
            <>
              <Claim className="w-[150px]" />
              <div>
                <NetworkSwitcher />
              </div>
            </>
          )}
        </div>
        <WalletConnect />
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 lg:p-6 w-full lg:w-1/2">
        <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setOfferType("buy")}
            className={`flex-1 px-4 py-3 font-medium border-b-2 ${
              isBuy
                ? "border-primary text-darkGray dark:text-darkGray-dark"
                : "text-gray-400 dark:border-darkGray dark:text-gray-500 hover:text-darkGray dark:hover:text-darkGray-dark hover:border-primary"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setOfferType("sell")}
            className={`flex-1 px-4 py-3 font-medium border-b-2 ${
              !isBuy
                ? "border-primary text-darkGray dark:text-darkGray-dark"
                : "dark:border-darkGray text-gray-400 dark:text-gray-500 hover:text-darkGray dark:hover:text-darkGray-dark hover:border-primary"
            }`}
          >
            Sell
          </button>
        </div>

        <div className="space-y-4 w-full">
          <div className={`flex ${isBuy ? "flex-col" : "flex-col-reverse"} w-full gap-4 items-center`}>
            <div className="p-4 bg-gray-50 w-full dark:bg-gray-700 rounded-xl">
              <label className="block text-sm mb-2 text-black dark:text-white">
                {isBuy ? "You Pay" : "You Receive"}
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  className="flex-1 text-2xl bg-transparent outline-none text-black dark:text-white"
                  placeholder={minAndMax.minFiat + " - " + minAndMax.maxFiat}
                  value={fiatAmount}
                  onChange={e => handleFormDataChange("fiatAmount", e.target.value)}
                />
                <div className="w-28 ml-2">
                  <InputSelect
                    style={{ paddingTop: "10px", padding: "10px" }}
                    options={(currencies || []).map(currency => ({
                      value: currency.id,
                      label: currency.name,
                      ...currency,
                    }))}
                    selectType="normal"
                    initialValue={currency.id}
                    onValueChange={value => {
                      setCurrency(currencies?.find(currency => currency.id === value));
                      console.log("qm", value);
                    }}
                    readOnly={false}
                    className="bg-white dark:bg-gray-800 text-black dark:text-white" // Adding dark mode styles
                  />
                </div>
              </div>
              {formErrors.fiatAmount && <p className="text-red-500 mt-1 text-sm">{formErrors.fiatAmount}</p>}
            </div>

            <div className="p-4 w-full bg-gray-50 dark:bg-gray-700 rounded-xl">
              <label className="block text-sm mb-2 text-black dark:text-white">
                {!isBuy ? "You Sell" : "You Receive"}
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  className="flex-1 text-2xl bg-transparent outline-none text-black dark:text-white"
                  placeholder={minAndMax.minCrypto + " - " + minAndMax.maxCrypto}
                  value={cryptoAmount}
                  onChange={e => handleFormDataChange("cryptoAmount", e.target.value)}
                />
                <Select
                  label=""
                  options={(tokens || []).map(token => ({
                    value: token.id,
                    label: token.name,
                    ...token,
                  }))}
                  showBalance={false}
                  selectType="normal"
                  initialValue={tokens?.[0]}
                  //@ts-ignore
                  onValueChange={(value: Token) => {
                    console.log("qn", value);
                    setToken(tokens?.find(t => t.id === value?.id));
                    console.log(value);
                  }}
                  readOnly={false}
                  className="bg-white dark:bg-gray-800 text-black dark:text-white" // Adding dark mode styles
                />
              </div>
              {formErrors.cryptoAmount && <p className="text-red-500 mt-1 text-sm">{formErrors.cryptoAmount}</p>}
            </div>
          </div>

          <div className="px-4 text-sm text-center text-gray-600 dark:text-gray-400">
            {minAndMax.maxCrypto === "0.00" ? (
              <p className="text-red-500 mt-1 text-sm">
                {"No Ads Available. Please try a different currency or token"}
              </p>
            ) : (
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <span>Estimated price</span>
                  <ToolTip text="This is estimated based on the available advertisements on P2P Zone. Click on Select Payment Method to view actual prices.">
                    <svg className="w-4 h-4 hover:text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path d="M12 16v-4m0-4h.01" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </ToolTip>
                </div>

                <span>
                  1 {token?.symbol} ≈ {estimatedRate} {currency?.name}
                </span>
              </div>
            )}
          </div>

          <Link
            href={"/quickTrade/2?" + searchParams}
            className={`w-full ${
              enabled
                ? "bg-primary text-gray-100 hover:bg-primary-foreground"
                : "bg-lightGray dark:bg-lightGray-dark text-gray-500 dark:text-gray-400 pointer-events-none"
            } flex items-center justify-center py-4 rounded-xl`}
          >
            Select Payment Method
            <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

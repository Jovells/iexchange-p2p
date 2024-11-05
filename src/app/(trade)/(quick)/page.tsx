"use client";

import { fetchAds } from "@/common/api/fetchAds";
import { FetchAdsOptions, Token } from "@/common/api/types";
import { useContracts } from "@/common/contexts/ContractContext";
import useMarketData from "@/common/hooks/useMarketData";
import { useQueries, useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { lazy, Suspense, useLayoutEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { z } from "zod";
import { SELECT_PAYMENT_METHOD_PAGE } from "@/common/page-links";
import { BOT_MERCHANT_ID } from "@/common/constants";

// Lazy load components
const Loader = lazy(() => import("@/components/loader/Loader"));
const ToolTip = lazy(() => import("@/components/toolTip"));
const InputSelect = lazy(() => import("@/components/ui/InputSelect"));
const Select = lazy(() => import("@/components/ui/Select"));
const WalletConnect = lazy(() => import("@/components/wallet"));
const FaucetAndNetwork = lazy(() => import("@/components/faucetAndNetwork"));

interface CurrencyInput {
  amount: string;
  currency: string;
}

export default function QuickTradePage() {
  const { currencies, tokens } = useMarketData();
  const { indexerUrl } = useContracts();
  const [currency, setCurrency] = useState(currencies?.find(c => c.name === "USD") || currencies?.[0]);
  const [token, setToken] = useState(tokens?.find(c => c.symbol === "USDT") || tokens?.[0]);
  const [offerType, setOfferType] = useState("buy");
  const [lastChanged, setLastChanged] = useState<"cryptoAmount" | "fiatAmount">();
  const [formErrors, setFormErrors] = useState<{ fiatAmount?: string; cryptoAmount?: string }>({});

  const isBuy = offerType === "buy";

  const options: FetchAdsOptions = {
    currency: currency?.id,
    quantity: 10,
    merchant: BOT_MERCHANT_ID,
    tokenId: token?.id,
    offerType,
    isActive: true,
  };

  const { data: estimatedRate, isLoading: isLoadingRate } = useQuery({
    queryKey: ["estimatedRate", options],
    queryFn: async () => {
      const response = await fetchAds(indexerUrl, options);
      return Number(
        response.offers.reduce((acc, offer) => acc + Number(offer.rate), 0) / response.offers.length,
      ).toPrecision(4);
    },
    placeholderData: "0.00",
  });

  const { data: minAndMax, isLoading } = useQueries({
    queries:
      [
        { orderBy: "minOrder", orderDirection: "asc" },
        { orderBy: "maxOrder", orderDirection: "desc" },
      ].map(method => ({
        queryKey: ["ads", { ...options, ...method, quantity: 1 }],
        queryFn: () => fetchAds(indexerUrl, { ...options, ...method, quantity: 1 }),
      })) || [],
    combine: results => {
      const min = Number(results[0].data?.offers[0].minOrder || 0);
      const max = Math.min(Number(results[1].data?.offers[0].maxOrder || 0), 1000000000 * 10 ** 18);
      const minRate = Number(results[0].data?.offers[0].rate || 0);
      const maxRate = Number(results[1].data?.offers[0].rate || 0);

      return {
        data: {
          minCrypto: formatCurrency(min, ""),
          maxCrypto: formatCurrency(max, ""),
          minFiat: formatCurrency(min * minRate, ""),
          maxFiat: formatCurrency(max * maxRate, ""),
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

  const [{ fiatAmount, cryptoAmount }, setFormData] = useState({
    fiatAmount: "",
    cryptoAmount: "",
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

  useLayoutEffect(() => {
    if (!currency && currencies && currencies.length > 0) {
      setCurrency(currencies.find(c => c.name === "USD") || currencies[0]);
    }

    if (!token && tokens && tokens.length > 0) {
      setToken(tokens.find(t => t.symbol === "USDT") || tokens[0]);
    }
  }, [currency, token, !!currencies?.[0], !!tokens?.[0]]);

  if (!token || !currency) {
    return <Loader fullPage />;
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

  const isReady = (!isLoading && !isLoadingRate) || (minAndMax && estimatedRate);
  console.log({ isLoading, isLoadingRate, minAndMax, estimatedRate, ready: isReady });

  return (
    <Suspense fallback={<Loader fullPage />}>
      {/* cta */}
      <div className="self-center max-w-prose mb-10 lg:mb-0 mt-16 lg:mt-0 text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl lg:text-8xl font-bold mb-2 text-gray-900 dark:text-white">
          P2P{" "}
          <span className="bg-gradient-custom dark:bg-gradient-custom-dark bg-clip-text text-transparent">
            Quick Trade
          </span>
        </h1>
        <h2 className="text-lg sm:text-xl  lg:text-2xl font-bold mb-3 lg:mb-4 text-gray-900 dark:text-white">
          Quickly buy and sell crypto right from your decentralised wallet
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Quickly buy and sell crypto with various payment methods
        </p>
        <div className="flex mt-4 mb-1 flex-col justify-center items-center lg:justify-start lg:items-start w-full">
          <div>
            <WalletConnect />
          </div>
          <div>
            <FaucetAndNetwork className="w-full lg:place-self-start md:w-[400px] md:flex-nowrap flex flex-wrap place-self-center mb-4 h-[50px]" />
          </div>
        </div>
      </div>
      {/* form */}

      <div className=" w-full max-w-[500px] mx-auto lg:mx-0">
        {isReady ? (
          <div className=" p-4 sm:p-6 w-full bg-white dark:bg-transparent dark:border dark:border-gray-700 rounded-2xl shadow-lg ">
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
                <div className="p-4 bg-gray-50 dark:bg-transparent w-full dark:border  dark:border-gray-700 rounded-xl">
                  <label className="block text-sm mb-2 text-black dark:text-white">
                    {isBuy ? "You Pay" : "You Receive"}
                  </label>
                  <div className="flex items-center">
                    <input
                      disabled={minAndMax.maxCrypto === "0.00" || isLoading}
                      type="text"
                      className="w-full flex-1 text-lg md:text-2xl text-ellipsis bg-transparent outline-none text-black dark:text-white"
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
                  {formErrors.fiatAmount && minAndMax.maxCrypto !== "0.00" && (
                    <p className="text-red-500 mt-1 text-sm">{formErrors.fiatAmount}</p>
                  )}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-transparent w-full dark:border  dark:border-gray-700 rounded-xl">
                  <label className="block text-sm mb-2 text-black dark:text-white">
                    {!isBuy ? "You Sell" : "You Receive"}
                  </label>
                  <div className="flex items-center">
                    <input
                      disabled={minAndMax.maxCrypto === "0.00" || isLoading}
                      type="text"
                      className="w-full flex-1 text-lg text-ellipsis  md:text-2xl bg-transparent outline-none text-black dark:text-white"
                      placeholder={minAndMax.minCrypto + " - " + minAndMax.maxCrypto}
                      value={cryptoAmount}
                      onChange={e => handleFormDataChange("cryptoAmount", e.target.value)}
                    />
                    <div className="w-28 ml-2">
                      <Select
                        label=""
                        options={(tokens || []).map(token => ({
                          value: token.id,
                          label: token.name,
                          ...token,
                        }))}
                        showBalance={false}
                        selectType="normal"
                        initialValue={token}
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
                  </div>
                  {formErrors.cryptoAmount && minAndMax.maxCrypto !== "0.00" && (
                    <p className="text-red-500 mt-1 text-sm">{formErrors.cryptoAmount}</p>
                  )}
                </div>
              </div>

              <div className="px-4 text-sm text-center text-gray-600 dark:text-gray-400">
                {minAndMax.maxCrypto === "0.00" ? (
                  isLoading ? (
                    <Loader loaderType="text" />
                  ) : (
                    <p className="text-red-500 mt-1 text-sm">
                      {"No Ads Available. Please try a different currency or token"}
                    </p>
                  )
                ) : (
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <span>Estimated price</span>
                      <ToolTip text="This is estimated based on the available advertisements on P2P Market. Click on Select Payment Method to view actual prices.">
                        <svg
                          className="w-4 h-4 hover:text-primary"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
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
                href={SELECT_PAYMENT_METHOD_PAGE(searchParams)}
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
        ) : (
          <div className="flex container w-screen items-center justify-center h-full">
            <Loader />
          </div>
        )}
      </div>
    </Suspense>
  );
}

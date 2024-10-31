"use client";
import CediH from "@/common/abis/CediH";
import { fetchAds } from "@/common/api/fetchAds";
import storeAccountDetails from "@/common/api/storeAccountDetails";
import { FetchAdsOptions, Offer, Order, OrderState, PaymentMethod } from "@/common/api/types";
import { BOT_MERCHANT_ID } from "@/common/constants";
import { useContracts } from "@/common/contexts/ContractContext";
import { useUser } from "@/common/contexts/UserContext";
import useMarketData from "@/common/hooks/useMarketData";
import useWriteContractWithToast from "@/common/hooks/useWriteContractWithToast";
import { createOrderSchema } from "@/common/schema";
import Loader from "@/components/loader/Loader";
import ToolTip from "@/components/toolTip";
import { formatCurrency, getPaymentMethodColor, shortenAddress, ixToast as toast } from "@/lib/utils";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFeeData, useReadContract } from "wagmi";
import { getBlock } from "@wagmi/core";
import { config } from "@/common/configs";
import { ORDER } from "@/common/constants/queryKeys";
import { ArrowRight, Bolt, MoveRight, MoveRightIcon, Zap } from "lucide-react";
import Link from "next/link";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import PaymentMethodSelect from "@/components/ui/PaymentMethodSelect";
import useUserPaymentMethods from "@/common/hooks/useUserPaymentMenthods";
import Button from "@/components/ui/Button";
import useCreateOrder from "@/common/hooks/useCreateOrder";
import { HOME_PAGE, QUICK_TRADE_PAGE } from "@/common/page-links";
import FaucetAndNetwork from "@/components/faucetAndNetwork";

export default function PaymentMethodsPage() {
  const searchParams = useSearchParams();
  const { indexerUrl } = useContracts();
  const {
    currencyId,
    tokenId,
    offerType,
    fiatAmount: fm,
    cryptoAmount: cm,
    lastChanged,
  } = Object.fromEntries(searchParams.entries());

  const [selectedOffer, setSelectedOffer] = useState<Offer | undefined>(undefined);
  const { handleSubmit, isPending, handleFormDataChange, setFormData, paymentMethod, fiatAmount, cryptoAmount } =
    useCreateOrder(selectedOffer, {
      fiatAmount: fm,
      cryptoAmount: cm,
    });

  const { address } = useUser();

  const [adsType, setAdsType] = useState<"bot" | "normal">("bot");

  const { currencies, tokens, paymentMethods } = useMarketData();
  const { paymentMethods: userPaymentMethods } = useUserPaymentMethods();

  const botOptions: FetchAdsOptions = {
    currency: currencyId,
    tokenId,
    isActive: true,
    amount: cm,
    offerType,
    merchant: BOT_MERCHANT_ID,
  };

  const nonBotOptions: FetchAdsOptions = {
    ...botOptions,
    quantity: 1,
    merchant: undefined,
    orderBy: "rate",
    orderDirection: "asc",
    withoutBots: true,
  };

  const { data: botAds, isLoading: isBotAdsLoading } = useQuery({
    queryKey: ["ads", botOptions],
    queryFn: () => fetchAds(indexerUrl, botOptions),
    enabled: !!currencyId && !!tokenId && !!offerType,
  });
  const { data: nonBotads, isLoading } = useQueries({
    queries:
      paymentMethods?.map(method => ({
        queryKey: ["ads", { ...nonBotOptions, paymentMethod: method.id }],
        queryFn: () => fetchAds(indexerUrl, { ...nonBotOptions, paymentMethod: method.id }),
        enabled: paymentMethods && paymentMethods.length > 0,
      })) || [],
    combine: results => {
      return {
        data: results.flatMap(result => result.data?.offers || []),
        isPending: results.some(result => result.isPending),
        isLoading: results.some(result => result.isLoading),
      };
    },
  });

  const currency = currencies?.find(c => c.id === currencyId);
  const token = tokens?.find(t => t.id === tokenId);

  const isMerchant = address === selectedOffer?.merchant.id;

  const isBuy = offerType === "buy";

  useEffect(() => {
    if (!selectedOffer) return;
    handleFormDataChange(
      lastChanged as "cryptoAmount" | "fiatAmount",
      lastChanged === "fiatAmount" ? fiatAmount : cryptoAmount,
    );
    handleFormDataChange("paymentMethod", selectedOffer?.paymentMethod as PaymentMethod);
  }, [selectedOffer, adsType]);

  useEffect(() => {
    if (!isBotAdsLoading && !botAds?.offers.length) {
      setAdsType("normal");
    }
  }, [botAds]);

  const isBot = adsType === "bot";

  const ads = isBot ? botAds?.offers : nonBotads;

  useEffect(() => {
    if (!ads?.find(ad => ad.id === selectedOffer?.id) && ads) {
      setSelectedOffer(ads[0]);
    }
  }, [selectedOffer, ads, offerType]);

  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm mb-6">
        <Link className="hover:text-primary" href={QUICK_TRADE_PAGE}>
          Quick Trade
        </Link>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Payment Method(s)</span>
      </div>

      <h2 className="text-xl font-bold mb-4 dark:text-white">
        Buy {currency?.name} with {selectedOffer?.paymentMethod.method}
      </h2>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setAdsType("bot")}
          className={`px-4 py-2 ${
            adsType === "bot" ? "bg-gray-300 dark:bg-gray-700 " : " "
          } rounded-full border font-bold border-gray-100 dark:border-gray-700 text-sm text-darkGray dark:text-gray-300 whitespace-nowrap flex items-center gap-1`}
        >
          <Zap size={16} />
          Bot Ads
          <ToolTip text="These Ads will be fulfilled automatically by a bot with 3 minutes">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path d="M12 16v-4m0-4h.01" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </ToolTip>
        </button>
        <button
          onClick={() => setAdsType("normal")}
          className={`px-4 py-2 ${
            adsType === "normal" ? "bg-gray-300 dark:bg-gray-700 " : " "
          } rounded-full border border-gray-100 dark:border-gray-700 text-darkGray dark:text-gray-300 font-bold text-sm whitespace-nowrap`}
        >
          Normal Ads
        </button>
      </div>

      {/* Preview Order Card - Shows on Mobile */}
      {(isBot ? botAds : nonBotads.length) ? (
        <div className="flex gap-8 w-full  md:flex-row flex-col">
          {/* Payment Methods List */}
          <div className="min-w-fit">
            <div className="flex font-bold dark:text-lightGray  gap-2">
              <p className="mb-4 ">Select an option:</p>
              or{" "}
              <Link className="text-primary flex gap-1" href={HOME_PAGE}>
                Go to P2P Market <ArrowRight />
              </Link>
            </div>
            <div className="flex flex-col gap-2 max-h-screen flex-wrap">
              {ads?.map(offer => (
                <div
                  onClick={() => setSelectedOffer(offer)}
                  key={offer.id}
                  className={`p-4 min-w-80 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 cursor-pointer hover:bg-gray-50  dark:hover:bg-gray-700 ${
                    selectedOffer?.id === offer.id ? "border-primary dark:border-primary" : ""
                  }`}
                >
                  <div className="flex items-center  justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1 h-4 border ${getPaymentMethodColor(offer.paymentMethod.method)} rounded-full`}
                      ></div>
                      <span className="font-medium dark:text-white">{offer.paymentMethod.method}</span>
                    </div>
                    <span className="text-sm text-primary font-medium">Best offer</span>
                  </div>
                  <div className="text-sm flex flex-col gap-1 text-gray-600 dark:text-gray-300 mt-1 ">
                    <span>Merchant: {offer.merchant.name || shortenAddress(offer.merchant.id)}</span>
                    <span>
                      Unit Price: 1 {token?.symbol} = {offer.rate} {currency?.name}
                    </span>
                    <span>
                      limits: {formatCurrency(offer.minOrder, "") + " - " + formatCurrency(offer.maxOrder, "")}{" "}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className=" flex flex-col gap-2">
            {/* Preview Order Card */}
            <div className="bg-white min-w-fit dark:bg-gray-800 rounded-xl p-4  border dark:border-gray-700">
              <h3 className="font-medium mb-4 dark:text-white">Preview Order</h3>

              <div className="space-y-3 mb-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">You Pay</span>
                  <span className="font-medium text-lg dark:text-white">
                    {fiatAmount} {currency?.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">You Receive</span>
                  <span className="font-medium text-lg dark:text-white">
                    {cryptoAmount} {token?.symbol}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Estimated Response Time</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium dark:text-white"> ~ {isBot ? "2 mins" : "30 mins"}</span>
                    <ToolTip
                      text={
                        isBot
                          ? "The not merchant atomatically fulfills orders within 2 minutes"
                          : "This is an estimate which depends on the availability of the merchant"
                      }
                    >
                      {" "}
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path d="M12 16v-4m0-4h.01" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </ToolTip>
                  </div>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-300">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Trade with</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-medium dark:text-white">
                        {isBot
                          ? "BOT"
                          : selectedOffer?.merchant.name || shortenAddress(selectedOffer?.merchant.id || "")}
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Merchant's Terms</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-medium dark:text-white">
                        {selectedOffer?.merchant.terms || "No terms provided"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {!isBuy && (
                <PaymentMethodSelect
                  addButton={!isBuy}
                  skipStep1={selectedOffer?.paymentMethod.method}
                  addButtonText={"Add " + selectedOffer?.paymentMethod.method + " details"}
                  label=""
                  initialValue=""
                  selectedMethod={paymentMethod}
                  placeholder="Select account to receive payment"
                  name="paymentMethod"
                  options={
                    userPaymentMethods?.filter(method => method.method === selectedOffer?.paymentMethod.method) || []
                  }
                  onValueChange={value => handleFormDataChange("paymentMethod", value)}
                />
              )}
              <Button
                loading={isPending}
                onClick={handleSubmit}
                className="w-full py-4 bg-primary hover:bg-primary-foreground text-white rounded-xl mt-6 font-medium"
              >
                Place order
              </Button>
            </div>
            <FaucetAndNetwork />
          </div>
        </div>
      ) : isLoading || isBotAdsLoading ? (
        <Loader />
      ) : (
        <div className="text-gray-600 dark:text-gray-300">
          No {isBot ? "Bot" : ""} Ads Available For selected options.
          <div>
            <button onClick={() => setAdsType("normal")} className="text-primary hover:underline">
              Check Normal Ads
            </button>{" "}
            or{" "}
            <Link href="/" className="text-primary hover:underline">
              Go to P2P Market
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

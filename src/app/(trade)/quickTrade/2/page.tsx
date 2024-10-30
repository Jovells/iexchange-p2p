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
import { getPaymentMethodColor, shortenAddress, ixToast as toast } from "@/lib/utils";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFeeData, useReadContract } from "wagmi";
import { getBlock } from "@wagmi/core";
import { config } from "@/common/configs";
import { ORDER } from "@/common/constants/queryKeys";
import { Bolt, Zap } from "lucide-react";
import Link from "next/link";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import PaymentMethodSelect from "@/components/ui/PaymentMethodSelect";
import useUserPaymentMethods from "@/common/hooks/useUserPaymentMenthods";
import Button from "@/components/ui/Button";

export default function PaymentMethodsPage() {
  const { isConnected } = useUser();
  const { openConnectModal } = useConnectModal();
  const searchParams = useSearchParams();
  const navigate = useRouter();
  const { indexerUrl, p2p } = useContracts();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();
  const {
    currencyId,
    tokenId,
    offerType,
    fiatAmount: fm,
    cryptoAmount: cm,
    lastChanged,
  } = Object.fromEntries(searchParams.entries());
  const [amounts, setAmounts] = useState<{ fiatAmount: string; cryptoAmount: string }>({
    fiatAmount: fm,
    cryptoAmount: cm,
  });
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const { address } = useUser();
  const { writeContractAsync: writeToken } = useWriteContractWithToast();
  const { writeContractAsync: writeP2p, isPending } = useWriteContractWithToast();
  const queryClient = useQueryClient();
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: CediH,
    address: selectedOffer?.token.id,
    functionName: "allowance",
    args: [address!, p2p.address],
    query: {
      enabled: offerType === "sell",
    },
  });
  const [adsType, setAdsType] = useState<"bot" | "normal">("bot");
  console.log("qwwww", amounts);

  const tokensAmount = amounts.cryptoAmount ? BigInt(Math.floor(Number(amounts.cryptoAmount) * 10 ** 18)) : BigInt(0);
  const { currencies, tokens, paymentMethods } = useMarketData();
  const { paymentMethods: userPaymentMethods } = useUserPaymentMethods();

  const options: FetchAdsOptions = {
    currency: currencyId,
    tokenId,
    offerType,
    merchant: BOT_MERCHANT_ID,
  };

  const nonBotOptions: FetchAdsOptions = {
    ...options,
    quantity: 1,
    amount: cm,
    isActive: true,
    merchant: undefined,
    orderBy: "rate",
    orderDirection: "asc",
    withoutBots: true,
  };

  const { data: botAds, isLoading: isBotAdsLoading } = useQuery({
    queryKey: ["ads", options],
    queryFn: () => fetchAds(indexerUrl, options),
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
    function handleFormDateChange() {
      if (!selectedOffer) return;

      const name = lastChanged;
      const value = amounts[name as "fiatAmount" | "cryptoAmount"];
      console.log("name", name, "orderType");
      // Prevent non-numeric input for fiatAmount and cryptoAmount fields

      if (name === "fiatAmount") {
        let newCryptoAmount;

        newCryptoAmount = Number(value) / Number(selectedOffer.rate);

        setAmounts(prev => ({
          ...prev,
          fiatAmount: value as string,
          cryptoAmount: newCryptoAmount.toPrecision(4), //TODO: @Jovells GET DECIMAL PLACES FROM TOKEN/CURRENCY
        }));
      } else if (name === "cryptoAmount") {
        let newFiatAmount;

        newFiatAmount = Number(value) * Number(selectedOffer.rate);

        setAmounts(prev => ({
          ...prev,
          cryptoAmount: value as string,
          fiatAmount: Number(newFiatAmount.toPrecision(4)).toString(), //TODO: @Jovells GET DECIMAL PLACES FROM TOKEN/CURRENCY
          fiatAmountForContract: newFiatAmount.toString(),
        }));
      } else {
        setAmounts(prev => ({ ...prev, [name]: value }));
      }
    }

    handleFormDateChange();
  }, [selectedOffer, adsType]);

  const handleSubmit = async (e: React.MouseEvent) => {
    if (!isConnected) {
      toast.default("Please connect your wallet to continue");
      return openConnectModal?.();
    }
    e.preventDefault();
    if (isMerchant) {
      toast.error("You cannot trade with yourself");
      return;
    }
    if (!selectedOffer) {
      toast.error("Please select an offer");
      return;
    }
    if (!paymentMethod) return toast.default("Please select a payment method");

    // Validate the form before submission

    const depositAddress = isBuy ? selectedOffer.depositAddress.id : address;

    const accountHash = isBuy
      ? selectedOffer.accountHash
      : await storeAccountDetails({
          name: paymentMethod.name as string,
          address: address as string,
          number: paymentMethod.number as string,
          paymentMethod: paymentMethod.method,
          details: paymentMethod.details,
        });

    try {
      const alreadyApproved = allowance! >= tokensAmount || offerType === "buy";
      if (!alreadyApproved) {
        const approveHash = await writeToken(
          { waitForReceipt: true },
          {
            abi: CediH,
            address: selectedOffer.token.id,
            functionName: "approve",
            args: [p2p.address, tokensAmount],
          },
        );
        refetchAllowance();
      }
      const newOrder = {
        accountHash: accountHash as `0x${string}`,
        offer: selectedOffer,
        trader: { id: address! },
        depositAddress: { id: depositAddress! },
        orderType: selectedOffer.offerType,
        quantity: tokensAmount.toString(),
        status: OrderState.Pending,
      } satisfies Partial<Order>;

      const toastId = "createOrder";

      const writeRes = await writeP2p(
        {
          waitForReceipt: true,
          toastId,
          loadingMessage: "Creating Order",
          successMessage: "Order Created Successfully",
          onTxSent: async () => toast.loading("Order Sent. Waiting for finalisation", { id: toastId }),
          onReceipt: async ({ receipt, decodedLogs }) => {
            console.log("qwreceiptdeclogs", receipt, decodedLogs);
            const orderId = decodedLogs[0].args.orderId.toString();
            const block = await getBlock(config, { blockNumber: receipt.blockNumber });
            console.log("qwblock", block);
            const order = { id: orderId, blockTimestamp: block.timestamp.toString(), ...newOrder } as Order;
            console.log("qworder", order);
            navigate.push("/order/" + orderId);
            const q = queryClient.setQueryData(ORDER({ indexerUrl, orderId }), order);
            console.log("qkl navigated in onreceipt", q);
          },
        },
        {
          abi: p2p.abi,
          address: p2p.address,
          functionName: "createOrder",
          args: [BigInt(selectedOffer.id), tokensAmount, depositAddress, accountHash],
        },
      );
      console.log("qwwriteRes", writeRes);
    } catch (e: any) {
      toast.error("An error occurred. Please try again" + e.message);
      console.log("error", e);
    }
  };

  useEffect(() => {
    if (!isBotAdsLoading && !botAds?.offers.length) {
      setAdsType("normal");
    }
  }, [botAds]);

  const ads = adsType === "bot" ? botAds?.offers : nonBotads;

  useEffect(() => {
    if (!ads?.find(ad => ad.id === selectedOffer?.id) && ads) setSelectedOffer(ads[0]);
  }, [selectedOffer, ads, offerType]);

  const isBot = adsType === "bot";
  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900">
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm mb-6">
          <Link className="hover:text-primary" href={"/quickTrade"}>
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
              adsType === "bot" ? "bg-primary text-white " : "bg-gray-100 dark:bg-gray-800"
            } rounded-full font-bold text-sm text-darkGray dark:text-gray-300 whitespace-nowrap flex items-center gap-1`}
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
              adsType === "normal" ? "bg-primary text-white " : "bg-gray-100 dark:bg-gray-800"
            } rounded-full text-darkGray dark:text-gray-300 font-bold text-sm whitespace-nowrap`}
          >
            Normal Ads
          </button>
        </div>

        {/* Preview Order Card - Shows on Mobile */}
        {ads ? (
          <div className="flex gap-8 w-full  justify-end md:flex-row-reverse flex-col">
            {" "}
            <div className="bg-white min-w-96 dark:bg-gray-800 rounded-xl p-4 mb-6 border dark:border-gray-700">
              <h3 className="font-medium mb-4 dark:text-white">Preview Order</h3>

              <div className="space-y-3 mb-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">You Pay</span>
                  <span className="font-medium text-lg dark:text-white">
                    {amounts.fiatAmount} {currency?.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">You Receive</span>
                  <span className="font-medium text-lg dark:text-white">
                    {amounts.cryptoAmount} {token?.symbol}
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
                  onValueChange={value => setPaymentMethod(value)}
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
            {/* Payment Methods List */}
            <div className="min-w-96">
              <p className="mb-4 md:hidden dark:text-lightGray">Payment Options:</p>
              <div className="space-y-3">
                {ads.map(offer => (
                  <div
                    onClick={() => setSelectedOffer(offer)}
                    key={offer.id}
                    className={`p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 cursor-pointer hover:bg-gray-50  dark:hover:bg-gray-700 ${
                      selectedOffer?.id === offer.id ? "border-primary dark:border-primary" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1 h-4 border ${getPaymentMethodColor(offer.paymentMethod.method)} rounded-full`}
                        ></div>
                        <span className="font-medium dark:text-white">{offer.paymentMethod.method}</span>
                      </div>
                      <span className="text-sm text-primary font-medium">Best offer</span>
                    </div>
                    <div className="text-sm flex flex-col gap-1 text-gray-600 dark:text-gray-300 mt-1 ">
                      <span>
                        Unit Price: 1 {token?.symbol} = {offer.rate} {currency?.name}
                      </span>
                      <span>Merchant: {offer.merchant.name || shortenAddress(offer.merchant.id)}</span>
                    </div>
                  </div>
                ))}
              </div>
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
                go to the P2P zone
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

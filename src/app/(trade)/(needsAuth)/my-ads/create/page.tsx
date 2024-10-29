'use client'

import Tabs from '@/components/tabs'
import Button from '@/components/ui/Button'
import InputSelect from '@/components/ui/InputSelect'
import Input from '@/components/ui/input'
import React, { useState } from "react";
import { useContracts } from "@/common/contexts/ContractContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCurrencies } from "@/common/api/fetchCurrencies";
import { fetchTokens } from "@/common/api/fetchTokens";
import { offerTypes, TIME_LIMITS } from "@/common/constants";
import { useRouter } from "next/navigation";
import storeAccountDetails from "@/common/api/storeAccountDetails";
import Loader from "@/components/loader/Loader";
import { z } from "zod";
import { ixToast as toast } from "@/lib/utils";
import useWriteContractWithToast from "@/common/hooks/useWriteContractWithToast";
import { useUser } from "@/common/contexts/UserContext";
import PaymentMethodSelect from "@/components/ui/PaymentMethodSelect";
import useUserPaymentMethods from "@/common/hooks/useUserPaymentMenthods";
import { AccountDetails, FetchAdsOptions, Offer, PaymentMethod } from "@/common/api/types";
import { ADS, MY_ADS } from "@/common/constants/queryKeys";
import { MY_ADS_PAGE } from "@/common/page-links";
import MyAds from "../page";

const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const formSchema = z
  .object({
    token: z.string().startsWith("0x"),
    currency: z.string().min(1, "Currency is required"),
    minOrder: z.number().positive("Minimum order must be positive"),
    maxOrder: z.number().positive("Maximum order must be positive"),
    paymentMethod: z.string().min(1, "Payment method is required"),
    accountName: z.string().min(1, "Account name is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    timeLimit: z.number().positive("Time limit must be positive"),
    terms: z.string().optional(),
    depositAddress: z.string().refine(val => ethAddressRegex.test(val), {
      message: "Invalid Ethereum address",
    }),
    rate: z.number().positive("Rate must be positive"),
    offerType: z.enum(["buy", "sell"]),
  })
  .refine(data => data.minOrder <= data.maxOrder, {
    message: "Minimum order cannot be higher than maximum order",
    path: ["minOrder"],
  });

type FormData = z.infer<typeof formSchema>;

const CreateAd = () => {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const { p2p, indexerUrl } = useContracts();
  const router = useRouter();
  const { address } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const { writeContractAsync, receipt } = useWriteContractWithToast(4);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const queryClient = useQueryClient();

  const { paymentMethods, isLoading: isPaymentMethodsLoading } = useUserPaymentMethods();

  const { data: currencies, isLoading: isCurrenciesLoading } = useQuery({
    queryKey: ["currencies"],
    queryFn: () => fetchCurrencies(indexerUrl),
  });
  const { data: tokens, isLoading: isTokensLoading } = useQuery({
    queryKey: ["tokens"],
    queryFn: () => fetchTokens(indexerUrl),
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | undefined>();
  const id = "create-ad";
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    toast.loading("Creating Ad...", { id });
    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        token: formData.get("token") as `0x${string}`,
        currency: formData.get("currency") as string,
        minOrder: Number(formData.get("minOrder") as string) * Number(10 ** 18),
        maxOrder: Number(formData.get("maxOrder") as string) * Number(10 ** 18),
        paymentMethod: selectedPaymentMethod?.method,
        accountName: selectedPaymentMethod?.name,
        accountNumber: selectedPaymentMethod?.number,
        details: selectedPaymentMethod?.details,
        timeLimit: Number(formData.get("timeLimit")),
        terms: formData.get("terms") as string,
        depositAddress: formData.get("depositAddress") as `0x${string}`,
        rate: Number(formData.get("rate") as string),
        offerType: activeTab,
      };

      try {
        formSchema.parse(data);
      } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
          const fieldErrors: Partial<Record<keyof FormData, string>> = {};
          error.errors.forEach(err => {
            if (err.path) {
              fieldErrors[err.path[0] as keyof FormData] = err.message;
            }
          });
          setErrors(fieldErrors);
          setSubmitting(false);
          toast.error("Please correct the errors in the form", { id });
          return;
        }
      }

      const {
        token,
        currency,
        minOrder,
        maxOrder,
        paymentMethod,
        accountName,
        details,
        accountNumber,
        timeLimit,
        terms,
        depositAddress,
        rate,
        offerType,
      } = data;
      console.log("create-data", data);
      const accountDetails: AccountDetails = {
        name: accountName!,
        number: accountNumber!,
        details: details,
        terms: terms,
        address: address?.toLowerCase() as string,
      };

      const handleContractWrite = async () => {
        try {
          const accountHash = await storeAccountDetails(accountDetails);
          const args = [
            token,
            currency,
            paymentMethod,
            rate,
            minOrder,
            maxOrder,
            accountHash,
            depositAddress,
            //swap is necessary
            activeTab === "buy" ? offerTypes.sell : offerTypes.buy,
          ];
          console.log("args", args, activeTab);

          const { txHash, decodedLogs, receipt } = await writeContractAsync(
            {
              loadingMessage: "Creating Ad...",
              successMessage: "Ad created successfully",
              waitForReceipt: true,
              toastId: id,
              //TODO @Jovells: REPLACE WITH PROPER OPTIMISTIC UPDATE
              timeTimeToWait: 5000,
            },
            {
              address: p2p.address,
              functionName: "createOffer",
              abi: p2p.abi,
              args: [
                token,
                currency,
                paymentMethod,
                rate,
                minOrder,
                maxOrder,
                accountHash,
                depositAddress,
                offerTypes[activeTab],
              ],
            },
          );
          console.log("qs Transaction successful:", txHash, receipt, decodedLogs);
          //replace with proper optimistic update
          // Redirect or handle success
          console.log("//////////////////////////////////////");
          const newOffer: Offer = {
            id: decodedLogs?.[0].args.offerId.toString(),
            token: tokens?.find(t => t.id === token)!,
            currency: currencies?.find(c => c.currency === currency)!,
            paymentMethod: paymentMethods?.find(p => p.method === paymentMethod)!,
            rate: rate.toString(),
            minOrder: minOrder.toString(),
            maxOrder: maxOrder.toString(),
            active: true,
            merchant: {
              id: accountHash,
              name: accountName,
              terms: terms,
              timeLimit: timeLimit,
            },
            depositAddress: {
              id: depositAddress,
            },
            offerType: offerTypes[offerType],
            accountHash: accountHash,
          };
          const options: FetchAdsOptions = {
            page: 0,
            quantity: 10,
            merchant: address,
          };

          await queryClient.setQueryData(
            MY_ADS({ indexerUrl, options }),
            (oldData: { hasNext: boolean; offers: Offer[] } | undefined) => ({
              ...oldData,
              offers: [newOffer, ...(oldData?.offers || [])],
            }),
          );

          router.push(MY_ADS_PAGE + "?optimitic=true");
          setSubmitting(false);
          toast.success("Ad created successfully", { id });
        } catch (error: any) {
          console.error("Transaction failed:", error);
          toast.error(error.message, { id });
          setSubmitting(false);
        }
      };

      await handleContractWrite();
    } catch (error) {
      console.log("Error creating ad:", error);
      toast.error("Failed to create ad. Please try again.", { id });
    }
  };

  if (
    !(currencies && tokens && paymentMethods) &&
    (isCurrenciesLoading || isPaymentMethodsLoading || isTokensLoading)
  ) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-0 py-4 bg-white dark:bg-[#14161B]">
      <div className="my-4 flex flex-col gap-4">
        <Tabs onTabChange={setActiveTab as any} />
        <div className="flex flex-col gap-2">
          <h1 className="text-black dark:text-white">Create Advert</h1>
          <p className="text-gray-400">Please fill in the information to proceed to post an Ad.</p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="shadow-lg border border-gray-200 dark:border-gray-800 p-6 py-10 bg-white dark:bg-gray-800 rounded-xl flex flex-col gap-10"
      >
        <div className="flex flex-col gap-8">
          <h1 className="text-[#01a2e4] font-bold">Type and Price</h1>
          <div className="flex flex-col w-full gap-6 sm:flex-row">
            <div className="flex flex-col w-full sm:w-1/3">
              <InputSelect
                name="token"
                options={
                  tokens?.map(token => ({
                    label: token.name,
                    value: token.id,
                  })) || []
                }
                label="Asset"
              />
              {errors.token && <span className="text-red-500 text-sm mt-1">{errors.token}</span>}
            </div>

            <div className="flex flex-col w-full sm:w-1/3">
              <InputSelect
                name="currency"
                options={
                  currencies?.map(currency => ({
                    label: currency.currency,
                    value: currency.currency,
                  })) || []
                }
                label="Fiat"
              />
              {errors.currency && <span className="text-red-500 text-sm mt-1">{errors.currency}</span>}
            </div>

            <div className="flex flex-col w-full sm:w-1/3">
              <Input name="rate" label="Rate" />
              {errors.rate && <span className="text-red-500 text-sm mt-1">{errors.rate}</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <h1 className="text-[#01a2e4] font-bold">Amount and Method</h1>
          <div className="flex flex-col gap-3">
            <span className="text-gray-700 dark:text-white font-light">Order Limit</span>
            <div className="flex flex-row items-start gap-6">
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex flex-col">
                  <Input name="minOrder" label="Minimum" />
                  {errors.minOrder && <span className="text-red-500 text-sm">{errors.minOrder}</span>}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex flex-col">
                  <Input name="maxOrder" label="Maximum" />
                  {errors.maxOrder && <span className="text-red-500 text-sm">{errors.maxOrder}</span>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-gray-700 dark:text-white font-light">Payment Methods</span>
            <PaymentMethodSelect
              addButton
              label=""
              initialValue=""
              selectedMethod={selectedPaymentMethod}
              placeholder="Select Payment Method"
              name="paymentMethod"
              options={paymentMethods || []}
              onValueChange={value => setSelectedPaymentMethod(value)}
            />
            <span className="text-gray-700 dark:text-white font-light">Time Limit</span>

            <div className="flex flex-col">
              <InputSelect
                name="timeLimit"
                options={
                  TIME_LIMITS.map(timeLimit => ({
                    label: timeLimit.label,
                    value: timeLimit.value,
                  })) || []
                }
                label="Time Limit"
              />
              {errors.timeLimit && <span className="text-red-500 text-sm">{errors.timeLimit}</span>}
            </div>
            <span className="text-gray-700 dark:text-white font-light">Deposit Address</span>
            <div className="flex flex-col">
              <Input defaultValue={address} name="depositAddress" label="Deposit Address" />
              {errors.depositAddress && <span className="text-red-500 text-sm">{errors.depositAddress}</span>}
            </div>
            <div className="flex flex-col gap-4 my-4">
              <span className="text-sm text-gray-500 dark:text-white">Terms (Optional)</span>
              <textarea
                name="terms"
                rows={10}
                className="resize-none w-full  p-5 border border-gray-300 dark:border-gray-600 rounded-[8px] bg-transparent text-gray-800 dark:text-white"
              />
              {errors.terms && <span className="text-red-500 text-sm">{errors.terms}</span>}
            </div>
          </div>
          <div className="flex flex-row justify-end gap-6">
            <Button
              type="button"
              text="Cancel"
              iconPosition="right"
              className="bg-transparent border border-gray-300 text-black dark:text-white rounded-xl px-4 py-2 w-fit"
              onClick={() => {
                router.back();
              }}
            />
            <Button
              loading={submitting}
              text="Create Ad"
              // icon="/images/icons/add-circle.png"
              iconPosition="right"
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-600 rounded-xl px-4 py-2 w-fit"
              type="submit"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateAd
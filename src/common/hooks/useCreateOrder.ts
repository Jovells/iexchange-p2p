import { fetchBlock } from "./../../lib/utils";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ixToast as toast } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Offer, OfferType, Order, OrderState, PaymentMethod } from "../api/types";
import { createOrderSchema } from "../schema";
import storeAccountDetails from "../api/storeAccountDetails";
import useWriteContractWithToast from "./useWriteContractWithToast";
import { z } from "zod";
import { ORDER } from "../constants/queryKeys";
import { useUser } from "../contexts/UserContext";
import CediH from "../abis/CediH";
import { useContracts } from "../contexts/ContractContext";
import { useBalance, useReadContract } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const useCreateOrder = (
  offer: Offer | undefined,
  initialFormData?: { fiatAmount?: string; cryptoAmount?: string; paymentMethod?: PaymentMethod | null },
) => {
  const { isConnected, openAuthModal } = useUser();
  const { indexerUrl } = useContracts();
  const isBuy = offer?.offerType === OfferType.buy;
  const [{ fiatAmount, cryptoAmount, paymentMethod }, setFormData] = useState({
    fiatAmount: initialFormData?.fiatAmount || "",
    cryptoAmount: initialFormData?.cryptoAmount || "",
    paymentMethod: isBuy
      ? initialFormData?.paymentMethod
      : initialFormData?.paymentMethod?.number
      ? initialFormData.paymentMethod
      : null,
  });
  console.log("qzz, initialpaymentMethod", paymentMethod);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const newOrder = useRef<Partial<Order>>({});
  const navigate = useRouter();
  const queryClient = useQueryClient();
  const { address: userAddress } = useUser();
  const { p2p, tokens } = useContracts();
  const {
    writeContractAsync: writeToken,
    data: approveHash,
    isSuccess: isApproveSuccess,
    isPending: isApprovePending,
  } = useWriteContractWithToast();
  const { writeContractAsync: writeP2p, data: p2phash, receipt, isSuccess, isPending } = useWriteContractWithToast();

  const { data: nativeBalance } = useBalance();

  const isMerchant = userAddress === offer?.merchant.id;

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: CediH,
    address: offer?.token.id,
    functionName: "allowance",
    args: [userAddress!, p2p.address],
    query: {
      enabled: !isBuy && userAddress !== undefined && !!offer,
    },
  });

  function handleFormDataChange(name: "cryptoAmount" | "fiatAmount" | "paymentMethod", value: string | PaymentMethod) {
    if (!offer) return toast.error("Please select an offer");

    // Prevent non-numeric input for fiatAmount and cryptoAmount fields
    if ((name === "fiatAmount" || name === "cryptoAmount") && !/^\d*\.?\d*$/.test(value as string)) {
      return;
    }

    if (name === "fiatAmount") {
      let newCryptoAmount;

      newCryptoAmount = Number(value) / Number(offer.rate);

      setFormData(prev => ({
        ...prev,
        fiatAmount: value as string,
        cryptoAmount: Number(newCryptoAmount.toPrecision(4)).toString(), //TODO: @Jovells GET DECIMAL PLACES FROM TOKEN/CURRENCY
        cryptoAmountForContract: newCryptoAmount.toString(),
      }));
    } else if (name === "cryptoAmount") {
      let newFiatAmount;

      newFiatAmount = Number(value) * Number(offer.rate);

      setFormData(prev => ({
        ...prev,
        cryptoAmount: value as string,
        fiatAmount: Number(newFiatAmount.toPrecision(4)).toString(), //TODO: @Jovells GET DECIMAL PLACES FROM TOKEN/CURRENCY
        fiatAmountForContract: newFiatAmount.toString(),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value as PaymentMethod }));
    }
  }

  const tokensAmount = cryptoAmount ? BigInt(Math.floor(Number(cryptoAmount) * 10 ** 18)) : BigInt(0);

  const alreadyApproved = allowance! >= tokensAmount || isBuy;

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    if (!isConnected) return openAuthModal?.();
    e.preventDefault();
    if (!offer) return toast.error("Please select an offer");

    const isMerchant = offer.merchant.id === userAddress;

    if (isMerchant) {
      toast.error("You cannot trade with yourself");
      return;
    }

    // Validate the form before submission
    const formData = { fiatAmount: fiatAmount, cryptoAmount: cryptoAmount, paymentMethod: paymentMethod };

    const result = createOrderSchema(offer).safeParse(formData);
    if (!result.success) {
      setErrors(result.error.issues);
      console.log("qz errors", result.error.issues, "fdara", formData);
      if (!paymentMethod) return toast.error("please Select a payment method");
      if (!isBuy && (!paymentMethod.name || paymentMethod.number))
        return toast.error("please an account for receiving payment");
      else toast.error(result.error.issues.map(issue => issue.path + " " + issue.message).join(", "));
      return;
    } else {
      setErrors([]);
    }

    const depositAddress = isBuy ? offer?.depositAddress.id : userAddress;

    const accountHash = isBuy
      ? offer.accountHash
      : await storeAccountDetails({
          name: paymentMethod?.name as string,
          address: userAddress as string,
          number: paymentMethod?.number as string,
          paymentMethod: paymentMethod?.method,
          details: paymentMethod?.details,
        });
    const toastId = "createOrder";

    try {
      if (!alreadyApproved) {
        const approveHash = await writeToken(
          { waitForReceipt: true },
          {
            abi: tokens[0].abi,
            address: offer.token.id,
            functionName: "approve",
            args: [p2p.address, tokensAmount],
          },
        );
        refetchAllowance();
      }
      newOrder.current = {
        accountHash: accountHash as `0x${string}`,
        offer,
        trader: { id: userAddress as `0x${string}` },
        depositAddress: { id: depositAddress! },
        orderType: offer.offerType,
        quantity: tokensAmount.toString(),
        status: OrderState.Pending,
      } satisfies Partial<Order>;

      const writeRes = await writeP2p(
        {
          waitForReceipt: true,
          toastId,
          loadingMessage: "Creating Order",
          successMessage: "Order Created Successfully",
          onReceipt: async ({ receipt, decodedLogs }) => {
            console.log("qwreceiptdeclogs", receipt, decodedLogs);
            const orderId = decodedLogs.find(log => log.args.orderId !== undefined)?.args.orderId.toString();
            const block = await fetchBlock(receipt.blockNumber);
            console.log("qwblock", block);
            const order = { id: orderId, blockTimestamp: block.timestamp.toString(), ...newOrder.current } as Order;
            console.log("qworder", order);
            navigate.push("/order/" + orderId);
            queryClient.setQueryData(ORDER({ indexerUrl, orderId }), order);
          },
        },
        {
          abi: p2p.abi,
          address: p2p.address,
          functionName: "createOrder",
          args: [BigInt(offer.id), tokensAmount, depositAddress, accountHash],
        },
      );
      console.log("qwwriteRes", writeRes);
    } catch (e: any) {
      toast.error("An error occurred. Please try again " + e.message, { id: toastId });
      console.log("error", e);
    }
  };

  return {
    handleSubmit,
    errors,
    isPending,
    isSuccess,
    isMerchant,
    isBuy,
    allowance,
    nativeBalance,
    setFormData,
    p2phash,
    receipt,
    approveHash,
    isApprovePending,
    isApproveSuccess,
    fiatAmount,
    cryptoAmount,
    paymentMethod,
    handleFormDataChange,
    alreadyApproved,
  };
};

export default useCreateOrder;

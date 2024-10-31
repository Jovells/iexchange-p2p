import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ixToast as toast } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Offer, OfferType, Order, OrderState, PaymentMethod } from "../api/types";
import { createOrderSchema } from "../schema";
import storeAccountDetails from "../api/storeAccountDetails";
import useWriteContractWithToast from "./useWriteContractWithToast";
import { z } from "zod";
import { getBlock } from "@wagmi/core";
import { ORDER } from "../constants/queryKeys";
import { useUser } from "../contexts/UserContext";
import CediH from "../abis/CediH";
import { useContracts } from "../contexts/ContractContext";
import { useBalance, useReadContract } from "wagmi";
import { config } from "../configs";

const useCreateOrder = (
  offer: Offer | undefined,
  initialFormData?: { fiatAmount?: string; cryptoAmount?: string; paymentMethod?: PaymentMethod },
) => {
  const { indexerUrl } = useContracts();
  const [{ fiatAmount, cryptoAmount, paymentMethod }, setFormData] = useState({
    fiatAmount: initialFormData?.fiatAmount || "",
    cryptoAmount: initialFormData?.cryptoAmount || "",
    paymentMethod: initialFormData?.paymentMethod || offer?.paymentMethod,
  });
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

  const isBuy = offer?.offerType === OfferType.buy;

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
    if (!offer) return toast.error("please Select an offer");

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
      let newToPay;

      newToPay = Number(value) * Number(offer.rate);

      setFormData(prev => ({
        ...prev,
        cryptoAmount: value as string,
        fiatAmount: Number(newToPay.toPrecision(4)).toString(), //TODO: @Jovells GET DECIMAL PLACES FROM TOKEN/CURRENCY
        fiatAmountForContract: newToPay.toString(),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value as PaymentMethod }));
    }
  }

  const tokensAmount = cryptoAmount ? BigInt(Math.floor(Number(cryptoAmount) * 10 ** 18)) : BigInt(0);

  const alreadyApproved = allowance! >= tokensAmount || isBuy;

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    if (!offer) return toast.error("please Select an offer");
    const isMerchant = offer.merchant.id === userAddress;

    e.preventDefault();
    if (isMerchant) {
      toast.error("You cannot trade with yourself");
      return;
    }

    // Validate the form before submission
    const formData = { fiatAmount: fiatAmount, cryptoAmount: cryptoAmount, paymentMethod: paymentMethod?.method };
    const result = createOrderSchema(offer).safeParse(formData);
    if (!result.success) {
      setErrors(result.error.issues);
      console.log("qz errors", result.error.issues, "fdara", formData);
      toast.error(result.error.issues.map(issue => issue.path + " " + issue.message).join(", "));
      return;
    } else {
      setErrors([]);
    }

    const depositAddress = isBuy ? offer?.depositAddress.id : userAddress;

    const accountHash = isBuy
      ? offer.accountHash
      : await storeAccountDetails({
          name: offer.paymentMethod.name as string,
          address: userAddress as string,
          number: offer.paymentMethod.number as string,
          paymentMethod: offer.paymentMethod.method,
          details: offer.paymentMethod.details,
        });

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
      toast.error("An error occurred. Please try again" + e.message);
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

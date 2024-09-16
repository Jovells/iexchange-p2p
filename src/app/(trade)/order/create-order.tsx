'use client'
import React, { FC, Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import InputWithSelect from "@/components/ui/InputWithSelect";
import InputSelect from "@/components/ui/InputSelect";
import Button from "@/components/ui/Button";
import MerchantProfile from "@/components/merchant/MerchantProfile";
import { useRouter } from "next/navigation";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { decodeEventLog } from "viem";
import { useContracts } from "@/common/contexts/ContractContext";
import CediH from "@/common/abis/CediH";
import { Offer, } from "@/common/api/types";
import toast from "react-hot-toast";
import { waitForTransactionReceipt } from "viem/actions";
import { z } from "zod";
import useWriteContractWithToast from "@/common/hooks/useWriteContractWithToast";

const formSchema = z.object({
  toPay: z.string().min(1, "Please enter a valid amount").refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Must be a valid positive number"
  }),
  toReceive: z.string().min(1, "Please enter a valid amount").refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Must be a valid positive number"
  }),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

interface Props {
  data: Offer;
  toggleExpand: () => void;
  orderType: string;
}

const CreateOrder: FC<Props> = ({ data, toggleExpand, orderType }) => {
  const [{ toPay, toReceive, paymentMethod }, setFormData] = useState({
    toPay: "",
    toReceive: "",
    paymentMethod: "",
  });
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const {p2p, tokens, currentChain} = useContracts();
  const token = tokens.find((token) => token.address.toLowerCase() === data.token.id.toLowerCase());
  const account = useAccount();
  const prevOrderType = useRef(orderType);
  const searchParams = useSearchParams();
  const navigate = useRouter();

  const trade = searchParams.get("trade") || "Buy";
  const crypto = searchParams.get("crypto") || "USDT";

  const { writeContractAsync: writeToken, data: approveHash, isSuccess: isApproveSuccess, isPending: isP2pWritePending } = useWriteContractWithToast();
  const { writeContractAsync: writeP2p, data: p2phash, isPending : isApprovePending  } = useWriteContractWithToast();
  const {
    data: receipt, isSuccess, 
    isLoading: isP2pPending,
  } = useWaitForTransactionReceipt({
    hash: p2phash, 
  });

  const { data: allowance } = useReadContract({
    abi: CediH,
    address: data.token.id,
    functionName: "allowance",
    args: [account.address!, p2p.address],
  });

  function handleFormDateChange(name: string, value: string) {
    // Prevent non-numeric input for toPay and toReceive fields
    if ((name === "toPay" || name === "toReceive") && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    if (name === "toPay") {
      const newToReceive = Number(value) * Number(data.rate);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        toReceive: newToReceive.toFixed(8),  // Limit to 8 decimal places
      }));
    } else if (name === "toReceive") {
      const newToPay = Number(value) / Number(data.rate);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        toPay: newToPay.toFixed(8),  // Limit to 8 decimal places
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  useEffect(() => {
    if (prevOrderType.current !== orderType) {
      toggleExpand();
      prevOrderType.current = orderType;
    }
  }, [orderType, toggleExpand]);

  const valueToPay = toPay ? BigInt(Math.floor(Number(toPay) * 10 ** 18)) : BigInt(0);
  const alreadyApproved = (allowance! >= valueToPay)  || (orderType === "buy");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('orderType', orderType)

    e.preventDefault();

    // Validate the form before submission
    const formData = { toPay, toReceive, paymentMethod };
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.issues);
      toast.error("Please correct the form errors");
      return;
    } else {
      setErrors([]);
    }

    try {
      if (!alreadyApproved) {
        const approveHash = await writeToken({},{
          abi: tokens[0].abi,
          address: data.token.id,
          functionName: "approve",
          args: [p2p.address, valueToPay],
        });
      } else {
        const createHash = await writeP2p({
        },{
          abi: p2p.abi,
          address: p2p.address,
          functionName: "createOrder",
          args: [
            BigInt(data.id),
            valueToPay,
            data.depositAddress.id,
            data.accountHash,
          ],
        });
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const id = "create-order";
  isSuccess && toast.success("Order Created", { id });

  if (isSuccess && p2phash) {
    let orderId;
    receipt.logs.some((log) => {
      try {
        const decoded = decodeEventLog({
          abi: p2p.abi,
          data: log.data,
          topics: log.topics,
          eventName: "NewOrder",
        });
        const args = decoded?.args as unknown as { orderId: string };
        orderId = args.orderId;
        return true;
      } catch (e) {
        return false;
      }
    });

    navigate.push("/order/" + orderId);
  }

  const isBuy = orderType.toLowerCase() === "buy"


  return (
    <Suspense>
      <form
        onSubmit={handleSubmit}
        className="w-full border-0 lg:border rounded-xl p-0 lg:p-6 min-h-[400px] flex flex-col flex-col-reverse lg:grid lg:grid-cols-2 bg-white lg:bg-gray-200">
        <div className="bg-transparent rounded-xl p-0 pt-6">
          <MerchantProfile offer={data} />
        </div>
        <div className="bg-white rounded-xl p-0 lg:p-6 space-y-3 pt-6">
          <InputWithSelect
            placeholder={ isBuy ? "You Pay" : "You Receive"}
            initialCurrency={data.currency.currency}
            name="toPay"
            currencies={[{symbol: data.currency.currency, id: data.currency.id, name: data.currency.currency}]}
            value={toPay}
            onValueChange={(value) => handleFormDateChange("toPay", value.amount)}
            readOnly={false}
            selectIsReadOnly={true}
          />
          {errors.find(e => e.path[0] === "toPay") && (
            <p className="text-red-500">{errors.find(e => e.path[0] === "toPay")?.message}</p>
          )}
          <InputWithSelect
            placeholder={isBuy ? "You Receive" : "You Pay"}
            initialCurrency={data.token.symbol}
            name="toReceive"
            value={toReceive}
            currencies={[{symbol: data.token.symbol, id: data.token.id, name: data.token.name}]}
            onValueChange={(value) => handleFormDateChange("toReceive", value.amount)}
            readOnly={false}
            selectIsReadOnly={true}
          />
          {errors.find(e => e.path[0] === "toReceive") && (
            <p className="text-red-500">{errors.find(e => e.path[0] === "toReceive")?.message}</p>
          )}
          <InputSelect
            label=""
            initialValue=""
            value={paymentMethod}
            placeholder="Select Payment Method"
            name="paymentMethod"
            options={[{value: data.paymentMethod.method, label: data.paymentMethod.method}]}
            onValueChange={(value) => handleFormDateChange("paymentMethod", value)}
          />
          {errors.find(e => e.path[0] === "paymentMethod") && (
            <p className="text-red-500">{errors.find(e => e.path[0] === "paymentMethod")?.message}</p>
          )}
          <div className="grid grid-cols-2 gap-8 pt-4">
            <Button
              text="Cancel"
              className="bg-[#EAEBEC] text-black rounded-xl px-4 py-2"
              onClick={toggleExpand}
            />
            <Button
              loading={isP2pWritePending || isApprovePending || isP2pPending}
              type="submit"
              text={alreadyApproved? `${trade} ${crypto}` : "Approve " + data.token.symbol}
              className={`${isBuy ? "bg-[#2D947A]" : "bg-[#f14e4e]"} text-white rounded-xl px-4 py-2`}
            />
          </div>
        </div>
      </form>
    </Suspense>
  );
};

export default CreateOrder;
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



interface Props {
  data: Offer; // Consider replacing 'any' with a specific type
  toggleExpand: () => void;
  orderType: string;
}

const CreateOrder: FC<Props> = ({ data, toggleExpand, orderType }) => {
  const [{ toPay, toReceive, paymentMethod }, setFormData] = useState({
    toPay: "",
    toReceive: "",
    paymentMethod: "",
  });
  const {p2p, tokens, currentChain} = useContracts();
  const token = tokens.find((token) => token.address.toLowerCase() === data.token.id.toLowerCase());
  const account = useAccount();
  const prevOrderType = useRef(orderType);
  const searchParams = useSearchParams();
  const navigate = useRouter();

  const trade = searchParams.get("trade") || "Buy";
  const crypto = searchParams.get("crypto") || "USDT";

  const { writeContractAsync: writeToken, data: approveHash, isSuccess: isApproveSuccess, isPending: isP2pWritePending } = useWriteContract();
  const { writeContractAsync: writeP2p, data: p2phash, isPending : isApprovePending  } = useWriteContract();
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
  console.log("allowance", allowance);

  function handleFormDateChange(name: string, value: string) {
    console.log("name", name, "value", value, "data", data);
    if (name === "toPay") {
      const newToReceive = Number(value) * Number(data.rate);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        toReceive: newToReceive.toString(),
      }));
    } else if (name === "toReceive") {
      const newToPay = Number(value) / Number(data.rate);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        toPay: newToPay.toString(),
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

  const valueToPay = BigInt(toPay) * BigInt(10 ** 18);
  const alreadyApproved = (allowance! >= valueToPay)  || (orderType === "sell");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = toast.loading("Processing Order...");

    console.log("submitting form", { toPay, toReceive, paymentMethod, data });

    try {
      
    if (!alreadyApproved) {
      toast.loading("Approving Token...", { id });
      const approveHash = await writeToken({
      abi: tokens[0].abi,
      address: data.token.id,
      functionName: "approve",
      args: [p2p.address, valueToPay],
      });
      console.log("approveHash", approveHash);
      
    }else{
      console.log("Already Approved", alreadyApproved);
      toast.loading("Creating Order...", { id });
      const createHash =   await writeP2p({
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
      console.log("createHash", createHash);

      toast.success("Order Created", { id });
    }


  }
  catch (e) {
    console.log("error", e);
    toast.error("Error Creating Order", { id });
  }
  };
  const id = "create-order";
  console.log("p2phasher", p2phash, "isP2pPending", isP2pPending);
  isP2pPending && toast.loading("Processing Order...", { id });
  isSuccess && toast.success("Order Created", { id });


  if (isSuccess && p2phash) {
    console.log("success", p2phash);
    let orderId;
    receipt.logs.some((log) => {
      try {
        const decoded = decodeEventLog({
          abi: p2p.abi,
          data: log.data,
          topics: log.topics,
          eventName: "NewOrder",
        });
        console.log("decoded", decoded);
        const args = decoded?.args as unknown as { orderId: string };
        orderId = args.orderId;
        return true;
      } catch (e) {
        return false;
      }
    });

    console.log("order created", { receipt, orderId });
    navigate.push("/order/" + orderId);
  }

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
          placeholder={orderType.toLowerCase() === "buy" ? "You Pay" : "You Sell"}
          initialCurrency={data.currency.currency}
          name="toPay"
          currencies={[{symbol: data.currency.currency, id: data.currency.id, name: data.currency.currency}]}
          value={toPay}
          onValueChange={(value) => handleFormDateChange("toPay", value.amount)}
          readOnly={false}
          selectIsReadOnly={true}
        />
        <InputWithSelect
          placeholder="You Receive"
          initialCurrency={data.token.symbol}
          name="toReceive"
          value={toReceive}
          currencies={[{symbol: data.token.symbol, id: data.token.id, name: data.token.name}]}
          onValueChange={(value) =>
            handleFormDateChange("toReceive", value.amount)
          }
          readOnly={false}
          selectIsReadOnly={true}
        />
        <InputSelect
          label=""
          initialValue=""
          value={paymentMethod}
          placeholder="Select Payment Method"
          name="paymentMethod"
          options={[{value: data.paymentMethod.method, label: data.paymentMethod.method}]}
          onValueChange={(value) =>
            handleFormDateChange("paymentMethod", value)
          }
        />
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
            className="bg-[#2D947A] text-white rounded-xl px-4 py-2"
          />
        </div>
      </div>
    </form>
    </Suspense>
  );
};

export default CreateOrder;

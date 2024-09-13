'use client'
import React, { FC, Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import InputWithSelect from "@/components/ui/InputWithSelect";
import InputSelect from "@/components/ui/InputSelect";
import Button from "@/components/ui/Button";
import MerchantProfile from "@/components/merchant/MerchantProfile";
import { DollarSign, Euro } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { decodeEventLog } from "viem";
import { useContracts } from "@/common/contexts/ContractContext";
import CediH from "@/common/abis/CediH";
import { waitForTransactionReceipt } from "viem/actions";
import { waitForTransactionReceiptQueryKey } from "wagmi/query";

const currencies = [
  {
    symbol: "GHS",
    name: "Ghanaian Cedi",
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    symbol: "USD",
    name: "US Dollar",
    icon: <DollarSign className="w-4 h-4" />,
  },
  { symbol: "EUR", name: "Euro", icon: <Euro className="w-4 h-4" /> },
  {
    symbol: "GBP",
    name: "British Pound",
    icon: <DollarSign className="w-4 h-4" />,
  },
];

const paymentMethods = [
  { value: "MOMO", label: "MTN Mobile Money" },
  { value: "access bank", label: "Access Bank" },
  { value: "Telecel cash", label: "Telecel Cash" },
];

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
  const {p2p, tokens, indexerUrl} = useContracts();
  const token = tokens.find((token) => token.address.toLowerCase() === data.token.id.toLowerCase());
  const account = useAccount();
  const prevOrderType = useRef(orderType);
  const searchParams = useSearchParams();
  const navigate = useRouter();

  const trade = searchParams.get("trade") || "Buy";
  const crypto = searchParams.get("crypto") || "USDT";

  const { writeContractAsync, data: hash } = useWriteContract();
  const {
    data: receipt,
    isLoading,
    isSuccess,
  } = useWaitForTransactionReceipt({
    hash,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitting form", { toPay, toReceive, paymentMethod, data });

    const valueToPay = BigInt(toPay) * BigInt(10 ** 18);

    const alreadyApproved = allowance! >= valueToPay;
    if (alreadyApproved) {
      const approveHash = await writeContractAsync({
      abi: tokens[0].abi,
      address: data.token.id,
      functionName: "approve",
      args: [p2p.address, valueToPay],
      });
      console.log("approveHash", approveHash);
      
    }else{
      console.log("Already Approved");
    }

    console.log("isSuccess", isSuccess);

    const hash = (alreadyApproved || isSuccess) && await writeContractAsync({
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
    console.log("p2phash", hash);
  };

  if (isSuccess) {
    console.log("success", hash);
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
        <MerchantProfile />
      </div>
      <div className="bg-white rounded-xl p-0 lg:p-6 space-y-3 pt-6">
        <InputWithSelect
          label={orderType.toLowerCase() === "buy" ? "You Pay" : "You Sell"}
          initialCurrency="USD"
          name="toPay"
          currencies={currencies}
          value={toPay}
          onValueChange={(value) => handleFormDateChange("toPay", value.amount)}
          readOnly={false}
          placeholder="Enter amount"
          selectIsReadOnly={true}
        />
        <InputWithSelect
          label="You Receive"
          initialCurrency="USD"
          name="toReceive"
          value={toReceive}
          currencies={currencies}
          onValueChange={(value) =>
            handleFormDateChange("toReceive", value.amount)
          }
          readOnly={false}
          placeholder="Enter amount"
          selectIsReadOnly={true}
        />
        <InputSelect
          label=""
          initialValue=""
          value={paymentMethod}
          placeholder="Select Payment Method"
          name="paymentMethod"
          options={paymentMethods}
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
            type="submit"
            text={`${trade} ${crypto}`}
            className="bg-[#2D947A] text-white rounded-xl px-4 py-2"
          />
        </div>
      </div>
    </form>
    </Suspense>
  );
};

export default CreateOrder;

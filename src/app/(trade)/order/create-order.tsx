import React, { FC, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import InputWithSelect from "@/components/ui/InputWithSelect";
import InputSelect from "@/components/ui/InputSelect";
import Button from "@/components/ui/Button";
import MerchantProfile from "@/components/merchant/MerchantProfile";
import { DollarSign, Euro } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import p2pAbi from "@/common/abis/OptimisticP2P.json";
import cedihAbi from "@/common/abis/CediH.json";
import {
  CEDIH_ABI,
  MORPH_CEDIH_ADDRESS,
  MORPH_P2P_ADDRESS,
} from "@/common/contracts";
import { decodeEventLog } from "viem";
import OptimisticP2P from "@/common/abis/OptimisticP2P";
import CediH from "@/common/abis/CediH";

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

    const approveHash = await writeContractAsync({
      abi: CediH,
      address: data.token.id,
      functionName: "approve",
      args: [MORPH_CEDIH_ADDRESS, valueToPay],
    });
    console.log("approveHash", approveHash);

    const hash = await writeContractAsync({
      abi: OptimisticP2P,
      address: MORPH_P2P_ADDRESS,
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
          abi: p2pAbi.abi,
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
  );
};

export default CreateOrder;

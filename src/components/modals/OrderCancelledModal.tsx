import { useModal } from "@/common/contexts/ModalContext";
import { X } from "lucide-react";
import React from "react";
import Button from "../ui/Button";
import Image from "next/image";
import { shortenAddress } from "@/lib/utils";
import { useContracts } from "@/common/contexts/ContractContext";

const OrderCancellationModal = ({ txHash }: { txHash: string }) => {
  const { hideModal } = useModal();
  const { currentChain } = useContracts();

  return (
    <div className="w-[400px] bg-white dark:bg-gray-800 p-14 rounded-[8px] flex flex-col justify-center items-center">
      <Image src="/images/icons/alert-info.svg" alt="info" className="w-auto h-auto mb-8" width={84} height={84} />
      <h2 className="font-[500px] text-center text-[16px] mb-6 dark:text-white">Order Cancelled</h2>
      <p className="text-center text-gray-500 dark:text-gray-400 text-[14px] font-[400px] mb-6">
        The other party has cancelled the order.
      </p>
      <div className="text-gray-500 dark:text-gray-400">TxHash :</div>{" "}
      <a
        href={`${currentChain?.blockExplorers?.default.url}/tx/${txHash}`}
        target="_blank"
        className="text-blue-500 dark:text-blue-400"
      >
        {shortenAddress(txHash, 8)}
      </a>
      <Button
        text="OK"
        className="w-full mt-5 text-black dark:text-white bg-transparent border border-gray-200 dark:border-gray-600"
        onClick={hideModal}
      />
    </div>
  );
};

export default OrderCancellationModal;

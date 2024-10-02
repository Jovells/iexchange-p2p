import { useModal } from "@/common/contexts/ModalContext";
import { X } from "lucide-react";
import React from "react";
import Button from "../ui/Button";
import Image from "next/image";
import { useContracts } from "@/common/contexts/ContractContext";
import { shortenAddress } from "@/lib/utils";

interface Props {
  txHash: string;
  fiatAmount: string;
}

const SellerPaymentConfirmedModal: React.FC<Props> = ({ txHash, fiatAmount }) => {
  const { showModal, hideModal } = useModal();
  const { currentChain } = useContracts();

  return (
    <div className="w-[400px] bg-white p-14 rounded-[8px] flex flex-col justify-center items-center">
      <Image src="/images/icons/alert-info.svg" alt="info" className="w-auto h-auto mb-8" width={84} height={84} />
      <h2 className="font-[500px] text-center text-[16px] mb-6">Seller Marked Paid</h2>
      <p className="text-center text-gray-500 text[14px] font-[400px] mb-6">
        Seller has marked order as paid. Please confirm that you received {fiatAmount} in your account before releasing
        the crypto to the buyer.
      </p>
      <div className="text-gray-500">TxHash :</div>{" "}
      <a href={`${currentChain?.blockExplorers?.default.url}/tx/${txHash}`} target="_blank" className="text-blue-500">
        {shortenAddress(txHash, 8)}
      </a>
      <Button text="OK" className="w-full text-black bg-transparent border border-gray-200" onClick={hideModal} />
    </div>
  );
};

export default SellerPaymentConfirmedModal;

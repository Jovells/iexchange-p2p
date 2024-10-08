import { useModal } from "@/common/contexts/ModalContext";
import { X } from "lucide-react";
import React from "react";
import Button from "../ui/Button";
import Image from "next/image";
import { useContracts } from "@/common/contexts/ContractContext";
import { shortenAddress } from "@/lib/utils";

interface Props {
  txHash: string;
  cryptoAmount: string;
  fiatAmount: string;
}

const BuyerReleaseModal: React.FC<Props> = ({ txHash, cryptoAmount, fiatAmount }) => {
  const { showModal, hideModal } = useModal();
  const { currentChain } = useContracts();

  return (
    <div className="w-[400px] bg-white p-14 rounded-[8px] flex flex-col justify-center items-center">
      {/* TODO:@mbawon make images auto respond to dark mode */}
      <Image src="/images/icons/alert-success.svg" alt="info" className="w-auto h-auto mb-8" width={84} height={84} />
      <h2 className="font-[500px] text-center text-[16px] mb-6">Buy Successful</h2>
      <p className="text-center text-gray-500 text[14px] font-[400px] mb-6">
        You have succesfully bought {cryptoAmount} for {fiatAmount}!
      </p>
      <div className="text-gray-500">TxHash :</div>{" "}
      <a href={`${currentChain?.blockExplorers?.default.url}/tx/${txHash}`} target="_blank" className="text-blue-500">
        {shortenAddress(txHash, 8)}
      </a>
      <Button text="OK" className="w-full text-black bg-transparent border border-gray-200" onClick={hideModal} />
    </div>
  );
};

export default BuyerReleaseModal;

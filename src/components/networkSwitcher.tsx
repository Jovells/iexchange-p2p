import { useContracts } from "@/common/contexts/ContractContext";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import React, { Suspense } from "react";
import Loader from "./loader/Loader";
import Button from "./ui/Button";
import { ChevronsUpDown } from "lucide-react";
import { FaChevronCircleRight, FaPlug } from "react-icons/fa";

function NetworkSwitcher() {
  const { openChainModal } = useChainModal();
  const { openConnectModal } = useConnectModal();
  const { isCorrectChain, currentChain } = useContracts();

  const text = isCorrectChain ? currentChain?.name : "Wrong Network";

  return (
    <Suspense fallback={<Loader loaderType="text" />}>
      {openChainModal ? (
      <Button
        text={text}
        className="justify-end bg-transparent border border-[#01a2e4] px-4 py-2 w-full text-black dark:text-white transition duration-300 ease-in-out hover:bg-[#01a2e4] hover:text-white"
        onClick={() => openChainModal()}
        icon={<ChevronsUpDown />}
      />
      ) : (
      <Button
        text={text}
        className="justify-end bg-transparent border dark:border-[#01a2e4] px-4 py-2 w-full text-black dark:text-white transition duration-300 ease-in-out hover:bg-[#01a2e4] hover:text-white"
        onClick={() => openConnectModal?.()}
        icon={<FaPlug />}
      />
      )}
    </Suspense>
  );
}

export default NetworkSwitcher;

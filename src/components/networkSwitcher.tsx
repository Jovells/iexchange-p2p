import { useContracts } from "@/common/contexts/ContractContext";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import React, { Suspense } from "react";
import Loader from "./loader/Loader";
import Button from "./ui/Button";
import { ChevronsUpDown } from "lucide-react";
import { FaChevronCircleRight } from "react-icons/fa";

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
          className="justify-end bg-transparent border border-blue-300 dark:border-blue-600 px-4 py-2 w-full text-black dark:text-white"
          onClick={() => openChainModal()}
          icon={<ChevronsUpDown />}
        />
      ) : (
        <Button
          text={text}
          className="justify-end bg-transparent border border-blue-300 dark:border-blue-600 px-4 py-2 w-full text-black dark:text-white"
          onClick={() => openConnectModal?.()}
          icon={<FaChevronCircleRight />}
        />
      )}
    </Suspense>
  );
}

export default NetworkSwitcher;

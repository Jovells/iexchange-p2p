import { useContracts } from "@/common/contexts/ContractContext";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import React, { Suspense } from "react";
import Loader from "./loader/Loader";
import Button from "./ui/Button";
import { ChevronsUpDown } from "lucide-react";
import { FaChevronCircleRight, FaPlug } from "react-icons/fa";
import { useUser } from "@/common/contexts/UserContext";

function NetworkSwitcher({ className }: { className?: string }) {
  const { openChainModal } = useChainModal();
  const { openAuthModal } = useUser();
  const { isCorrectChain, currentChain } = useContracts();

  const text = isCorrectChain ? currentChain?.name : "Wrong Network";

  return (
    <Button
      text={text}
      className={
        "justify-end bg-transparent  border border-[#01a2e4] px-4 py-2 w-full text-black dark:text-white transition duration-300 ease-in-out hover:bg-[#01a2e4] hover:text-white " +
          className || ""
      }
      onClick={() => (openChainModal ? openChainModal() : openAuthModal?.())}
      icon={openChainModal ? <ChevronsUpDown /> : <FaPlug />}
    />
  );
}

export default NetworkSwitcher;

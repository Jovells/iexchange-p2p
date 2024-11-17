import { useContracts } from "@/common/contexts/ContractContext";
import React, { Suspense } from "react";
import Loader from "./loader/Loader";
import Button from "./ui/Button";
import { ChevronsUpDown, NetworkIcon } from "lucide-react";
import { FaChevronCircleRight, FaPlug } from "react-icons/fa";
import { useUser } from "@/common/contexts/UserContext";
import ToolTip from "./toolTip";

function NetworkSwitcher({ className }: { className?: string }) {
  const { openAuthModal } = useUser();
  const { isCorrectChain, currentChain } = useContracts();

  const text = isCorrectChain ? currentChain?.name : "Wrong Network";

  return (
    <ToolTip text="Connected to Arbitrum Sepolia Network">
      <Button
        text={text}
        className={
          "justify-end bg-transparent min-w-[180px] h-full  border border-gray-200 dark:border-gray-600 px-4 py-2 w-full text-black dark:text-white transition duration-300 ease-in-out" +
            className || ""
        }
        icon={<NetworkIcon />}
      />
    </ToolTip>
  );
}

export default NetworkSwitcher;

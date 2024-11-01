"use client";

import NetworkSwitcher from "@/components/networkSwitcher";
import WalletConnect from "@/components/wallet";
import React from "react";
import Claim from "../claim";
import { useUser } from "@/common/contexts/UserContext";
import FaucetAndNetwork from "@/components/faucetAndNetwork";

const QuickTradeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected } = useUser();
  return (
    <div className="flex flex-col justify-center lg:flex-row gap-10 p-4 lg:p-10 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-32  md:mx-auto">
      {children}
    </div>
  );
};

export default QuickTradeLayout;

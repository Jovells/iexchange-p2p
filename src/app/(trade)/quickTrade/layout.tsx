import WalletConnectSection from "@/components/sections/WalletConnectSection";
import React from "react";

const QuickTradeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <div className="px-10 py-32 md:max-w-6xl  md:mx-auto">
        <div className="flex flex-col items-center justify-center w-full h-full">{children}</div>
      </div>
    </>
  );
};

export default QuickTradeLayout;

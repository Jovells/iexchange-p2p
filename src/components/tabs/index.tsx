'use client'

import { FC, useState } from "react";

interface Props {
  onTabChange?: (value: string) => void;
  activeTab?: "buy" | "sell";
}
const Tabs: FC<Props> = ({ onTabChange, activeTab }) => {
  const [_activeTab, setActiveTab] = useState<"buy" | "sell" | string>(activeTab || "buy");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange && onTabChange(value);
  };

  console.log("activeTab", _activeTab);

  return (
    <div className="flex flex-row justify-between lg:justify-start items-center flex-wrap lg:flex-nowrap w-full lg:w-auto">
      <div className="flex flex-row items-center bg-white dark:bg-gray-700 border border-gray-700 rounded-xl p-1 min-w-[150px]">
        <button
          type="button"
          onClick={() => handleTabChange("buy")}
          className={`w-auto rounded-xl text-center text-md py-1 px-6 ${
            (activeTab || _activeTab) === "buy" ? "text-white bg-ixGreen" : "text-gray-600 dark:text-gray-300"
          }`}
        >
          I want to Buy
        </button>
        <button
          onClick={() => handleTabChange("sell")}
          className={`w-auto rounded-xl text-center text-md py-1 px-6 ${
            (activeTab || _activeTab).toLowerCase() === "sell"
              ? "text-white bg-ixRed"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          I want to Sell
        </button>
      </div>
    </div>
  );
};

export default Tabs
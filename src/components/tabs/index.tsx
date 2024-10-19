'use client'

import { FC, useState } from "react";

interface Props {
    onTabChange?: (value: string) => void
}
const Tabs: FC<Props> = ({ onTabChange }) => {
    const [activeTab, setActiveTab] = useState<"buy" | "sell" | string>("sell");

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        onTabChange && onTabChange(value)
    }

    console.log("activeTab", activeTab)

    return (
      <div className="flex flex-row justify-between lg:justify-start items-center flex-wrap lg:flex-nowrap w-full lg:w-auto">
        <div className="flex flex-row items-center bg-white dark:bg-gray-700 border border-gray-700 rounded-xl p-1 min-w-[150px]">
          <button
            type="button"
            onClick={() => handleTabChange("buy")}
            className={`w-auto rounded-xl text-center text-md py-1 px-6 ${
              activeTab.toLowerCase() === "buy" ? "text-white bg-[#01a2e4]" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            I want to Buy
          </button>
          <button
            onClick={() => handleTabChange("sell")}
            className={`w-auto rounded-xl text-center text-md py-1 px-6 ${
              activeTab.toLowerCase() === "sell" ? "text-white bg-[#01a2e4]" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            I want to Sell
          </button>
        </div>
      </div>
    );
}

export default Tabs
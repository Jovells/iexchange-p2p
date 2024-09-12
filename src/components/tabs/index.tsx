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

    return (
        <div className="flex flex-row justify-between lg:justify-start items-center flex-wrap lg:flex-nowrap w-full lg:w-auto">
            <div className="flex flex-row items-center bg-white border border-gray-200 rounded-xl p-1 min-w-[150px]">
                <button
                    onClick={() => handleTabChange("Buy")}
                    className={`w-auto rounded-xl text-center text-md py-1 px-6 ${activeTab.toLowerCase() === "buy"
                        ? "text-white bg-blue-500"
                        : "text-gray-600"
                        }`}>
                    I want to Buy
                </button>
                <button
                    onClick={() => handleTabChange("Sell")}
                    className={`w-auto rounded-xl text-center text-md py-1 px-6 ${activeTab.toLowerCase() === "sell"
                        ? "text-white bg-blue-500"
                        : "text-gray-600"
                        }`}>
                    I want to Sell
                </button>
            </div>
        </div>
    )
}

export default Tabs
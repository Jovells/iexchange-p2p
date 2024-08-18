import React from 'react';

interface Tab {
    label: string;
    value: string;
}

interface TabComponentProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (value: string) => void;
}

const CustomTab: React.FC<TabComponentProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex flex-col lg:flex-row items-center bg-white border border-gray-200 rounded-xl p-1 gap-6">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onTabChange(tab.value)}
                    className={`min-w-[150px] rounded-xl text-center text-md p-1 ${activeTab.toLowerCase() === tab.value.toLowerCase() ? 'text-black bg-gray-300' : 'text-gray-600'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default CustomTab
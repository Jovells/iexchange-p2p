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
        <div>
            <div className="hidden lg:flex flex-row items-center bg-white border border-gray-200 rounded-xl p-1 gap-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => onTabChange(tab.value)}
                        className={`min-w-[150px] rounded-xl text-center text-md p-1 ${activeTab === tab.value ? 'text-black bg-gray-300' : 'text-gray-600'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="lg:hidden w-full">
                <label htmlFor="tab-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Filter
                </label>
                <select
                    id="tab-select"
                    value={activeTab}
                    onChange={(e) => onTabChange(e.target.value)}
                    className="block w-full p-2 py-3 border border-gray-300 rounded-xl outline-none"
                >
                    {tabs.map((tab) => (
                        <option key={tab.value} value={tab.value}>
                            {tab.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default CustomTab;

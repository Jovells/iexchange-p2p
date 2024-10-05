import React, { useState } from 'react'
import Image from 'next/image';

interface GuideItem {
    image: string;
    title: string;
    description: string;
}

const IExchangeGuide = () => {
    const [activeTab, setActiveTab] = useState("trade");

    const guideData: { [key: string]: GuideItem[] } = {
        trade: [
            {
                image: "/images/icons/place-order.png",
                title: "Place an Order or Receive an Order",
                description: "Click on Buy or Sell to initiate a trade. Review the trade terms and conditions. Specify the amount of cryptocurrency you want to buy or sell."
            },
            {
                image: "/images/icons/pay.png",
                title: "Place an Order or Receive an Order",
                description: "Click on Buy or Sell to initiate a trade. Review the trade terms and conditions. Specify the amount of cryptocurrency you want to buy or sell."
            },
            {
                image: "/images/icons/receive-crypto.png",
                title: "Place an Order or Receive an Order",
                description: "Click on Buy or Sell to initiate a trade. Review the trade terms and conditions. Specify the amount of cryptocurrency you want to buy or sell."
            }
        ],
        settle: [
            {
                image: "/images/icons/verify-kyc.png",
                title: "Verify your Account with KYC",
                description: "Click on become a Stake on Platform on the Appealed Orders Page. Proceed with KYC to access KYC Verification. This will direct you to a third-party web app for necessary information."
            },
            {
                image: "/images/icons/pay.png",
                title: "Stake on Platform",
                description: "Once you are done with your KYC, return to iExchange to stake funds. Select and deposit funds by entering the amount and selecting currency. You’re now a Settler!"
            },
            {
                image: "/images/icons/pick-case.png",
                title: "Pick a Case to Settle",
                description: "On the Appealed Order Page, there are several cases available. Click on a case to settle. Each case has 3 rounds, and you can participate in judgment in only one round per case."
            }
        ],
        merchandise: [
            {
                image: "/images/icons/verify-kyc.png",
                title: "Verify your Account with KYC",
                description: "Click on become a Merchant. Proceed with KYC to access KYC Verification. This will direct you to a third-party web app for necessary information."
            },
            {
                image: "/images/icons/pay.png",
                title: "Stake on Platform",
                description: "Once you are done with your KYC, return to iExchange to stake funds. Select and deposit funds by entering the amount and selecting currency. You’re now a Merchant!"
            },
            {
                image: "/images/icons/post-ad.png",
                title: "Create and Post an Ad",
                description: "Click on Post Ad. This directs you to a form to fill in the right information about your advertisement. Enter the amount of cryptocurrency you wish to trade, and click Add Post."
            }
        ]
    };

    return (
        <div className='w-full py-3 lg:py-16'>
            <div className="flex flex-row justify-between items-center flex-wrap lg:flex-nowrap lg:p-0 gap-6 lg:gap-0 mt-6">
                <h1 className='text-3xl font-bold dark:text-white'>How iExchange Works</h1>
                <div className="flex flex-row items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-[8px] lg:min-w-[150px] min-w-full p-2">
                    <button
                        onClick={() => setActiveTab("trade")}
                        className={`w-full rounded-[8px] text-center text-md p-1 px-6 ${activeTab === 'trade' ? 'text-black dark:text-white bg-gray-400 dark:bg-gray-700' : 'text-gray-400 dark:text-gray-500'
                            }`}
                    >
                        Trade
                    </button>
                    <button
                        onClick={() => setActiveTab("merchandise")}
                        className={`w-full rounded-[8px] text-center text-md p-1 px-6 ${activeTab === 'merchandise' ? 'text-black dark:text-white bg-gray-400 dark:bg-gray-700' : 'text-gray-400 dark:text-gray-500'
                            }`}
                    >
                        Merchandise
                    </button>
                    <button
                        onClick={() => setActiveTab("settle")}
                        className={`w-full rounded-[8px] text-center text-md p-1 px-6 ${activeTab === 'settle' ? 'text-black dark:text-white bg-gray-400 dark:bg-gray-700' : 'text-gray-400 dark:text-gray-500'
                            }`}
                    >
                        Settle
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 py-4 lg:py-12 gap-6 lg:p-0'>
                {guideData[activeTab].map((item, index) => (
                    <div key={index} className='flex flex-col justify-start items-start bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 min-h-[200px]'>
                        <div className='p-3 space-y-3'>
                            <div className="flex justify-center items-center">
                                <Image src={item.image} alt="icon" width={100} height={100} />
                            </div>
                            <h1 className='text-2xl font-medium dark:text-white'>{item.title}</h1>
                            <p className='text-gray-500 dark:text-gray-400'>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default IExchangeGuide;

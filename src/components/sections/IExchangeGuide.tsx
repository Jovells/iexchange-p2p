import React, { useState } from 'react'
import Image from 'next/image';

const IExchangeGuide = () => {
    const [activeTab, setActiveTab] = useState("trade");

    return (
        <div className='w-full py-3 lg:py-16'>
            <div className="flex flex-row justify-between items-center flex-wrap lg:flex-nowrap p-6 lg:p-0 gap-6 lg:gap-0">
                <h1 className='text-3xl font-bold'>How iExchange Works</h1>
                <div className="flex flex-row items-center bg-white border border-gray-200 rounded-xl p-1 min-w-[150px]">
                    <button
                        onClick={() => setActiveTab("trade")}
                        className={`w-full rounded-xl text-center text-md p-1 px-6 ${activeTab.toLowerCase() === 'trade' ? 'text-black bg-gray-300' : 'text-gray-600'
                            }`}
                    >
                        Trade
                    </button>
                    <button
                        onClick={() => setActiveTab("merchandise")}
                        className={`w-full rounded-xl text-center text-md p-1 px-6 ${activeTab.toLowerCase() === 'merchandise' ? 'text-black bg-gray-300' : 'text-gray-600'
                            }`}
                    >
                        Merchandise
                    </button>
                    <button
                        onClick={() => setActiveTab("settle")}
                        className={`w-full rounded-xl text-center text-md p-1 px-6 ${activeTab.toLowerCase() === 'settle' ? 'text-black bg-gray-300' : 'text-gray-600'
                            }`}
                    >
                        Settle
                    </button>
                </div>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-3 py-4 lg:py-12 gap-6 p-6 lg:p-0'>
                {
                    activeTab === 'trade' && (
                        <>
                            <div className='flex flex-col justify-start items-start bg-gray-100 border rounded-xl p-6 min-h-[200px]'>
                                <div className='p-3 space-y-3'>
                                    <div className="flex justify-center items-center">
                                        <Image src="/images/icons/place-order.png" alt="icon" width={100} height={100} />
                                    </div>
                                    <h1 className='text-2xl font-medium'>
                                        Place an Order or Receive an Order
                                    </h1>
                                    <p className='text-gray-500'>
                                        Click on Buy or Sell to initiate a trade. Review the trade terms and conditions.
                                        Specify the amount of cryptocurrency you want to buy or sell.
                                    </p>
                                </div>
                            </div>
                            <div className='flex flex-col justify-start items-start bg-gray-100 border rounded-xl p-6 min-h-[200px]'>
                                <div className='p-3 space-y-3'>
                                    <div className="flex justify-center items-center">
                                        <Image src="/images/icons/pay.png" alt="icon" width={100} height={100} />
                                    </div>
                                    <h1 className='text-2xl font-medium'>
                                        Place an Order or Receive an Order
                                    </h1>
                                    <p className='text-gray-500'>
                                        Click on Buy or Sell to initiate a trade. Review the trade terms and conditions.
                                        Specify the amount of cryptocurrency you want to buy or sell.
                                    </p>
                                </div>
                            </div>
                            <div className='flex flex-col justify-start items-start bg-gray-100 border rounded-xl p-6 min-h-[200px]'>
                                <div className='p-3 space-y-3'>
                                    <div className="flex justify-center items-center">
                                        <Image src="/images/icons/receive-crypto.png" alt="icon" width={100} height={100} />
                                    </div>
                                    <h1 className='text-2xl font-medium'>
                                        Place an Order or Receive an Order
                                    </h1>
                                    <p className='text-gray-500'>
                                        Click on Buy or Sell to initiate a trade. Review the trade terms and conditions.
                                        Specify the amount of cryptocurrency you want to buy or sell.
                                    </p>
                                </div>
                            </div>
                        </>
                    )
                }
                {
                    activeTab === 'settle' && (
                        <>
                            <div className='flex flex-col justify-start items-start bg-gray-100 border rounded-xl p-6 min-h-[200px]'>
                                <div className='p-3 space-y-3'>
                                    <div className="flex justify-center items-center">
                                        <Image src="/images/icons/verify-kyc.png" alt="icon" width={100} height={100} />
                                    </div>
                                    <h1 className='text-2xl font-medium'>
                                        Verify your Account with KYC
                                    </h1>
                                    <p className='text-gray-500'>
                                        Click on become a Stake on Platform pn the Appealed Orders Page. Proceed with KYC to access KYC Verification.
                                        This will Direct you to a third Party Web app for neccesary information
                                    </p>
                                </div>
                            </div>
                            <div className='flex flex-col justify-start items-start bg-gray-100 border rounded-xl p-6 min-h-[200px]'>
                                <div className='p-3 space-y-3'>
                                    <div className="flex justify-center items-center">
                                        <Image src="/images/icons/pay.png" alt="icon" width={100} height={100} />
                                    </div>
                                    <h1 className='text-2xl font-medium'>
                                        Stake on Platform
                                    </h1>
                                    <p className='text-gray-500'>
                                        Once you are Done with your KYC. You’re back to iExchange to Stake Funds. Select and Deposit Funds by Entering Amount and selecting currency. You’re now a Settler!
                                    </p>
                                </div>
                            </div>
                            <div className='flex flex-col justify-start items-start bg-gray-100 border rounded-xl p-6 min-h-[200px]'>
                                <div className='p-3 space-y-3'>
                                    <div className="flex justify-center items-center">
                                        <Image src="/images/icons/pick-case.png" alt="icon" width={100} height={100} />
                                    </div>
                                    <h1 className='text-2xl font-medium'>
                                        Pick a Case to Settle
                                    </h1>
                                    <p className='text-gray-500'>
                                        On the Appealed Order Page there are Several Cases Available. You have to click on a particular Case you please to settle. Every Case has 3 rounds and you can participate in judgement in only a round in a case.
                                    </p>
                                </div>
                            </div>
                        </>
                    )
                }
                {
                    activeTab === 'merchandise' && (
                        <>
                            <div className='flex flex-col justify-start items-start bg-gray-100 border rounded-xl p-6 min-h-[200px]'>
                                <div className='p-3 space-y-3'>
                                    <div className="flex justify-center items-center">
                                        <Image src="/images/icons/verify-kyc.png" alt="icon" width={100} height={100} />
                                    </div>
                                    <h1 className='text-2xl font-medium'>
                                        Verify your Account with KYC
                                    </h1>
                                    <p className='text-gray-500'>
                                        Click on become a Merchant. Proceed with KYC to access KYC Verification.
                                        This will Direct you to a third Party Web app for neccesary information
                                    </p>
                                </div>
                            </div>
                            <div className='flex flex-col justify-start items-start bg-gray-100 border rounded-xl p-6 min-h-[200px]'>
                                <div className='p-3 space-y-3'>
                                    <div className="flex justify-center items-center">
                                        <Image src="/images/icons/pay.png" alt="icon" width={100} height={100} />
                                    </div>
                                    <h1 className='text-2xl font-medium'>
                                        Stake on Platform
                                    </h1>
                                    <p className='text-gray-500'>
                                        Once you are Done with your KYC. You’re back to iExchange to Stake Funds. Select and Deposit Funds by Entering Amount and selecting currency. You’re now a Merchant!
                                    </p>
                                </div>
                            </div>
                            <div className='flex flex-col justify-start items-start bg-gray-100 border rounded-xl p-6 min-h-[200px]'>
                                <div className='p-3 space-y-3'>
                                    <div className="flex justify-center items-center">
                                        <Image src="/images/icons/post-ad.png" alt="icon" width={100} height={100} />
                                    </div>
                                    <h1 className='text-2xl font-medium'>
                                        Create and Post an Ad
                                    </h1>
                                    <p className='text-gray-500'>
                                        Click on Post Ad. This Directs you to a form to fill in the right information about your advertisement. Enter the amount of cryptocurrency you wish to trade and etc. and click Add Post.
                                    </p>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default IExchangeGuide
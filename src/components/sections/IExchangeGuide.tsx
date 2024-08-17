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
                    activeTab === 'merchandise' && (
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
            </div>
        </div>
    )
}

export default IExchangeGuide
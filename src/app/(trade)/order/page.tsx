'use client'

import ChatWithMerchant from '@/components/merchant/ChatWithMerchant'
import Button from '@/components/ui/Button'
import React from 'react'

const OrderCreated = () => {
  return (
    <>
      <div className='w-full py-6 bg-[#CCE0F6]'>
        <div className="w-full lg:container lg:mx-auto px-4 lg:px-0 lg:px-0 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <span className='font-bold text-gray-600'>Order Created</span>
            <div className='flex flex-row space-x-2'>
              <span className='text-gray-500'>Time Limit Exhaustion:</span>
              <div className='flex flex-row justify-start items-start space-x-1'>
                <span className='bg-blue-500 rounded-lg w-6 h-6 p-1 flex justify-center items-center px-3 text-white text-sm'>15</span>
                <span>:</span>
                <span className='bg-blue-500 rounded-lg w-6 h-6 p-1 flex justify-center items-center px-3 text-white text-sm'>00</span>
              </div>
            </div>
          </div>
          <div className='space-y-0 lg:space-y-2'>
            <div className='flex flex-row items-center space-x-2'>
              <span className='text-gray-500'>Order number:</span>
              <span className='text-black text-sm'>1002003333</span>
            </div>
            <div className='flex flex-row items-center space-x-2'>
              <span className='text-gray-500'>Date created:</span>
              <span className='text-black text-sm'>12.12.2024</span>
            </div>
          </div>
        </div>
      </div>
      <div className='container mx-auto px-0 py-4'>
        <div className="w-full h-[500px] grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-20">

          <ChatWithMerchant />

          <div className='p-6 h-full shadow-lg border border-gray-300 rounded-xl space-y-6'>
            <h2 className='text-lg text-gray-500'>Order Info</h2>

            <div className='flex flex-col justify-start items-start lg:flex-row lg:justify-between gap-3 lg:gap-10 mt-6'>

              <div className='flex flex-row lg:flex-col gap-4 lg:gap-0'>
                <div className='text-sm text-gray-600 font-light'>Amount</div>
                <div className='text-green-700 text-lg font-medium'>GHS 1,200.00</div>
              </div>

              <div className='flex flex-row lg:flex-col gap-4 lg:gap-0'>
                <div className='text-sm text-gray-600 font-light'>Price</div>
                <div className='text-gray-700 text-lg font-light'>GHS 1,200.00</div>
              </div>

              <div className='flex flex-row lg:flex-col gap-4 lg:gap-0'>
                <div className='text-sm text-gray-600 font-light'>Receive Quantity</div>
                <div className='text-gray-700 text-lg font-light'>GHS 1,200.00</div>
              </div>

            </div>
            <div>
              <h2>Make Payment</h2>
              <div className='w-full border rounded-xl p-4 h-auto space-y-4'>
                <div>
                  <div className='font-light text-gray-500 text-sm'>Account Name</div>
                  <div className='text-gray-600'>iExchange Merchant Acct</div>
                </div>
                <div>
                  <div className='font-light text-gray-500 text-sm'>Account Number</div>
                  <div className='text-gray-600'>1223333349999</div>
                </div>
              </div>
            </div>
            <div>
              <h2 className='text-gray-700'>Proceed Transaction</h2>
              <p className='text-gray-500'>Click “Done with Payment” to notify the Seller or click “Cancel” to stop the Order</p>
            </div>
            <div className='flex flex-col lg:flex-row gap-6'>
              <Button
                text="Transfer Funds, Notify Seller"
                icon="/images/icons/export.svg"
                iconPosition="right"
                className="bg-[#000000] text-white rounded-xl px-4 py-2"
                onClick={() => { }}
              />
              <Button
                text="Cancel Order"
                className="bg-gray-50 text-black rounded-xl px-4 py-2"
                onClick={() => { }}
              />
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default OrderCreated
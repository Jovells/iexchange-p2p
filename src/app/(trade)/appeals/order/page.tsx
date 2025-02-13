'use client'
import React, { Fragment } from 'react'
import Chat from '../chat'
import Button from '@/components/ui/Button'
import FaqsSection from '@/components/sections/Faqs'
import Timer from '@/components/timer'
import Vote from '../vote'
import { useModal } from '@/common/contexts/ModalContext'
import Steps from '@/components/step'
import { steps } from '@/common/data/steps'

const Appeal = () => {

  const { showModal, hideModal } = useModal()

  const handleVote = () => {
    showModal(
      <Vote hideModal={hideModal} />
    )
  }
  return (
    <Fragment>
      <div className='w-full py-6 bg-[#CCE0F6]'>
        <div className="w-full lg:container lg:mx-auto px-4 lg:px-0 lg:px-0 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <span className='font-bold text-gray-600'>Waiting for Judgement</span>
            <div className='flex flex-row space-x-2'>
              <span className='text-gray-500'>Time Limit Exhaustion:</span>
              <Timer initialMinutes={1} initialSeconds={30} onComplete={() => { }} />
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
        <div className="flex justify-center items-center py-16">
          <Steps steps={steps} />
        </div>
        <div className="w-full h-[500px] grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-20">

          <Chat />

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
                text={<Timer initialMinutes={1} initialSeconds={30} onComplete={() => { }} text='to Vote' className='bg-transparent' />}
                icon="/images/icons/export.svg"
                iconPosition="right"
                className="bg-[#000000] text-white rounded-xl px-4 py-2"
                onClick={handleVote}
              />
              <Button
                text="Decline Case"
                className="bg-gray-50 text-black rounded-xl px-4 py-2"
              />
            </div>
          </div>

        </div>

        <FaqsSection />
      </div>
    </Fragment>
  )
}

export default Appeal
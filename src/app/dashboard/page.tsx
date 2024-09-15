
'use client'

import Verify from '@/components/cards/Verify'
import Button from '@/components/ui/Button'
import { Clock, EyeOff, SquareAsterisk } from 'lucide-react'
import React from 'react'

const Dashboard = () => {
  
  return (
    <div className='flex flex-col justify-start gap-10'>
      <h1 className='text-2xl font-medium'>Get Started</h1>
      {/* <Steps steps={steps} /> */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="">
          <Verify />
        </div>
        <div className="flex flex-col justify-between border border-gray-500 rounded-xl p-6">
          <h1 className="text-xl font-medium">
            Trade Crypto above $500
          </h1>
          <div className='flex flex-row items-center gap-3'>
            <Clock className='text-gray-500 w-6 h-6' />
            <span className='text-gray-500'>Pending</span>
          </div>
        </div>

        <div className="flex flex-col justify-between border border-gray-500 rounded-xl p-6">
          <h1 className="text-xl font-medium">
            Stake to Become Merchant and Settler
          </h1>
          <div className='flex flex-row items-center gap-3'>
            <Clock className='text-gray-500 w-6 h-6' />
            <span className='text-gray-500'>Pending</span>
          </div>
        </div>

      </div>
      <div className="flex flex-col justify-between border border-gray-200 rounded-xl p-6 gap-4">
        <div className="flex flex-row items-center gap-4">
          <span className="text-xl font-medium">
            Estimated Balance
          </span>
          <EyeOff />
        </div>
        <div className='flex flex-col items-start gap-4'>
          <div className="flex flex-row items-center gap2">
            <SquareAsterisk className='text-gray-400' />
            <SquareAsterisk className='text-gray-400' />
            <SquareAsterisk className='text-gray-400' />
            <SquareAsterisk className='text-gray-400' />
            <SquareAsterisk className='text-gray-400' />
            <SquareAsterisk className='text-gray-400' />
          </div>
          <Button
            text="Add Wallet"
            icon="/images/icons/add-circle.png"
            iconPosition="right"
            className='bg-black text-white px-3 py-2 rounded-xl'
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
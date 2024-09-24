import React from 'react'
import DashboardLayout from '../../DashboardLayout'
import Verify from '@/components/cards/Verify'
import Button from '@/components/ui/Button'
import { shortenAddress } from '@/lib/utils'
// import { useAccount } from 'wagmi'

const Identification = () => {
    // const account = useAccount()
  return (
    <DashboardLayout>
      <div className="flex flex-col items-start">

        <div className="border-b w-full pb-12 mb-12 flex flex-row gap-3">
          <div className="bg-gray-200 rounded-xl w-[100px] h-[100px]">
          </div>
          <div className="flex flex-col items-start">
            <span>{shortenAddress("aaaaddd328282828282828282ncjddjddd!!")}</span>
            <Button
              text="Unverified"
              className='font-light text-gray-700 text-sm bg-gray-200 p-2 rounded-xl'
            />
          </div>
        </div>
        <Verify />

        <div className="flex flex-col items-start w-full gap-4 mt-14 border-t pt-12">
          <h1 className='font-medium text-black text-lg'>Account Privileges</h1>
          <Button
            text="Connect Wallet"
            icon="/images/icons/lock.png"
            iconPosition='left'
            className='font-light text-gray-500 text-sm'
          />
          <Button
            text="Fiat and Crypto Conversion"
            icon="/images/icons/lock.png"
            iconPosition='left'
            className='font-light text-gray-500 text-sm'

          />
          <Button
            text="Post Ads"
            icon="/images/icons/lock.png"
            iconPosition='left'
            className='font-light text-gray-500 text-sm'

          />
          <Button
            text="Settle Cases"
            icon="/images/icons/lock.png"
            iconPosition='left'
            className='font-light text-gray-500 text-sm'

          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Identification
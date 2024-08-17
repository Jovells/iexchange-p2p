import { BadgeCheck, IndianRupee } from 'lucide-react'
import React from 'react'

const MerchantProfile = () => {
    return (
        <div className='flex flex-col justify-between h-full px-6 pl-0'>
            <div className='space-y-4'>
                <div className="flex flex-row items-center">
                    <IndianRupee className='w-4 h-4' />
                    <span>Crypthority.Gh</span>
                    <BadgeCheck className='w-4 h-4 ml-1' />
                </div>
                {/* trades */}
                <div className='text-xs'>
                    <p>397 trades</p>
                    <p>99% Completion</p>
                </div>
                {/* commitments */}
                <div className='flex flex-col justify-start items-start lg:flex-row gap-2 lg:gap-20 text-xs'>
                    <div className='flex flex-row-reverse justify-between lg:flex-col w-full lg:w-auto'>
                        <span>30min</span>
                        <span>Payment Time Frame</span>
                    </div>
                    <div className='flex flex-row-reverse justify-between lg:flex-col w-full lg:w-auto'>
                        <span>13.5min</span>
                        <span>Avg. Pay Time</span>
                    </div>
                    <div className='flex flex-row-reverse justify-between lg:flex-col w-full lg:w-auto'>
                        <span>1,200.00USDT</span>
                        <span>Available</span>
                    </div>
                </div>
            </div>
            {/* Terms */}
            <div className='space-y-3 bg-white p-0 lg:p-6 pt-6  rounded-xl'>
                <h2>Merchant Terms and Conditions</h2>
                <p className='text-sm text-gray-500'>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque</p>
                <p className='text-sm text-gray-500'>laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et
                    quasich itecto bea tae vitae dicta sunt expli cabo. Nemo enim ipsam volup tatem quia</p>
            </div>
        </div>
    )
}

export default MerchantProfile
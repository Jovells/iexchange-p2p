import { Offer } from '@/common/api/types'
import { formatCurrency, shortenAddress } from '@/lib/utils'
import { BadgeCheck, IndianRupee } from 'lucide-react'
import React from 'react'

const MerchantProfile = ({
    offer
}:{offer: Offer}) => {
    return (
        <div className='flex flex-col justify-between h-full px-6 pl-0'>
            <div className='space-y-4'>
                <div className="flex flex-row items-center">
                    {/* TODO@mbawon */}
                    <IndianRupee className='w-4 h-4' />
                    <span>{offer.merchant.name} ({shortenAddress(offer.merchant.id)})</span>
                    <BadgeCheck className='w-4 h-4 ml-1' />
                </div>
                {/* trades */}
                <div className='text-xs flex gap-20'>
                    <div>
                    <p>397 trades</p>
                    <p>99% Completion</p>
                    </div>
                    <div>
                    {/* TODO: @mbawon Check alignment */}
                    <p className='font-bold text-gray-200 bg-slate-500 rounded p-1  '>{offer.paymentMethod.method}</p>
                    <p>Payment Method</p>
                    </div>
                </div>
                {/* commitments */}
                <div className='flex flex-col justify-start items-start lg:flex-row gap-2 lg:gap-20 text-xs'>
                    <div className='flex flex-row-reverse justify-between lg:flex-col w-full lg:w-auto'>
                        <span>{offer.merchant.timeLimit || "30"} {"mins"}</span>
                        <span>Payment Time Frame</span>
                    </div>
                    <div className='flex flex-row-reverse justify-between lg:flex-col w-full lg:w-auto'>
                        <span>13.5min</span>
                        <span>Avg. Pay Time</span>
                    </div>
                    <div className='flex flex-row-reverse justify-between lg:flex-col w-full lg:w-auto'>
                        <span>{formatCurrency(offer.minOrder, offer.token.symbol)} - {formatCurrency(offer.maxOrder, offer.token.symbol)}</span>
                        <span>Limit</span>
                    </div>
                </div>
            </div>
            {/* Terms */}
            <div className='space-y-3 bg-white p-0 lg:p-6 pt-6 h-full mt-5 rounded-xl'>
                <h2>Merchant Terms and Conditions</h2>
                <p className='text-sm text-gray-500'>{offer.merchant.terms || "N/A"}</p>
            </div>
        </div>
    )
}

export default MerchantProfile
'use client'

import { currencies } from '@/common/data/currencies'
import Button from '@/components/ui/Button'
import InputWithSelect from '@/components/ui/InputWithSelect'
import { X } from 'lucide-react'
import React from 'react'

const Stake = ({ hideModal }: { hideModal: () => void }) => {
    return (
        <div className='bg-white w-[500px] min-h-[350px] p-6 rounded-xl flex flex-col justify-between'>
            <div>
                <div className="flex justify-end">
                    <X onClick={hideModal} className='cursor-pointer' />
                </div>
                <div className='flex flex-col gap-2'>
                    <h2 className='text-gray-700 text-lg'>Settler Stake</h2>
                    <p className='text-gray-500 text-sm'>Stake any currency up to 10USDT to Continue the Process of becoming a Merchant.</p>
                </div>
            </div>
            <div>
                <InputWithSelect
                    label="Stake Amount"
                    initialCurrency="GHS"
                    currencies={currencies as unknown as { symbol: string; name: string, icon: JSX.Element ; id: `0x${string}`}[]}
                    onValueChange={(value) => console.log(value)}
                    readOnly={false}
                    placeholder="Enter amount"
                    selectIsReadOnly={false}
                />
            </div>
            <Button
                text="Proceed"
                className='bg-black text-white p-3 w-full rounded-xl'
            />
        </div>
    )
}

export default Stake
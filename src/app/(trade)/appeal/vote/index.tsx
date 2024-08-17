'use client'

import Button from '@/components/ui/Button'
import { X } from 'lucide-react'
import React from 'react'

const Vote = ({ hideModal }: { hideModal: () => void }) => {
    return (
        <div className='bg-white w-[500px] min-h-[350px] p-6 rounded-xl flex flex-col justify-between'>
            <div>
                <div className="flex justify-end">
                    <X onClick={hideModal} className='cursor-pointer' />
                </div>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-gray-600 text-xl'>Cast Your Vote</h1>
                    <p className='text-gray-500'>Choose rightly to settle case</p>
                </div>
            </div>
            <div></div>
            <Button
                text="Proceed"
                className='bg-black text-white p-3 w-full rounded-xl'
            />
        </div>
    )
}

export default Vote
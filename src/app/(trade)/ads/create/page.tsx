'use client'

import Tabs from '@/components/tabs'
import Button from '@/components/ui/Button'
import InputSelect from '@/components/ui/InputSelect'
import InputWithSelect from '@/components/ui/InputWithSelect'
import Input from '@/components/ui/input'
import React, { useState } from 'react'
import RenderAddedPaymentMethod from './RenderAddedPaymentMethod'

const page = () => {
    const [ payload, setPayload] = useState()

    const addPaymentMethod = () =>{}
    const addPost = () =>{}

    return (
        <div className='container mx-auto p-0 py-4'>
            <div className="my-4 flex flex-col gap-4">
                <Tabs />
                <div className='flex flex-col gap-2'>
                    <h1>Create Advert</h1>
                    <p className='text-gray-400'>Please fill in the information to proceed to post an Ad.</p>
                </div>
            </div>
            <div className="shadow-lg border border-gray-200 p-10 py-10 bg-white rounded-xl flex flex-col gap-10">
                <div className='flex flex-col gap-8'>
                    <h1 className='text-blue-500 font-bold'>Type and Price</h1>
                    <div className='flex flex-row items-start justify-center gap-6'>
                        <InputSelect options={[]} label='Asset' />
                        <InputSelect options={[]} label='Fiat' />
                        <InputWithSelect currencies={[]} label='My Price' />
                    </div>
                </div>
                <div className='flex flex-col gap-8'>
                    <h1 className='text-blue-500 font-bold'>Amount and Method</h1>
                    <div className='flex flex-col gap-2'>
                        <span className='text-gray-700 font-light'>Assets</span>
                        <div className='flex flex-row items-start justify-center gap-6'>
                            <Input label="Total Amount" />
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <span className='text-gray-700 font-light'>Order Limit</span>
                        <div className='flex flex-row items-start gap-6'>
                            <div className='flex flex-col gap-2 flex-1'>
                                <div className='flex flex-row items-start justify-center gap-6'>
                                    <Input label="Minimum" />
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 flex-1'>
                                <div className='flex flex-row items-start justify-center gap-6'>
                                    <Input label="Maximum" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <span className='text-gray-700 font-light'>Payment Methods</span>
                        <div className='flex flex-row items-start gap-6'>
                            <div className="flex-1">
                                <InputSelect options={[]} label='Method' />
                            </div>
                            <div className='flex flex-col gap-2 flex-1'>
                                <div className='flex flex-row items-start justify-center gap-6'>
                                    <Input label="Account Name" />
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 flex-1'>
                                <div className='flex flex-row items-start justify-center gap-6'>
                                    <Input label="Account Number" />
                                </div>
                            </div>
                        </div>
                        <div className='mt-3'>
                            <Button
                                text="Add Payment Method"
                                icon='/images/icons/add-circle.png'
                                iconPosition="right"
                                className="bg-black text-white hover:bg-gray-600 rounded-xl px-4 py-2 w-fit mb-6"
                                onClick={()=>addPaymentMethod()}
                            />
                            <RenderAddedPaymentMethod paymentMethod={[]} handleDelete={() => { }} />
                        </div>
                        <InputSelect options={[]} label='Payment Time Limit' />
                        <div className='flex flex-col gap-4 my-4'>
                            <span className='text-sm text-gray-500'>Terms (Optional)</span>
                            <textarea rows={10} className='resize-none w-full border border-gray-200 rounded-xl' />
                        </div>
                    </div>
                    <div className="flex flex-row justify-end gap-6">
                        <Button
                            text="Cancel"
                            iconPosition="right"
                            className="bg-transparent border border-gray-300 text-black rounded-xl px-4 py-2 w-fit"
                            onClick={()=>{}}
                        />
                        <Button
                            text="Add Post"
                            icon='/images/icons/add-circle.png'
                            iconPosition="right"
                            className="bg-black text-white hover:bg-gray-600 rounded-xl px-4 py-2 w-fit"
                            onClick={addPost}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page
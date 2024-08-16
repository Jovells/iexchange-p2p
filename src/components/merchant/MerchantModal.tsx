'use client'

import { X } from "lucide-react";
import Button from "../ui/Button";
import InputWithSelect from "../ui/InputWithSelect";
import { currencies } from "@/common/data/currencies";

const MerchantModal = ({ hideModal, action }: { hideModal: () => void; action: string }) => {
    return (
        <div className='w-full lg:w-[500px] h-auto bg-[#ffffff] p-8 rounded-xl shadow-md border-2-gray-500'>
            <div className='flex justify-end'>
                <X onClick={hideModal} className='cursor-pointer' />
            </div>
            {action === "verify" && (
                <>
                    <div className='flex flex-col gap-6'>
                        <h2 className='text-gray-700 text-lg'>Let’s Verify Your identification</h2>
                        <p className='text-gray-500 text-sm'>Please provide all neccesary infomartion. Note that all your information is Safe.</p>
                    </div>
                    <Button
                        text="Proceed"
                        className="bg-[#000000] text-white hover:bg-gray-600 rounded-xl px-4 py-2 mt-12 w-full"
                        onClick={() => { }}
                    />
                </>
            )}
            {action === "stake" && (
                <>
                    <div className='flex flex-col gap-6 mb-4'>
                        <h2 className='text-gray-700 text-lg'>Merchant Stake</h2>
                        <p className='text-gray-500 text-sm'>Stake any currency up to 10USDT to Continue the Process of becoming a Merchant.</p>
                    </div>
                    <InputWithSelect
                        label="Stake Amount"
                        initialCurrency="GHS"
                        currencies={currencies}
                        onValueChange={(value) => console.log(value)}
                        readOnly={false}
                        placeholder="Enter amount"
                        selectIsReadOnly={false}
                    />
                    <Button
                        text="Proceed"
                        className="bg-[#000000] text-white hover:bg-gray-600 rounded-xl px-4 py-2 mt-6 w-full"
                        onClick={() => { }}
                    />
                </>
            )}
        </div>
    )
}

export default MerchantModal
import { useModal } from '@/common/contexts/ModalContext'
import { X } from 'lucide-react';
import React from 'react'
import Button from '../ui/Button';
import Image from 'next/image';

interface Props {
    onClick: () => Promise<void>
    amount?:string;
    accountNuber?:string;
    accountName?:string;
}

const PaymentConfirmation: React.FC<Props> = ({ onClick, amount, accountName, accountNuber }) => {
    const { showModal, hideModal } = useModal();

    const showConfirmation = () => {
        showModal(
            <div className='w-[400px] bg-white p-14 rounded-[8px] flex flex-col justify-center items-center'>
                <Image src="/images/icons/alert-success.svg" alt='info' className='w-auto h-auto mb-8' width={84} height={84} />
                <h2 className='font-[500px] text-center text-[16px] mb-6'>Successfully Purchased</h2>
                <p className="text-center text-gray-500 text[14px] font-[400px] mb-6">
                    You have succesfully Purchased [Amount]!
                </p>
                <Button
                    text="OK"
                    className='w-full text-black bg-transparent border border-gray-200'
                    onClick={hideModal}
                />
            </div>
        )
    }

    const handleClick = async () => {
        await onClick()
        hideModal()
        setTimeout(() => {
            showConfirmation()
        }, 500);
    }

    return (
        <div className='w-[400px] bg-white rounded-[8px]'>
            <div className="flex flex-row justify-between items-center border-b border-gray-200 font-[500px] p-6 px-10">
                <h2 className='font-[500px] text-[16px]'>Payment Confirmation</h2>
                <X />
            </div>
            <div className="p-6 px-10 flex flex-col gap-4">
                <p className='text-gray-500 font-[400px] text-[14px]'>
                    By clicking "Confirm Payment," you agree to our [Terms and Conditions] and acknowledge that the payment details are accurate.
                </p>
                <div className="border border-gray-200 rounded-[8px] p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className='font-[400px] text-[14px] text-[#5B5E5F]'>Account Name</h2>
                        <p className='font-[500px] text-[14px] text-black'>Rebecca Ernestina Feyi</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className='font-[400px] text-[14px] text-[#5B5E5F]'>Account Number</h2>
                        <p className='font-[500px] text-[14px] text-black'>+233 (0) 22 022 5768</p>
                    </div>
                </div>
                <p className='text-gray-500 font-[400px] text-[14px] border border-red-400 rounded-[8px] p-3'>
                    iExchange is not responsible for any losses or damages resulting from the use of the platform, including, but not limited to, financial losses, data breaches, or unauthorized access to your account.
                </p>
                <Button
                    text="Confirm Payment"
                    className='w-full text-white bg-black'
                    onClick={handleClick}
                />
            </div>
        </div>
    )
}

export default PaymentConfirmation
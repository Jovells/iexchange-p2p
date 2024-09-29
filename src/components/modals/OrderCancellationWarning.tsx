import { useModal } from '@/common/contexts/ModalContext'
import { X } from 'lucide-react';
import React from 'react'
import Button from '../ui/Button';
import Image from 'next/image';

interface Props {
    onClick: () => Promise<void>
}

const OrderCancellationWarning: React.FC<Props> = ({ onClick }) => {
    const { showModal, hideModal } = useModal();

    const showConfirmation = () => {
        showModal(
            <div className='w-[400px] bg-white p-14 rounded-[8px] flex flex-col justify-center items-center'>
                <Image src="/images/icons/alert-info.svg" alt='info' className='w-auto h-auto mb-8' width={84} height={84} />
                <h2 className='font-[500px] text-center text-[16px] mb-6'>Note, You have Cancelled Your Order</h2>
                <p className="text-center text-gray-500 text[14px] font-[400px] mb-6">
                    Please remember that you only 3 more attempt, otherwise your account will be suspended
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
                <h2 className='font-[500px] text-[16px]'>Order Cancellation Warning</h2>
                <X />
            </div>
            <div className="p-6 px-10 flex flex-col gap-8">
                <p className='text-gray-500 font-[400px] text-[14px]'>
                    If you cancel [X] more orders, your account will be temporarily restricted from placing new orders. You will receive an email notification once the restriction is lifted, allowing you to place orders again.
                </p>
                <p className='text-gray-500 font-[400px] text-[14px]'>
                    We value your participation in our P2P community and appreciate your understanding in this matter. If you have any questions or need assistance, please do not hesitate to contact our support team.
                </p>
                <Button
                    text="Continue"
                    className='w-full text-white bg-black'
                    onClick={handleClick}
                />
            </div>
        </div>
    )
}

export default OrderCancellationWarning
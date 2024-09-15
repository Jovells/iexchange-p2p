'use client'

import React from 'react'
import Button from '../ui/Button';
import { useModal } from '@/common/contexts/ModalContext';

interface Props {
    modalType?: "success" | "error";
    icon?: React.ReactNode | string;
    text?: string;
    buttonClick?: () => Promise<void>;
}

const ModalAlert: React.FC<Props> = ({ modalType, icon, text, buttonClick }) => {
    const { hideModal } = useModal()
    const handleClick = async () => {
        if (buttonClick) {
            try {
                await buttonClick();
                hideModal()
            } catch (error) {
                console.error("Button click handler failed:", error);
            }
        } else {
            hideModal()
        }
    }
    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='flex flex-col justify-center items-center gap-8 bg-white shadow-xl rounded-xl py-10 w-[500px] min-h-[250px]'>
                {typeof icon === "string" ? (
                    <img src={icon} alt="icon" className="h-28 w-28" />
                ) : (
                    icon
                )}
                <p className='text-md text-gray-400 text-center'>{text}</p>
                <Button text="OK" onClick={handleClick} className='bg-transparent border rounded-xl border-gray-200 px-10 py-1' />
            </div>
        </div>
    )
}

export default ModalAlert
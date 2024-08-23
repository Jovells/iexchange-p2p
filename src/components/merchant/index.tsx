'use client'

import React, { useEffect } from 'react'
import Button from '../ui/Button'
import { useModal } from '@/common/contexts/ModalContext';
import MerchantModal from './MerchantModal';
import { useAccount } from 'wagmi';
import { X } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GET_ACCOUNT_BY_ID, MY_QUERY } from '@/common/graphql/queries';

const BecomeAMerchant = () => {
    const { isConnected, address } = useAccount()
    const { showModal, hideModal } = useModal()

    const isVerified = true;
    const isMerchant = false;

    // const { data, loading, error } = useQuery(GET_ACCOUNTS, {
    //     variables: { id: "1000" }
    // });

    // const { data, loading, error } = useQuery(MY_QUERY);

    const handleClick = () => {
        if (!isConnected) {
            showModal(
                <div className='w-full lg:w-[300px] h-auto bg-[#ffffff] p-8 rounded-xl shadow-md border-2-gray-500'>
                    <div className='flex justify-end'>
                        <X onClick={hideModal} className='cursor-pointer' />
                    </div>
                    <div className="flex flex-col justify-center items-center w-full gap-3">
                        <w3m-button />
                    </div>
                </div>
            )
            return
        }
        if (isVerified) {
            if (!isMerchant) {
                showModal(<MerchantModal hideModal={hideModal} action="stake" />)
            } else {
                //navigate to create ads
            }
        } else {
            showModal(<MerchantModal hideModal={hideModal} action="verify" />)
        }
    };

    useEffect(() => {
        if (isConnected) {
            hideModal()
        }
    }, [isConnected])

    return (
        <Button
            text={(isMerchant) ? "Post an Ads" : "Become a Merchant"}
            icon={isMerchant ? "/images/icons/add-circle.png" : "/images/icons/export.svg"}
            iconPosition="right"
            className="bg-[#000000] text-white hover:bg-gray-600 rounded-xl px-4 py-2"
            onClick={handleClick}
        />
    )
}

export default BecomeAMerchant
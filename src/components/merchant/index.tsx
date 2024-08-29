'use client'

import React, { useEffect, useCallback } from 'react'
import Button from '../ui/Button'
import { useModal } from '@/common/contexts/ModalContext'
import MerchantModal from './MerchantModal'
import { useAccount } from 'wagmi'
import { X } from 'lucide-react'
import { fetchAccount } from '@/common/api'
import { useQuery } from '@tanstack/react-query'

const BecomeAMerchant = () => {
    const { isConnected, address } = useAccount()
    const { showModal, hideModal } = useModal()

    const { data: account, error, isLoading, isError, isFetching } = useQuery({
        queryKey: ['merchantAccount', address],
        queryFn: () => fetchAccount(address),
        enabled: !!address,
        retry: 1,
        refetchOnWindowFocus: false,
    })

    // Determine if the user is a merchant based on account data
    const isMerchant = account?.isMerchant || false

    const handleClick = useCallback(() => {
        if (isConnected) return //to updated to !isConnected

        if (isMerchant) {
            // Handle the case when the user is a merchant (e.g., navigation to an ad page)
            // Add your navigation logic here
            return
        }

        const content = isConnected ? (  //to updated to !isConnected
            <div className="w-full lg:w-[300px] h-auto bg-white p-8 rounded-xl shadow-md border-2 border-gray-500">
                <div className="flex justify-end">
                    <X onClick={hideModal} className="cursor-pointer" />
                </div>
                <div className="flex flex-col justify-center items-center w-full gap-3">
                    <w3m-button />
                </div>
            </div>
        ) : (
            <MerchantModal hideModal={hideModal} action="stake" />
        )

        showModal(content)
    }, [isConnected, isMerchant, showModal, hideModal])

    useEffect(() => {
        if (isConnected) {
            hideModal()
        }
    }, [isConnected, hideModal])

    return (
        <Button
            text={isMerchant ? 'Post an Ads' : 'Become a Merchant'}
            icon={isMerchant ? '/images/icons/add-circle.png' : '/images/icons/export.svg'}
            iconPosition="right"
            className="bg-black text-white hover:bg-gray-600 rounded-xl px-4 py-2"
            onClick={handleClick}
        />
    )
}

export default BecomeAMerchant

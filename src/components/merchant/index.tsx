'use client'

import React, { useCallback } from 'react'
import Button from '../ui/Button'
import { useModal } from '@/common/contexts/ModalContext'
import MerchantModal from './MerchantModal'
import { useAccount } from 'wagmi'
import { fetchAccount } from '@/common/api'
import { useQuery } from '@tanstack/react-query'
import { useConnectModal } from '@rainbow-me/rainbowkit'

const BecomeAMerchant = () => {
    const { openConnectModal } = useConnectModal()
    const { isConnected, address } = useAccount()
    const { showModal, hideModal } = useModal()

    // const address: any = "0x8db769ccd2f5946a94fce8b3ad9a296d5309c36c"

    const { data: account, error, isLoading, isError, isFetching } = useQuery({
        queryKey: ['merchantAccount', address],
        queryFn: () => fetchAccount(address),
        enabled: !!address,
        retry: 1,
        refetchOnWindowFocus: false,
    })

    const isMerchant = account?.account?.isMerchant || false

    const handleClick = useCallback(() => {


        console.log("MERCHANT ", isMerchant, isConnected)
        if (!isConnected) {
            openConnectModal?.()
            return
        }

        if (isMerchant) {
            // navigate to create ads
            return
        }

        const content = <MerchantModal hideModal={hideModal} action="stake" />

        showModal(content)

    }, [isConnected, isMerchant, showModal, hideModal])

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

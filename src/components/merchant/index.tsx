'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Button from '../ui/Button'
import { useModal } from '@/common/contexts/ModalContext'
import MerchantModal from "./MerchantModal";
import { fetchAccount } from '@/common/api/fetchAccount'
import { useQuery } from '@tanstack/react-query'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/navigation'
import { useContracts } from '@/common/contexts/ContractContext'
import { POST_AD_PAGE } from '@/common/page-links'
import useIsMerchant from '@/common/hooks/useIsMerchant'
import { useUser } from '@/common/contexts/UserContext'

const BecomeAMerchant = () => {
    const {isMerchant, isLoading} = useIsMerchant()
    const{indexerUrl} = useContracts();
    const router = useRouter()
    const { openConnectModal } = useConnectModal()
    const {session} = useUser();
    const { showModal, hideModal } = useModal()
    const [isMounted, setIsMounted] = useState(false);
    
    const isAuthenticated = session?.status === "authenticated";

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // const address: any = "0x8db769ccd2f5946a94fce8b3ad9a296d5309c36c"

    // const { data: account, error, isLoading, isError, isFetching } = useQuery({
    //     queryKey: ['merchantAccount', indexerUrl, address],
    //     queryFn: () => fetchAccount(indexerUrl, address),
    //     enabled: !!address,
    //     retry: 1,
    //     refetchOnWindowFocus: false,
    // })

    // const isMerchant = account?.account?.isMerchant || false

    const handleClick = useCallback(() => {
        if (!isAuthenticated) {
            openConnectModal?.()
            return
        }

        if (isMerchant) {
            router.push(POST_AD_PAGE)
            return
        }

        const content = <MerchantModal hideModal={hideModal} action="stake" />

        showModal(content)

    }, [isAuthenticated, isMerchant, showModal, hideModal])
    

    return (
        <Button
            text={isMerchant ? 'Post an Ad' : 'Become a Merchant'}
            icon={isMerchant ? '/images/icons/add-circle.png' : '/images/icons/export.svg'}
            iconPosition="right"
            className="bg-black text-white hover:bg-gray-600"
            onClick={handleClick}
            loading={isLoading}
        />
    )
}

export default BecomeAMerchant

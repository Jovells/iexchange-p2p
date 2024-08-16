import React from 'react'
import Button from '../ui/Button'
import { useModal } from '@/common/contexts/ModalContext';
import MerchantModal from './MerchantModal';

const BecomeAMerchant = () => {
    const { showModal, hideModal } = useModal()
    const isConnected = false;
    const isVerified = false;
    const isMerchant = false;

    const handleClick = () => {
        if (!isConnected) {
            //handle connect wallet
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
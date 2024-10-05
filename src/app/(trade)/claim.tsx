import { useModal } from '@/common/contexts/ModalContext';
import { useUser } from '@/common/contexts/UserContext';
import ClaimModal from '@/components/modals/ClaimModal';
import Button from '@/components/ui/Button';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import React from 'react'

interface Props{
    className:string;
}
const claim:React.FC<Props> = ({className}) => {
    const { isConnected } = useUser();
    const { openConnectModal } = useConnectModal();
    const { showModal, hideModal } = useModal();

    const showClaimModal = () => {
        if (isConnected) {
            const modal = <ClaimModal />;
            showModal(modal);
        } else {
            openConnectModal?.();
        }
    };
    return (
        <Button
            text="Faucet"
            onClick={showClaimModal}
            className={`bg-gradient-to-r transition duration-300 bg-[#01A2E4] hover:bg-[#0191C8] text-white rounded-xl px-4 py-2 font-bold shadow-lg  border-blue-300 dark:border-blue-600 ${className}`}
            // className={`bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-xl px-4 py-2 font-bold shadow-lg hover:from-yellow-500 hover:to-yellow-700 border border-yellow-300 dark:border-yellow-600 ${className}`}
        />
    )
}

export default claim
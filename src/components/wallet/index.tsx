import React, { Fragment, useEffect } from 'react';
import ConnectWallet from '../ui/Button';
import Image from 'next/image';
import { useAccount, useDisconnect } from 'wagmi';
import { shortenAddress } from '@/lib/utils';
import { useModal } from '@/common/contexts/ModalContext';

const WalletConnect = () => {
    const { address: walletAddress, isConnected } = useAccount();
    const { disconnect, isPending } = useDisconnect();
    const { showModal, hideModal } = useModal();

    useEffect(() => {
        if (isPending) {
            showModal(
                <div>loading...</div>
            )
        } else {
            hideModal()
        }
    }, [disconnect, isPending])

    return (
        <Fragment>
            {isConnected ? (
                <div className="flex justify-between items-center space-x-2 text-black py-2">
                    <span>{shortenAddress(walletAddress)}</span>
                    <div onClick={() => disconnect()}>
                        <Image
                            src="/images/icons/disconnect.png"
                            alt="Disconnect"
                            width={30}
                            height={30}
                            className="cursor-pointer"
                        />
                    </div>
                </div>
            ) : (
                // <ConnectWallet
                //     text="Connect Wallet"
                //     icon="/images/icons/export.svg"
                //     iconPosition="right"
                //     className="bg-[#000000] text-white hover:bg-gray-600 rounded-xl px-4 py-2"
                // />
                <w3m-button />
            )}
        </Fragment>
    );
};

export default WalletConnect;

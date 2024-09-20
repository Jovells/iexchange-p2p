import React, { Fragment, useEffect, useLayoutEffect } from 'react';
import Image from 'next/image';
import { useAccount, useDisconnect } from 'wagmi';
import { shortenAddress } from '@/lib/utils';
import { useModal } from '@/common/contexts/ModalContext';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { useUser } from '@/common/contexts/UserContext';




const WalletConnect = () => {
    const { address: walletAddress } = useAccount();
    const {session } = useUser();
    const { disconnect, isPending } = useDisconnect();
    const { showModal, hideModal } = useModal();


//sign out
    useEffect(() => {
        if (isPending) {
            showModal(
                <div>loading...</div>
            )
        } else {
            hideModal()
        }
    }, [isPending])



    return (
        <Fragment>
            {session.status === "authenticated" ? (
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
                <ConnectButton/>
            )}
        </Fragment>
    );
};

export default WalletConnect;

import React, { Fragment, useEffect, useLayoutEffect } from 'react';
import Image from 'next/image';
import { useDisconnect } from "wagmi";
import { shortenAddress } from '@/lib/utils';
import { useModal } from '@/common/contexts/ModalContext';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useUser } from '@/common/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { HOME_PAGE } from '@/common/page-links';




const WalletConnect = () => {
    const { session, address: walletAddress, signUserOut } = useUser();
    const { disconnect, isPending } = useDisconnect();
    const { showModal, hideModal } = useModal();
    const router = useRouter();

    function handleDisconnect() {
      console.log("Disconnecting...");
      router.push(HOME_PAGE);
      signUserOut();
    }


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
        {walletAddress ? (
          <div className="justify-between items-center space-x-2 text-black dark:text-white py-2 hidden">
            <span>{shortenAddress(walletAddress)}</span>
            <div onClick={() => handleDisconnect()}>
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
          <ConnectButton />
        )}
      </Fragment>
    );
};

export default WalletConnect;

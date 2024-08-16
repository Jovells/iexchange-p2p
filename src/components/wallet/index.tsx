import React, { Fragment } from 'react';
import ConnectWallet from '../ui/Button';
import Image from 'next/image';

const WalletConnect = () => {
    const isConnected = false;
    const walletAddress = '0xAbCdEf...1234';

    return (
        <Fragment>
            {isConnected ? (
                <div className="flex justify-between items-center space-x-2 text-black py-2">
                    <span>{walletAddress}</span>
                    <Image
                        src="/images/icons/disconnect.png"
                        alt="Disconnect"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                        onClick={() => console.log('Disconnect wallet logic here')}
                    />
                </div>
            ) : (
                <ConnectWallet
                    text="Connect Wallet"
                    icon="/images/icons/export.svg"
                    iconPosition="right"
                    className="bg-[#000000] text-white hover:bg-gray-600 rounded-xl px-4 py-2"
                />
            )}
        </Fragment>
    );
};

export default WalletConnect;

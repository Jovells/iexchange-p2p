import React, { useEffect, useState } from 'react';
import WalletConnect from '../wallet';
import { useAccount } from 'wagmi';

const WalletConnectSection: React.FC = () => {
    const { isConnected } = useAccount();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || isConnected) {
        return null;
    }

    return (
        <div className="min-h-[300px] flex justify-center items-center">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4">
                    Onchain <span className="gradient-text">P2P</span> Trading Platform
                </h1>
                <p className="text-lg md:text-sm lg:text-xl mb-8">
                    Convert Crypto to Fiat | Fiat to Crypto in your decentralized wallet with iExchange.
                </p>
                <WalletConnect />
            </div>
        </div>
    );
};

export default WalletConnectSection;

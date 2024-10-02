import React, { useEffect, useState } from 'react';
import WalletConnect from "../wallet";
import { useUser } from '@/common/contexts/UserContext';

const WalletConnectSection: React.FC = () => {
    const { session } = useUser();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || session?.status === "authenticated") {
        return null;
    }

    return (
        <div className="min-h-[300px] flex justify-center items-center">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-4xl lg:text-[70px] font-[600px] mb-4 text-[#111315]">
                    Onchain <span className="gradient-text">P2P</span> Trading Platform
                </h1>
                <p className="text-lg text-[#3D4651] lg:text-[16px] font-[600px] mb-8">
                    Convert Crypto to Fiat | Fiat to Crypto in your decentralized wallet with iExchange.
                </p>
                <WalletConnect />
            </div>
        </div>
    );
};

export default WalletConnectSection;

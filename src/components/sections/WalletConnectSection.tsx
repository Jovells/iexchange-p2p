import React, { useEffect, useState } from 'react';
import WalletConnect from "../wallet";
import { useUser } from '@/common/contexts/UserContext';
import NetworkSwitcher from '../networkSwitcher';
import Claim from '@/app/(trade)/claim';

const WalletConnectSection: React.FC = () => {
    const { isConnected } = useUser();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);
    if (!isMounted) {
      return null;
    }

    // if (!isMounted || session?.status === "authenticated") {
    //     return null;
    // }

    return (
      <div className="min-h-[300px] flex justify-center items-center">
        <div className="flex flex-col items-center text-center py-10 lg:py-20">
          <h1 className="text-4xl lg:text-[54px] font-semibold mb-6 text-[#111315] dark:text-white">
            Onchain <span className="gradient-text">P2P</span> Trading Platform
          </h1>
          <p className="text-lg text-[#586d86] lg:text-[16px]  mb-8 dark:text-gray-300">
            Convert Crypto to Fiat | Fiat to Crypto in your decentralized wallet with iExchange.
          </p>
          <div className="flex flex-row item-center gap-4">
            {isConnected && (
              <>
                <Claim className="w-[150px] hidden lg:block" />
                <div className="">
                  <NetworkSwitcher />
                </div>
              </>
            )}
          </div>
          <WalletConnect />
        </div>
      </div>
    );
};

export default WalletConnectSection;

import React from 'react'
import WalletConnect from '../wallet';
import { useAccount } from 'wagmi';

const WalletConnectSection = () => {
    const { isConnected } = useAccount();
    // const isConnected = false;
    if (isConnected) {
        return null;
    }
    return (
        <div className='min-h-[300px] flex justify-center items-center'>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 text-center">
                    Onchain <span className='gradient-text '>P2P</span> Trading Platform
                </h1>
                <p className="text-lg md:text-xs lg:text-xl mb-8 text-center">
                    Convert Crypto to Fiat | Fiat to Crypto in your decentralized wallet with iExchange.
                </p>
                <WalletConnect />
            </div>
        </div>
    )
}

export default WalletConnectSection
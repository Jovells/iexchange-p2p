'use client'

import { createContext, useContext, ReactNode, FC, useState, useEffect } from "react";
import { useChainId, useChains, useSwitchChain } from "wagmi";
import contracts, { NetworkContractsConfig, TokenContract } from "../contracts";
import { Chain } from "viem";
import { chains } from "../configs";


interface ContractsContextType {
  p2p: NetworkContractsConfig["p2p"];
  faucet: NetworkContractsConfig["faucet"];
  tokens: TokenContract[];
  indexerUrl: string;
  currentChain: Chain | undefined | null;
  isCorrectChain: boolean
}



export const ContractsContext = createContext<ContractsContextType | undefined>(
  undefined
);

export const useContracts = () => {
  const context = useContext(ContractsContext);
  if (!context) {
    throw new Error("useContracts must be used within a UserProvider");
  }
  return context;
};

export const ContractsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const chainId = useChainId();
  const [currentChainId, setCurrentChainId] = useState(chainId);
  const currentChain = chains.find((chain) => chain.id === currentChainId) || null;
  const p2p = contracts[currentChain?.id || chains[0].id].p2p;
  const tokens = contracts[currentChain?.id || chains[0].id].tokens;
  const indexerUrl = contracts[currentChain?.id || chains[0].id].indexerUrl;
  const faucet = contracts[currentChain?.id || chains[0].id].faucet;
  const isCorrectChain = !!currentChain;


  useEffect(() => {
    window.ethereum?.on("chainChanged", (newChainId: string) => {
      console.log("chainChanged", newChainId);
      console.log("chainChanged", newChainId, Number(newChainId));
      setCurrentChainId(Number(newChainId));
    });
    return () =>{}
   }, [])

   useEffect(() => {
    setCurrentChainId(chainId)
   }, [chainId])
 

  console.log('chainIdwagmi', indexerUrl)



  return (
    <ContractsContext.Provider value={{ p2p, faucet, tokens, indexerUrl, currentChain, isCorrectChain }}>
      {children}
    </ContractsContext.Provider>
  );
};
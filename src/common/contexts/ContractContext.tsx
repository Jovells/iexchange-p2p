'use client'

import { createContext, useContext, ReactNode, FC, useState, useEffect } from "react";
import { useChainId, useChains } from "wagmi";
import contracts, { NetworkContractsConfig, TokenContract } from "../contracts";
import { Chain } from "viem";


interface ContractsContextType {
  p2p: NetworkContractsConfig["p2p"];
  faucet: NetworkContractsConfig["faucet"];
  tokens: TokenContract[];
  indexerUrl: string;
  currentChain: Chain
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
  const chains = useChains();
  const currentChain = chains.find((chain) => chain.id === chainId) as Chain;
  const p2p = contracts[chainId].p2p;
  const tokens = contracts[chainId].tokens;
  const indexerUrl = contracts[chainId].indexerUrl;
  const faucet = contracts[chainId].faucet;

  return (
    <ContractsContext.Provider value={{ p2p, faucet, tokens, indexerUrl, currentChain }}>
      {children}
    </ContractsContext.Provider>
  );
};
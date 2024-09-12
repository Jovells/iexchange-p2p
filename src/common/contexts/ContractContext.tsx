'use client'

import { createContext, useContext, ReactNode, FC, useState, useEffect } from "react";
import { useChainId } from "wagmi";
import contracts, { NetworkContractsConfig, TokenContract } from "../contracts";


interface ContractsContextType {
  p2p: NetworkContractsConfig["p2p"];
  tokens: TokenContract[];
  indexerUrl: string;
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
  const chain = useChainId();
  const p2p = contracts[chain].p2p;
  const tokens = contracts[chain].tokens;
  const indexerUrl = contracts[chain].indexerUrl;

  return (
    <ContractsContext.Provider value={{ p2p, tokens, indexerUrl }}>
      {children}
    </ContractsContext.Provider>
  );
};
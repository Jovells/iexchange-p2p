'use client'

import React, { ReactNode } from 'react'
import { config, projectId } from '@/common/configs'
import QueryProvider  from './QueryProvider'

import { State, WagmiProvider } from 'wagmi';
import { UserProvider } from './UserContext';
import { ContractsProvider } from './ContractContext';
import dynamic from "next/dynamic";
import AlchemyProvider from "./Alchemy";

const ChatProvider = dynamic(() => import("./XMTPContext"), { ssr: false });

if (!projectId) throw new Error("Project ID is not defined");

export default function WalletProvider({
  children,
  initialState,
  alchemyInitialState,
}: {
  children: ReactNode;
  initialState?: State;
  alchemyInitialState: any;
}) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryProvider>
        <AlchemyProvider initialState={alchemyInitialState}>
          <UserProvider>
            <ContractsProvider>
              <ChatProvider>{children}</ChatProvider>
            </ContractsProvider>
          </UserProvider>
        </AlchemyProvider>
      </QueryProvider>
    </WagmiProvider>
  );
}
'use client'

import React, { ReactNode } from 'react'
import { config, projectId } from '@/common/configs'
import QueryProvider  from './QueryProvider'

import { State, WagmiProvider } from 'wagmi';
import { UserProvider } from './UserContext';
import { ContractsProvider } from './ContractContext';
import dynamic from "next/dynamic";

const ChatProvider = dynamic(() => import("./XMTPContext"), { ssr: false });



if (!projectId) throw new Error('Project ID is not defined')


export default function WalletProvider({
  children,
  initialState
}: {
  children: ReactNode
  initialState?: State
}) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryProvider>
        <UserProvider>
          <ContractsProvider>
            <ChatProvider>{children}</ChatProvider>
          </ContractsProvider>
        </UserProvider>
      </QueryProvider>
    </WagmiProvider>
  );
}
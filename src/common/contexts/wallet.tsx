'use client'

import React, { ReactNode } from 'react'
import { config, projectId } from '@/common/configs'
import QueryProvider  from './QueryProvider'

import { State, WagmiProvider } from 'wagmi';

import {RainbowKitProvider, darkTheme} from '@rainbow-me/rainbowkit' 
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { UserProvider } from './UserContext';
import { ContractsProvider } from './ContractContext';



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
      <RainbowKitSiweNextAuthProvider>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#000000',
          // accentColorForeground: '#',
          borderRadius: 'medium',
          fontStack: "system"
        })}>
          <ContractsProvider>
        {children}
          </ContractsProvider>
        </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
        </UserProvider>
        </QueryProvider>
    </WagmiProvider>
  )
}
'use client'

import React, { ReactNode } from 'react'
import { config, projectId } from '@/common/configs'
import QueryProvider  from './QueryProvider'

import { State, WagmiProvider } from 'wagmi';

import {RainbowKitProvider, darkTheme} from '@rainbow-me/rainbowkit' 


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
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#000000',
          // accentColorForeground: '#',
          borderRadius: 'medium',
          fontStack: "system"
        })}>
        {children}
        </RainbowKitProvider>
        </QueryProvider>
    </WagmiProvider>
  )
}
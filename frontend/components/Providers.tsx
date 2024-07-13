'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Web3AuthProvider } from '@web3auth/modal-react-hooks'
import { web3AuthContextConfig } from '@/lib/web3auth/web3AuthProviderProps'

const queryClient = new QueryClient()

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <Web3AuthProvider config={web3AuthContextConfig}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
      </Web3AuthProvider>
    </NextThemesProvider>
  )
}

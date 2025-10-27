import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';

export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    farcasterMiniApp()
  ]
});

// USDC contract on Base - Mainnet
export const USDC_CONTRACT = {
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const,
  decimals: 6,
  symbol: 'USDC',
};
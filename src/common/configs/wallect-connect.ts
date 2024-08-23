import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import {
  base,
  baseSepolia,
  mainnet,
  morphHolesky,
  polygon,
  sepolia,
} from "wagmi/chains";

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.WEB3_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

export const metadata = {
  name: "AppKit",
  description: "AppKit Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create wagmiConfig
const mHolesky = {
  ...morphHolesky,
  rpcUrls: {
    default: {
      http: ["https://rpc-holesky.morphl2.io"],
    },
  },
};
const chains = [mHolesky] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  auth: {
    email: true, // default to true
    socials: ["google", "x", "github", "discord", "apple", "facebook"],
    showWallets: true, // default to true
    walletFeatures: true, // default to true
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

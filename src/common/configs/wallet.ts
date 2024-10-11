import { cookieStorage, createStorage } from "wagmi";
import {
  morphHolesky,
  kakarotSepolia,
} from "wagmi/chains";
import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.WEB3_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

// Create wagmiConfig
const mHolesky = {
  ...morphHolesky,
  rpcUrls: {
    default: {
      http: ["https://rpc-holesky.morphl2.io"],
    },
  },
};
const kSepolia = {
  ...kakarotSepolia,
  id: 920637907288165,
  rpcUrls: {
    default: {
      http: ["https://sepolia-rpc.kakarot.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "BlockScout",
      url: " https://blockscout-kkrt-sepolia.karnot.xyz/",
    },
  },
} satisfies Chain;

const isProd = process.env.NODE_ENV === "production";
export const chains = isProd ? ([mHolesky] as const) : ([mHolesky, kSepolia] as const);
export const config = getDefaultConfig({
  appName: "IExchange",
  chains,
  projectId,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

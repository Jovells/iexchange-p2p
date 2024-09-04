import { cookieStorage, createStorage } from "wagmi";
import {
  base,
  baseSepolia,
  mainnet,
  morphHolesky,
  polygon,
  sepolia,
} from "wagmi/chains";
import { getDefaultConfig } from '@rainbow-me/rainbowkit';


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
const chains = [mHolesky] as const;
export const config = getDefaultConfig({
  appName: "IExchange",
  chains,
  projectId,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

import { Config, cookieStorage, createConfig, createConnector, createStorage } from "wagmi";
import { connectorsForWallets, Wallet } from "@rainbow-me/rainbowkit";
import { morphHolesky, kakarotSepolia } from "wagmi/chains";
import { injectedWallet, metaMaskWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { HOME_PAGE } from "../page-links";
import { createClient, http } from "viem";

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.WEB3_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const customMetamaskWallet = metaMaskWallet({ projectId });
const oldMobileGetUri = customMetamaskWallet.mobile!.getUri;

const newMobileGetUri = (uri: string) => {
  if (window?.ethereum) {
    return oldMobileGetUri?.(uri) as string;
  }
  /**
   * if the user is in the metamask browser, return a custom uri
   */
  return "https://metamask.app.link/dapp/" + location.origin + HOME_PAGE;
};

customMetamaskWallet.mobile!.getUri = newMobileGetUri;

const metaMaskWalletConnector = ({ projectId }: { projectId: string }): Wallet => customMetamaskWallet;

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [injectedWallet, metaMaskWalletConnector, walletConnectWallet],
    },
  ],
  {
    appName: "My RainbowKit App",
    projectId: "YOUR_PROJECT_ID",
  },
);

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
export const dconfig = getDefaultConfig({
  appName: "IExchange",
  chains,
  projectId,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export const cconfig = createConfig({
  ssr: true,

  chains,
  connectors,
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});

export const config: Config = dconfig;

console.log("qk config", config);

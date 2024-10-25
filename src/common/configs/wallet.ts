import { Config, cookieStorage, createConfig, createConnector, createStorage } from "wagmi";
import { connectorsForWallets, Wallet } from "@rainbow-me/rainbowkit";
import { morphHolesky, kakarotSepolia } from "wagmi/chains";
import { injectedWallet, metaMaskWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { HOME_PAGE, HOME_PAGE_ALT } from "../page-links";
import { createClient, http } from "viem";

// Get projectId from https://cloud.walletconnect.com
export const projectId = "3a04d38134c46085917b81c1494b1716";

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
  return "https://metamask.app.link/dapp/" + HOME_PAGE_ALT;
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
export const chains = isProd ? ([mHolesky] as const) : ([mHolesky] as const);
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
  chains,
  connectors,
  transports: {
    [mHolesky.id]: http(),
    [kSepolia.id]: http(),
  },
});

export const config: Config = cconfig;

console.log("qk config", config);

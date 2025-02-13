import { AlchemyAccountsUIConfig, cookieStorage, createConfig } from "@account-kit/react";
import { sepolia, alchemy, arbitrumSepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      [{ type: "email" }],
      [
        { type: "passkey" },
        { type: "social", authProviderId: "google", mode: "popup" },
        { type: "social", authProviderId: "facebook", mode: "popup" },
      ],
      [{ type: "external_wallets", walletConnect: { projectId: "your-project-id" } }],
    ],
    addPasskeyOnSignup: true,
  },
  supportUrl: "https://t.me/iExchangeCommunity",
};

export const config = createConfig(
  {
    // if you don't want to leak api keys, you can proxy to a backend and set the rpcUrl instead here
    // get this from the app config you create at https://dashboard.alchemy.com/accounts?utm_source=demo_alchemy_com&utm_medium=referral&utm_campaign=demo_to_dashboard
    transport: alchemy({ apiKey: process.env.ALCHEMY_API_KEY! }),
    chain: arbitrumSepolia,
    ssr: true, // set to false if you're not using server-side rendering
    enablePopupOauth: true,
    storage: cookieStorage,
  },
  uiConfig,
);

export const queryClient = new QueryClient();

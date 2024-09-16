import "@/styles/globals.css";
import "@/styles/custom.css";
import { WalletProvider } from "@/common/contexts";
import ModalManager from "@/components/shared/modal/Modal";
import { ModalContextProvider } from "@/common/contexts/ModalContext";
import { auth } from "../auth";
import { SessionProvider } from "next-auth/react";
import TopLoader from "@/components/loader/TopLoader";
import { Metadata } from "next/types";
import { Inter } from "next/font/google";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: "/images/logo/iexchange-logo.png", // Adjusted to a relative path
  title: "iExchange P2P || Onchain P2P Trading Platform",
  description:
    "Convert Crypto to Fiat | Fiat to Crypto in your decentralized wallet with iExchange.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure `auth` function is server-side compatible
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <TopLoader />
          <SessionProvider refetchInterval={0} session={session}>
            <WalletProvider>
              <ModalContextProvider>
                <Toaster/>
                {children}
                <ModalManager />
              </ModalContextProvider>
            </WalletProvider>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

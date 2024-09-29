import "@/styles/globals.css";
import "@/styles/custom.css";
import { WalletProvider } from "@/common/contexts";
import ModalManager from "@/components/shared/modal/Modal";
import { ModalContextProvider } from "@/common/contexts/ModalContext";
import TopLoader from "@/components/loader/TopLoader";
import { Metadata } from "next/types";
import { Inter, Roboto } from "next/font/google";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ['100', '300', '400', '500', '700', '900'],
  display: "swap"
});

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

  return (
    <html lang="en">
      <body className={roboto.className}>
        <ErrorBoundary>
          <TopLoader />
          <WalletProvider>
            <ModalContextProvider>
              <Toaster />
              {children}
              <ModalManager />
            </ModalContextProvider>
          </WalletProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

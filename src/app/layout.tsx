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
import { ThemeProvider } from "@/common/contexts/ThemeProvider";
import { Suspense } from "react";
import PostAd from "./(trade)/postAd";
import ScrollToTopOnPageChange from "@/components/layout/ScrollToTop";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ['100', '300', '400', '500', '700', '900'],
  display: "swap",
});

export const metadata: Metadata = {
  icons: "/images/logo/iexchange-logo.png",
  title: "iExchange P2P || Onchain P2P Trading Platform",
  description:
    "Convert Crypto to Fiat | Fiat to Crypto in your decentralized wallet with iExchange.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.className} bg-white dark:bg-[#14161B]`}>
        <ErrorBoundary>
          <ThemeProvider>
            <TopLoader />
            <WalletProvider>
              <ModalContextProvider>
                <Toaster />
                <Suspense fallback={<TopLoader />}>
                  {children}
                  {/* <PostAd className="block lg:hidden" text="Post Ad" /> */}
                </Suspense>
                <ModalManager />
                <ScrollToTopOnPageChange />
              </ModalContextProvider>
            </WalletProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

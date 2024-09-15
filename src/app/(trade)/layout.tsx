// import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/custom.css";
import MainNav from "@/components/layout/navbar";
import SubNav from "@/components/layout/navbar/SubNav";
import Footer from "@/components/layout/footer";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "iExchange P2P || Onchain P2P Trading Platform",
//   description:
//     "Convert Crypto to Fiat | Fiat to Crypto in your decentralized wallet with iExchange.",
// };

export default function TradeLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  
  return (
    <>
      <MainNav />
      <SubNav />
      <div className="w-full min-h-screen">
        {children}
      </div>
      <Footer />
    </>
  );
}

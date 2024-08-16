import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/custom.css";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "iExchange P2P || Onchain P2P Trading Platform",
    description: "Convert Crypto to Fiat | Fiat to Crypto in your decentralized wallet with iExchange.",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body >{children}</body>
        </html>
    );
}

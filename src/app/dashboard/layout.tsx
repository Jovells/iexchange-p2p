import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/custom.css";
import MainNav from "@/components/layout/navbar";
import { ModalContextProvider } from "@/common/contexts/ModalContext";
import ModalManager from "@/components/shared/modal/Modal";
import SideNav from "@/components/layout/SideNav";
import Footer from "@/components/layout/footer";

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
            <body className="flex flex-col min-h-screen">
                <ModalContextProvider>
                    <MainNav />
                    <div className="flex flex-1 border-t p-10 pr-6">
                        <SideNav />
                        <div className="flex-1 p-4 px-10 pr-0">
                            {children}
                        </div>
                    </div>
                    <ModalManager />
                    <Footer />
                </ModalContextProvider>
            </body>
        </html>
    );
}

'use client'

import "@/styles/globals.css";
import "@/styles/custom.css";
import MainNav from "@/components/layout/navbar";
import { ModalContextProvider } from "@/common/contexts/ModalContext";
import ModalManager from "@/components/shared/modal/Modal";
import SideNav from "@/components/layout/SideNav";
import Footer from "@/components/layout/footer";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };


    return (
        <div className="flex flex-col min-h-screen">
            <ModalContextProvider>
                <MainNav />
                <div className="lg:hidden px-4 py-2 bg-white text-gray-600 border-t">
                    <button onClick={toggleDrawer} className="text-gray-600 flex items-center">
                        <Menu className="mr-2 h-10 w-10" />
                    </button>
                </div>
                <div className="flex flex-1 border-t p-0 pt-0 lg:pt-6">
                    <SideNav isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
                    <div className="flex-1 p-6">
                        {children}
                    </div>
                </div>
                <ModalManager />
                <Footer />
            </ModalContextProvider>
        </div>
    );
}

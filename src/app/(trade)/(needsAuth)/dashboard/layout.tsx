'use client'

import "@/styles/globals.css";
import "@/styles/custom.css";
import MainNav from "@/components/layout/navbar";
import { ModalContextProvider } from "@/common/contexts/ModalContext";
import ModalManager from "@/components/shared/modal/Modal";
import SideNav from "@/components/layout/SideNav";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import SubNav from "@/components/layout/navbar/SubNav";
import { useUser } from "@/common/contexts/UserContext";
import NetworkSwitcher from "@/components/networkSwitcher";
import Loader from "@/components/loader/Loader"; 

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { session } = useUser();

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    useEffect(() => {
        const loadContent = async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsLoading(false);
        };

        loadContent();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Loader />
            </div>
        );
    }
    return (
        <ModalContextProvider>
            <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
                <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#14161B] border-b border-gray-300 dark:border-gray-800">
                    <MainNav />
                    <SubNav />
                </div>
                <div className="pt-[110px]">
                    <div className="lg:hidden px-4 py-2 bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-200 flex flex-row justify-between items-center">
                        <button onClick={toggleDrawer} className="text-gray-600 dark:text-gray-200 flex items-center">
                            <Menu className="mr-2 h-10 w-10" />
                        </button>
                        {session.status === "authenticated" && (
                            <div className="">
                                <NetworkSwitcher />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-row flex-1 p-0 pt-0 lg:pt-0">
                        <SideNav isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
                        <div className="flex-1 p-6 h-screen bg-white dark:bg-gray-800 overflow-y-auto pl-6 lg:pl-[280px]">
                            {children}
                        </div>
                    </div>
                </div>
                <ModalManager />
            </div>
        </ModalContextProvider>
    );
}

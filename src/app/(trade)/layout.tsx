'use client'

import "@/styles/globals.css";
import "@/styles/custom.css";
import MainNav from "@/components/layout/navbar";
import SubNav from "@/components/layout/navbar/SubNav";
import Footer from "@/components/layout/footer";
import Loader from "@/components/loader/Loader";
import { useState, useEffect } from "react";

const TradeLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); // Simulating load time

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative min-h-screen flex flex-col">
            {isLoading ? (
                <Loader loaderType="spinner" className="h-screen" />
            ) : (
                <>
                    {/* Navbar Section */}
                    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#14161B] border-b border-gray-300 dark:border-gray-800">
                        <MainNav />
                        <SubNav />
                    </div>
                    
                    {/* Main Content Section */}
                    <div className="flex-grow pt-[100px] px-4">
                        {children}
                    </div>
                    
                    {/* Footer Section */}
                    <Footer />
                </>
            )}
        </div>
    );
}

export default TradeLayout;

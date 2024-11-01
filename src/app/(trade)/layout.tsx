'use client'

import "@/styles/globals.css";
import "@/styles/custom.css";
import MainNav from "@/components/layout/navbar";
import SubNav from "@/components/layout/navbar/SubNav";
import Footer from "@/components/layout/footer";
import Loader from "@/components/loader/Loader";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const TradeLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [isLoading, setIsLoading] = useState(true);
    const path = usePathname()

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setIsLoading(false);
    //     }, 1000);

    //     return () => clearTimeout(timer);
    // }, []);

    return (
      <div className="relative min-h-screen flex flex-col">
        {/* {isLoading ? (
          <Loader loaderType="spinner" className="h-screen" />
        ) : ( */}
          <>
            <div className="fixed top-0 left-0 right-0 z-50 border-b border-gray-300 dark:border-gray-800 bg-white dark:bg-[#14161B]">
              <MainNav />
              <SubNav />
            </div>

            {<div className={`lex-grow pt-[100px] ${path.includes("dashboard") && "pr-0 lg:pr-6 pl-0 lg:pl-[260px]"}`}>{children}</div>}
            {!path.includes("dashboard") && <Footer />}
          </>
        {/* )} */}
      </div>
    );
}

export default TradeLayout;

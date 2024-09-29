import "@/styles/globals.css";
import "@/styles/custom.css";
import MainNav from "@/components/layout/navbar";
import SubNav from "@/components/layout/navbar/SubNav";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";
import Loader from "@/components/loader/Loader";

const TradeLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <Suspense fallback={<Loader loaderType="text" className="h-screen" />}>
            <div className="fixed top-0 left-0 right-0 z-50 bg-white">
                <MainNav />
                <SubNav />
            </div>
            <div className="w-full min-h-screen mt-[100px]"> {/* Adjust the margin-top based on the heights of MainNav and SubNav */}
                {children}
            </div>
            <Footer />
        </Suspense>
    );
}

export default TradeLayout;

import "@/styles/globals.css";
import "@/styles/custom.css";
import MainNav from "@/components/layout/navbar";
import SubNav from "@/components/layout/navbar/SubNav";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";
import Loader from "@/components/loader/Loader";

const TradeLayout = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {

    return (
        <Suspense fallback={<Loader loaderType="text" className="h-screen" />}>
            <MainNav />
            <SubNav />
            <div className="w-full min-h-screen">
                {children}
            </div>
            <Footer />
        </Suspense>
    );
}

export default TradeLayout

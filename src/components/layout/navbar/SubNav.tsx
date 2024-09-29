'use client'
import { OrdersDropdown } from './OrdersDropdown';
import IsVerifiedButton from "@/components/ui/IsVerifiedButton";
import MenuDropdown from "../../ui/MenuDropdown";
import Link from 'next/link';
import WalletConnect from "@/components/wallet";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { DASHBOARD_PAGE, MY_ADS_PAGE, ORDER_HISTORY_PAGE } from "@/common/page-links";
import useIsMerchant from "@/common/hooks/useIsMerchant";
import { useUser } from '@/common/contexts/UserContext';
import { useRouter } from 'next/navigation';

const menuLinks = [
    { href: "/", label: "P2P" },
    { href: "/appeal", label: "Appeals" },
    { href: MY_ADS_PAGE, label: "My Ads" } // should on be visible to merchants
];
const accountLinks = [
    { link: DASHBOARD_PAGE, icon: "/images/icons/home.png", label: "Dashboard" },
    { link: ORDER_HISTORY_PAGE, icon: "/images/icons/clock.png", label: "Order History" },
    { link: "/profile", icon: "/images/icons/profile-circle.png", label: "Profile" },
    { link: "/settings", icon: "/images/icons/settings.png", label: "Settings" }
];

const helpCenterLinks = [
    { link: "/buy-sell", label: "How to Buy/Sell" },
    { link: "/place-order", label: "Placing and Order" },
    { link: "/becoming-merchant", label: "How to be a Merchant" },
    { link: "/becoming-settler", label: "How to be a settler" }
];


const SubNav = () => {
    const navigate = useRouter()

    const { session } = useUser();
    const [isMounted, setIsMounted] = useState(false);
    const { isMerchant, isLoading } = useIsMerchant()

    const isAuthenticated = session?.status === "authenticated";


    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || !isAuthenticated) {
        return null;
    }

    const renderLinks = (links: { href: string; label: string }[]) => (
        links.map(link => (
            <Link
                key={link.href}
                href={link.href}
                className={`text-[#111315] hover:text-[#01A2E4] text-[14px] font-[500px] block px-2 py-2  ${link.label === "My Ads" && !isMerchant ? "hidden" : "flex"}`}
            >
                {link.label}
            </Link>
        ))
    );

    const renderMenuDropdowns = () => (
        <div className="flex flex-row">
            <MenuDropdown
                title="Help Center"
                icon="/images/icons/message.svg"
                dropdownItems={helpCenterLinks}
            />
            <MenuDropdown
                title="Orders"
                icon="/images/icons/orders.svg"
                dropdownItems={[]}
                onClick={() => navigate.push("/dashboard/history/orders")}
            >
                <div className="min-w-[500px] rounded-[8px]">
                    <OrdersDropdown />
                </div>
            </MenuDropdown>
            <MenuDropdown
                title="Account"
                icon="/images/icons/profile.svg"
                dropdownItems={isAuthenticated ? accountLinks : []}
            >
                <div className="p-4 border border-gray-200 border-b-0">
                    <WalletConnect />
                    {isAuthenticated && <IsVerifiedButton />}
                </div>
            </MenuDropdown>
        </div>
    );

    return (
        <div className="border-b mt-0 lg:mt-2 mb-0">
            <div className="w-full lg:container lg:mx-auto flex flex-row justify-between items-center px-2 lg:px-0">
                <div className="flex flex-row ">
                    {renderLinks(menuLinks)}
                </div>
                {renderMenuDropdowns()}
            </div>
        </div>
    )
}

export default SubNav
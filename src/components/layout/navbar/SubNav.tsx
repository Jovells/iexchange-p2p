'use client'

import IsVerifiedButton from "@/components/ui/IsVerifiedButton";
import MenuDropdown from "../../ui/MenuDropdown";
import Link from 'next/link';
import WalletConnect from "@/components/wallet";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { DASHBOARD_PAGE, MY_ADS_PAGE, ORDER_HISTORY_PAGE } from "@/common/page-links";

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

const items = [
    { label: "Item 1", value: "Description of item 1" },
    { label: "Item 2", value: "Description of item 2" },
    { label: "Item 3", value: "Description of item 3" },
    { label: "Item 4", value: "Description of item 4" },
    { label: "Item 5", value: "Description of item 5" },
    { label: "Item 6", value: "Description of item 6" },
];

const renderLinks = (links: { href: string; label: string }[]) => (
    links.map(link => (
        <Link
            key={link.href}
            href={link.href}
            className="text-[#111315] hover:text-[#01A2E4] font-roboto font-medium text-sm leading-5 tracking-widest block px-2 py-2 rounded-md text-base"
        >
            {link.label}
        </Link>
    ))
);

const SubNav = () => {

    const { isConnected } = useAccount();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || !isConnected) {
        return null;
    }

    const renderMenuDropdowns = () => (
        <div className="flex flex-row">
            <MenuDropdown
                title="Help Center"
                icon="/images/icons/message.png"
                dropdownItems={helpCenterLinks}
            />
            <MenuDropdown
                title="Orders"
                icon="/images/icons/orders.png"
                dropdownItems={[]}
            >
                <div className="w-[400px] p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item, index) => (
                        <div key={index} className="border-b p-4">
                            <h3 className="text-lg font-semibold">{item.label}</h3>
                            <p className="text-gray-600">{item.value}</p>
                        </div>
                    ))}
                </div>
            </MenuDropdown>
            <MenuDropdown
                title="Account"
                icon="/images/icons/profile.png"
                dropdownItems={isConnected ? accountLinks : []}
            >
                <WalletConnect />
                {isConnected && <IsVerifiedButton />}
            </MenuDropdown>
        </div>
    );

    return (
        <div className="border-b mt-0 lg:mt-4 mb-0">
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
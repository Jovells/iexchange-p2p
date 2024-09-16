'use client'

import { ChevronDown, ChevronRight, Clock, Home, Settings, User, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

const navItems = [
    {
        title: "Home",
        icon: <Home />,
        link: "/dashboard",
        children: [],
    },
    {
        title: "Order History",
        icon: <Clock />,
        link: "/history",
        children: [
            { title: "P2P Orders", link: "/dashboard/history/orders" },
            { title: "Transactions", link: "/dashboard/history/transactions" },
            { title: "Appealed Order", link: "/dashboard/history/appeals" },
        ],
    },
    {
        title: "Account",
        icon: <User />,
        link: "/account",
        children: [
            { title: "Identification", link: "/dashboard/account/identification" },
            { title: "Payment", link: "/dashboard/account/payment" },
        ],
    },
    {
        title: "Settings",
        icon: <Settings />,
        link: "/dashboard/settings",
        children: [],
    },
];

interface SideNavProps {
    isDrawerOpen: boolean;
    toggleDrawer: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ isDrawerOpen, toggleDrawer }) => {
    const pathname = usePathname();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    useEffect(() => {
        navItems.forEach((item, index) => {
            if (item.children.some((child) => pathname.startsWith(child.link))) {
                setActiveIndex(index);
            }
        });
    }, [pathname]);

    const handleNavClick = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <>
            <nav className={`lg:block ${isDrawerOpen ? 'block' : 'hidden'} lg:static absolute top-0 left-0 w-64 bg-white text-gray-600 h-screen lg:h-auto z-50 lg:z-auto`}>
                <div className="mt-16 block lg:hidden"></div>
                <ul className="space-y-6 p-0">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            {item.children.length > 0 ? (
                                <div
                                    className={`flex items-center p-4 cursor-pointer ${activeIndex === index ? "bg-gray-100 " : ""}`}
                                    onClick={() => handleNavClick(index)}
                                >
                                    <div className="mr-3">{item.icon}</div>
                                    <div className="flex-1">{item.title}</div>
                                    <div>
                                        {activeIndex === index ? <ChevronDown /> : <ChevronRight />}
                                    </div>
                                </div>
                            ) : (
                                <Link href={item.link} className={`flex items-center p-4 hover:bg-gray-50 ${pathname === item.link ? "font-bold" : ""}`} onClick={() => handleNavClick(index)}>
                                    <div className="mr-3">{item.icon}</div>
                                    <div className="flex-1">{item.title}</div>
                                </Link>
                            )}
                            {activeIndex === index && item.children.length > 0 && (
                                <ul className="ml-8 mt-2 space-y-6">
                                    {item.children.map((child, childIndex) => (
                                        <li key={childIndex}>
                                            <Link
                                                href={child.link}
                                                className={`block p-2 hover:bg-gray-50 text-gray-600 ${pathname === child.link ? "font-bold" : ""}`}
                                            >
                                                {child.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
            {isDrawerOpen && (
                <div
                    onClick={toggleDrawer}
                    className="fixed inset-0 bg-black opacity-50 lg:hidden"
                />
            )}
        </>
    );
};

export default SideNav;

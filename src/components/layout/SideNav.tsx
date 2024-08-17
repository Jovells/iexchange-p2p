'use client'

import { ChevronDown, ChevronRight, Clock, Home, Settings, User } from "lucide-react";
import React, { useState } from "react";

const navItems = [
    {
        title: "Home",
        icon: <Home />,
        link: "/home",
        children: [],
    },
    {
        title: "Order History",
        icon: <Clock />,
        link: "/settings",
        children: [
            { title: "P2P", link: "/settings/profile" },
            { title: "Transaction History", link: "/settings/account" },
            { title: "Appealed Order", link: "/settings/account" },
        ],
    },
    {
        title: "Account",
        icon: <User />,
        link: "/settings",
        children: [
            { title: "Identification", link: "/settings/profile" },
            { title: "Payment", link: "/settings/account" },
        ],
    },
    {
        title: "Settings",
        icon: <Settings />,
        link: "/settings",
        children: [],
    },
];

const SideNav = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleNavClick = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <nav className="w-64 bg-white text-gray-600 h-screen hidden lg:block">
            <ul className="space-y-6">
                {navItems.map((item, index) => (
                    <li key={index}>
                        <div
                            className={`flex items-center p-4 cursor-pointer ${activeIndex === index ? "bg-gray-50" : ""
                                }`}
                            onClick={() => handleNavClick(index)}
                        >
                            <div className="mr-3">{item.icon}</div>
                            <div className="flex-1">{item.title}</div>
                            {item.children.length > 0 && (
                                <div>
                                    {activeIndex === index ? <ChevronDown /> : <ChevronRight />}
                                </div>
                            )}
                        </div>
                        {activeIndex === index && item.children.length > 0 && (
                            <ul className="ml-8 mt-2 space-y-6">
                                {item.children.map((child, childIndex) => (
                                    <li key={childIndex}>
                                        <a
                                            href={child.link}
                                            className="block p-2 hover:bg-gray-50 text-gray-600"
                                        >
                                            {child.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default SideNav

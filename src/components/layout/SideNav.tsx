'use client'

import { useUser } from "@/common/contexts/UserContext";
import { ChevronDown, ChevronRight, Clock, Home, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import NetworkSwitcher from "../networkSwitcher";
import Image from "next/image";
import { HOME_PAGE } from "@/common/page-links";
import { getImage } from "@/lib/utils";

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
  const navigation = useRouter();
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { session } = useUser();

  useEffect(() => {
    navItems.forEach((item, index) => {
      if (item.children.some(child => pathname.startsWith(child.link))) {
        setActiveIndex(index);
      }
    });
  }, [pathname]);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isDrawerOpen]);

  const handleNavClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      <nav
        className={`lg:block ${
          isDrawerOpen ? "block" : "hidden"
        } pt-6 lg:pt-[130px] lg:fixed absolute top-0 left-0 w-64 bg-white dark:bg-[#14161B] text-gray-600 dark:text-gray-300 h-full z-50 lg:z-auto flex flex-col justify-between`}
      >
        {session.status === "authenticated" && (
          <div className="px-4 hidden lg:block mb-6">
            <NetworkSwitcher />
          </div>
        )}

        <div>
          <Image
            src={getImage("iexchange.svg") as string}
            alt="iexchange logo"
            className="h-[50px] w-auto lg:w-auto block lg:hidden cursor-pointer"
            width={150}
            height={50}
            onClick={() => navigation.push(HOME_PAGE)}
          />
          <ul className="space-y-6 p-0">
            {navItems.map((item, index) => (
              <li key={index}>
                {item.children.length > 0 ? (
                  <div
                    className={`flex items-center p-4 cursor-pointer ${
                      activeIndex === index ? "bg-gray-100 dark:bg-gray-700" : ""
                    }`}
                    onClick={() => handleNavClick(index)}
                  >
                    <div className="mr-3">{item.icon}</div>
                    <div className="flex-1">{item.title}</div>
                    <div>{activeIndex === index ? <ChevronDown /> : <ChevronRight />}</div>
                  </div>
                ) : (
                  <Link
                    href={item.link}
                    className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      pathname === item.link ? "font-bold" : ""
                    }`}
                    onClick={() => handleNavClick(index)}
                  >
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
                          className={`block p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 ${
                            pathname === child.link ? "font-bold" : ""
                          }`}
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
        </div>
      </nav>
      {isDrawerOpen && <div onClick={toggleDrawer} className="fixed inset-0 bg-black opacity-50 lg:hidden" />}
    </div>
  );
};

export default SideNav;

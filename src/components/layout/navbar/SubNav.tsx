'use client'
import { OrdersDropdown } from './OrdersDropdown';
import IsVerifiedButton from "@/components/ui/IsVerifiedButton";
import MenuDropdown from "../../ui/MenuDropdown";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  APPEALS_PAGE,
  BUY_SELL_PAGE,
  DASHBOARD_PAGE,
  HELP_PAGE,
  HOME_PAGE,
  MERCHANT_PAGE,
  MY_ADS_PAGE,
  ORDER_HISTORY_PAGE,
  PLACING_AD_PAGE,
  QUICK_TRADE_PAGE,
  SETTLER_PAGE,
} from "@/common/page-links";
import useIsMerchant from "@/common/hooks/useIsMerchant";
import { useUser } from "@/common/contexts/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { getImage } from "@/lib/utils";
import useMyPendingOrders from "@/common/hooks/useMyOrders";
import MultiLevelDropdown from "./MultiLevelDropdown";
import ConnectButton from "@/components/connectButton";
import SignOutButton from "@/components/connectButton/SignOut";

const menuLinks = [
  { href: QUICK_TRADE_PAGE, label: "Quick Trade" },
  { href: HOME_PAGE, label: "P2P" },
  { href: APPEALS_PAGE, label: "Appeals" },
  { href: MY_ADS_PAGE, label: "My Ads" }, // should on be visible to merchants
];

const menuLinks2 = [
  { href: QUICK_TRADE_PAGE, label: "Quick Trade" },
  { href: HOME_PAGE, label: "P2P" },
];

const helpCenterLinks = [
  { link: BUY_SELL_PAGE, label: "How to Buy/Sell" },
  { link: PLACING_AD_PAGE, label: "Pacing an Ad" },
  { link: MERCHANT_PAGE, label: "How to be a Merchant" },
  { link: SETTLER_PAGE, label: "How to be a settler" },
];

const SubNav = () => {
  const navigate = useRouter();
  const currentPath = usePathname();
  const { total: totalPendingOrders } = useMyPendingOrders();

  const { isConnected } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const { isMerchant, isLoading } = useIsMerchant();

  //images
  const helpIcon = getImage("message.svg");
  // @TODO: replace with orders with List from List from lucid
  const orderIcons = getImage("orders.svg");
  const profileIcon = getImage("profile.svg");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const homeIcon = getImage("home.svg");
  const clockIcon = getImage("clock.svg");
  const profileCircleIcon = getImage("profile-circle.svg");
  const settingsIcon = getImage("settings.svg");

  const accountLinks = [
    { link: DASHBOARD_PAGE, icon: homeIcon, label: "Dashboard" },
    { link: ORDER_HISTORY_PAGE, icon: clockIcon, label: "Order History" },
    { link: "/profile", icon: profileCircleIcon, label: "Profile" },
    { link: "/settings", icon: settingsIcon, label: "Settings" },
  ];

  const renderLinks = (links: { href: string; label: string }[]) =>
    links.map(link => {
      const isActive = currentPath === link.href;
      return (
        <Link
          key={link.href}
          href={link.href}
          className={`
        block px-2 py-2 pl-0 font-medium 
        ${link.label === "My Ads" && !isMerchant ? "hidden" : "flex"} 
        text-[14px] 
        text-[#111315] 
        dark:text-white 
        hover:text-[#01A2E4] 
        dark:hover:text-[#01A2E4] 
        transition-colors duration-200 ease-in-out
        ${isActive ? "border-b-2 border-[#01A2E4]" : "border-0"} 
    `}
        >
          {link.label}
        </Link>
      );
    });

  const renderLinks1 = (links: { href: string; label: string }[]) =>
    links.map(link => {
      const isActive = currentPath === link.href;
      return (
        <Link
          key={link.href}
          href={link.href}
          className={`
          block px-2 py-2 pl-0 font-medium 
          ${link.label === "My Ads" && !isMerchant ? "hidden" : "flex"} 
          text-[14px] 
          text-[#111315] 
          dark:text-white 
          hover:text-[#01A2E4] 
          dark:hover:text-[#01A2E4] 
          transition-colors duration-200 ease-in-out
          ${isActive ? "border-b-2 dark:border-[#01A2E4]" : "border-0"} 
      `}
        >
          {link.label}
        </Link>
      );
    });

  const renderMenuDropdowns = () => (
    <div className="flex flex-row gap-4">
      <MenuDropdown
        title="Help Center"
        onClick={() => navigate.push(HELP_PAGE)}
        icon={helpIcon as string}
        dropdownItems={helpCenterLinks}
      />
      <MenuDropdown
        title="Orders"
        icon={orderIcons as string}
        notification={totalPendingOrders}
        dropdownItems={[]}
        onClick={() => navigate.push("/dashboard/history/orders")}
      >
        <div className="min-w-[500px] rounded-[8px]">
          <OrdersDropdown />
        </div>
      </MenuDropdown>
      <MenuDropdown title="Account" icon={profileIcon as string} dropdownItems={isConnected ? accountLinks : []}>
        <div className="p-4 border border-gray-200 dark:border-gray-800 border-b-0">
          {/* <WalletConnect /> */}
          <SignOutButton />
          {/* {isConnected && <IsVerifiedButton />} */}
        </div>
      </MenuDropdown>
    </div>
  );

  const renderMenuDropdowns2 = () => (
    <div className="flex flex-row gap-4">
      <MenuDropdown title="Help Center" icon={helpIcon as string} dropdownItems={helpCenterLinks} />
    </div>
  );

  if (!isMounted || !isConnected) {
    return (
      <div className="border-0 mt-0 lg:mt-2 mb-0">
        <div className="container mx-auto px-3 lg:px-6 flex flex-row justify-between items-center">
          <div className="flex flex-row gap-4 pl-2 lg:pl-0">{renderLinks1(menuLinks2)}</div>
          {renderMenuDropdowns2()}
        </div>
      </div>
    );
  }

  return (
    <div className="border-0 mt-0 lg:mt-2 mb-0">
      <div className="container mx-auto px-3 lg:px-6 flex flex-row justify-between items-center">
        <div className="flex flex-row gap-4 pl-2 lg:pl-0">{renderLinks(menuLinks)}</div>
        <div className="hidden lg:inline-block">{renderMenuDropdowns()}</div>
        <MultiLevelDropdown />
      </div>
    </div>
  );
};

export default SubNav
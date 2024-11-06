'use client'
import Link from "next/link";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import Image from 'next/image';
import BecomeAMerchant from "../../merchant";
import { ThemeToggle } from "@/components/shared";
import { useRouter } from "next/navigation";
import { getImage } from "@/lib/utils";
import { HOME_PAGE } from "@/common/page-links";

const MenuBar: FC<{ children?: ReactNode }> = ({ children }) => {
    const navigation = useRouter();
    const drawerRef = useRef<HTMLDivElement>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setIsDrawerOpen(false);
      }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const renderLinks = (links: { href: string; label: string }[]) =>
      links.map((link, i) => (
        <Link
          key={i}
          href={link.href}
          className="block px-2 py-2 text-[14px font-[500] transition duration-300
                    text-[#111315] hover:text-[#01A2E4] dark:text-white dark:hover:text-[#01A2E4]"
        >
          {link.label}
        </Link>
      ));

    const navLinks = [
      { href: "", label: "Product" },
      { href: "", label: "Solutions" },
      { href: "", label: "Whitepaper" },
      { href: "", label: "FAQ's" },
      { href: "", label: "News" },
    ];

    const togglerIcon = getImage("toggler.svg");

    return (
      <div className="w-full flex flex-row justify-between lg:justify-start items-center py-2 pr-3 lg:pr-4">
        <Image
          src={getImage("iexchange.svg") as string}
          alt="iexchange logo"
          className="h-[50px] w-auto lg:w-auto cursor-pointer"
          width={150}
          height={50}
          onClick={() => navigation.push(HOME_PAGE)}
        />
        <div className="w-full flex flex-row justify-end lg:justify-between items-center">
          <div className="hidden lg:flex space-x-1 mt-1">{renderLinks(navLinks)}</div>

          <div className="hidden lg:flex flex-row justify-start items-center space-x-3">
            <BecomeAMerchant />
            <Link
              href=""
              className="rounded-full border-2 border-[#FFB323] bg-clip-border border-gradient-to-r from-[#FFB323] via-[#996B15] to-[#C98D1C] p-0"
            >
              <img src="/images/light/gold.png" alt="gold bars" className="w-auto h-auto" />
            </Link>
            <ThemeToggle />
          </div>
          <div className="lg:hidden flex flex-row justify-start items-center gap-2" id="mobile-menu">
            <Link
              href=""
              className="rounded-full border-2 border-[#FFB323] bg-clip-border border-gradient-to-r from-[#FFB323] via-[#996B15] to-[#C98D1C] p-0"
            >
              <img src="/images/light/gold.png" alt="gold bars" className="w-auto h-auto" />
            </Link>
            <button
              type="button"
              className="flex items-center justify-center rounded-md text-gray-400 hover:text-[#01A2E4] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isDrawerOpen}
              onClick={toggleDrawer}
            >
              <span className="sr-only">Open main menu</span>
              <img src={togglerIcon as string} alt="icon" className="h-14 w-8" />
            </button>
            <div
              ref={drawerRef}
              className={`fixed inset-y-0 right-0 transform ${
                isDrawerOpen ? "translate-x-0" : "translate-x-full"
              } transition-transform duration-300 ease-in-out bg-white dark:bg-[#14161B] w-64 z-50 shadow-2xl`}
            >
              <div className="flex flex-col items-start justify-start space-y-4 p-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md text-gray-400 hover:text-[#01A2E4] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded={isDrawerOpen}
                  onClick={toggleDrawer}
                >
                  <svg
                    className={`${isDrawerOpen ? "block" : "hidden"} h-6 w-6`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex flex-col space-y-4">
                  {renderLinks(navLinks)}
                  <ThemeToggle />
                </div>
                <div>
                  <BecomeAMerchant />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default MenuBar;

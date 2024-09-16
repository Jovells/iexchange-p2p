'use client'
import Link from "next/link";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import Button from "../../ui/Button";
import Image from 'next/image';
import BecomeAMerchant from "../../merchant";
import { ThemeToggle } from "@/components/shared";
import { useRouter } from "next/navigation";
import { useModal } from "@/common/contexts/ModalContext";
import ClaimModal from "@/components/modals/ClaimModal";

const MenuBar: FC<{ children?: ReactNode }> = ({ children }) => {
    const navigation = useRouter()
    const drawerRef = useRef<HTMLDivElement>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { showModal, hideModal} = useModal();

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    const handleClickOutside = (event: MouseEvent) => {
        if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
            setIsDrawerOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const renderLinks = (links: { href: string; label: string }[]) => (
        links.map(link => (
            <Link
                key={link.href}
                href={link.href}
                className="text-[#111315] hover:text-[#01A2E4] font-roboto font-sm leading-5 tracking-widest block px-2 py-2 rounded-md text-base"
            >
                {link.label}
            </Link>
        ))
    );

    const navLinks = [
        { href: "/", label: "Product" },
        { href: "/solution", label: "Solutions" },
        { href: "/whitepaper", label: "Whitepaper" },
        { href: "/faqs", label: "FAQ's" },
        { href: "/news", label: "News" }
    ];


    const showClaimModal = () =>{
        const modal = <ClaimModal />
        showModal(modal);
    }

    return (
        <div className="w-full flex flex-row justify-between lg:justify-start items-center py-2 px-0 lg:pr-3 lg:pl-0">
            <Image src="/images/logo/iexchange-logo.png" alt="iexchange logo" className="h-[50px] w-[300px] lg:w-[170px] " width={150} height={50} onClick={() => navigation.push("/")} />
            <div className="w-full flex flex-row justify-end lg:justify-between items-center">
                <div className="hidden lg:flex space-x-1">
                    {renderLinks(navLinks)}
                </div>
                <div className="hidden lg:flex flex-row justify-start items-center space-x-6">
                    <BecomeAMerchant />
                    <Button text="Claim" className="bg-black text-white rounded-xl px-4 py-2" onClick={showClaimModal} />
                    <Button
                        icon="/images/icons/gold.png"
                        iconPosition="any"
                        iconClassName="w-[32px] h-[32px]"
                        className="bg-transparent rounded-full px-0 py-0 border-2 border-[#FFB323] bg-clip-border border-gradient-to-r from-[#FFB323] via-[#996B15] to-[#C98D1C]"
                    />
                    <ThemeToggle />
                </div>
                <div className="lg:hidden flex flex-row justify-start items-center" id="mobile-menu">
                    <Button
                        icon="/images/icons/gold.png"
                        iconPosition="any"
                        iconClassName="w-[22px] h-[22px]"
                        className="bg-transparent rounded-full mr-2 px-0 py-0 border-2 border-[#FFB323] bg-clip-border border-gradient-to-r from-[#FFB323] via-[#996B15] to-[#C98D1C]"
                    />
                    <button
                        type="button"
                        className="flex items-center justify-center rounded-md text-gray-400 hover:text-[#01A2E4] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        aria-controls="mobile-menu"
                        aria-expanded={isDrawerOpen}
                        onClick={toggleDrawer}
                    >
                        <span className="sr-only">Open main menu</span>
                        <img src="/images/icons/toggler.svg" alt="icon" className="h-14 w-14" />
                    </button>
                    <div
                        ref={drawerRef}
                        className={`fixed inset-y-0 right-0 transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out bg-white w-64 z-50 shadow-2xl`}
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
                                    className={`${isDrawerOpen ? 'block' : 'hidden'} h-6 w-6`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
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

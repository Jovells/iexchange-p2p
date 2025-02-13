'use client'

// next
import Link from "next/link";
import Image from "next/image";

// components
import FooterLink from "./footer-link";
// shared components
import { ThemeToggle } from "@/components/shared";

// data
import { footerNavSections, socials } from "@/common/data";
import { getImage } from "@/lib/utils";

const Footer = () => {

  const xIcon = getImage("x.svg")
  const telegramIcon = getImage("telegram.svg")
  const youtubeIcon = getImage("youtube.svg")

  return (
    <footer className="border-t border-[#C3C9D0] dark:border-[#3D4651] ">
      <div className="container mx-auto py-8">
        {/* socials and theme toggle */}
        <div className="pt-10 pb-14 ">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:justify-center gap-10">
            <div className="flex flex-col gap-4">
              {/* socials */}
              <div className="flex flex-row items-center gap-4">
                <Image src={xIcon as string} alt="social icon" width={24} height={24} />
                <Image src={telegramIcon as string} alt="social icon" width={24} height={24} />
                <Image src={youtubeIcon as string} alt="social icon" width={24} height={24} />
              </div>
              <div className="w-full">
                <ThemeToggle />
              </div>
            </div>
            {footerNavSections.map(navSection => (
              <div key={navSection.title} className="w-full flex flex-col gap-5 font-medium">
                <h3 className="text-xl text-[#3D4651] dark:text-[#f5f5f5]">{navSection.title}</h3>
                <div className="flex flex-col gap-3.5">
                  {navSection.links.map(link => (
                    <FooterLink key={link.label} href={link.href}>
                      {link.label}
                    </FooterLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* separator */}
        <hr className="border-[#DFE2E7] dark:border-[#3D4651]" />
        {/* copyright and terms */}
        <div className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center lg:items-start justify-center">
            <Image src={getImage("iexchange.svg") as string} alt="logo" width={127} height={42} />
            <div className="font-medium">
              <p className="text-sm text-[#677689] dark:text-[#A4ACB7]">
                © iExchange (GH), {new Date().getFullYear()}. All rights reserved.
                <span className="lg:px-3 whitespace-nowrap inline-flex gap-3 text-[#26272E] dark:text-[#f5f5f5]">
                  <Link href="/">Privacy Note</Link> <Link href="/">Terms & Conditions</Link>{" "}
                  <Link href="/">Terms of Use</Link>{" "}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

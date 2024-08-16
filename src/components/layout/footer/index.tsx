// next
import Link from "next/link";
import Image from "next/image";

// components
import FooterLink from "./footer-link";
import FooterSocialLink from "./footer-social-link";
// shared components
import { ThemeToggle } from "@/components/shared";

// data
import { footerNavSections, socials } from "@/common/data";

const Footer = () => {
  
  return (
    <footer className="bg-secondary border-t border-[#C3C9D0] dark:border-[#3D4651]">
      <div className="container py-8">
        {/* socials and theme toggle */}
        <div className="pt-10 pb-14 lg:px-20">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-start sm:justify-center gap-10">
            <div className="flex flex-col gap-4">
              {/* socials */}
              <div className="flex flex-row items-center gap-10">
                {socials.map((social) => (
                  <FooterSocialLink key={social.name} social={social} />
                ))}
              </div>
              {/* theme toggle */}
              <div className="w-full">
                <ThemeToggle />
              </div>
            </div>
            {/* nav links */}
            {footerNavSections.map((navSection) => (
              <div
                key={navSection.title}
                className="w-full flex flex-col gap-5 font-medium"
              >
                <h3 className="text-xl dark:text-[#f5f5f5]">
                  {navSection.title}
                </h3>
                <div className="flex flex-col gap-3.5">
                  {navSection.links.map((link) => (
                    <FooterLink key={link.label} href={link.href}>
                      {link.label}
                    </FooterLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* seperator */}
        <hr className="border:[#DFE2E7] dark:border-[#3D4651]" />
        {/* copyright and terms */}
        <div className="py-5">
          <div className="grid lg:grid-cols-[1fr-auto] items-center lg:items-start justify-center gap-5">
            <Image
              src="/images/logos/iexchange.png"
              alt="logo"
              width={127}
              height={42}
            />
            <div className="font-medium">
              <p className="text-sm text-[#677689]">
                © iExchange (GH), {new Date().getFullYear()}. All rights
                reserved.
                <span className="lg:px-3 whitespace-nowrap inline-flex gap-3 text-[#26272E] dark:text-[#f5f5f5]">
                  <Link href="/">Privacy Note</Link>{" "}
                  <Link href="/">Terms & Conditions</Link>{" "}
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

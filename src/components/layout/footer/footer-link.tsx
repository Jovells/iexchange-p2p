// react
import { FC, PropsWithChildren } from "react";
// next
import Link from "next/link";

// types
type FooterLinkProps = PropsWithChildren<{
  href: string;
}>;

const FooterLink: FC<FooterLinkProps> = ({ href, children }) => {
  return (
    <Link href={href} className="text-sm text-[#3D4651] dark:text-[#dfe2e7]">
      {children}
    </Link>
  );
};

export default FooterLink;
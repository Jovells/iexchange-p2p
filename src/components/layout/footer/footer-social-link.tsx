"use client";

// react
import { FC, useEffect, useState } from "react";
// next
import Link from "next/link";
import Image from "next/image";
// imports
import { useTheme } from "next-themes";

// data
import { Social } from "@/common/data";

// types
type FooterSocialLinkProps = {
  social: Social;
};

const FooterSocialLink: FC<FooterSocialLinkProps> = ({ social }) => {
  // hooks
  const { theme, resolvedTheme } = useTheme();
  const [loadedTheme, setLoadedTheme] = useState<string | null>(null);

  useEffect(() => {
      if (resolvedTheme) {
          setLoadedTheme(resolvedTheme);
      }
  }, [resolvedTheme]);

  return (
    <Link href={social.href}>
      <Image
        src={loadedTheme === "light" ? social.icon.light : social.icon.dark}
        alt={`${social.name} icon`}
        width={24}
        height={24}
      />
    </Link>
  );
};

export default FooterSocialLink;

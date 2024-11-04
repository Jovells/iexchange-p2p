import { BUY_SELL_PAGE, MERCHANT_PAGE, PLACING_AD_PAGE } from "@/common/page-links";
import Link from "next/link";
import React from "react";

export function HelpNav({ slug }: { slug?: string | undefined }) {
  return (
    <nav className="mt-4 p-4 rounded-md">
      <ul className="flex justify-center space-x-4">
        <li className={slug == undefined ? "text-primary font-bold" : "text-gray-700"}>
          <Link href="/help" className="hover:underline text-sm">
            Full Guide
          </Link>
        </li>
        <span>|</span>
        <li className={slug === "buy-sell" ? "text-primary font-bold" : "text-gray-700"}>
          <Link href={BUY_SELL_PAGE} className="hover:underline  text-sm">
            How to Buy/Sell
          </Link>
        </li>
        <span>|</span>
        <li className={slug === "place-ad" ? "text-primary font-bold" : "text-gray-700"}>
          <Link href={PLACING_AD_PAGE} className="hover:underline  text-sm">
            Pacing an Ad
          </Link>
        </li>
        <span>|</span>
        <li className={slug === "become-merchant" ? "text-primary font-bold" : "text-gray-700"}>
          <Link href={MERCHANT_PAGE} className="hover:underline  text-sm">
            Becoming a Merchant
          </Link>
        </li>
      </ul>
    </nav>
  );
}

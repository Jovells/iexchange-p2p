import React from "react";
export function HelpNav({ slug }: { slug?: string | undefined }) {
  return (
    <nav className="mt-4 p-4 rounded-md">
      <ul className="flex justify-center space-x-4">
        <li className={slug == undefined ? "text-primary font-bold" : "text-gray-700"}>
          <a href="/help" className="hover:underline">
            Full Guide
          </a>
        </li>
        <span>|</span>
        <li className={slug === "buy-sell" ? "text-primary font-bold" : "text-gray-700"}>
          <a href="/help/buy-sell" className="hover:underline">
            How to Buy/Sell
          </a>
        </li>
        <span>|</span>
        <li className={slug === "place-ad" ? "text-primary font-bold" : "text-gray-700"}>
          <a href="/help/how-to-place-an-ad" className="hover:underline">
            How to Place an Ad
          </a>
        </li>
        <span>|</span>
        <li className={slug === "become-merchant" ? "text-primary font-bold" : "text-gray-700"}>
          <a href="/help/how-to-become-a-merchant" className="hover:underline">
            How to Become a Merchant
          </a>
        </li>
      </ul>
    </nav>
  );
}

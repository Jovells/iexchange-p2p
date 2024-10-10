import { Offer } from '@/common/api/types';
import { formatCurrency, shortenAddress } from '@/lib/utils';
import { BadgeCheck, IndianRupee, UserCircle } from 'lucide-react';
import React from 'react';

const MerchantProfile = ({
  offer
}: {
  offer: Offer;
}) => {
  return (
    <div className="flex flex-col justify-between h-full px-6 pl-0">
      <div className="space-y-4">
        <div className="flex flex-row items-center text-gray-800 dark:text-gray-200">
          <UserCircle className="w-4 h-4" />
          <span className="text-gray-800 dark:text-gray-200">
            {offer.merchant.name} ({shortenAddress(offer.merchant.id)})
          </span>
          <BadgeCheck className="w-4 h-4 ml-1 text-gray-800 dark:text-gray-200" />
        </div>
        {/* Trades */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
          <div className="flex flex-col items-start">
            <p className="text-gray-800 dark:text-gray-200">397 trades</p>
            <p className="text-gray-500 dark:text-gray-400">99% Completion</p>
          </div>
          <div className="flex flex-col items-start">
            <p className=" text-gray-800 ">{offer.paymentMethod.method}</p>
            <p className="text-gray-500 dark:text-gray-400">Payment Method</p>
          </div>
          <div className="flex flex-col items-start">
            <p className="font-bold  text-gray-800 rounded ">
              {offer.rate} {offer.currency.currency}
            </p>
            <p className="text-gray-500 dark:text-gray-400">Rate</p>
          </div>
        </div>

        {/* Commitments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
          <div className="flex flex-col items-start">
            <span className="text-gray-800 dark:text-gray-200">
              {offer.merchant.timeLimit || "30"} {"mins"}
            </span>
            <span className="text-gray-500 dark:text-gray-400">Payment Time Frame</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-gray-800 dark:text-gray-200">13.5min</span>
            <span className="text-gray-500 dark:text-gray-400">Avg. Pay Time</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-gray-800 dark:text-gray-200">
              {formatCurrency(offer.minOrder, offer.token.symbol)} -{" "}
              {formatCurrency(offer.maxOrder, offer.token.symbol)}
            </span>
            <span className="text-gray-500 dark:text-gray-400">Limit</span>
          </div>
        </div>
      </div>
      {/* Terms */}
      <div className="space-y-3 bg-white dark:bg-gray-800 p-0 lg:p-6 pt-6 h-full mt-5 rounded-xl">
        <h2 className="text-gray-800 dark:text-gray-200">Merchant Terms and Conditions</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{offer.merchant.terms || "N/A"}</p>
      </div>
    </div>
  );
}

export default MerchantProfile;

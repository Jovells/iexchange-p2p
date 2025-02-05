import React from "react";
import Verify from "@/components/cards/Verify";
import Button from "@/components/ui/Button";
import { shortenAddress } from "@/lib/utils";
import InProgress from "@/components/datatable/inProgress";

const Identification = () => {
  return <InProgress />;
  // return (
  //   <>
  //     <div className="flex flex-col items-start">
  //       <div className="border-b border-black w-full pb-12 mb-12 flex flex-row gap-3">
  //         <div className="bg-gray-200 dark:bg-gray-700 rounded-xl w-[100px] h-[100px]"></div>
  //         <div className="flex flex-col items-start">
  //           <span className="text-gray-800 dark:text-gray-200">
  //             {shortenAddress("aaaaddd328282828282828282ncjddjddd!!")}
  //           </span>
  //           <Button
  //             text="Unverified"
  //             className="font-light text-gray-700 dark:text-gray-300 text-sm bg-gray-200 dark:bg-gray-600 p-2 rounded-xl"
  //           />
  //         </div>
  //       </div>

  //       <Verify />

  //       <div className="flex flex-col items-start w-full gap-4 mt-14 border-t border-black pt-12">
  //         <h1 className="font-medium text-black dark:text-white text-lg">Account Privileges</h1>
  //         <Button
  //           text="Connect Wallet"
  //           icon="/images/light/lock.png"
  //           iconPosition="left"
  //           className="font-light text-gray-500 dark:text-gray-400 text-sm"
  //         />
  //         <Button
  //           text="Fiat and Crypto Conversion"
  //           icon="/images/icons/lock.png"
  //           iconPosition="left"
  //           className="font-light text-gray-500 dark:text-gray-400 text-sm"
  //         />
  //         <Button
  //           text="Post Ads"
  //           icon="/images/light/lock.png"
  //           iconPosition="left"
  //           className="font-light text-gray-500 dark:text-gray-400 text-sm"
  //         />
  //         <Button
  //           text="Settle Cases"
  //           icon="/images/light/lock.png"
  //           iconPosition="left"
  //           className="font-light text-gray-500 dark:text-gray-400 text-sm"
  //         />
  //       </div>
  //     </div>
  //   </>
  // );
};

export default Identification;

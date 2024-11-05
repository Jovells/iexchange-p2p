import Claim from "@/app/(trade)/claim";
import React from "react";
import NetworkSwitcher from "./networkSwitcher";
import { useUser } from "@/common/contexts/UserContext";

export default function FaucetAndNetwork({ className, outline }: { outline?: boolean; className?: string }) {
  const { isConnected } = useUser();
  return (
    isConnected && (
      <>
        <div
          className={
            "flex w-[400px] h-60px flex-row mt-4 items-center justify-center lg:justify-start gap-4 " + className
          }
        >
          <Claim className={"w-full h-full border" + (outline ? "border-gray-200 dark:border-gray-700" : "")} />
          <NetworkSwitcher className="w-full h-full" />
        </div>
      </>
    )
  );
}

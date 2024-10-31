import Claim from "@/app/(trade)/claim";
import React from "react";
import NetworkSwitcher from "./networkSwitcher";
import { useUser } from "@/common/contexts/UserContext";

export default function FaucetAndNetwork({ className }: { className?: string }) {
  const { isConnected } = useUser();
  return (
    <div
      className={"flex w-[400px] h-60px flex-row mt-4 items-center justify-center lg:justify-start gap-4 " + className}
    >
      {isConnected && (
        <>
          <Claim className="w-full h-full border" />
          <NetworkSwitcher className="w-full h-full" />
        </>
      )}
    </div>
  );
}

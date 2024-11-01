"use client";
import { useUser } from "@/common/contexts/UserContext";
import { HOME_PAGE } from "@/common/page-links";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Protected({ children }: { children: React.ReactNode }) {
  const { session, isConnected } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push(HOME_PAGE);
    }
  }, [session, router]);

  return <>{children}</>;
}

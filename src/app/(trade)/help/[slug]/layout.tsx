"use client";
import { HelpNav } from "./../../../../components/help-nav";
import { useTheme } from "@/common/contexts/ThemeProvider";
import { useParams } from "next/navigation";
import React, { useLayoutEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { slug } = useParams();

  return (
    <div>
      <HelpNav slug={slug as string} />
      {children}
    </div>
  );
};

export default Layout;

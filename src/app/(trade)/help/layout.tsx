"use client";
import { useTheme } from "@/common/contexts/ThemeProvider";
import React, { useLayoutEffect } from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toggleTheme, isDarkMode } = useTheme();
  useLayoutEffect(() => {
    if (isDarkMode) {
      toggleTheme();
    }
  }, [isDarkMode]);
  return <div>{children}</div>;
}

export default Layout;

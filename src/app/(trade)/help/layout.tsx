"use client";
import { useTheme } from "@/common/contexts/ThemeProvider";
import React, { useEffect, useLayoutEffect } from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const { toggleTheme, isDarkMode } = useTheme();
  // useEffect(() => {
  //   if (isDarkMode) {
  //     toggleTheme();
  //   }
  // }, []);

  return <div>{children}</div>;
};

export default Layout;

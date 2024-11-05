"use client";

import React from "react";

const QuickTradeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col container lg:flex-row gap-4 p-4 lg:p-10 sm:px-6 lg:px-10 py-6 sm:py-8 xl:py-32  md:mx-auto">
      {children}
    </div>
  );
};

export default QuickTradeLayout;

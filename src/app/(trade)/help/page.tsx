"use client";
import { HelpNav } from "@/components/help-nav";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const BuySellPage: React.FC = () => {
  const { slug } = useParams();
  const hash = slug ? "#" + slug : "";

  return (
    <div className="container mx-auto h-screen p-0 py-4">
      <HelpNav />

      <iframe
        src={"https://scribehow.com/embed/iExchange_Full_guide__LKwXrMoITIm19QdPPvCmoA?as=scrollable" + hash}
        width="100%"
        height="100%"
        className=""
        allowFullScreen
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default BuySellPage;

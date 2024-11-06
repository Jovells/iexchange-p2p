"use client";
import { HelpNav } from "@/components/help-nav";
import Loader from "@/components/loader/Loader";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const BuySellPage: React.FC = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);

  return (
    <div className="container mx-auto h-screen p-0 py-4">
      {loading && (
        <div className=" flex w-full justify-center items-center  h-screen ">
          <Loader />
        </div>
      )}

      <iframe
        src={"https://scribehow.com/page-embed/iExchange_Help_Center__1EKapmT7SOCI_oiAuX4ynQ"}
        width="100%"
        height="100%"
        className=""
        onLoad={() => {
          setLoading(false);
        }}
        allowFullScreen
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default BuySellPage;

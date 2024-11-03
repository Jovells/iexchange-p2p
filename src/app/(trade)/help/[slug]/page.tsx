"use client";
import Loader from "@/components/loader/Loader";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const BuySellPage: React.FC = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const getLink = () => {
    if (slug === "buy-sell") {
      return "https://scribehow.com/embed/How_to_BuySell_on_iExchange__lCmCyQVLTLmS1JkgJ06QXw?as=scrollable";
    } else if (slug === "become-merchant") {
      return "https://scribehow.com/embed/How_to_place_an_ad_on_iExchange__5QzAizAaSWOZb--4FxfTqA?as=scrollable";
    } else if (slug === "place-ad") {
      return "https://scribehow.com/embed/How_to_place_an_ad_on_iExchange__VERdj9CgRxS0PmI4xrtlXw?as=scrollable";
    } else {
      return "https://scribehow.com/embed/iExchange_Full_guide__LKwXrMoITIm19QdPPvCmoA?as=scrollable";
    }
  };
  const link = getLink();

  return (
    <div className="container mx-auto h-screen p-0 py-4">
      {loading && (
        <div className=" flex w-full justify-center items-center  h-screen ">
          <Loader />
        </div>
      )}
      <iframe
        src={link}
        width="100%"
        height="100%"
        className=""
        onLoad={() => setLoading(false)}
        allowFullScreen
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default BuySellPage;

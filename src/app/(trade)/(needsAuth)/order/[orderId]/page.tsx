"use client";
import { useParams } from "next/navigation";
import React from "react";
import dynamic from "next/dynamic";

const OderStage = dynamic(() => import("./OderStage"), {
  ssr: false,
});

const OrderCreated = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return <OderStage toggleExpand={() => {}} orderId={orderId} />;
};

export default OrderCreated;

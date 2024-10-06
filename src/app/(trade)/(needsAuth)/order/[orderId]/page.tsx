"use client";
import { useParams } from "next/navigation";
import React from "react";
import OrderStage from "./OderStage";

const OrderCreated = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return <OrderStage toggleExpand={() => {}} orderId={orderId} />;
};

export default OrderCreated;

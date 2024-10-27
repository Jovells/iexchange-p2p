"use client";
import { useParams } from "next/navigation";
import React, { lazy } from "react";

const OrderStage = lazy(() => import("./OderStage"));


const OrderCreated = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return <OrderStage toggleExpand={() => {}} orderId={orderId} />;
};

export default OrderCreated;

"use client";
import OderStage from './OderStage';
import { useParams } from "next/navigation";
import React from "react";
import TradeLayout from '../../layout';

const OrderCreated = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
      <OderStage toggleExpand={() => { }} orderId={orderId} />
  );
};

export default OrderCreated;

"use client";
import OderStage from './OderStage';
import { useParams } from "next/navigation";
import React from "react";
import TradeLayout from '../../TradeLayout';

const OrderCreated = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <TradeLayout>
      <OderStage toggleExpand={() => { }} orderId={orderId} />
    </TradeLayout>
  );
};

export default OrderCreated;

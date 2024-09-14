"use client";
import  OderStage  from './OderStage';
import { useParams } from "next/navigation";
import React from "react";

const OrderCreated = () => {
  const { orderId } = useParams<{ orderId: string }>();
 
  return (
    <OderStage toggleExpand={()=>{}} orderId={orderId}/>
  );
};

export default OrderCreated;

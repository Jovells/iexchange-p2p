'use client'

import CustomTab from '@/common/tab'
import { useRouter } from 'next/navigation'
import React from 'react'
import OrdersTable from './table'
import { OrderState } from '@/common/api/types'
import DashboardLayout from '../../DashboardLayout'

const P2POrderHistory = () => {
  const route = useRouter()
  const [activeTab, setActiveTab] = React.useState<string | undefined>(undefined);

  const handleTabChange = (value: string | undefined) => {
    setActiveTab(value);
  };

  const tabs = [
    { label: "All", value: undefined },
    { label: "Pending", value: OrderState.Pending.toString() },
    { label: "Paid", value: OrderState.Paid.toString() },
    { label: "Released", value: OrderState.Released.toString() },
    { label: "Appeal in progress", value: OrderState.Appealed.toString() },
    { label: "Cancelled orders", value: OrderState.Cancelled.toString() },
  ];

  const actions = [
    { label: "action", onClick: (row: any) => route.push("/appeal/order"), classNames: "bg-green-700 text-white" },
  ];

  const stat = activeTab !== undefined ? parseInt(activeTab) : undefined;

  return (
    <DashboardLayout>
      <div className="py-12 pt-0 flex flex-col gap-4">
        <div className="w-full lg:w-fit">
          <CustomTab tabs={tabs as any} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        <OrdersTable status={stat} />
      </div>
    </DashboardLayout>
  );
}

export default P2POrderHistory
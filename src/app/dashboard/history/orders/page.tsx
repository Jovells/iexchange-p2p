'use client'

import CustomTab from '@/common/tab'
import { useRouter } from 'next/navigation'
import React from 'react'
import OrdersTable from './table'
import { OrderState } from '@/common/api/types'
import DashboardLayout from '../../DashboardLayout'

const P2POrderHistory = () => {
  const route = useRouter()
  const [activeTab, setActiveTab] = React.useState<any>("");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const tabs = [
    { label: 'All', value: "" },
    { label: 'Unpaid', value: OrderState.pending },
    { label: 'Paid', value: OrderState.paid },
    { label: 'Appeal in progress', value: OrderState.appealed },
    { label: 'Cancelled orders', value: OrderState.cancelled },
  ];


  const actions = [
    { label: "action", onClick: (row: any) => route.push('/appeal/order'), classNames: "bg-green-700 text-white" }
  ]

  return (
    <DashboardLayout>
      <div className='py-12 pt-0 flex flex-col gap-4'>
        <div className="w-full lg:w-fit">
          <CustomTab tabs={tabs as any} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        <OrdersTable status={activeTab} />
      </div>
    </DashboardLayout>
  )
}

export default P2POrderHistory
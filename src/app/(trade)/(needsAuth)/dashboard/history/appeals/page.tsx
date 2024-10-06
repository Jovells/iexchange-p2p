'use client'

import { columns, data } from '@/common/data/table-data'
import CustomTab from '@/common/tab'
import GridTable from '@/components/datatable'
import { useRouter } from 'next/navigation'
import React from 'react'
import DashboardLayout from '../../layout'

const AppealedOrderHistory = () => {
  const route = useRouter()
  const [activeTab, setActiveTab] = React.useState('All');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const tabs = [
    { label: 'All', value: 'All' },
    { label: 'Unpaid', value: 'Unpaid' },
    { label: 'Paid', value: 'Paid' },
    { label: 'Appeal in progress', value: 'Appeal in progress' },
    { label: 'Cancelled orders', value: 'Cancelled orders' },
  ];


  const actions = [
    { label: "action", onClick: (row: any) => route.push('/appeal/order'), classNames: "bg-green-700 text-white" }
  ]

  return (
    <>
      <div className='py-12 pt-0 flex flex-col gap-4'>
        <div className="w-full lg:w-fit">
          <CustomTab tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        <GridTable columns={columns} data={data} actions={actions} itemsPerPage={50} />
      </div>
    </>
  )
}

export default AppealedOrderHistory
'use client'
import { useModal } from '@/common/contexts/ModalContext';
import GridTable from '@/components/datatable';
import FaqsSection from '@/components/sections/Faqs';
import Button from '@/components/ui/Button';
import { CircleCheck, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const columns: any = [
  {
    key: 'name',
    label: 'name',
    render: (row: any) => <span className="font-bold">{row.name}</span>,
  },
  {
    key: 'age',
    label: 'Age',
    render: (row: any) => <span className="font-bold">{row.age}</span>,
  },
  {
    key: 'email',
    label: 'Email',
    render: (row: any) => {
      return (
        //multi row rendering
        <div>
          <p className="font-bold">{row.name}</p>
          <span className="font-bold">{row.email}</span>
        </div>
      )
    },
  },
  {
    key: 'country',
    label: 'Country',
    render: (row: any) => <span className="font-bold">{row.country}</span>,
  },
  {
    key: 'occupation',
    label: 'Occupation',
    render: (row: any) => <span className="font-bold">{row.occupation}</span>,
  },
]
const MyAds = () => {
  // State or condition that determines what content to display
  const hasStake = true;
  const { showModal, hideModal } = useModal()

  const route = useRouter()

  const data = [
    { name: "John Doe", age: 25, email: "john@example.com", country: "USA", occupation: "Engineer" },
    { name: "Jane Smith", age: 30, email: "jane@example.com", country: "UK", occupation: "Designer" },
  ];

  const actions = [
    { onClick: (row: any) => route.push('/appeal/order'), classNames: "bg-transparent text-black", icon: <Eye /> },
    { onClick: (row: any) => route.push('/appeal/order'), classNames: "bg-transparent text-black", icon: <Trash2 /> },
    { onClick: (row: any) => route.push('/appeal/order'), classNames: "bg-transparent text-black", icon: <CircleCheck /> },
  ]


  return (
    <div className="container mx-auto p-0 py-4">
      <div className='py-12 flex flex-col gap-10'>
        <GridTable columns={columns} data={data} actions={actions} itemsPerPage={50} />
      </div>

      <FaqsSection />
    </div>
  );
};

export default MyAds;

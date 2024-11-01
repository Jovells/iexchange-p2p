'use client'

import { useModal } from '@/common/contexts/ModalContext';
import GridTable from '@/components/datatable';
import FaqsSection from '@/components/sections/Faqs';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import React from 'react';
import Stake from './stake';
import InProgress from "@/components/datatable/inProgress";
import Wrapper from '@/components/layout/Wrapper';

const columns: any = [
  {
    key: 'name',
    label: 'Name',
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
    render: (row: any) => (
      <div>
        <p className="font-bold">{row.name}</p>
        <span className="font-bold">{row.email}</span>
      </div>
    ),
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
];

const Appeals = () => {
  const hasStake = true;
  const { showModal, hideModal } = useModal();
  const route = useRouter();

  const data = [
    { name: "John Doe", age: 25, email: "john@example.com", country: "USA", occupation: "Engineer" },
    { name: "Jane Smith", age: 30, email: "jane@example.com", country: "UK", occupation: "Designer" },
  ];

  const actions = [
    { label: "Pick Order", onClick: (row: any) => route.push('/appeal/order'), classNames: "bg-green-700 text-white" }
  ];

  const handleStake = () => {
    showModal(<Stake hideModal={hideModal} />);
  };

  return <InProgress />;

  // return (
  //   <Wrapper>
  //     <div className="container mx-auto p-0 py-4 pt-0">
  //       {!hasStake && (
  //         <div className="min-h-[500px] flex justify-center items-center">
  //           <div className="flex flex-col justify-center items-center space-y-4">
  //             <p className="text-xl text-gray-600 dark:text-gray-300">
  //               Get to settle cases and resolve trading problems by staking $20 and get returns.
  //             </p>
  //             <Button
  //               text="Stake on Platform"
  //               iconPosition="right"
  //               icon="/images/icons/export.svg"
  //               className="border px-3 py-2 rounded-xl text-gray-500 dark:text-gray-200"
  //               onClick={handleStake}
  //             />
  //           </div>
  //         </div>
  //       )}

  //       {hasStake && (
  //         <div className="py-12 flex flex-col gap-10">
  //           <div className="flex flex-col gap-3">
  //             <h1 className="text-gray-600 dark:text-white text-xl">Awaiting Case</h1>
  //             <p className="text-gray-500 dark:text-white">Pick up an order and settle cases fairly.</p>
  //           </div>
  //           <GridTable columns={columns} data={data.length > 0 ? data : []} actions={actions} itemsPerPage={50} />
  //         </div>
  //       )}

  //       <FaqsSection />
  //     </div>
  //   </Wrapper>
  // );
};

export default Appeals;

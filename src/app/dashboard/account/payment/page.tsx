'use client';

import { useModal } from '@/common/contexts/ModalContext';
import Loader from '@/components/loader/Loader';
import Button from '@/components/ui/Button';
import SearchInput from '@/components/ui/SearchInput';
import { Check, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AddPaymentMethod from './AddPaymentMethod';

type PaymentMethod = {
  id: number;
  name: string;
};

const paymentMethods: PaymentMethod[] = [
  { id: 1, name: 'Credit Card' },
  { id: 2, name: 'PayPal' },
  { id: 3, name: 'Bank Transfer' },
  { id: 4, name: 'Apple Pay' },
  { id: 5, name: 'Google Pay' },
];

const Payment = () => {
  const { showModal, hideModal } = useModal();
  const [selectedMethods, setSelectedMethods] = useState<number[]>([]);

  // Function to toggle selection
  const toggleSelection = (id: number) => {
    setSelectedMethods((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((methodId) => methodId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement your search logic here
  };

  // Function to show the modal with the correct content
  const handleClick = () => {
    showModal(
      <AddPaymentMethod hideModal={hideModal} />
      // <div className='w-full lg:w-[800px] h-auto bg-white rounded-xl shadow-md border-2 border-gray-500 flex flex-col gap-4'>
      //   <div className='flex flex-row items-center justify-between border-b px-8 py-6'>
      //     <h1 className='font-bold'>Select Payment Method</h1>
      //     <div className='flex justify-end'>
      //       <X onClick={hideModal} className='cursor-pointer' />
      //     </div>
      //   </div>
      //   <Loader className='h-[400px]' />
      //   {/* <div className='gap-4 flex flex-col p-8 pt-4'>
      //     <SearchInput
      //       placeholder="Type to search..."
      //       onSearch={handleSearch}
      //       showButton={false}
      //       buttonText="Go"
      //     />
      //     <ul className="space-y-2">
      //       {paymentMethods.map((method) => (
      //         <li
      //           key={method.id}
      //           className="flex justify-between items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
      //           onClick={() => toggleSelection(method.id)}
      //         >
      //           <span>{method.name}</span>
      //           {selectedMethods.includes(method.id) && (
      //             <div className='bg-black rounded-lg p-1 flex items-center justify-center'>
      //               <Check className="h-3 w-3 text-white" />
      //             </div>
      //           )}
      //         </li>
      //       ))}
      //     </ul>
      //     <div className='flex flex-row items-center gap-4 p-4 px-0'>
      //       <Button
      //         text="Cancel"
      //         className="flex-1 bg-transparent text-black border border-gray-500 hover:bg-gray-100rounded-xl px-4 py-2"
      //         onClick={() => {
      //           hideModal()
      //           setSelectedMethods([])
      //         }}
      //       />
      //       <Button
      //         text="Add Payment Method"
      //         className="flex-1 bg-black text-white hover:bg-gray-600 rounded-xl px-4 py-2"
      //         onClick={handleClick}
      //       />
      //     </div>

      //   </div> */}
      // </div>
    );
  };

  useEffect(() => {
    if (selectedMethods.length > 0) {
      handleClick()
    }
  }, [selectedMethods])
  return (
    <div className='py-12 pt-0 flex flex-col items-start gap-4'>
      <div className='flex flex-col items-start gap-4'>
        <h1 className='py-2 border-b-2 border-[#1ABCFE]'>P2P Payment Methods</h1>
        <p className='text-[#797D7E]'>
          When you list your cryptocurrencies for sale, the payment methods you've set up will be shown to potential buyers as available options. Make sure that the account holder’s name matches your verified name on iExchange. You can register up to 20 different payment methods.
        </p>
        <Button
          text="Add Payment Method"
          icon='/images/icons/add-circle.png'
          iconPosition="right"
          className="bg-black text-white hover:bg-gray-600 rounded-xl px-4 py-2"
          onClick={handleClick}
        />
      </div>
      <div>
        list of payment method
      </div>
    </div>
  );
};

export default Payment;

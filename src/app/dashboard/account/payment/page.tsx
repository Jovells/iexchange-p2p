'use client';

import { useModal } from '@/common/contexts/ModalContext';
import Button from '@/components/ui/Button';
import React, { } from 'react';
import AddPaymentMethod from './AddPaymentMethod';
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi';
import { db } from '@/common/configs/firebase';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import fetchPaymentDetails from '@/common/api/fetchPaymentDetails';


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
  const account = useAccount();



    const { data: paymentMethods, isLoading, isError } = useQuery({
      queryKey: ['paymentMethods', account.address],
      queryFn: () => fetchPaymentDetails(account.address!)
    });




  // Function to show the modal with the correct content
  const handleClick = () => {
    showModal(
      <AddPaymentMethod hideModal={hideModal} />
    );
  };

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
        
      {paymentMethods?.map((method, i) => (
            <div key={i}>{method.paymentMethod} : {method.details}</div>))}
      </div>
    </div>
  );
};

export default Payment;

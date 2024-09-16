'use client';

import { useModal } from '@/common/contexts/ModalContext';
import Button from '@/components/ui/Button';
import React, { } from 'react';
import AddPaymentMethod from './AddPaymentMethod';
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi';
import fetchPaymentDetails from '@/common/api/fetchPaymentDetails';
import { parseStringToObject } from '@/lib/utils';
import DashboardLayout from '../../DashboardLayout';


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



  const { data: methods, isLoading, isError } = useQuery({
    queryKey: ['paymentMethods', account.address],
    queryFn: () => fetchPaymentDetails(account.address!)
  });
  console.log("methods", methods)



  // Function to show the modal with the correct content
  const handleClick = () => {
    showModal(
      <AddPaymentMethod hideModal={hideModal} />
    );
  };


  return (
    <DashboardLayout>
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

          {methods?.map((method, i) => {
            const parsedDetails = parseStringToObject(method.details);
            return (
              <div key={i} className="p-2 border-b">
                <strong>{method.paymentMethod}</strong>
                <div className="">
                  {Object.entries(parsedDetails).map(([key, value], index) => (
                    <div key={index}>
                      <strong>{key}:</strong> {value}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <div></div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Payment;


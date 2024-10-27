'use client';

import { useModal } from '@/common/contexts/ModalContext';
import Button from '@/components/ui/Button';
import React, { } from 'react';
import AddPaymentMethod from './AddPaymentMethod';

import useUserPaymentMethods from "@/common/hooks/useUserPaymentMenthods";
import Loader from "@/components/loader/Loader";
import { getImage } from '@/lib/utils';
import PaymentMethods from './paymentMethods';

type PaymentMethod = {
  id: number;
  name: string;
};

const Payment = () => {
  const { showModal, hideModal } = useModal();
  const { paymentMethods, isLoading, isFetching } = useUserPaymentMethods();

  // Function to show the modal with the correct content
  const handleClick = () => {
    showModal(<AddPaymentMethod hideModal={hideModal} />);
  };

  const payntIcon = getImage("add-circle.svg")

  return (
    <>
      <div className="py-12 pt-0 flex flex-col items-start gap-4">
        <div className="flex flex-col items-start gap-4 border-b border-gray-300 dark:border-gray-700 pb-4">
          <h1 className="py-2 border-b-2 border-[#1ABCFE] text-black dark:text-white text-lg">P2P Payment Methods</h1>
          <p className="text-black dark:text-gray-100">
            When you list your cryptocurrencies for sale, the payment methods you've set up will be shown to potential
            buyers as available options. Make sure that the account holder’s name matches your verified name on
            iExchange. You can register up to 20 different payment methods.
          </p>
          <Button
            text="Add Payment Method"
            icon={payntIcon}
            iconPosition="right"
            className="bg-black text-white hover:bg-gray-600 rounded-xl px-4 py-4"
            onClick={handleClick}
          />
        </div>
        <PaymentMethods isFetching={isFetching} methods={paymentMethods} />
      </div>
    </>
  );
};

export default Payment;


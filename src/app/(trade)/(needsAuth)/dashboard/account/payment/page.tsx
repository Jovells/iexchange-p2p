'use client';

import { useModal } from '@/common/contexts/ModalContext';
import Button from '@/components/ui/Button';
import React, { } from 'react';
import AddPaymentMethod from './AddPaymentMethod';

import useUserPaymentMethods from "@/common/hooks/useUserPaymentMenthods";
import Loader from "@/components/loader/Loader";
import { getImage } from '@/lib/utils';

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
        <div className="flex flex-col items-start gap-4">
          <h1 className="py-2 border-b-2 border-[#1ABCFE]">P2P Payment Methods</h1>
          <p className="text-[#797D7E]">
            When you list your cryptocurrencies for sale, the payment methods you've set up will be shown to potential
            buyers as available options. Make sure that the account holder’s name matches your verified name on
            iExchange. You can register up to 20 different payment methods.
          </p>
          <Button
            text="Add Payment Method"
            icon={payntIcon}
            iconPosition="right"
            className="bg-black text-white hover:bg-gray-600 rounded-xl px-4 py-2"
            onClick={handleClick}
          />
        </div>
        <div>
          {isFetching && <Loader loaderType="text" />}
          {!paymentMethods && !isFetching && (
            <div className="p-4 bg-gray-100 rounded-xl text-center">
              <p className="text-gray-400 font-bold">No payment methods added yet</p>
            </div>
          )}

          {paymentMethods?.map((method, i) => {
            //TODO @mbawon modify to match figma
            return (
              <div key={i} className="p-2 border-b">
                <strong>{method.method}</strong>
                <div className="pt-2">
                  <span className="flex justify-between gap-4">
                    <span className="text-sm text-gray-500">Name:</span> <span>{method.name}</span>
                  </span>
                  <span className="flex justify-between gap-4">
                    <span className="text-sm text-gray-500">Number:</span> <span>{method.number}</span>
                  </span>
                  <span className="flex justify-between gap-4">
                    <span className="text-sm text-gray-500">Extra Details:</span> <span>{method.details}</span>
                  </span>
                </div>
              </div>
            );
          })}
          <div></div>
        </div>
      </div>
    </>
  );
};

export default Payment;



import React, { useState } from 'react';
import { X } from 'lucide-react';

type methodType = {
  id: number;
  name: string;
}

interface MethodInterface {
  paymentMethod: methodType[];
  handleDelete: (value: any) => void
}

const RenderAddedPaymentMethod: React.FC<MethodInterface> = ({ paymentMethod, handleDelete }) => {

  const removeItem = (value: any) => {
    handleDelete(value.id)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {paymentMethod && paymentMethod.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 bg-yellow-100 rounded-lg shadow-sm hover:bg-gray-100"
        >
          <span>{item.name}</span>
          <button
            onClick={removeItem}
            className="text-black hover:text-red-700 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default RenderAddedPaymentMethod;

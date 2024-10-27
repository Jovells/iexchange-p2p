import { db } from '@/common/configs/firebase';
import Loader from '@/components/loader/Loader'
import Button from '@/components/ui/Button';
import SearchInput from '@/components/ui/SearchInput'
import { Check, X } from 'lucide-react'
import React, { FC, Fragment, useState } from 'react'
import { collection, addDoc } from "firebase/firestore";
import { useContracts } from "@/common/contexts/ContractContext";
import { useQuery } from "@tanstack/react-query";
import fetchContractPaymentMethods from "@/common/api/fetchContractPaymentMethods";
import Input from "@/components/ui/input";
import { useUser } from "@/common/contexts/UserContext";
import useUserPaymentMethods from "@/common/hooks/useUserPaymentMenthods";
import toast from "react-hot-toast";
import { PaymentMethod } from "@/common/api/types";

interface Props {
  hideModal: () => void;
  buttonText?: string;
  method?: string;
  onSuccess?: (newPaymentMethod: PaymentMethod) => void;
}
const AddPaymentMethod: FC<Props> = ({ hideModal, method, onSuccess }) => {
  const { indexerUrl } = useContracts();
  const [selectedMethod, setSelectedMethod] = useState<string | null | undefined>(method);
  const [steps, setSteps] = useState(method ? 2 : 1);
  const { address } = useUser();
  const [details, setDetails] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const { refetch } = useUserPaymentMethods();

  const { data: paymentMetho, isFetching } = useQuery({
    queryKey: ["paymentOptions"],
    queryFn: () => fetchContractPaymentMethods(indexerUrl),
    enabled: !!indexerUrl,
  });

  const handleSearch = () => {};

  const handleAdd = async () => {
    const id = toast.loading("Adding payment method...");
    console.log("qaselectedMethod", selectedMethod, name, number, details);

    if (selectedMethod) {
      // Add the payment method details to the "accounts" collection
      addDoc(collection(db, `Users/${address}/paymentMethods`), {
        method: selectedMethod,
        name,
        number,
        details,
        // Add other payment method details here
      })
        .then(async () => {
          onSuccess?.({
            method: selectedMethod,
            name,
            number,
            details,
          });
          await refetch();
          hideModal();
          toast.success("Payment method added", { id });
        })
        .catch(error => {
          // Error occurred while adding payment method
          // Handle the error appropriately
          toast.error("Error adding payment method", { id });
          console.error("Error adding payment method: ", error);
        });
    }
  };


  return (
    <div className="w-full h-auto bg-transparent rounded-xl shadow-md border-2 border-gray-300 dark:border-gray-700 flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between border-b border-gray-300 dark:border-gray-700 px-8 py-6">
        <h1 className="font-bold text-black dark:text-white">Payment Method</h1>
        <div className="flex justify-end">
          <X onClick={hideModal} className="cursor-pointer text-black dark:text-white" />
        </div>
      </div>
      {paymentMetho && paymentMetho?.length > 0 ? (
        <div className="gap-4 flex flex-col p-8 pt-4">
          {steps === 1 && (
            <Fragment>
              <SearchInput placeholder="Type to search..." onSearch={handleSearch} showButton={false} buttonText="Go" />
              <ul className="space-y-2">
                {paymentMetho &&
                  paymentMetho
                    .filter(mt => mt.isAccepted)
                    .map(method => (
                      <li
                        key={method?.method}
                        className="flex justify-between items-center p-3 text-black dark:text-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:text-black"
                        onClick={() => setSelectedMethod(method?.method)}
                      >
                        <span>{method.method}</span>
                        {selectedMethod === method?.method && (
                          <div className="bg-black rounded-lg p-1 flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </li>
                    ))}
              </ul>
              <div className="flex flex-row items-center gap-4 p-4 px-0">
                <Button
                  text="Cancel"
                  className="flex-1 bg-transparent text-black dark:text-white border border-gray-500 hover:bg-gray-100rounded-xl px-4 py-2"
                  onClick={() => {
                    hideModal();
                    setSelectedMethod(null);
                  }}
                />
                <Button
                  text="Next"
                  className="flex-1 bg-black text-white hover:bg-gray-600 rounded-xl px-4 py-2"
                  onClick={() => setSteps(steps + 1)}
                  disabled={!selectedMethod}
                />
              </div>
            </Fragment>
          )}
          {steps === 2 && (
            <Fragment>
              <div className="space-y-3">
                <p className='text-black dark:text-white'>
                  Provide your <span className="font-bold underline text-lg">{selectedMethod}</span> details.{" "}
                </p>
                <Input value={name} required onChange={e => setName(e.target.value)} label="Name" />
                <Input value={number} required onChange={e => setNumber(e.target.value)} label="Number" />
                <textarea
                  placeholder="Extra details?"
                  onChange={e => setDetails(e.target.value)}
                  rows={10}
                  className="w-full p-4 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl outline-none resize-none bg-transparent "
                />
              </div>
              <div className="flex flex-row items-center gap-4 p-4 px-0">
                <Button
                  text="Back"
                  className="flex-1 bg-transparent text-black dark:text-white border border-gray-500 hover:bg-gray-100rounded-xl px-4 py-2"
                  onClick={() => {
                    setSteps(steps - 1);
                  }}
                />
                <Button
                  text="Add Payment Method"
                  className="flex-1 bg-black text-white hover:bg-gray-600 rounded-xl px-4 py-2"
                  onClick={handleAdd}
                />
              </div>
            </Fragment>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default AddPaymentMethod
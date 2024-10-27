import { useModal } from '@/common/contexts/ModalContext';
import { X } from 'lucide-react';
import React from 'react';
import Button from '../ui/Button';
import Image from 'next/image';
import { shortenAddress } from "@/lib/utils";
import { useContracts } from "@/common/contexts/ContractContext";

interface Props {
  onClick: () => Promise<string>;
  cancellationsRemaining: number;
}

const OrderCancellationWarning: React.FC<Props> = ({ onClick, cancellationsRemaining }) => {
  const { showModal, hideModal } = useModal();
  const { currentChain } = useContracts();
  const [isLoading, setIsLoading] = React.useState(false);

  const showConfirmation = (txHash: string) => {
    showModal(
      <div className="w-full bg-white dark:bg-gray-800 p-14 rounded-[8px] flex flex-col justify-center items-center">
        <Image src="/images/icons/alert-info.svg" alt="info" className="w-auto h-auto mb-8" width={84} height={84} />
        <h2 className="font-[500px] text-center text-[16px] mb-6 dark:text-white">Note, You have Cancelled Your Order</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 text-[14px] font-[400px] mb-6">
          Please remember that you only {cancellationsRemaining - 1} more attempt, otherwise your account will be
          suspended.
        </p>
        <div className="text-gray-500 dark:text-gray-400">TxHash :</div>
        <a 
          href={`${currentChain?.blockExplorers?.default.url}/tx/${txHash}`} 
          target="_blank" 
          className="text-blue-500 dark:text-blue-400"
        >
          {shortenAddress(txHash, 8)}
        </a>
        <Button text="OK" className="w-full text-black dark:text-white bg-transparent border border-gray-200 dark:border-gray-600" onClick={hideModal} />
      </div>,
    );
  };

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const txHash = await onClick();
      hideModal();
      showConfirmation(txHash);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[400px] bg-white dark:bg-gray-800 rounded-[8px]">
      <div className="flex flex-row justify-between items-center border-b border-gray-200 dark:border-gray-600 font-[500px] p-6 px-10">
        <h2 className="font-[500px] text-[16px] dark:text-white">Order Cancellation Warning</h2>
        <X onClick={hideModal} className="text-gray-500 dark:text-gray-400 cursor-pointer" />
      </div>
      <div className="p-6 px-10 flex flex-col gap-8">
        <p className="text-gray-500 dark:text-gray-400 font-[400px] text-[14px]">
          If you cancel {cancellationsRemaining} more orders, your account will be temporarily restricted from placing
          new orders. You will receive an email notification once the restriction is lifted, allowing you to place
          orders again.
        </p>
        <p className="text-gray-500 dark:text-gray-400 font-[400px] text-[14px]">
          We value your participation in our P2P community and appreciate your understanding in this matter. If you have
          any questions or need assistance, please do not hesitate to contact our support team.
        </p>
        <Button loading={isLoading} text="Continue" className="w-full text-white bg-black dark:bg-gray-700" onClick={handleClick} />
      </div>
    </div>
  );
};

export default OrderCancellationWarning;

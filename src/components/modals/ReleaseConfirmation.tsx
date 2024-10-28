import { useModal } from '@/common/contexts/ModalContext'
import { X } from 'lucide-react';
import React from 'react'
import Button from '../ui/Button';
import Image from 'next/image';
import { useContracts } from '@/common/contexts/ContractContext';
import { shortenAddress } from '@/lib/utils';

interface Props {
  onClick: () => Promise<string>
  cryptoAmount: string;
  fiatAmount: string;
}

const ReleaseConfirmation: React.FC<Props> = ({ onClick, cryptoAmount, fiatAmount }) => {
  const { showModal, hideModal } = useModal();
  const { currentChain } = useContracts();
  const [isLoading, setIsLoading] = React.useState(false);

  const showConfirmation = (txHash: string) => {
    showModal(
      <div className="w-full bg-white dark:bg-gray-800 p-14 rounded-[8px] flex flex-col justify-center items-center">
        <Image src="/images/icons/alert-success.svg" alt="info" className="w-auto h-auto mb-8" width={84} height={84} />
        <h2 className="font-medium text-center text-[16px] mb-6 text-black dark:text-white">Sell Successful</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 text-[14px] font-normal mb-6">
          You have successfully sold {cryptoAmount} for {fiatAmount}!
        </p>
        <div className="text-gray-500 dark:text-gray-400">TxHash:</div>
        <a
          href={`${currentChain?.blockExplorers?.default.url}/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 dark:text-blue-400"
        >
          {shortenAddress(txHash, 8)}
        </a>
        <Button
          text="OK"
          className="w-full text-black dark:text-white bg-transparent border border-gray-200 dark:border-gray-600"
          onClick={hideModal}
        />
      </div>,
    );
  };

  const handleClick = async () => {
    setIsLoading(true);
    try {
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
      <div className="flex flex-row justify-between items-center border-b border-gray-200 dark:border-gray-600 font-medium p-6 px-10">
        <h2 className="font-medium text-[16px] text-black dark:text-white">Release Confirmation</h2>
        <X onClick={hideModal} className="text-black dark:text-white" />
      </div>
      <div className="p-6 px-10 flex flex-col gap-4">
        <p className="text-gray-500 dark:text-gray-400 font-normal text-[14px]">
          By clicking "Confirm Payment," you agree to our [Terms and Conditions] and acknowledge that the payment
          details are accurate.
        </p>
        <p className="text-gray-500 dark:text-gray-400 font-normal text-[14px]">
          Ensure that the payment has been fully received in your account. Once you confirm the payment, the
          cryptocurrency will be released to the buyer. This action cannot be undone.
        </p>
        <p className="text-gray-500 dark:text-gray-400 font-normal text-[14px] border border-red-400 dark:border-red-600 rounded-[8px] p-3">
          iExchange is not responsible for any losses or damages resulting from the use of the platform, including, but
          not limited to, financial losses, data breaches, or unauthorized access to your account.
        </p>
        <Button
          loading={isLoading}
          text="Confirm Release"
          className="w-full text-white bg-black dark:bg-gray-700"
          onClick={handleClick}
        />
      </div>
    </div>
  );
}

export default ReleaseConfirmation;

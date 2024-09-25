import { useWriteContract as useWagmiWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import toast from 'react-hot-toast';
import { useModal } from '../contexts/ModalContext';
import ModalAlert from '@/components/modals';
import { use, useEffect, useState } from 'react';
import { config } from '../configs';
import { getBlock } from '@wagmi/core'


 function useWriteContractWithToast() {
    const { showModal } = useModal()
    const [isPending, setIspending] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

  const writeContractResult = useWagmiWriteContract();
  const {data: receipt, isError, error} = useWaitForTransactionReceipt({
    hash: writeContractResult.data,
    confirmations: 1,

  })

  const { writeContractAsync, writeContract } = writeContractResult;

  const customWriteAsync = async (
    { shouldShowModal = false,
      modalAction,
      loadingMessage,
      toastId,
      timeTimeToWait = 5000,
      errorMessage,
    successMessage} : {
      timeTimeToWait?: number,
      shouldShowModal?: boolean,
      toastId?: string,
      modalAction?: any,
      errorMessage?: string,
      loadingMessage?: string,
        successMessage?: string},
    ...args: Parameters<typeof writeContractAsync>
  ) => {

    toastId =  toastId || toast.loading(loadingMessage || 'Calling ' + args[0].functionName + '...');
    try {
      setIspending(true)
      const result = await writeContractAsync(...args);
      await new Promise((resolve) => setTimeout(resolve, timeTimeToWait));
      
      shouldShowModal && showModal( <ModalAlert buttonText="Done" buttonClick={modalAction} 
      modalType="success" 
      title="Successful" 
      description= {successMessage || args[0].functionName + ' successful'}   
      icon="../../images/icons/success.png" />);

      toast.success(successMessage || args[0].functionName + ' successful', { id: toastId  });

      setIsSuccess(true)
         } catch (error: any) {
      toast.error(errorMessage || `Transaction Failed: ${error.message}`, { id: toastId });
      throw new Error(error);
    }
    finally {
      setIspending(false)
    }
  };

  const customWrite = (...args: Parameters<typeof writeContract>) => {
    const toastId = toast.loading('Processing Transaction...');
    try {
      const result = writeContract(...args);
      toast.success('Transaction Successful', { id: toastId });

      return result;
    } catch (error: any) {
      toast.error(`Transaction Failed: ${error.message}`, { id: toastId });
      throw error;
    }
  };



  return {
    ...writeContractResult,
    receipt,
    isPending,
    isSuccess,
    writeContractAsync: customWriteAsync,
    writeContract: customWrite,
  };
}

export default useWriteContractWithToast;
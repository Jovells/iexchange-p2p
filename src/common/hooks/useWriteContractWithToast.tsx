import { useWriteContract as useWagmiWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ixToast as toast } from "@/lib/utils";
import { useModal } from '../contexts/ModalContext';
import ModalAlert from '@/components/modals';
import { useState } from 'react';



 function useWriteContractWithToast() {
    const { showModal } = useModal()
    const [isPending, setIspending] = useState(false)

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
      timeTimeToWait,
      errorMessage,
      afterAction,
    successMessage} : {
      timeTimeToWait?: number,
      shouldShowModal?: boolean,
      toastId?: string,
      modalAction?: any,
      afterAction?: Promise<any>,
      errorMessage?: string,
      loadingMessage?: string,
        successMessage?: string},
    ...args: Parameters<typeof writeContractAsync>
  ) => {

    toastId =  toastId || toast.loading(loadingMessage || 'Calling ' + args[0].functionName + '...');
    try {
      setIspending(true)
      const txHash = await writeContractAsync(...args);
      console.log("vb before afterAction")
      await afterAction;
      console.log("after afterAction")
      timeTimeToWait= timeTimeToWait || afterAction ? 0 : 5000;
      await new Promise((resolve) => setTimeout(resolve, timeTimeToWait));
      console.log("vb after wait")
      shouldShowModal && showModal( <ModalAlert buttonText="Done" buttonClick={modalAction} 
      modalType="success" 
      title="Successful" 
      description= {successMessage || args[0].functionName + ' successful'}   
      icon="../../images/icons/success.png" />);
      toast.success(successMessage || args[0].functionName + ' successful', { id: toastId  });
      return txHash;

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
    writeContractAsync: customWriteAsync,
    writeContract: customWrite,
  };
}

export default useWriteContractWithToast;
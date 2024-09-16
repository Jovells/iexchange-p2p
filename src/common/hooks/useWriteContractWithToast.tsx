import { useWriteContract as useWagmiWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import toast from 'react-hot-toast';
import { useModal } from '../contexts/ModalContext';
import ModalAlert from '@/components/modals';


 function useWriteContractWithToast() {
    const { showModal } = useModal()

  const writeContractResult = useWagmiWriteContract();
  const {data: receipt, isSuccess, isError, error} = useWaitForTransactionReceipt({
    hash: writeContractResult.data,
    confirmations: 1
  })

  const { writeContractAsync, writeContract } = writeContractResult;

  const customWriteAsync = async (
    { shouldShowModal = false,
      modalAction,
      loadingMessage,
    successMessage} : {
      shouldShowModal?: boolean,
      modalAction?: any,
      loadingMessage?: string,
        successMessage?: string},
    ...args: Parameters<typeof writeContractAsync>
  ) => {

    const toastId = toast.loading(loadingMessage || 'Calling ' + args[0].functionName + '...');
    try {
      const result = await writeContractAsync(...args);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      toast.success(successMessage || args[0].functionName + ' successful', { id: toastId  });
      shouldShowModal && showModal( <ModalAlert buttonText="Done" buttonClick={modalAction} 
      modalType="success" 
      title="Successful" 
      description= {successMessage || args[0].functionName + ' successful'}   
      icon="../../images/icons/success.png" />);

      while (!(isSuccess || isError)) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if(isSuccess) {
        return receipt;
      }else{
        throw new Error(error as any)
      };
    } catch (error: any) {
      toast.error(`Transaction Failed: ${error.message}`, { id: toastId });
      throw error;
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
    writeContractAsync: customWriteAsync,
    writeContract: customWrite,
  };
}

export default useWriteContractWithToast;
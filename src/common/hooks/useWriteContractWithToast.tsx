import { useWriteContract as useWagmiWriteContract } from 'wagmi';
import toast from 'react-hot-toast';
import { useModal } from '../contexts/ModalContext';
import ModalAlert from '@/components/modals';


 function useWriteContractWithToast() {
    const { showModal } = useModal()

  const writeContractResult = useWagmiWriteContract();

  const { writeContractAsync, writeContract } = writeContractResult;

  const customWriteAsync = async (
    {loadingMessage,
    successMessage} : {loadingMessage?: string,
        successMessage?: string},
    ...args: Parameters<typeof writeContractAsync>
  ) => {
    const toastId = toast.loading(loadingMessage || 'Calling ' + args[0].functionName + '...');
    try {
      const result = await writeContractAsync(...args);
      toast.success(successMessage || args[0].functionName + ' successful', { id: toastId  });
      showModal( <ModalAlert buttonText="Done" buttonClick={async () => { }} 
      modalType="success" 
      title="Successful" 
      description= {successMessage || args[0].functionName + ' successful'}   
      icon="../../images/icons/success.png" />);

      return result;
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

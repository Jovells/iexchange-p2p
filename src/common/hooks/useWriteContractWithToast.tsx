import { useWriteContract as useWagmiWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ixToast as toast } from "@/lib/utils";
import { useModal } from '../contexts/ModalContext';
import ModalAlert from '@/components/modals';
import { useEffect, useRef, useState } from "react";
import { decodeEventLog, TransactionReceipt } from "viem";
import { WriteContractWithToastReturnType } from "../api/types";

type Options = {
  timeTimeToWait?: number;
  shouldShowModal?: boolean;
  toastId?: string;
  modalAction?: any;
  afterAction?: Promise<any>;
  errorMessage?: string;
  loadingMessage?: string;
  successMessage?: string;
  waitForReceipt?: boolean;
  args?: any;
};



function useWriteContractWithToast(numConfirmations = 1) {
  const { showModal } = useModal();
  const [isPending, setIspending] = useState(false);
  const [options, setOptions] = useState<Options>();
  const [decodedLogs, setDecodedLogs] = useState<any[]>([]);
  const writeContractResult = useWagmiWriteContract();
  const {
    data: receipt,
    isError,
    error,
  } = useWaitForTransactionReceipt({
    hash: writeContractResult.data,
    confirmations: numConfirmations,
  });
  const promiseRef = useRef<{ resolve: (data: WriteContractWithToastReturnType) => void; reject: Function }>();

  const { writeContractAsync, writeContract } = writeContractResult;

  const customWriteAsync = async (
    options: Options,
    ...args: Parameters<typeof writeContractAsync>
  ): Promise<WriteContractWithToastReturnType> => {
    const {
      waitForReceipt,
      loadingMessage,
      toastId: tId,
      timeTimeToWait: ttw,
      errorMessage,
      afterAction,
      successMessage,
    } = options;
    const toastId = toast.loading(loadingMessage || "Calling " + args[0].functionName + "...", { id: tId });
    setOptions({ ...options, toastId, args });
    try {
      setIspending(true);
      const txHash = await writeContractAsync(...args);
      console.log("vb before afterAction");
      await afterAction;
      console.log("after afterAction");
      const timeTimeToWait = ttw || afterAction ? 0 : 5000;
      await new Promise(resolve => setTimeout(resolve, timeTimeToWait));
      console.log("vb after wait");
      const p = new Promise((resolve, reject) => {
        promiseRef.current = { resolve, reject };
        if (!waitForReceipt) {
          resolve({ txHash });
          toast.success(successMessage || "Transaction Successful", { id: toastId });
        }
      });
      console.log("vb after promise", p);
      return p as Promise<WriteContractWithToastReturnType>;
    } catch (error: any) {
      toast.error(errorMessage || `Transaction Failed: ${error.message}`, { id: toastId });
      throw new Error(error);
    } finally {
      setIspending(false);
    }
  };

  const customWrite = (...args: Parameters<typeof writeContract>) => {
    const toastId = toast.loading("Processing Transaction...");
    try {
      const result = writeContract(...args);
      toast.success("Transaction Successful", { id: toastId });

      return result;
    } catch (error: any) {
      toast.error(`Transaction Failed: ${error.message}`, { id: toastId });
      throw error;
    }
  };

  useEffect(() => {
    //TODO:@Jovells refactor to prevent running if user is not waiting for receipt
    if (receipt) {
      let logs = [];
      console.log("qs receipt", receipt.logs);
      for (const log of receipt.logs) {
        try {
          console.log("qs log", log.data, log.topics, options?.args[0].abi);
          const decoded = decodeEventLog({
            abi: options?.args[0].abi,
            data: log.data,
            topics: log.topics,
          });
          logs.push(decoded || log);
        } catch (e) {
          console.log("qs error", e);
          continue;
        }
      }

      setDecodedLogs(logs);
      console.log("qs decoded", logs, promiseRef.current);
      promiseRef.current?.resolve({ receipt, decodedLogs: logs, txHash: receipt.transactionHash });
      if (options?.waitForReceipt) {
        options?.shouldShowModal
          ? showModal(
              <ModalAlert
                buttonText="Done"
                buttonClick={options.modalAction}
                modalType="success"
                title="Successful"
                description={options.successMessage || options.args[0].functionName + " successful"}
                icon="../../images/icons/success.png"
              />,
            )
          : toast.success(options?.successMessage || options?.args[0].functionName + " successful", {
              id: options?.toastId,
            });
      }
    }
  }, [receipt, options?.toastId]);

  return {
    ...writeContractResult,
    receipt,
    isPending,
    writeContractAsync: customWriteAsync,
    writeContract: customWrite,
  };
}

export default useWriteContractWithToast;
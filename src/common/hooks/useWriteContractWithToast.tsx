import { useWriteContract as useWagmiWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ixToast as toast } from "@/lib/utils";
import { useModal } from '../contexts/ModalContext';
import ModalAlert from '@/components/modals';
import { useEffect, useRef, useState } from "react";
import { decodeEventLog, TransactionReceipt } from "viem";
import { DecodedLog, WriteContractWithToastReturnType } from "../api/types";

type Options = {
  timeTimeToWait?: number;
  shouldShowModal?: boolean;
  toastId?: string;
  modalAction?: any;
  onTxSent?: (txHash: `0x${string}`) => Promise<any>;
  onReceipt?: ({ receipt, decodedLogs }: { receipt: TransactionReceipt; decodedLogs: DecodedLog[] }) => Promise<any>;
  errorMessage?: string;
  loadingMessage?: string;
  successMessage?: string;
  waitForReceipt?: boolean;
  args?: Record<string, any>;
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
  const [promiseResolveReject, setPromiseResolveReject] = useState<{ resolve: any; reject: any }>();

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
      onTxSent,
      onReceipt,
      successMessage,
    } = options;
    const toastId = toast.loading(loadingMessage || "Calling " + args[0].functionName + "...", { id: tId });
    setOptions({ ...options, toastId, args });
    try {
      setIspending(true);
      const txHash = await writeContractAsync(...args);
      console.log("vb before afterAction");
      await onTxSent?.(txHash);
      console.log("after afterAction");
      const timeTimeToWait = ttw || onTxSent ? 0 : 5000;
      await new Promise(resolve => setTimeout(resolve, timeTimeToWait));
      console.log("vb after wait");
      const p = new Promise((resolve, reject) => {
        setPromiseResolveReject({ resolve, reject });
        console.log("vb in promise", promiseResolveReject);
        if (!waitForReceipt) {
          resolve({ txHash });
          toast.success(successMessage || "Transaction Successful", { id: toastId });
        }
      });
      console.log("vb before finalResult promise", p);
      const finalResult = await p;
      console.log("vb after promise", p, "vb finalResult", finalResult);
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
    const handleReceipt = async () => {
      console.log("qsvb receipt", receipt, promiseResolveReject, writeContractResult);
      if (receipt && promiseResolveReject) {
        let logs: DecodedLog[] = [];
        console.log("qs receipt", receipt.logs);
        for (const log of receipt.logs) {
          try {
            console.log("qs log", log.data, log.topics, options?.args?.[0].abi);
            const decoded = decodeEventLog({
              abi: options?.args?.[0].abi,
              data: log.data,
              topics: log.topics,
            }) as DecodedLog;
            logs.push(decoded || log);
          } catch (e) {
            console.log("qs error", e);
            continue;
          }
        }

        setDecodedLogs(logs);
        console.log("qs decoded", logs, promiseResolveReject);
        await options?.onReceipt?.({ receipt, decodedLogs: logs });
        console.log("qkl after onReceipt", promiseResolveReject);
        promiseResolveReject?.resolve({ receipt, decodedLogs: logs, txHash: receipt.transactionHash });
        if (options?.waitForReceipt) {
          options?.shouldShowModal
            ? showModal(
                <ModalAlert
                  buttonText="Done"
                  buttonClick={options.modalAction}
                  modalType="success"
                  title="Successful"
                  description={options.successMessage || options.args?.[0].functionName + " successful"}
                  icon="../../images/icons/success.png"
                />,
              )
            : toast.success(options?.successMessage || options?.args?.[0].functionName + " successful", {
                id: options?.toastId,
              });
        }
      }
    };

    handleReceipt();
  }, [receipt, options?.toastId, promiseResolveReject]);

  return {
    ...writeContractResult,
    receipt,
    isPending,
    writeContractAsync: customWriteAsync,
    writeContract: customWrite,
  };
}

export default useWriteContractWithToast;
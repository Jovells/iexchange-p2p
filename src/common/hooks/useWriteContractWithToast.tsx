import { useWriteContract as useWagmiWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useModal } from "../contexts/ModalContext";
import ModalAlert from "@/components/modals";
import { useEffect, useState } from "react";
import { decodeEventLog, encodeFunctionData, TransactionReceipt } from "viem";
import { DecodedLog, WriteContractWithToastReturnType } from "../api/types";
import { useSendUserOperation, useSmartAccountClient } from "@account-kit/react";
import { WriteContractFunctionParameters } from "viem/experimental";
import { getErrorMessage } from "@/lib/utils";

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
  const { showModal, hideModal } = useModal();
  const [isPending, setIspending] = useState(false);
  const [options, setOptions] = useState<Options>();
  const [decodedLogs, setDecodedLogs] = useState<any[]>([]);
  const [hash, setHash] = useState<`0x${string}`>();
  const writeContractResult = useWagmiWriteContract();
  const { client } = useSmartAccountClient({ type: "LightAccount" });

  const { sendUserOperation, isSendingUserOperation, sendUserOperationAsync } = useSendUserOperation({
    client,
    waitForTxn: true,
    onSuccess: async ({ hash, request }) => {
      setHash(hash);
      await options?.onTxSent?.(hash);
    },
    onError: error => {
      console.log("qsalch error", error.name, error.message);
      showModal(
        <ModalAlert
          title="Transaction Failed"
          description={getErrorMessage(error.message) || "Transaction Failed"}
          modalType="error"
        />,
      );
      throw error;
    },
  });

  const {
    data: receipt,
    isError,
    error,
    status,
  } = useWaitForTransactionReceipt({
    hash,
    confirmations: numConfirmations,
  });

  const [promiseResolveReject, setPromiseResolveReject] = useState<{ resolve: any; reject: any }>();

  const customWriteAsync = async (
    options: Options,
    ...args: [WriteContractFunctionParameters]
  ): Promise<WriteContractWithToastReturnType> => {
    const {
      waitForReceipt,
      loadingMessage,
      timeTimeToWait: ttw,
      errorMessage,
      onTxSent,
      onReceipt,
      successMessage,
    } = options;

    showModal(<ModalAlert title="Transaction In Progress" description="Please wait." modalType="loading" />);

    setOptions({ ...options, args });

    try {
      setIspending(true);

      const data = encodeFunctionData({
        abi: args[0].abi,
        functionName: args[0].functionName,
        args: args[0].args,
      });

      const op = await sendUserOperationAsync({
        uo: {
          target: args[0].address,
          data,
          value: args[0].value,
        },
      });
      console.log("qsalch op", op);

      showModal(
        <ModalAlert
          title="Transaction In Progress"
          description={loadingMessage || "Transaction sent. Waiting for confirmation."}
          modalType="loading"
        />,
      );

      const timeTimeToWait = ttw || onTxSent ? 0 : 5000;
      await new Promise(resolve => setTimeout(resolve, timeTimeToWait));

      const p = new Promise((resolve, reject) => {
        setPromiseResolveReject({ resolve, reject });
        if (!waitForReceipt) {
          resolve({ hash });
          showModal(
            <ModalAlert
              title="Transaction Successful"
              description={successMessage || "Transaction Successful"}
              modalType="success"
              autoClose
            />,
          );
        }
      });

      const finalResult = await p;
      return p as Promise<WriteContractWithToastReturnType>;
    } catch (error: any) {
      showModal(
        <ModalAlert
          title="Transaction Failed"
          description={errorMessage || `Transaction Failed: ${getErrorMessage(error.message)}`}
          modalType="error"
        />,
      );
      throw new Error(error);
    } finally {
      setIspending(false);
    }
  };

  useEffect(() => {
    const handleReceipt = async () => {
      if (receipt && promiseResolveReject) {
        let logs: DecodedLog[] = [];
        for (const log of receipt.logs) {
          try {
            const decoded = decodeEventLog({
              abi: options?.args?.[0].abi,
              data: log.data,
              topics: log.topics,
            }) as DecodedLog;
            logs.push(decoded || log);
          } catch (e) {
            continue;
          }
        }

        setDecodedLogs(logs);
        await options?.onReceipt?.({ receipt, decodedLogs: logs });
        promiseResolveReject?.resolve({ receipt, decodedLogs: logs, txHash: receipt.transactionHash });

        if (options?.waitForReceipt) {
          options?.shouldShowModal
            ? showModal(
                <ModalAlert
                  buttonText="Done"
                  buttonClick={options.modalAction}
                  modalType="success"
                  autoClose
                  title="Successful"
                  description={options.successMessage || options.args?.[0].functionName + " successful"}
                  icon="../../images/icons/success.png"
                />,
              )
            : showModal(
                <ModalAlert
                  title="Transaction Successful"
                  description={options?.successMessage || options?.args?.[0].functionName + " successful"}
                  modalType="success"
                  autoClose
                />,
              );
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
  };
}

export default useWriteContractWithToast;

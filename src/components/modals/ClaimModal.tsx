'use client'

import React, { useEffect, useState, useCallback } from 'react';
import Button from '../ui/Button';
import { ArrowRight, X } from 'lucide-react';
import { useContracts } from '@/common/contexts/ContractContext';
import { useReadContract } from "wagmi";
import Loader from '../loader/Loader';
import useWriteContractWithToast from '@/common/hooks/useWriteContractWithToast';
import { useModal } from '@/common/contexts/ModalContext';
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/common/contexts/UserContext";

const ClaimModal = () => {
  const queryClient = useQueryClient();
  const { hideModal } = useModal();
  const { faucet } = useContracts();
  const { address } = useUser();

  const { data: lastClaimed, isFetching } = useReadContract({
    abi: faucet.abi,
    address: faucet.address,
    functionName: "lastClaimed",
    args: [address!],
    query: { enabled: !!address },
  });

  const { writeContractAsync: claim, isPending: isClaiming } = useWriteContractWithToast();

  const [isClaimAvailable, setIsClaimAvailable] = useState(false);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [timeElapsed, setTimeElapsed] = useState({
    days: "0",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  async function handleClaim() {
    try {
      await claim(
        {},
        {
          abi: faucet.abi,
          address: faucet.address,
          functionName: "claim",
          args: [],
        },
      );
      hideModal();
      queryClient.refetchQueries({ queryKey: ["readContract", { functionName: "balanceOf" }] });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (lastClaimed !== undefined) {
      const calculatedEndDate = new Date(Number(lastClaimed) * 1000 + 24 * 60 * 60 * 1000);
      setEndDate(calculatedEndDate);
    }
  }, [lastClaimed]);

  const calculateTimeElapsed = useCallback(() => {
    if (!endDate) return;

    const currentDate = new Date();
    const difference = endDate.getTime() - currentDate.getTime();
    let newTimeElapsed = {
      days: "0",
      hours: "00",
      minutes: "00",
      seconds: "00",
    };

    if (difference > 0) {
      newTimeElapsed = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)).toString(),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24)
          .toString()
          .padStart(2, "0"),
        minutes: Math.floor((difference / 1000 / 60) % 60)
          .toString()
          .padStart(2, "0"),
        seconds: Math.floor((difference / 1000) % 60)
          .toString()
          .padStart(2, "0"),
      };
    } else {
      setIsClaimAvailable(true);
    }

    setTimeElapsed(newTimeElapsed);
  }, [endDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      calculateTimeElapsed();
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeElapsed]);

  const timerComponents: JSX.Element[] = [];

  Object.keys(timeElapsed).forEach(interval => {
    timerComponents.push(
      <div
        key={interval}
        className="flex-1 h-[100px] p-3 px-2 bg-gradient-to-b from-gray-300 to-gray-800 dark:from-gray-600 dark:to-gray-900 border text-white rounded-xl"
      >
        <div className="text-center h-[50%] capitalize">{interval}</div>
        <div className="text-center h-[50%] text-3xl">{timeElapsed[interval as keyof typeof timeElapsed]}</div>
      </div>,
    );
  });

  // if (isFetching) {
  //   return <Loader />;
  // }

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end lg:items-center">
        {/* Mobile Bottom-Up Modal */}
        <div className={`w-full min-h-[500px] bg-white rounded-t-xl p-8 flex flex-col items-center dark:bg-gray-800 lg:rounded-xl lg:w-[500px] lg:min-h-[auto] lg:h-auto`}>
          <div className="flex justify-end">
            <button onClick={hideModal} aria-label="Close modal" className="text-gray-600 dark:text-gray-300">
              <X />
            </button>
          </div>
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-center text-2xl font-medium text-gray-800 dark:text-gray-200">Available Tokens</h1>
              <p className="text-center text-lg text-gray-500 dark:text-gray-400">Claim the number of Tokens you have been allocated below.</p>
            </div>
            {!isClaimAvailable ? (
              <div className="flex flex-col gap-6">
                <div className="w-full border rounded-xl bg-gray-100 dark:bg-gray-700 p-6 py-4 flex flex-col justify-center">
                  <p className="text-center text-gray-500 dark:text-gray-300 text-xs">
                    Currently there are no tokens available for claiming. Kindly visit after a period of 24 hours to claim.
                  </p>
                </div>
                <div className="w-full flex flex-row gap-4">
                  {timerComponents.length ? timerComponents : <span>Just now!</span>}
                </div>
                <div className="w-full border rounded-xl bg-yellow-100 dark:bg-yellow-600 p-6 py-4 flex flex-col border-red-400 shadow-md">
                  <h1 className="text-xl text-black dark:text-white font-medium">Notice on claiming Tokens</h1>
                  <p className="text-gray-500 dark:text-gray-300 text-xs">
                    It is important to note that your allocated tokens can be claimed once daily after 24 hours of initial
                    claim.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="w-full border rounded-xl bg-gray-100 dark:bg-gray-700 p-6 py-4 flex flex-col justify-center">
                  <h2 className="text-sm text-gray-500 dark:text-gray-300 text-center">Amount of RMP</h2>
                  <h2 className="text-xl text-gray-600 dark:text-gray-100 text-center">5000 RMP</h2>
                </div>
                <div className="w-full border rounded-xl bg-gray-100 dark:bg-gray-700 p-6 py-4 flex flex-col justify-center">
                  <h2 className="text-sm text-gray-500 dark:text-gray-300 text-center">Amount of TRK</h2>
                  <h2 className="text-xl text-gray-600 dark:text-gray-100 text-center">5000 TRK</h2>
                </div>
                <div className="w-full border rounded-xl bg-gray-100 dark:bg-gray-700 p-6 py-4 flex flex-col justify-center">
                  <h2 className="text-sm text-gray-500 dark:text-gray-300 text-center">Amount of CEDIH</h2>
                  <h2 className="text-xl text-gray-600 dark:text-gray-100 text-center">5000 CEDIH</h2>
                </div>
              </div>
            )}
            <Button
              text={isClaiming ? "Claiming..." : "Claim All"}
              className="bg-black text-white px-4 py-4 rounded-xl dark:bg-gray-700 dark:text-gray-200"
              icon={<ArrowRight />}
              iconPosition="right"
              disabled={!isClaimAvailable || isClaiming}
              onClick={handleClaim}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ClaimModal;

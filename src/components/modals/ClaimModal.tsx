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
        className="flex-1 h-[100px] p-3 px-2 bg-gradient-to-b from-gray-300 to-gray-800 border text-white rounded-xl"
      >
        <div className="text-center h-[50%] capitalize">{interval}</div>
        <div className="text-center h-[50%] text-3xl">{timeElapsed[interval as keyof typeof timeElapsed]}</div>
      </div>,
    );
  });

  if (isFetching) {
    return <Loader />;
  }

  return (
    <div className="w-full lg:w-[500px] min-h-[500px] rounded-xl bg-white p-8 flex flex-col items-center">
      <div className="flex flex-col gap-8">
        <div className="flex justify-end items-center">
          <button className="" onClick={hideModal} aria-label="Close modal">
            <X />
          </button>
        </div>
        <div>
          <h1 className="text-center text-2xl font-medium">Available Tokens</h1>
          <p className="text-center text-lg text-gray-500">Claim the number of Tokens you have been allocated below.</p>
        </div>
        {!isClaimAvailable ? (
          <div className="flex flex-col gap-6">
            <div className="w-full border rounded-xl bg-gray-100 p-6 py-4 flex flex-col justify-center">
              <p className="text-center text-gray-500 text-xs">
                Currently there are no tokens available for claiming. Kindly visit after a period of 24 hours to claim.
              </p>
            </div>
            <div className="w-full flex flex-row gap-4">
              {timerComponents.length ? timerComponents : <span>Just now!</span>}
            </div>
            <div className="w-full border rounded-xl bg-yellow-100 p-6 py-4 flex flex-col border-red-400 shadow-md">
              <h1 className="text-xl text-black font-medium">Notice on claiming Tokens</h1>
              <p className="text-gray-500 text-xs">
                It is important to note that your allocated tokens can be claimed once daily after 24 hours of initial
                claim.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="w-full border rounded-xl bg-gray-100 p-6 py-4 flex flex-col justify-center">
              <h2 className="text-sm text-gray-500 text-center">Amount of RMP</h2>
              <h2 className="text-xl text-gray-600 text-center">5000 RMP</h2>
            </div>
            <div className="w-full border rounded-xl bg-gray-100 p-6 py-4 flex flex-col justify-center">
              <h2 className="text-sm text-gray-500 text-center">Amount of TRK</h2>
              <h2 className="text-xl text-gray-600 text-center">5000 TRK</h2>
            </div>
            <div className="w-full border rounded-xl bg-gray-100 p-6 py-4 flex flex-col justify-center">
              <h2 className="text-sm text-gray-500 text-center">Amount of CEDIH</h2>
              <h2 className="text-xl text-gray-600 text-center">5000 CEDIH</h2>
            </div>
          </div>
        )}
        <Button
          text={isClaiming ? "Claiming..." : "Claim All"}
          className="bg-black text-white px-4 py-4 rounded-xl"
          icon={<ArrowRight />}
          iconPosition="right"
          disabled={!isClaimAvailable || isClaiming}
          onClick={() => handleClaim()}
        />
      </div>
    </div>
  );
};

export default ClaimModal;
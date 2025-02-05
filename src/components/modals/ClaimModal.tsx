'use client'

import React, { useEffect, useState, useCallback } from 'react';
import Button from '../ui/Button';
import { ArrowRight, ExternalLink, Icon, X } from "lucide-react";
import { useContracts } from "@/common/contexts/ContractContext";
import { useReadContract } from "wagmi";
import Loader from "../loader/Loader";
import useWriteContractWithToast from "@/common/hooks/useWriteContractWithToast";
import { useModal } from "@/common/contexts/ModalContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/common/contexts/UserContext";
import { ACCEPTED_TOKENS, TOKEN_BALANCES } from "@/common/constants/queryKeys";
import { fetchTokens } from "@/common/api/fetchTokens";
import Link from "next/link";

const ClaimModal = () => {
  const queryClient = useQueryClient();
  const { hideModal } = useModal();
  const { faucet, indexerUrl, currentChain } = useContracts();
  const { address } = useUser();

  const { data: acceptedTokens, isPending: isAcceptedTokensPending } = useQuery({
    queryKey: ACCEPTED_TOKENS(indexerUrl),
    queryFn: () => fetchTokens(indexerUrl),
    enabled: !!indexerUrl,
  });

  const { data: lastClaimed, isLoading: isClaimLoading } = useReadContract({
    abi: faucet.abi,
    address: faucet.address,
    functionName: "lastClaimed",
    args: [address!],
    query: { enabled: !!address },
  });

  const { writeContractAsync: claim, isPending: isClaiming } = useWriteContractWithToast();

  const [isClaimAvailable, setIsClaimAvailable] = useState(false);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [ready, setReady] = useState(false);
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
      queryClient.refetchQueries({ queryKey: TOKEN_BALANCES });
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
    setReady(true);
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

  if (!ready) {
    return <Loader />;
  }

  return (
    <>
      <div className={`w-full bg-white rounded-t-xl p-6 flex flex-col items-center dark:bg-gray-800 lg:rounded-xl`}>
        <div className="w-full flex flex-row justify-end">
          <button onClick={hideModal} aria-label="Close modal" className="text-gray-600 dark:text-gray-300">
            <X />
          </button>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="w-full">
            <h1 className="text-center text-2xl font-medium text-gray-800 dark:text-gray-200">Available Tokens</h1>
            <p className="text-center text-lg text-gray-500 dark:text-gray-400">
              Claim the number of Tokens you have been allocated below.
            </p>
          </div>
          {!isClaimAvailable ? (
            <div className="flex flex-col gap-6">
              <div className="w-full border rounded-xl bg-gray-100 dark:bg-gray-700 p-6 py-4 flex flex-col justify-center">
                <p className="text-center text-gray-500 dark:text-gray-300 text-xs">
                  Currently there are no tokens available for claiming. Kindly visit after a period of 24 hours to
                  claim.
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
            <div className="w-full flex flex-row overflow-x-auto gap-6">
              {acceptedTokens &&
                acceptedTokens.map((token, i) => (
                  <div
                    key={i}
                    className="min-w-[250px] min-h-[150px] border rounded-xl bg-gray-100 dark:bg-gray-700 p-6 py-4 flex flex-col justify-center"
                  >
                    <h2 className="text-sm text-gray-500 dark:text-gray-300 text-center">Amount of {token.symbol}</h2>
                    <h2 className="text-xl text-gray-600 dark:text-gray-100 text-center">5000 {token.symbol}</h2>
                  </div>
                ))}
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
          <div className="flex items-center w-full ">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 dark:text-gray-300">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="border border-darkGray font-bold text-darkGray flex items-center justify-center gap-2 px-4 py-4 rounded-xl dark:bg-gray-700 dark:text-darkGray-dark hover:bg-gray-200 dark:hover:bg-gray-600"
            href={"https://morphfaucet.com"}
          >
            Go to {currentChain?.name} faucet
            <ExternalLink />
          </Link>
        </div>
      </div>
    </>
  );
};

export default ClaimModal;

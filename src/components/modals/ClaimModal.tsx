'use client'

import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import { ArrowRight } from 'lucide-react';

const ClaimModal = () => {
    const [initialClaimDate, setInitialClaimDate] = useState(new Date('2024-09-15T00:00:00'));
    const [isClaimAvailable, setIsClaimAvailable] = useState(false);

    const endDate = new Date(initialClaimDate.getTime() + 24 * 60 * 60 * 1000);

    const calculateTimeElapsed = () => {
        const currentDate = new Date();
        const difference = endDate.getTime() - currentDate.getTime();
        let timeElapsed = {
            days: "0",
            hours: "00",
            minutes: "00",
            seconds: "00"
        };

        if (difference > 0) {
            timeElapsed = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)).toString(),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'),
                minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0'),
                seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, '0'),
            };
        } else {
            setIsClaimAvailable(true);
        }

        return timeElapsed;
    };

    const [timeElapsed, setTimeElapsed] = useState(calculateTimeElapsed());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed(calculateTimeElapsed());
        }, 1000);

        return () => clearInterval(timer);
    }, [initialClaimDate]);

    const timerComponents: JSX.Element[] = [];

    Object.keys(timeElapsed).forEach((interval) => {
        timerComponents.push(
            <div key={interval} className="flex-1 h-[100px] p-3 px-2 bg-gradient-to-b from-gray-300 to-gray-800 border text-white rounded-xl">
                <div className='text-center h-[50%] capitalize'>{interval}</div>
                <div className='text-center h-[50%] text-3xl'>{timeElapsed[interval as keyof typeof timeElapsed]}</div>
            </div>
        );
    });

    return (
        <div className='w-full lg:w-[500px] min-h-[500px] rounded-xl bg-white p-8 flex flex-col items-center'>
            <div className='flex flex-col gap-8'>
                <div>
                    <h1 className='text-center text-2xl font-medium'>Available Tokens</h1>
                    <p className='text-center text-lg text-gray-500'>Claim the number of Tokens you have been allocated below.</p>
                </div>
                {!isClaimAvailable && (
                    <div className='flex flex-col gap-6'>
                        <div className="w-full border rounded-xl bg-gray-100 p-6 py-4 flex flex-col justify-center">
                            <p className='text-center text-gray-500 text-xs'>
                                Currently there are no tokens available for claiming. Kindly visit after a period of 24 hours to claim.
                            </p>
                        </div>
                        <div className="w-full flex flex-row gap-4">
                            {timerComponents.length ? timerComponents : <span>Just now!</span>}
                        </div>
                        <div className="w-full border rounded-xl bg-yellow-100 p-6 py-4 flex flex-col border-red-400 shadow-md">
                            <h1 className='text-xl text-black font-medium'>Notice on claiming Tokens</h1>
                            <p className='text-gray-500 text-xs'>
                                It is important to note that your allocated tokens can be claimed once daily after 24 hours of initial claim.
                            </p>
                        </div>
                    </div>
                )}
                {isClaimAvailable && (
                    <div className='flex flex-col gap-6'>
                        <div className="w-full border rounded-xl bg-gray-100 p-6 py-4 flex flex-col justify-center">
                            <h2 className='text-sm text-gray-500 text-center'>Amount of RMP</h2>
                            <h2 className='text-xl text-gray-600 text-center'>1000 RMP</h2>
                        </div>
                        <div className="w-full border rounded-xl bg-gray-100 p-6 py-4 flex flex-col justify-center">
                            <h2 className='text-sm text-gray-500 text-center'>Amount of TRK</h2>
                            <h2 className='text-xl text-gray-600 text-center'>1000 TRK</h2>
                        </div>
                        <div className="w-full border rounded-xl bg-gray-100 p-6 py-4 flex flex-col justify-center">
                            <h2 className='text-sm text-gray-500 text-center'>Amount of CEDITH</h2>
                            <h2 className='text-xl text-gray-600 text-center'>1000 CEDITH</h2>
                        </div>
                    </div>
                )}
                <Button
                    text="Claim All"
                    className='bg-black text-white px-4 py-4 rounded-xl'
                    icon={<ArrowRight />}
                    iconPosition='right'
                    disabled={!isClaimAvailable}
                />
            </div>
        </div>
    );
};

export default ClaimModal;

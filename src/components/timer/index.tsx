
import React, { useState, useEffect } from 'react';

interface TimerProps {
    initialMinutes?: number;
    initialSeconds?: number;
    onComplete?: () => void;
    text?: string;
    className?:string;
}

const Timer: React.FC<TimerProps> = ({
    initialMinutes = 0,
    initialSeconds = 0,
    onComplete,
    text,
    className
}) => {
    const [minutes, setMinutes] = useState(initialMinutes);
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        if (minutes === 0 && seconds === 0) return;

        const intervalId = setInterval(() => {
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(intervalId);
                    if (onComplete) onComplete();
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            } else {
                setSeconds(seconds - 1);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [minutes, seconds, onComplete]);

    const formatTime = (value: number) => value.toString().padStart(2, '0');

    return (
        <div className='flex flex-row justify-start items-start space-x-1'>
            <span className={`bg-blue-500 rounded-lg w-6 h-6 p-1 flex justify-center items-center px-3 text-white text-sm ${className}`}>{formatTime(minutes)}</span>
            <span>:</span>
            <span className={`bg-blue-500 rounded-lg w-6 h-6 p-1 flex justify-center items-center px-3 text-white text-sm ${className}`}>{formatTime(seconds)}</span>
            <span>{text}</span>
        </div>
    );
};

export default Timer;

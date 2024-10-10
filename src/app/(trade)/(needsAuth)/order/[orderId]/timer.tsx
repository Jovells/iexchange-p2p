import React from "react";
export function Timer({timestamp, seconds}: {timestamp: number | BigInt | string, seconds: number}) {    // 
    const [timeLeft, setTimeLeft] = React.useState(seconds);

    React.useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = (seconds * 1000) - (now - (Number(timestamp) * 1000)) ;
            console.log("now", now, "distance", distance, "timestamp", timestamp, "seconds", );
            const min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const sec = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(min * 60 + sec);

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft(0);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timestamp]);

    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const remainingSeconds = (timeLeft % 60).toString().padStart(2, '0');
  return (
    <div className="flex flex-row dark:text-white justify-start items-start space-x-1">
      <span className="bg-blue-500 rounded-[4px] w-6 h-6 p-1 flex justify-center items-center px-3 text-white text-sm">
        {minutes}
      </span>
      <span>:</span>
      <span className="bg-blue-500 rounded-[4px] w-6 h-6 p-1 flex justify-center items-center px-3 text-white text-sm">
        {remainingSeconds}
      </span>
    </div>
  );
}
  
import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  duration: number;
}

export const CountdownTimer = ({ duration = 4000 }: CountdownTimerProps) => {
  const [remainingTime, setRemainingTime] = useState(duration);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => Math.max(0, prevTime - 100));
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  const percentage = (remainingTime / duration) * 100;

  return (
    <div className="w-full bg-background/20 rounded-full h-1.5 mt-2">
      <div
        className="bg-primary h-1.5 rounded-full transition-all duration-100 ease-linear"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

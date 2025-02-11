import React, { useEffect, useState } from "react";

interface TimerProps {
  initialTime: number;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progress = (timeLeft / initialTime) * circumference;

  // Dynamic color change based on remaining time
  const getStrokeColor = () => {
    if (timeLeft <= 10) return "stroke-red-600";
    if (timeLeft <= 30) return "stroke-yellow-500";
    return "stroke-green-500";
  };

  return (
    <div className="relative w-32 h-32 mt-4">
      <svg width="100%" height="100%">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          stroke="gray"
          strokeWidth="10"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          className={`transition-colors duration-300 ${getStrokeColor()}`}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};

export default Timer;

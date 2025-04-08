import React, { useState, useRef } from "react";

interface CircularSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const CircularSlider: React.FC<CircularSliderProps> = ({ value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const circleRef = useRef<HTMLDivElement>(null);

  // Configuration - scaled down to match plugin button size
  const radius = 32; // Reduced from 100
  const strokeWidth = 4; // Reduced from 12
  const handleSize = 8; // Reduced from 24
  const center = radius + strokeWidth + handleSize / 2;
  const minValue = 0;
  const maxValue = 1000;

  const calculateValue = (x: number, y: number) => {
    let angle = Math.atan2(y, x);
    angle = angle + Math.PI / 2;
    if (angle < 0) angle += 2 * Math.PI;

    const normalizedValue =
      (angle / (2 * Math.PI)) * (maxValue - minValue) + minValue;
    return Math.round(normalizedValue);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const rect = circleRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - (rect.left + center);
      const y = e.clientY - (rect.top + center);
      onChange(calculateValue(x, y));
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      e.preventDefault();
      const rect = circleRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - (rect.left + center);
        const y = e.clientY - (rect.top + center);
        onChange(calculateValue(x, y));
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const normalizedValue = value / maxValue;
  const angle = normalizedValue * 2 * Math.PI - Math.PI / 2;
  const handleX = center + radius * Math.cos(angle);
  const handleY = center + radius * Math.sin(angle);

  return (
    <div
      className="w-16 h-16 rounded-full bg-neutral-800 border border-neutral-700"
      ref={circleRef}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {" "}
        {/* Changed from w-17 to w-16 */}
        <svg
          width={center * 2}
          height={center * 2}
          className="cursor-pointer absolute"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#262626"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="bg-neutral-800"
          />

          {/* Progress circle */}
          <path
            d={`
			  M ${center} ${center - radius}
			  A ${radius} ${radius} 0 ${normalizedValue > 0.5 ? 1 : 0} 1 ${handleX} ${handleY}
			`}
            fill="none"
            stroke="#404040"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Handle */}
          <circle
            cx={handleX}
            cy={handleY}
            r={handleSize / 2}
            className="fill-neutral-600 hover:fill-neutral-500 cursor-grab active:cursor-grabbing"
          />
        </svg>
        {/* Center value */}
        <div className="z-10 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm font-medium text-gray-200">{value} s</span>
        </div>
      </div>
    </div>
  );
};

export default CircularSlider;

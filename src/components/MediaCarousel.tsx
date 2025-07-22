"use client";

import { useState } from 'react';

interface MediaCarouselProps {
  children: React.ReactNode[];
  className?: string;
}

export default function MediaCarousel({ children, className = "" }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (children.length <= 1) {
    return <div className={className}>{children[0]}</div>;
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? children.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === children.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden rounded-lg">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75 transition-opacity"
      >
        ←
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75 transition-opacity"
      >
        →
      </button>

      {/* Dots indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-[#004838]' : 'bg-[#EBEDE8]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
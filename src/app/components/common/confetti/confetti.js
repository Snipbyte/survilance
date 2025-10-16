// components/common/confetti/Confetti.js
import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

const ConfettiComponent = ({ isActive, onComplete }) => {
  const [showConfetti, setShowConfetti] = useState(isActive);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Only set dimensions if on client side
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        if (onComplete) onComplete();
      }, 3000); // Show confetti for 3 seconds
    }
  }, [isActive, onComplete]);

  return (
    <>
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          numberOfPieces={200}
          recycle={false}
        />
      )}
    </>
  );
};

export default ConfettiComponent;

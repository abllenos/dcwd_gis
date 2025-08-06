// src/components/LottieSpinner.tsx
import React from 'react';
import Lottie from 'lottie-react';
import spinnerAnimation from '../assets/spinner.json';

interface SpinnerProps {
  size?: number;
}

const LottieSpinner: React.FC<SpinnerProps> = ({ size = 100 }) => (
  <div
    style={{
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}
  >
    <Lottie
      animationData={spinnerAnimation}
      loop
      autoplay
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      }}
    />
  </div>
);

export default LottieSpinner;

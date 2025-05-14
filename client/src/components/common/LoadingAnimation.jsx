import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../Animation/Animation - 1747228525490.json';
import './LoadingAnimation.css';

const LoadingAnimation = ({ size = 'medium', text }) => {
  // Set width based on size prop
  const getSize = () => {
    switch (size) {
      case 'small': return { width: 60, height: 60 };
      case 'large': return { width: 120, height: 120 };
      case 'medium':
      default: return { width: 88, height: 88 };
    }
  };

  return (
    <div className="loading-animation-container">
      <Lottie 
        animationData={animationData} 
        loop={true}
        style={getSize()}
        className="loading-animation"
      />
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingAnimation;
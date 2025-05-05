import React from 'react';

const Loader = ({ size = 'md' }) => {
  const sizePx = {
    sm: 32,
    md: 48,
    lg: 72,
  };
  const spinnerSize = sizePx[size] || sizePx.md;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.5rem 0' }}>
      <svg
        width={spinnerSize}
        height={spinnerSize}
        viewBox="0 0 50 50"
        style={{ display: 'block' }}
        className="cool-loader-spinner"
      >
        <defs>
          <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a6bf5" />
            <stop offset="100%" stopColor="#6f88ff" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#232b42"
          strokeWidth="6"
          opacity="0.18"
        />
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="url(#loader-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="90 60"
          filter="url(#glow)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
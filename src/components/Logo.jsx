import React from 'react';

const Logo = ({ showText = true, size = 40, color = '#2563eb', textColor = 'white' }) => {
  const boxSize = size;
  const strokeWidth = boxSize * 0.125;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: "'Outfit', sans-serif" }}>
      {/* Abstract 'R' in a square frame */}
      <svg 
        width={boxSize} 
        height={boxSize} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Square Frame */}
        <rect 
          x="5" 
          y="5" 
          width="90" 
          height="90" 
          stroke={color} 
          strokeWidth="10" 
          fill="none" 
        />
        
        {/* Stylized 'R' */}
        {/* Main vertical bar of R - slightly separated from left edge */}
        <path 
          d="M35 30V70" 
          stroke={color} 
          strokeWidth="12" 
          strokeLinecap="butt" 
        />
        {/* The loop and leg of R */}
        <path 
          d="M35 30H65C70 30 75 35 75 42.5C75 50 70 55 65 55H35L75 75" 
          stroke={color} 
          strokeWidth="12" 
          strokeLinecap="butt" 
          strokeLinejoin="bevel"
          fill="none"
        />
        {/* Small accent slash matching the 'R' design in image */}
        <path 
          d="M28 30L35 38" 
          stroke={color} 
          strokeWidth="4" 
        />
      </svg>

      {/* Brand Text */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ 
            fontSize: `${size * 0.65}px`, 
            fontWeight: 800, 
            letterSpacing: '1px',
            color: textColor,
            textTransform: 'uppercase'
          }}>
            Rudraksha
          </span>
          <span style={{ 
            fontSize: `${size * 0.35}px`, 
            fontWeight: 400, 
            letterSpacing: '3px',
            color: textColor,
            textTransform: 'uppercase',
            opacity: 0.9
          }}>
            Design Studio
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;

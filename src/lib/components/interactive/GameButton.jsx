import React, { useState } from 'react';
import '../../styles/components.css';

/**
 * GameButton - A reusable button component with variants and sizes
 * 
 * @param {Object} props
 * @param {string} props.variant - 'primary', 'secondary', or 'accent'
 * @param {string} props.size - 'small', 'medium', or 'large'
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 */
const GameButton = ({
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  className = '',
  children,
  ...rest
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };
  
  const handleMouseUp = () => {
    if (!disabled) {
      setIsPressed(false);
    }
  };
  
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };
  
  return (
    <button
      className={`game-button game-button-${variant} game-button-${size} ${isPressed ? 'pressed' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default GameButton;
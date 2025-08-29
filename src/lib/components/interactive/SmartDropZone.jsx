// lib/components/interactive/SmartDropZone.jsx
import React, { useState, useEffect } from 'react';
import DropZone from './DropZone';

const SmartDropZone = ({
  id,
  acceptTypes,
  currentDragSymbol,
  onDrop,
  position,
  hint,
  className = '',
  style = {},
  children
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Determine if this zone should be visible
  const shouldShow = currentDragSymbol && acceptTypes.includes(currentDragSymbol);

  // Debug logging
  useEffect(() => {
    console.log(`📍 SmartDropZone ${id}:`, {
      currentDragSymbol,
      acceptTypes,
      shouldShow,
      isActive,
      isHovered
    });
  }, [currentDragSymbol, shouldShow, isActive, isHovered]);

  // Don't render if shouldn't show
  if (!shouldShow) {
    return null;
  }

  return (
    <DropZone
      id={id}
      acceptTypes={acceptTypes}
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsHovered(true);
        setIsActive(true);
      }}
      onDragLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      className={`smart-drop-zone ${className} ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
      style={{
        position: 'absolute',
        ...position,
        border: isHovered ? 
          '4px solid #FFD700' : '3px dashed rgba(255, 215, 0, 0.8)',
        borderRadius: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isHovered ?
          'rgba(255, 215, 0, 0.4)' : 'rgba(255, 215, 0, 0.2)',
        transition: 'all 0.3s ease',
        animation: 'smartZoneAppear 0.4s ease-out',
        fontSize: '0.9rem',
        color: 'rgba(255, 255, 255, 0.95)',
        textAlign: 'center',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
        fontWeight: 'bold',
        boxShadow: isHovered ?
          '0 0 30px rgba(255, 215, 0, 0.8)' : '0 0 20px rgba(255, 215, 0, 0.5)',
        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        zIndex: 100,
        ...style
      }}
    >
      <div className="zone-hint-content">
        {hint}
        {children}
      </div>
    </DropZone>
  );
};

export default SmartDropZone;
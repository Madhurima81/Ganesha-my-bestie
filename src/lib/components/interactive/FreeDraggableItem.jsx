// lib/components/interactive/FreeDraggableItem.jsx
// 🎯 Reusable component for free dragging (no snap-back, no drop zones required)

import React, { useState, useRef } from 'react';

const FreeDraggableItem = ({ 
  id,
  position = { top: '50%', left: '50%' }, // Current position
  onPositionChange, // Callback when position changes
  onDragStart, // Optional: Called when drag starts
  onDragEnd, // Optional: Called when drag ends
  disabled = false,
  children,
  className = "",
  style = {},
  bounds = { top: 0, left: 0, right: 95, bottom: 95 }, // Percentage bounds
  dragDelay = 0 // Optional delay before drag starts (useful for distinguishing from clicks)
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragTimeoutRef = useRef(null);
  
  // 🔧 MOUSE DRAG HANDLER
  const handleMouseDown = (e) => {
    if (disabled) return;
    
    console.log(`🎮 Mouse drag started for: ${id}`);
    
    // Optional drag delay (useful for click vs drag distinction)
    if (dragDelay > 0) {
      dragTimeoutRef.current = setTimeout(() => {
        startDrag(e.clientX, e.clientY, 'mouse');
      }, dragDelay);
      
      // Cancel delay if mouse moves quickly
      const handleEarlyMove = () => {
        if (dragTimeoutRef.current) {
          clearTimeout(dragTimeoutRef.current);
          startDrag(e.clientX, e.clientY, 'mouse');
        }
      };
      
      document.addEventListener('mousemove', handleEarlyMove, { once: true });
    } else {
      startDrag(e.clientX, e.clientY, 'mouse');
    }
    
    e.preventDefault();
  };
  
  // 🔧 TOUCH DRAG HANDLER
  const handleTouchStart = (e) => {
    if (disabled) return;
    
    console.log(`📱 Touch drag started for: ${id}`);
    
    const touch = e.touches[0];
    
    if (dragDelay > 0) {
      dragTimeoutRef.current = setTimeout(() => {
        startDrag(touch.clientX, touch.clientY, 'touch');
      }, dragDelay);
    } else {
      startDrag(touch.clientX, touch.clientY, 'touch');
    }
    
    e.preventDefault();
  };
  
  // 🔧 START DRAG LOGIC
  const startDrag = (startX, startY, inputType) => {
    setIsDragging(true);
    
    // Call external drag start handler
    if (onDragStart) {
      onDragStart(id);
    }
    
    const startPos = position;
    
    const handleMove = (moveEvent) => {
      let currentX, currentY;
      
      if (inputType === 'touch') {
        const touch = moveEvent.touches[0];
        currentX = touch.clientX;
        currentY = touch.clientY;
      } else {
        currentX = moveEvent.clientX;
        currentY = moveEvent.clientY;
      }
      
      // Calculate movement delta
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;
      
      // Convert pixel movement to percentage
      const newLeft = parseFloat(startPos.left) + (deltaX / window.innerWidth) * 100;
      const newTop = parseFloat(startPos.top) + (deltaY / window.innerHeight) * 100;
      
      // Apply bounds
      const boundedLeft = Math.max(bounds.left, Math.min(bounds.right, newLeft));
      const boundedTop = Math.max(bounds.top, Math.min(bounds.bottom, newTop));
      
      const newPosition = {
        top: `${boundedTop}%`,
        left: `${boundedLeft}%`
      };
      
      // Update position
      if (onPositionChange) {
        onPositionChange(newPosition);
      }
    };
    
    const handleEnd = () => {
      console.log(`🎯 Drag ended for: ${id}`);
      setIsDragging(false);
      
      // Call external drag end handler
      if (onDragEnd) {
        onDragEnd(id);
      }
      
      // Cleanup event listeners
      if (inputType === 'touch') {
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      } else {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
      }
    };
    
    // Add event listeners
    if (inputType === 'touch') {
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    } else {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
    }
  };
  
  // 🎨 DRAG STYLES
  const dragStyles = isDragging ? {
    transform: 'scale(1.05)',
    filter: 'brightness(1.1) drop-shadow(0 5px 15px rgba(0,0,0,0.3))',
    zIndex: 9999,
    transition: 'none'
  } : {
    transition: 'all 0.2s ease'
  };
  
  return (
    <div
      className={`free-draggable-item ${className} ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        cursor: disabled ? 'default' : (isDragging ? 'grabbing' : 'grab'),
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        touchAction: 'none',
        ...style,
        ...dragStyles
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      data-free-draggable={id}
    >
      {children}
    </div>
  );
};

export default FreeDraggableItem;
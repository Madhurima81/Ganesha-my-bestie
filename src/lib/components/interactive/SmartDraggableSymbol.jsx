// lib/components/interactive/SmartDraggableSymbol.jsx
import React, { useState, useEffect } from 'react';
import DraggableItem from './DraggableItem';

const SmartDraggableSymbol = ({
  symbol,
  position,
  isPlaced = false,
  onDragStart,
  onDragEnd,
  currentDragSymbol,
  style = {}
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(null);

  // Don't render if already placed
  if (isPlaced) {
    return null;
  }

  const isCurrentlyDragging = currentDragSymbol === symbol.id;

  // Enhanced drag handlers
  const handleDragStart = (id) => {
    console.log(`🚀 SmartDraggable: Starting drag for ${id}`);
    setIsDragging(true);
    onDragStart?.(id);
  };

  const handleDragEnd = () => {
    console.log(`🏁 SmartDraggable: Ending drag for ${symbol.id}`);
    setIsDragging(false);
    setDragPosition(null);
    onDragEnd?.();
  };

  return (
    <div
      className="smart-draggable-container"
      style={{
        position: 'absolute',
        ...position,
        zIndex: isCurrentlyDragging ? 1000 : 10,
        transition: isDragging ? 'none' : 'all 0.3s ease',
        //transform: isCurrentlyDragging ? 'scale(1.1)' : 'scale(1)',
        ...style
      }}
    >
      <DraggableItem
        id={symbol.id}
        data={{ type: symbol.id, name: symbol.name }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div 
          className={`smart-floating-symbol ${isCurrentlyDragging ? 'dragging' : ''}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px',
            borderRadius: '15px',
            background: isCurrentlyDragging ? 
              'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)',
            border: isCurrentlyDragging ?
              '3px solid #FFD700' : '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: isCurrentlyDragging ?
              '0 8px 25px rgba(255, 215, 0, 0.6)' : '0 4px 15px rgba(0, 0, 0, 0.3)',
            cursor: 'grab',
            transition: 'all 0.3s ease',
            animation: isCurrentlyDragging ? 'symbolFloat 1s ease-in-out infinite' : 'none'
          }}
        >
          <img 
            src={symbol.image} 
            alt={symbol.name}
            style={{ 
              width: '50px', 
              height: '50px',
              filter: isCurrentlyDragging ? 'brightness(1.2)' : 'brightness(1)',
              transition: 'filter 0.3s ease'
            }}
            draggable={false} // Prevent image drag interference
          />
          <div 
            className="smart-symbol-name"
            style={{
              marginTop: '5px',
              fontSize: '0.8rem',
              color: isCurrentlyDragging ? '#FFD700' : 'rgba(255, 255, 255, 0.9)',
              fontWeight: 'bold',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
              transition: 'color 0.3s ease'
            }}
          >
            {symbol.name}
          </div>
        </div>
      </DraggableItem>
    </div>
  );
};

export default SmartDraggableSymbol;
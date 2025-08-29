// DropZone.jsx - FIXED VERSION
import React, { useRef, useState, useEffect } from 'react';

const DropZone = ({
  id,
  acceptTypes = [],
  onDrop,
  disabled = false,
  children,
  className,
  style = {}
}) => {
  const [isOver, setIsOver] = useState(false);
  const zoneRef = useRef(null);
  
  // Set up custom event listeners for touch devices
  useEffect(() => {
    const element = zoneRef.current;
    if (!element) return;
    
    // Set a data attribute for identification
    element.setAttribute('data-dropzone', id);
    
    // Handle custom touch drag events
    const handleCustomDragOver = (e) => {
      if (disabled) return;
      
      const { id: itemId, data } = e.detail;
      
      // Check if the item type is acceptable
      const isAcceptable = acceptTypes.length === 0 || 
        (data && data.type && acceptTypes.includes(data.type));
      
      if (isAcceptable) {
        setIsOver(true);
        e.preventDefault(); // Allow drop
      }
    };
    
    const handleCustomDrop = (e) => {
      if (disabled) return;
      
      setIsOver(false);
      
      const { id: itemId, data, sourceElement } = e.detail;
      
      // Check if the item type is acceptable
      const isAcceptable = acceptTypes.length === 0 || 
        (data && data.type && acceptTypes.includes(data.type));
      
      if (isAcceptable && onDrop) {
        // Call the onDrop handler with the item data
        onDrop({ id: itemId, data });
      }
    };
    
    // Listen for custom events
    element.addEventListener('custom-dragover', handleCustomDragOver);
    element.addEventListener('custom-drop', handleCustomDrop);
    
    return () => {
      element.removeEventListener('custom-dragover', handleCustomDragOver);
      element.removeEventListener('custom-drop', handleCustomDrop);
    };
  }, [id, acceptTypes, onDrop, disabled]);
  
  // Standard HTML5 drag and drop handlers
  const handleDragOver = (e) => {
    if (disabled) {
      return;
    }
    
    // Prevent default to allow drop
    e.preventDefault();
    
    // Get the dragged item data
    let itemData;
    try {
      const dataTransfer = e.dataTransfer.getData('application/json');
      if (dataTransfer) {
        itemData = JSON.parse(dataTransfer);
      }
    } catch (error) {
      // Ignore parsing errors
      console.log('Error parsing data:', error);
    }
    
    // For touch events, check the global variable
    if (!itemData && window.__dragData) {
      itemData = window.__dragData;
    }
    
    // Check if the item type is acceptable
    const isAcceptable = acceptTypes.length === 0 || 
      (itemData && itemData.data && itemData.data.type && 
       acceptTypes.includes(itemData.data.type));
    
    if (isAcceptable) {
      // Set drop effect
      e.dataTransfer.dropEffect = 'move';
      
      // Update visual state
      setIsOver(true);
    }
  };
  
  const handleDragEnter = (e) => {
    if (disabled) return;
    
    // Similar logic to handleDragOver
    e.preventDefault();
    setIsOver(true);
  };
  
  const handleDragLeave = (e) => {
    if (disabled) return;
    
    // Update visual state
    setIsOver(false);
  };
  
  const handleDrop = (e) => {
    if (disabled) return;
    
    // Prevent default browser actions
    e.preventDefault();
    
    // Reset visual state
    setIsOver(false);
    
    // Get the dropped item data
    let itemData;
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        itemData = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error parsing drop data:', error);
    }
    
    // If no data from dataTransfer, check global state (for touch)
    if (!itemData && window.__dragData) {
      itemData = window.__dragData;
    }
    
    // Check if the item type is acceptable
    const isAcceptable = acceptTypes.length === 0 || 
      (itemData && itemData.data && itemData.data.type && 
       acceptTypes.includes(itemData.data.type));
    
    if (isAcceptable && itemData && onDrop) {
      // Call the onDrop handler
      onDrop(itemData);
    }
  };

  // 🔧 FIXED: Combine styles properly without border conflicts
  const dropZoneStyle = {
    // Don't mix border and borderColor - use one or the other
    border: isOver ? '3px solid #4CAF50' : '3px solid transparent',
background: isOver ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
    transition: 'all 0.3s ease',
    ...style // Apply user styles after defaults
  };

  return (
    <div
      ref={zoneRef}
      className={className}
      style={dropZoneStyle}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-dropzone={id} // For identification with touch events
    >
      {children}
    </div>
  );
};

export default DropZone;
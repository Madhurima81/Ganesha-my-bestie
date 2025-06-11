import { useState, useCallback, useRef } from 'react';

/**
 * useDragAndDrop - Custom hook for managing drag and drop state
 * 
 * @param {Object} options - Configuration options
 * @param {Array} options.items - Initial items that can be dragged
 * @param {Array} options.zones - Drop zones configuration
 * @param {function} options.onDrop - Global callback when an item is dropped
 * @param {function} options.validator - Global validator function
 * @returns {Object} Drag and drop state and handlers
 */
const useDragAndDrop = ({
  items = [],
  zones = [],
  onDrop = null,
  validator = null
} = {}) => {
  // State for drag items and their locations
  const [dragItems, setDragItems] = useState(items);
  
  // Track which items are in which zones
  const [itemLocations, setItemLocations] = useState({});
  
  // Currently dragged item
  const [activeItem, setActiveItem] = useState(null);
  
  // Currently hovered zone
  const [activeZone, setActiveZone] = useState(null);
  
  // Drop feedback
  const [lastDrop, setLastDrop] = useState(null);
  
  // Refs for internal state that doesn't need to trigger renders
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  
  // Handler for drag start
  const handleDragStart = useCallback((data) => {
    setActiveItem(data);
    dragStartPosRef.current = {
      x: data.event.clientX || (data.event.touches && data.event.touches[0].clientX) || 0,
      y: data.event.clientY || (data.event.touches && data.event.touches[0].clientY) || 0
    };
  }, []);
  
  // Handler for drag over a zone
  const handleDragOver = useCallback((data) => {
    setActiveZone(data.zoneId);
  }, []);
  
  // Handler for drag leave
  const handleDragLeave = useCallback(() => {
    setActiveZone(null);
  }, []);
  
  // Handler for drop
  const handleDrop = useCallback((data) => {
    const { zoneId, item, isValid } = data;
    
    // Skip if drop is invalid
    if (isValid === false) {
      setLastDrop({ 
        success: false, 
        item: item.data, 
        zone: zoneId, 
        reason: 'Invalid drop' 
      });
      return;
    }
    
    // Update item location
    setItemLocations(prev => ({
      ...prev,
      [item.id]: zoneId
    }));
    
    // Update last drop info
    setLastDrop({ 
      success: true, 
      item: item.data, 
      zone: zoneId, 
      timestamp: new Date() 
    });
    
    // Call global onDrop if provided
    if (onDrop) {
      onDrop({
        itemId: item.id,
        itemData: item.data,
        sourceZone: prev[item.id],
        targetZone: zoneId
      });
    }
    
    // Reset active states
    setActiveItem(null);
    setActiveZone(null);
  }, [onDrop]);
  
  // Validate if an item can be dropped in a zone
  const validateDrop = useCallback((item, zoneId) => {
    // Check zone-specific validator
    const zone = zones.find(z => z.id === zoneId);
    if (zone && zone.validator) {
      return zone.validator(item);
    }
    
    // Fall back to global validator
    if (validator) {
      return validator(item, zoneId);
    }
    
    // Default to valid if no validators
    return true;
  }, [zones, validator]);
  
  // Add a new draggable item
  const addDragItem = useCallback((item) => {
    setDragItems(prev => [...prev, item]);
  }, []);
  
  // Remove a draggable item
  const removeDragItem = useCallback((itemId) => {
    setDragItems(prev => prev.filter(item => item.id !== itemId));
    setItemLocations(prev => {
      const newLocations = { ...prev };
      delete newLocations[itemId];
      return newLocations;
    });
  }, []);
  
  // Move an item to a specific zone programmatically
  const moveItem = useCallback((itemId, zoneId) => {
    // Validate the move
    const item = dragItems.find(item => item.id === itemId);
    if (!item) return false;
    
    const isValid = validateDrop(item.data, zoneId);
    if (!isValid) return false;
    
    // Update item location
    setItemLocations(prev => ({
      ...prev,
      [itemId]: zoneId
    }));
    
    return true;
  }, [dragItems, validateDrop]);
  
  // Check if a zone contains an item
  const zoneContains = useCallback((zoneId, itemId) => {
    return itemLocations[itemId] === zoneId;
  }, [itemLocations]);
  
  // Get all items in a zone
  const getZoneItems = useCallback((zoneId) => {
    const zoneItemIds = Object.entries(itemLocations)
      .filter(([, zone]) => zone === zoneId)
      .map(([itemId]) => itemId);
    
    return dragItems.filter(item => zoneItemIds.includes(item.id));
  }, [dragItems, itemLocations]);
  
  // Reset all items to their initial state
  const resetItems = useCallback(() => {
    setItemLocations({});
    setActiveItem(null);
    setActiveZone(null);
    setLastDrop(null);
  }, []);
  
  return {
    // State
    items: dragItems,
    itemLocations,
    activeItem,
    activeZone,
    lastDrop,
    
    // Event handlers
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    validateDrop,
    
    // Actions
    addDragItem,
    removeDragItem,
    moveItem,
    resetItems,
    
    // Queries
    zoneContains,
    getZoneItems
  };
};

export default useDragAndDrop;
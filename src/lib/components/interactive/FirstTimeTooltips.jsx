// FirstTimeTooltips.jsx
import React, { useState, useEffect, useRef } from 'react';
import "../../styles/components.css";

/**
 * FirstTimeTooltips Component
 * Shows tooltips automatically the first time elements are encountered
 * 
 * @param {Object} props
 * @param {Array} props.tooltips - Array of tooltip configs {id, message, position, elementRef}
 * @param {string} props.zoneId - Current zone identifier for storage
 * @param {boolean} props.enabled - Whether first-time tooltips are enabled
 * @param {number} props.autoHideDelay - Delay in ms before auto-hiding tooltips (default: 4000)
 * @param {Function} props.onTooltipShown - Callback when a tooltip is shown
 * @param {Function} props.onTooltipHidden - Callback when a tooltip is hidden
 */
const FirstTimeTooltips = ({
  tooltips = [],
  zoneId = 'default',
  enabled = true,
  autoHideDelay = 4000,
  onTooltipShown = () => {},
  onTooltipHidden = () => {}
}, ref) => {
    const [shownTooltips, setShownTooltips] = useState({});
  const [currentTooltip, setCurrentTooltip] = useState(null);
  const tooltipTimerRef = useRef(null);
  const storageKey = `firstTimeTooltips_${zoneId}`;

  // Load previously shown tooltips from localStorage on component mount
  useEffect(() => {
    if (!enabled) return;
    
    try {
      const savedTooltips = JSON.parse(localStorage.getItem(storageKey) || '{}');
      setShownTooltips(savedTooltips);
    } catch (e) {
      console.error('Could not load tooltip state from localStorage', e);
    }
    
    return () => {
      // Clean up timer on unmount
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    };
  }, [enabled, storageKey]);

  // Show the next unseen tooltip if available
  useEffect(() => {
    if (!enabled || currentTooltip) return;
    
    const unseen = tooltips.find(tooltip => !shownTooltips[tooltip.id]);
    if (unseen) {
      setCurrentTooltip(unseen);
      onTooltipShown(unseen.id);
      
      // Auto-dismiss after delay
      tooltipTimerRef.current = setTimeout(() => {
        handleDismissTooltip(unseen.id);
      }, autoHideDelay);
    }
  }, [enabled, tooltips, shownTooltips, currentTooltip, autoHideDelay, onTooltipShown]);

  // Handle the user dismissing a tooltip
  const handleDismissTooltip = (id) => {
    setCurrentTooltip(null);
    onTooltipHidden(id);
    
    // Mark this tooltip as shown
    const updatedShownTooltips = {
      ...shownTooltips,
      [id]: true
    };
    
    setShownTooltips(updatedShownTooltips);
    
    // Save to localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedShownTooltips));
    } catch (e) {
      console.error('Could not save tooltip state to localStorage', e);
    }
    
    // Clear any pending auto-dismiss
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = null;
    }
  };

  // Reset all tooltips to be shown again (for testing/debugging)
  const resetAllTooltips = () => {
    setShownTooltips({});
    localStorage.removeItem(storageKey);
  };

  // Make resetAllTooltips available to parent components
  React.useImperativeHandle(
    ref,
    () => ({
      resetAllTooltips
    }),
    []
  );

  // Render nothing if disabled or no current tooltip
  if (!enabled || !currentTooltip) return null;

  return (
    <div 
      className="first-time-tooltip" 
      style={{
        position: 'absolute',
        ...currentTooltip.position,
        zIndex: 1000,
        padding: '15px',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '15px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        border: '3px solid #4CAF50',
        maxWidth: '250px',
        textAlign: 'center',
        transform: 'translate(-50%, -130%)'
      }}
      onClick={() => handleDismissTooltip(currentTooltip.id)}
    >
      <div className="tooltip-pointer"></div>
      <div 
        className="tooltip-message"
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '8px'
        }}
      >
        {currentTooltip.message}
      </div>
      <div 
        className="tooltip-tap-hint"
        style={{
          fontSize: '14px',
          color: '#666',
          fontStyle: 'italic'
        }}
      >
        Tap to continue
      </div>
    </div>
  );
};

export default React.forwardRef(FirstTimeTooltips);
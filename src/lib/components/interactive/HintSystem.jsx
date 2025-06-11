// HintSystem.jsx
import React, { useState, useEffect, useRef } from 'react';
import "../../styles/components.css";

/**
 * HintSystem Component
 * Shows hints when the user is inactive for a certain period
 * 
 * @param {Object} props
 * @param {Array} props.hints - Array of hint configs {id, message, condition, priority, position, isCompleted}
 * @param {boolean} props.enabled - Whether the hint system is enabled
 * @param {number} props.inactivityThreshold - Time in ms before showing hints (default: 8000)
 * @param {number} props.hintDuration - How long to show each hint (default: 5000)
 * @param {Function} props.onUserActivity - Callback for when user activity is detected
 */
const HintSystem = ({
  hints = [],
  enabled = true,
  inactivityThreshold = 8000,
  hintDuration = 5000,
  onUserActivity = () => {}
}) => {
  const [inactiveTime, setInactiveTime] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState(null);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  
  const inactivityIntervalRef = useRef(null);
  const hintTimerRef = useRef(null);
  
  // Reset timer on any user interaction
  useEffect(() => {
    if (!enabled) return;
    
    const handleUserActivity = () => {
      setLastInteraction(Date.now());
      setInactiveTime(0);
      
      if (showHint) {
        setShowHint(false);
        setCurrentHint(null);
      }
      
      onUserActivity();
    };
    
    // Add event listeners for user activity
    window.addEventListener('mousedown', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    
    return () => {
      window.removeEventListener('mousedown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, [enabled, showHint, onUserActivity]);
  
  // Set up inactivity checker
  useEffect(() => {
    if (!enabled) return;
    
    inactivityIntervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const timeElapsed = currentTime - lastInteraction;
      setInactiveTime(timeElapsed);
      
      // If user has been inactive long enough and we're not already showing a hint
      if (timeElapsed >= inactivityThreshold && !showHint) {
        showNextHint();
      }
    }, 1000);
    
    return () => {
      if (inactivityIntervalRef.current) {
        clearInterval(inactivityIntervalRef.current);
      }
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current);
      }
    };
  }, [enabled, inactivityThreshold, showHint, lastInteraction]);
  
  // Find the next available hint based on conditions and priority and completion status
  const showNextHint = () => {
    // Filter hints by their conditions and completion status
    const availableHints = hints
      .filter(hint => {
        // Only show hints for elements that are both:
        // 1. Available according to the hint's condition
        // 2. Not already completed (need to add this to hint config)
        return typeof hint.condition === 'function' 
          ? hint.condition() && !hint.isCompleted 
          : true;
      })
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
      
    if (availableHints.length > 0) {
      const nextHint = availableHints[0];
      setCurrentHint(nextHint);
      setShowHint(true);
      
      // Auto-hide after duration
      hintTimerRef.current = setTimeout(() => {
        setShowHint(false);
        setCurrentHint(null);
      }, hintDuration);
    } else {
      // No available hints - clear any showing hint
      setShowHint(false);
      setCurrentHint(null);
    }
  };
  
  // Manually dismiss a hint
  const dismissHint = () => {
    setShowHint(false);
    setCurrentHint(null);
    
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
    }
    
    // Reset inactivity timer
    setLastInteraction(Date.now());
  };
  
  // Don't render anything if disabled or no hint to show
  if (!enabled || !showHint || !currentHint) return null;
  
  return (
    <div 
      className="hint-bubble"
      style={{
        position: 'absolute',
        ...currentHint.position,
        zIndex: 1000,
        padding: '12px 20px',
        background: 'rgba(255, 243, 224, 0.95)',
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        border: '2px solid #FFC107',
        maxWidth: '220px',
        animation: 'float 3s infinite ease-in-out',
        transform: 'translate(-50%, -50%)'
      }}
      onClick={dismissHint}
    >
      <div 
        className="hint-message"
        style={{
          fontSize: '16px',
          color: '#5D4037',
          textAlign: 'center',
          fontWeight: 'bold'
        }}
      >
        💡 {currentHint.message}
      </div>
    </div>
  );
};

export default HintSystem;
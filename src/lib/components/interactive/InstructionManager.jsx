// InstructionManager.jsx
import React, { useState, useEffect, useRef } from 'react';
import FirstTimeTooltips from './FirstTimeTooltips';
import HintSystem from './HintSystem';
import CoachCharacter from './CoachCharacter';

/**
 * InstructionManager Component
 * Coordinates between different instruction systems (tooltips, hints, coach)
 * 
 * @param {Object} props
 * @param {string} props.zoneId - Current zone identifier
 * @param {Array} props.tooltips - First-time tooltips configuration
 * @param {Array} props.hints - Hints configuration
 * @param {Object} props.coach - Coach character configuration
 * @param {Object} props.settings - System settings and preferences
 * @param {Function} props.onInstructionComplete - Callback when an instruction is completed
 */
const InstructionManager = ({
  zoneId = 'default',
  tooltips = [],
  hints = [],
  coach = { enabled: true, characterImage: null },
  settings = {
    tooltipsEnabled: true,
    hintsEnabled: true,
    coachEnabled: true,
    inactivityThreshold: 8000,
    hintDuration: 5000,
    tooltipDuration: 4000
  },
  onInstructionComplete = () => {}
}) => {
  const [activeSystem, setActiveSystem] = useState(null); // 'tooltip', 'hint', 'coach'
  const [targetElement, setTargetElement] = useState(null);
  const [coachMessage, setCoachMessage] = useState('');
  const [progressTracking, setProgressTracking] = useState({});
  
  const firstTimeTooltipRef = useRef(null);
  const lastActivityTime = useRef(Date.now());
  
  // Initialize progress tracking for the zone
  useEffect(() => {
    try {
      const savedProgress = JSON.parse(localStorage.getItem(`zoneProgress_${zoneId}`) || '{}');
      setProgressTracking(savedProgress);
    } catch (e) {
      console.error('Could not load zone progress from localStorage', e);
    }
  }, [zoneId]);
  
  // Save progress
  const updateProgress = (key, value) => {
    const updatedProgress = {
      ...progressTracking,
      [key]: value
    };
    
    setProgressTracking(updatedProgress);
    
    try {
      localStorage.setItem(`zoneProgress_${zoneId}`, JSON.stringify(updatedProgress));
    } catch (e) {
      console.error('Could not save zone progress to localStorage', e);
    }
  };
  
  // Handle user activity
  const handleUserActivity = () => {
    lastActivityTime.current = Date.now();
    
    // If coach is showing an element, dismiss after user interaction
    if (activeSystem === 'coach' && targetElement) {
      setActiveSystem(null);
      setTargetElement(null);
      setCoachMessage('');
    }
  };
  
  // Handle tooltip shown
  const handleTooltipShown = (tooltipId) => {
    setActiveSystem('tooltip');
    
    // Track that this tooltip was shown
    updateProgress(`tooltip_${tooltipId}`, true);
  };
  
  // Handle tooltip hidden/dismissed
  const handleTooltipHidden = (tooltipId) => {
    setActiveSystem(null);
    onInstructionComplete('tooltip', tooltipId);
  };
  
  // Check if an element is stuck (user hasn't interacted with it)
  const checkForStuckElements = () => {
    // Only check if no instruction is currently active
    if (activeSystem || !settings.coachEnabled) return;
    
    // Look for interactive elements that haven't been completed
    const stuckElements = hints
      .filter(hint => typeof hint.condition === 'function' && hint.condition())
      .filter(hint => {
        // Check if this element has been highlighted by coach before
        const lastCoachTime = progressTracking[`coach_${hint.id}`] || 0;
        const timeSinceCoach = Date.now() - lastCoachTime;
        
        // Only consider elements that haven't been coached recently (> 30 seconds)
        return timeSinceCoach > 30000;
      })
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
    
    if (stuckElements.length > 0) {
      const element = stuckElements[0];
      
      // Show coach for this element
      setActiveSystem('coach');
      setTargetElement(element.position);
      setCoachMessage(element.message || "Try this!");
      
      // Track that coach highlighted this element
      updateProgress(`coach_${element.id}`, Date.now());
      
      // Auto-dismiss coach after 5 seconds
      setTimeout(() => {
        if (activeSystem === 'coach') {
          setActiveSystem(null);
          setTargetElement(null);
          setCoachMessage('');
        }
      }, 5000);
    }
  };
  
  // Set up periodic checks for stuck elements
  useEffect(() => {
    const checkInterval = setInterval(() => {
      // Check if user has been inactive for at least 15 seconds
      const inactiveTime = Date.now() - lastActivityTime.current;
      if (inactiveTime > 15000) {
        checkForStuckElements();
      }
    }, 5000);
    
    return () => clearInterval(checkInterval);
  }, [activeSystem, progressTracking, settings.coachEnabled]);
  
  // Reset all instructions for the current zone (for debugging/testing)
  const resetZoneInstructions = () => {
    if (firstTimeTooltipRef.current) {
      firstTimeTooltipRef.current.resetAllTooltips();
    }
    
    // Clear all progress for this zone
    setProgressTracking({});
    localStorage.removeItem(`zoneProgress_${zoneId}`);
    localStorage.removeItem(`firstTimeTooltips_${zoneId}`);
  };
  
  return (
    <>
      {/* First-time tooltips */}
      <FirstTimeTooltips
        ref={firstTimeTooltipRef}
        tooltips={tooltips}
        zoneId={zoneId}
        enabled={settings.tooltipsEnabled && activeSystem !== 'coach'}
        autoHideDelay={settings.tooltipDuration}
        onTooltipShown={handleTooltipShown}
        onTooltipHidden={handleTooltipHidden}
      />
      
      {/* Hint system */}
      <HintSystem
        hints={hints}
        enabled={settings.hintsEnabled && activeSystem !== 'tooltip' && activeSystem !== 'coach'}
        inactivityThreshold={settings.inactivityThreshold}
        hintDuration={settings.hintDuration}
        onUserActivity={handleUserActivity}
      />
      
      {/* Coach character */}
      <CoachCharacter
        enabled={settings.coachEnabled && activeSystem === 'coach'}
        characterImage={coach.characterImage}
        targetPosition={targetElement}
        message={coachMessage}
        showMessage={!!coachMessage}
        animation={targetElement ? 'pointing' : 'idle'}
        onAnimationComplete={() => {
          // After coach completes animation
          setTimeout(() => {
            if (activeSystem === 'coach') {
              setActiveSystem(null);
              onInstructionComplete('coach', targetElement);
            }
          }, 2000);
        }}
      />
    </>
  );
};

export default InstructionManager;
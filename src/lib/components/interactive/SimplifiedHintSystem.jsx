// SimplifiedHintSystem.jsx
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

/**
 * SimplifiedHintSystem Component with integrated CoachCharacter
 * Shows an initial hint after a few seconds and then displays subsequent hints that stay
 * visible until the user clicks to dismiss them or the condition is no longer met.
 * Also shows a coach character if the user doesn't interact after a delay.
 * 
 * @param {Object} props
 * @param {Array} props.hints - Array of hint objects {id, message, condition, position}
 * @param {boolean} props.enabled - Whether the hint system is enabled
 * @param {number} props.initialDelay - Time in ms before showing first hint (default: 5000)
 * @param {number} props.initialDuration - Time in ms to show the initial hint (default: 3000)
 * @param {number} props.subsequentDelay - Time in ms before showing next hint (default: 8000)
 * @param {number} props.coachDelay - Time in ms before showing coach (default: 15000)
 * @param {boolean} props.coachEnabled - Whether coach character is enabled
 * @param {string} props.coachImage - Image URL for coach character
 * @param {Function} props.onUserInteraction - Callback when user interacts with a hint
 */
const SimplifiedHintSystem = forwardRef(({
  hints = [],
  enabled = true,
  initialDelay = 5000,
  initialDuration = 3000,
  subsequentDelay = 8000,
  coachDelay = 15000,
  coachEnabled = true,
  coachImage = null,
  onUserInteraction = () => {}
}, ref) => {
  // Hint system states
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState(null);
  const [initialHintShown, setInitialHintShown] = useState(false);
  const [hintQueue, setHintQueue] = useState([]);
  const [error, setError] = useState(null);
  
  // Coach character states
  const [showCoach, setShowCoach] = useState(false);
  const [coachTarget, setCoachTarget] = useState(null);
  const [coachMessage, setCoachMessage] = useState('');
  
  // Timer refs
  const initialTimerRef = useRef(null);
  const dismissTimerRef = useRef(null);
  const subsequentTimerRef = useRef(null);
  const checkConditionTimerRef = useRef(null);
  const coachTimerRef = useRef(null);

  // Filter hints by their conditions
  const getAvailableHints = () => {
    try {
      const availableHints = hints.filter(hint => {
        try {
          const isAvailable = typeof hint.condition === 'function' 
            ? hint.condition() 
            : true;
          
          return isAvailable;
        } catch (err) {
          console.error(`Error in hint condition for hint ${hint.id}:`, err);
          return false; // Skip this hint if its condition has an error
        }
      });
      
      // Debug logging for available hints
      if (availableHints.length > 0) {
        console.log("Available hints:", availableHints.map(h => h.id));
      }
      
      return availableHints;
    } catch (err) {
      console.error("Error filtering hints:", err);
      return []; // Return empty array if there's an error
    }
  };
  
  // Show the next available hint
  const showNextHint = () => {
    try {
      const availableHints = getAvailableHints();
      
      if (availableHints.length > 0) {
        console.log(`Showing next hint: ${availableHints[0].id}`);
        setCurrentHint(availableHints[0]);
        setShowHint(true);
        
        // Start coach timer when showing a hint
        if (coachEnabled) {
          startCoachTimer();
        }
      }
    } catch (err) {
      setError(`Error showing next hint: ${err.message}`);
      console.error("Error in hint system:", err);
    }
  };
  
  // Start coach timer
  const startCoachTimer = () => {
    console.log("Starting coach timer");

    // Clear any existing coach timer
    if (coachTimerRef.current) clearTimeout(coachTimerRef.current);
    
    // Set timer to show coach if hint isn't dismissed
    coachTimerRef.current = setTimeout(() => {
        console.log("Coach timer completed, checking if should show coach");

      // Only show coach if hint is still visible and not the initial hint
      if (showHint && initialHintShown && !dismissTimerRef.current) {
        // Calculate target position based on the current hint
        const targetPosition = calculateCoachPosition(currentHint.position);
        console.log("Showing coach at position:", targetPosition, "with message:", currentHint?.message);
        setCoachTarget(targetPosition);
        setCoachMessage(currentHint.message || "Try clicking here!");
        setShowCoach(true);
    } else {
        console.log("Not showing coach because conditions not met:", 
                   {showHint, initialHintShown, dismissTimerActive: !!dismissTimerRef.current});
      }
    }, coachDelay);
  };
  
  // Calculate coach position based on hint position - updated for better positioning
  const calculateCoachPosition = (hintPosition) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Parse hint position to get x,y coordinates
    let hintX = viewportWidth * 0.5; 
    let hintY = viewportHeight * 0.5;
    
    // Convert hint position to viewport coordinates
    if (hintPosition) {
      if (hintPosition.left) {
        const value = parseFloat(hintPosition.left);
        hintX = typeof hintPosition.left === 'string' && hintPosition.left.includes('%')
          ? viewportWidth * (value / 100)
          : value;
      } else if (hintPosition.right) {
        const value = parseFloat(hintPosition.right);
        hintX = typeof hintPosition.right === 'string' && hintPosition.right.includes('%')
          ? viewportWidth - (viewportWidth * (value / 100))
          : viewportWidth - value;
      }
      
      if (hintPosition.top) {
        const value = parseFloat(hintPosition.top);
        hintY = typeof hintPosition.top === 'string' && hintPosition.top.includes('%')
          ? viewportHeight * (value / 100)
          : value;
      } else if (hintPosition.bottom) {
        const value = parseFloat(hintPosition.bottom);
        hintY = typeof hintPosition.bottom === 'string' && hintPosition.bottom.includes('%')
          ? viewportHeight - (viewportHeight * (value / 100))
          : viewportHeight - value;
      }
    }
    
    // Position coach in a different quadrant than the hint
    let coachX, coachY;
    
    // Decide which quadrant to place the coach based on hint position
    if (hintX < viewportWidth * 0.4) {
      // Hint is on left side, place coach on right
      coachX = viewportWidth * 0.8; 
    } else if (hintX > viewportWidth * 0.6) {
      // Hint is on right side, place coach on left
      coachX = viewportWidth * 0.2;
    } else {
      // Hint is in center, choose side based on viewport position
      coachX = (hintY < viewportHeight / 2) ? viewportWidth * 0.2 : viewportWidth * 0.8;
    }
    
    if (hintY < viewportHeight * 0.4) {
      // Hint is at top, place coach at bottom
      coachY = viewportHeight * 0.8;
    } else if (hintY > viewportHeight * 0.6) {
      // Hint is at bottom, place coach at top
      coachY = viewportHeight * 0.2;
    } else {
      // Hint is in middle, choose top/bottom based on viewport position
      coachY = (hintX < viewportWidth / 2) ? viewportHeight * 0.2 : viewportHeight * 0.8;
    }
    
    // Ensure coach stays on screen with margin
    coachX = Math.max(100, Math.min(viewportWidth - 100, coachX));
    coachY = Math.max(100, Math.min(viewportHeight - 100, coachY));
    
    return { x: coachX, y: coachY };
  };
  
  // Handle coach dismissal
  const handleCoachDismiss = () => {
    setShowCoach(false);
    // You can decide whether to restart the coach timer here or not
  };
  
  // Handle dismissing hint
  const dismissHint = () => {
    try {
      console.log(`User dismissed hint: ${currentHint?.id}`);
      setShowHint(false);
      setShowCoach(false); // Also hide coach
      
      // Clear coach timer
      if (coachTimerRef.current) {
        clearTimeout(coachTimerRef.current);
      }
      
      onUserInteraction();
      
      // Only set up a timer for the next hint if we're past the initial hint
      if (initialHintShown && !dismissTimerRef.current) {
        subsequentTimerRef.current = setTimeout(() => {
          showNextHint();
        }, subsequentDelay);
      }
    } catch (err) {
      setError(`Error dismissing hint: ${err.message}`);
      console.error("Error in hint system:", err);
    }
  };
  
  // Reset hint system for a new sequence - IMPORTANT: this function must be BEFORE useImperativeHandle
  const resetHintSystem = () => {
    try {
      console.log("Resetting hint system");
      // Hide current hint
      setShowHint(false);
      setShowCoach(false); // Also hide coach
      
      // Clear all timers
      if (initialTimerRef.current) clearTimeout(initialTimerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      if (subsequentTimerRef.current) clearTimeout(subsequentTimerRef.current);
      if (checkConditionTimerRef.current) clearInterval(checkConditionTimerRef.current);
      if (coachTimerRef.current) clearTimeout(coachTimerRef.current);
      
      // Reset state
      setInitialHintShown(false);
      setCurrentHint(null);
      
      // Start the sequence again with updated hint queue
      setHintQueue(getAvailableHints());
      
      // Start initial hint timer again
      initialTimerRef.current = setTimeout(() => {
        const availableHints = getAvailableHints();
        if (availableHints.length > 0) {
          setCurrentHint(availableHints[0]);
          setShowHint(true);
          setInitialHintShown(true);
          
          // Auto-hide the first hint after initialDuration
          dismissTimerRef.current = setTimeout(() => {
            setShowHint(false);
            dismissTimerRef.current = null;
            
            // Start timer for subsequent hints that stay until clicked
            subsequentTimerRef.current = setTimeout(() => {
              showNextHint();
            }, subsequentDelay);
          }, initialDuration);
        }
      }, initialDelay);
    } catch (err) {
      setError(`Error resetting hint system: ${err.message}`);
      console.error("Error in hint system:", err);
    }
  };
  
  // Expose methods to parent component - AFTER resetHintSystem is defined
  useImperativeHandle(ref, () => ({
    hideCurrentHint: () => {
      console.log("Explicitly hiding current hint");
      setShowHint(false);
      setShowCoach(false); // Also hide coach
      
      // Clear coach timer
      if (coachTimerRef.current) {
        clearTimeout(coachTimerRef.current);
      }
      
      // Reset the subsequent hint timer
      if (subsequentTimerRef.current) clearTimeout(subsequentTimerRef.current);
      subsequentTimerRef.current = setTimeout(() => {
        showNextHint();
      }, subsequentDelay);
    },
    resetHintSystem
  }));
  
  // Update hint queue when hints change
  useEffect(() => {
    if (hints.length > 0) {
      try {
        setHintQueue(getAvailableHints());
      } catch (err) {
        setError(`Error updating hint queue: ${err.message}`);
        console.error("Error in hint system:", err);
      }
    }
  }, [hints]);
  
  // Initialize hint system
  useEffect(() => {
    if (!enabled || hintQueue.length === 0) return;
    
    // Clear any existing timers
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    if (subsequentTimerRef.current) clearTimeout(subsequentTimerRef.current);
    if (checkConditionTimerRef.current) clearTimeout(checkConditionTimerRef.current);
    if (coachTimerRef.current) clearTimeout(coachTimerRef.current);
    
    try {
      // Initial hint appears after specified delay
      initialTimerRef.current = setTimeout(() => {
        const availableHints = getAvailableHints();
        if (availableHints.length > 0) {
          setCurrentHint(availableHints[0]);
          setShowHint(true);
          setInitialHintShown(true);
          
          // Auto-hide the first hint after initialDuration
          dismissTimerRef.current = setTimeout(() => {
            setShowHint(false);
            dismissTimerRef.current = null;
            
            // Start timer for subsequent hints that stay until clicked
            subsequentTimerRef.current = setTimeout(() => {
              showNextHint();
            }, subsequentDelay);
          }, initialDuration);
        }
      }, initialDelay);
    } catch (err) {
      setError(`Error initializing hint system: ${err.message}`);
      console.error("Error in hint system:", err);
    }
    
    return () => {
      // Clean up all timers on component unmount
      if (initialTimerRef.current) clearTimeout(initialTimerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      if (subsequentTimerRef.current) clearTimeout(subsequentTimerRef.current);
      if (checkConditionTimerRef.current) clearInterval(checkConditionTimerRef.current);
      if (coachTimerRef.current) clearTimeout(coachTimerRef.current);
    };
  }, [enabled, hintQueue, initialDelay, initialDuration, subsequentDelay]);
  
  // Check if current hint's condition is still valid
  useEffect(() => {
    if (!showHint || !currentHint || !enabled) return;
    
    try {
      // Set up a timer to periodically check if condition is still met
      checkConditionTimerRef.current = setInterval(() => {
        if (currentHint.condition && typeof currentHint.condition === 'function') {
          try {
            const isConditionMet = currentHint.condition();
            
            if (!isConditionMet) {
              // Condition is no longer met, hide the hint
              console.log(`Hint ${currentHint.id} condition no longer met, hiding`);
              setShowHint(false);
              setShowCoach(false); // Also hide coach
              
              // Reset the subsequent hint timer to show the next relevant hint
              if (initialHintShown && !dismissTimerRef.current) {
                if (subsequentTimerRef.current) clearTimeout(subsequentTimerRef.current);
                
                subsequentTimerRef.current = setTimeout(() => {
                  showNextHint();
                }, subsequentDelay);
              }
            }
          } catch (err) {
            // If there's an error in the condition function, log it but don't crash
            console.error(`Error in hint condition for hint ${currentHint.id}:`, err);
            // Hide the problematic hint
            setShowHint(false);
            setShowCoach(false);
          }
        }
      }, 200); // Check every 200ms for quicker response
    } catch (err) {
      setError(`Error in condition checker: ${err.message}`);
      console.error("Error in hint system:", err);
    }
    
    return () => {
      if (checkConditionTimerRef.current) clearInterval(checkConditionTimerRef.current);
    };
  }, [showHint, currentHint, enabled, subsequentDelay]);
  
  // Start coach timer when a hint is shown
  useEffect(() => {
    if (coachEnabled && showHint && initialHintShown && !dismissTimerRef.current) {
      startCoachTimer();
    }
    
    return () => {
      if (coachTimerRef.current) clearTimeout(coachTimerRef.current);
    };
  }, [coachEnabled, showHint, initialHintShown]);
  
  // If there's an error, show nothing or a minimal error indicator
  if (error) {
    console.error("SimplifiedHintSystem error:", error);
    return null; // Return nothing on error
  }
  
  // Add CSS styles for animations
  const styles = `
    @keyframes float {
      0% { transform: translate(-50%, -50%) translateY(0px); }
      50% { transform: translate(-50%, -50%) translateY(-10px); }
      100% { transform: translate(-50%, -50%) translateY(0px); }
    }
    
    @keyframes coach-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes message-bounce {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(-5px); }
    }
    
    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.7; }
      50% { transform: scale(1.05); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.7; }
    }
    
    @keyframes point {
      0% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
      100% { transform: rotate(0deg); }
    }
  `;
  
  return (
    <>
      {/* Add animations */}
      <style>{styles}</style>
      
      {/* Render hint bubble */}
      {enabled && showHint && currentHint && (
        <div 
          className="hint-bubble"
          style={{
            position: 'absolute',
            ...(currentHint.position || { top: '50%', left: '50%' }),
            zIndex: 1000,
            padding: '12px 20px',
            background: 'rgba(255, 250, 230, 0.95)',
            borderRadius: '20px',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
            border: '3px solid #FFC107',
            maxWidth: '250px',
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
          <div 
            style={{
              fontSize: '12px',
              color: '#8D6E63',
              textAlign: 'center',
              marginTop: '8px'
            }}
          >
            {initialHintShown && dismissTimerRef.current === null ? '(Click to dismiss)' : ''}
          </div>
        </div>
      )}
      
{/* Render coach character */}
{coachEnabled && showCoach && coachTarget && (
  <div 
    style={{
      position: 'absolute',
      left: `${coachTarget.x}px`,
      top: `${coachTarget.y}px`,
      transform: 'translate(-50%, -50%)',
      zIndex: 1000, // Base z-index for the coach container
      cursor: 'pointer',
      width: '120px',
      height: '120px',
      animation: 'coach-bounce 2s infinite ease-in-out',
      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
      backgroundColor: coachImage ? 'transparent' : 'rgba(255, 215, 0, 0.5)'
    }}
    onClick={handleCoachDismiss}
  >
    {/* Coach image/emoji */}
    {coachImage ? (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${coachImage})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          zIndex: 1001 // Ensure image is above container
        }}
      />
    ) : (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          zIndex: 1001 // Ensure emoji is above container
        }}
      >
        🐭
      </div>
    )}
    
    {/* Coach message bubble - MOVED TO SEPARATE ELEMENT */}
  </div>
)}

{/* Render coach message separately at a higher z-index */}
{coachEnabled && showCoach && coachTarget && coachMessage && (
  <div
    style={{
      position: 'absolute',
      top: `${coachTarget.y - 100}px`, // Position above coach
      left: `${coachTarget.x}px`,
      transform: 'translateX(-50%)',
      background: 'rgba(255, 250, 230, 0.95)',
      padding: '12px 18px',
      borderRadius: '15px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      border: '3px solid #FFC107',
      maxWidth: '200px',
      textAlign: 'center',
      zIndex: 1500, // Much higher z-index to ensure it's above everything
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#5D4037',
      animation: 'message-bounce 2s infinite ease-in-out 0.3s',
      whiteSpace: 'normal',
      pointerEvents: 'none' // Prevent the bubble from catching clicks
    }}
  >
    {coachMessage}
    {/* Message pointer (triangle) */}
    <div
      style={{
        position: 'absolute',
        bottom: '-15px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderTop: '15px solid rgba(255, 250, 230, 0.95)',
        zIndex: 1501 // Ensure pointer is above bubble
      }}
    />
  </div>
)}
    </>
  );
});

export default SimplifiedHintSystem;
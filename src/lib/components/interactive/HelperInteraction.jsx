import React, { useState, useEffect, useRef } from 'react';
import { INTERACTION_TYPES, HELPER_CONFIGS } from './helperConfigs';
import './HelperInteraction.css';

const HelperInteraction = ({ 
  helperId, 
  onInteractionComplete, 
  onInteractionFailed 
}) => {
  const [phase, setPhase] = useState('instruction');
  const [progress, setProgress] = useState(0);
  const [gestureActive, setGestureActive] = useState(false);
  
  const elementRef = useRef(null);
  const gestureData = useRef({ 
    startX: 0, 
    startY: 0, 
    currentRotation: 0,
    totalDistance: 0,
    lastAngle: 0
  });
  
  // Get configurations
  const helperConfig = HELPER_CONFIGS[helperId];
  const interactionConfig = INTERACTION_TYPES[helperConfig?.type || 'tap'];
  
  if (!helperConfig) {
    console.error(`No config found for helper: ${helperId}`);
    return null;
  }

  // ===== GESTURE CALCULATION FUNCTIONS =====
  
  const calculateTiltProgress = (deltaX, deltaY) => {
    const tiltAngle = Math.max(0, Math.min(45, -deltaY / 3));
    gestureData.current.currentRotation = tiltAngle;
    const progress = (tiltAngle / interactionConfig.threshold) * 100;
    updateElementTransform(`rotate(${tiltAngle}deg)`);
    return progress;
  };
  
  const calculateRotateProgress = (deltaX, deltaY) => {
    const rotation = Math.abs(deltaX) * 2;
    gestureData.current.currentRotation = rotation;
    const progress = Math.min(100, (rotation / interactionConfig.threshold) * 100);
    updateElementTransform(`rotateY(${rotation}deg)`);
    return progress;
  };
  
  const calculateCircularProgress = (deltaX, deltaY) => {
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    const angleDiff = Math.abs(angle - (gestureData.current.lastAngle || 0));
    gestureData.current.currentRotation += angleDiff;
    gestureData.current.lastAngle = angle;
    const progress = Math.min(100, (gestureData.current.currentRotation / interactionConfig.threshold) * 100);
    updateElementTransform(`rotate(${angle}deg)`);
    return progress;
  };
  
  const calculateSwipeProgress = (deltaX, deltaY) => {
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    gestureData.current.totalDistance = distance;
    const progress = Math.min(100, (distance / interactionConfig.threshold) * 100);
    
    // Wipe effect
    if (elementRef.current) {
      const wipeOpacity = Math.max(0.2, 1 - (progress / 100));
      elementRef.current.style.setProperty('--wipe-opacity', wipeOpacity);
    }
    
    return progress;
  };
  
  const calculatePinchProgress = (deltaX, deltaY) => {
    const inwardDistance = Math.max(0, -deltaY);
    const progress = Math.min(100, (inwardDistance / interactionConfig.threshold) * 100);
    const scale = Math.max(0.7, 1 - inwardDistance / 200);
    updateElementTransform(`scale(${scale})`);
    return progress;
  };
  
  const calculateArcProgress = (deltaX, deltaY) => {
    const arcAngle = Math.atan2(-deltaY, deltaX) * (180 / Math.PI);
    const progress = Math.min(100, (Math.abs(arcAngle) / interactionConfig.threshold) * 100);
    updateElementTransform(`rotate(${arcAngle}deg)`);
    return progress;
  };
  
  // ===== GESTURE HANDLERS =====
  
  const handleGestureStart = (e) => {
    if (phase !== 'gesture') return;
    
    setGestureActive(true);
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0;
    
    gestureData.current = {
      startX: clientX,
      startY: clientY,
      currentRotation: 0,
      totalDistance: 0,
      lastAngle: 0
    };
    
    e.preventDefault();
  };
  
  const handleGestureMove = (e) => {
    if (!gestureActive || phase !== 'gesture') return;
    
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0;
    
    const deltaX = clientX - gestureData.current.startX;
    const deltaY = clientY - gestureData.current.startY;
    
    let newProgress = 0;
    
    switch (interactionConfig.gestureType) {
      case 'tilt':
        newProgress = calculateTiltProgress(deltaX, deltaY);
        break;
      case 'rotate':
        newProgress = calculateRotateProgress(deltaX, deltaY);
        break;
      case 'circular':
        newProgress = calculateCircularProgress(deltaX, deltaY);
        break;
      case 'swipe':
        newProgress = calculateSwipeProgress(deltaX, deltaY);
        break;
      case 'pinch':
        newProgress = calculatePinchProgress(deltaX, deltaY);
        break;
      case 'arc':
        newProgress = calculateArcProgress(deltaX, deltaY);
        break;
      default:
        newProgress = 100;
    }
    
    setProgress(newProgress);
    
    // Success threshold
    if (newProgress >= 90) {
      completeInteraction();
    }
    
    e.preventDefault();
  };
  
  const handleGestureEnd = (e) => {
    if (!gestureActive) return;
    
    setGestureActive(false);
    
    if (progress < 90) {
      resetGesture();
    }
    
    e.preventDefault();
  };
  
  const updateElementTransform = (transform) => {
    if (elementRef.current) {
      elementRef.current.style.transform = transform;
    }
  };
  
  // ===== INTERACTION FLOW =====
  
  const startGesturePhase = () => {
    setPhase('gesture');
    setProgress(0);
    
    // For simple tap interactions, show for 1 second then auto-complete
    if (interactionConfig.gestureType === 'click') {
      setTimeout(() => {
        completeInteraction();
      }, 1000);
    }
  };
  
  const completeInteraction = () => {
    if (phase === 'success') return; // Prevent double-completion
    
    setPhase('success');
    setProgress(100);
    setGestureActive(false);
    
    // Reset transform
    if (elementRef.current) {
      elementRef.current.style.transform = 'none';
    }
    
    // Create success effect
    createSuccessEffect();
    
    // Notify parent after animation
    setTimeout(() => {
      onInteractionComplete?.(helperId, helperConfig.phrase);
    }, 1500);
  };
  
  const resetGesture = () => {
    setProgress(0);
    
    if (elementRef.current) {
      elementRef.current.style.transform = 'none';
      elementRef.current.style.removeProperty('--wipe-opacity');
    }
    
    // Show encouragement
    setTimeout(() => {
      if (phase === 'gesture') {
        // Still in gesture phase, they can try again
      }
    }, 500);
  };
  
  const createSuccessEffect = () => {
    const container = document.createElement('div');
    container.className = 'success-particles';
    container.style.color = helperConfig.particleColor;
    
    document.body.appendChild(container);
    
    setTimeout(() => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, 3000);
  };
  
  const handleFallbackActivation = () => {
    completeInteraction();
  };
  
  // ===== EVENT LISTENERS =====
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element || phase !== 'gesture') return;
    
    // Mouse events
    element.addEventListener('mousedown', handleGestureStart);
    document.addEventListener('mousemove', handleGestureMove);
    document.addEventListener('mouseup', handleGestureEnd);
    
    // Touch events
    element.addEventListener('touchstart', handleGestureStart, { passive: false });
    document.addEventListener('touchmove', handleGestureMove, { passive: false });
    document.addEventListener('touchend', handleGestureEnd, { passive: false });
    
    return () => {
      element.removeEventListener('mousedown', handleGestureStart);
      document.removeEventListener('mousemove', handleGestureMove);
      document.removeEventListener('mouseup', handleGestureEnd);
      element.removeEventListener('touchstart', handleGestureStart);
      document.removeEventListener('touchmove', handleGestureMove);
      document.removeEventListener('touchend', handleGestureEnd);
    };
  }, [phase, gestureActive]);
  
  // ===== RENDER =====
  
  return (
    <div className="helper-interaction-container">
      {/* Helper Visual */}
      <div 
        ref={elementRef}
        className={`helper-interaction-visual ${phase} ${interactionConfig.gestureType}`}
        style={{ 
          backgroundColor: helperConfig.color
        }}
      >
        <span className="helper-icon">{helperConfig.icon}</span>
        
        {/* Progress Indicator */}
        {phase === 'gesture' && interactionConfig.gestureType !== 'click' && (
          <div className="gesture-progress">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      
      {/* Phase-specific UI */}
      {phase === 'instruction' && (
        <div className="interaction-instruction">
          <p>{interactionConfig.instruction}</p>
          <button onClick={startGesturePhase} className="start-gesture-btn">
            Let's Go!
          </button>
        </div>
      )}
      
      {phase === 'gesture' && interactionConfig.gestureType !== 'click' && (
        <div className="gesture-instruction">
          <p>{interactionConfig.instruction}</p>
          <button onClick={handleFallbackActivation} className="fallback-btn">
            {interactionConfig.fallbackText}
          </button>
        </div>
      )}
      
      {phase === 'success' && (
        <div className="success-message">
          <p>"{helperConfig.phrase}"</p>
        </div>
      )}
    </div>
  );
};

export default HelperInteraction;
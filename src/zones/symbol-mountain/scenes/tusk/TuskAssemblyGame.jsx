// zones/symbol-mountain/scenes/symbol/components/TuskAssemblyGame.jsx
// 🐘 Pure Visual Component - Sacred Ganesha Assembly Sequence (NO drop handling)

import React, { useState, useEffect, useRef } from 'react';
import SparkleAnimation from '../../../../lib/components/animation/SparkleAnimation';

// Import assembly images
import ganeshaOutline from './assets/images/ganesha-outline.png';
import ganeshaTuskOutline from './assets/images/ganesha-tusk-outline.png';
import ganeshaComplete from './assets/images/ganesha-complete.png';

// Import your musical instrument images for visual feedback
import musicalTabla from './assets/images/musical-tabla-colored.png';
import musicalFlute from './assets/images/musical-flute-colored.png';
import musicalBells from './assets/images/musical-bells-colored.png';
import musicalCymbals from './assets/images/musical-cymbals-colored.png';

const musicalInstruments = {
  tabla: { image: musicalTabla, name: 'Tabla' },
  flute: { image: musicalFlute, name: 'Flute' },
  bells: { image: musicalBells, name: 'Bells' },
  cymbals: { image: musicalCymbals, name: 'Cymbals' }
};

const TuskAssemblyGame = ({ 
  isActive = false,
  tuskPower = 0,
  profileName = 'little explorer',
  onTuskFullyPowered,
  onGaneshaComplete,
  onClose,
  autoStart = false
}) => {
  console.log('🐘 TuskAssemblyGame Visual Component:', { isActive, tuskPower, autoStart });

  // Visual states only
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSparkle, setShowSparkle] = useState(null);
  const [tuskGlowing, setTuskGlowing] = useState(false);
  const [tuskFloating, setTuskFloating] = useState(false);
  const [ganeshaAssembled, setGaneshaAssembled] = useState(false);
  const [assemblyPhase, setAssemblyPhase] = useState('waiting'); // 'waiting', 'powering', 'floating', 'complete'
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [previousTuskPower, setPreviousTuskPower] = useState(0);

  // Refs
  const timeoutsRef = useRef([]);

  // Clean up timeouts
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  };

  // Safe timeout
  const safeSetTimeout = (callback, delay) => {
    const timeout = setTimeout(callback, delay);
    timeoutsRef.current.push(timeout);
    return timeout;
  };

  // Initialize visual component when activated
  useEffect(() => {
    if (isActive) {
      console.log('🐘 Initializing visual tusk assembly display');
      setShowInstructions(true);
      setAssemblyPhase('waiting');
      setTuskFloating(false);
      setGaneshaAssembled(false);
      setFeedbackMessage('');
      clearAllTimeouts();
      
      // Show initial instructions
      setFeedbackMessage(`Sacred Ganesha Assembly begins, ${profileName}! Watch the divine transformation!`);
      
      // Hide instructions after showing them
      safeSetTimeout(() => {
        setShowInstructions(false);
      }, 3000);
    }
  }, [isActive, profileName]);

  // Auto-start visual sequence if requested
  useEffect(() => {
    if (autoStart && isActive && assemblyPhase === 'waiting') {
      console.log('🐘 Auto-starting visual assembly sequence');
      safeSetTimeout(() => {
        setShowInstructions(false);
      }, 2000);
    }
  }, [autoStart, isActive, assemblyPhase]);

  // Watch tusk power changes for visual effects (main logic)
  useEffect(() => {
    if (isActive && tuskPower > previousTuskPower) {
      console.log(`🐘 Visual: Tusk power increased to ${tuskPower}/3`);
      setAssemblyPhase('powering');
      setTuskGlowing(true);
      
      // Update cultural feedback messages
      if (tuskPower === 1) {
        setFeedbackMessage('🎵 Divine harmony begins! The sacred tusk awakens with musical energy!');
      } else if (tuskPower === 2) {
        setFeedbackMessage('🎶 Sacred melodies flow! Ganesha\'s power grows stronger with each note!');
      } else if (tuskPower === 3) {
        setFeedbackMessage('✨ Perfect divine symphony! The tusk is ready to join Lord Ganesha!');
        handleTuskFullyPowered();
      }
      
      // Show power-up sparkle effect
      setShowSparkle(`tusk-power-${tuskPower}`);
      safeSetTimeout(() => {
        setShowSparkle(null);
      }, 2500);
      
      setPreviousTuskPower(tuskPower);
    }
  }, [tuskPower, isActive, previousTuskPower]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  // Handle visual tusk fully powered sequence
  const handleTuskFullyPowered = () => {
    console.log('🐘 Visual: Starting tusk floating animation sequence');
    setAssemblyPhase('floating');
    setTuskFloating(true);
    setFeedbackMessage(`🚀 Behold! The sacred tusk rises to complete Lord Ganesha, ${profileName}!`);
    
    // Callback to parent
    if (onTuskFullyPowered) {
      onTuskFullyPowered();
    }
    
    // Start Ganesha assembly visual sequence after floating animation
    safeSetTimeout(() => {
      handleGaneshaAssembly();
    }, 3500); // Slightly longer for dramatic effect
  };

  // Handle visual Ganesha assembly sequence
  const handleGaneshaAssembly = () => {
    console.log('🐘 Visual: Starting complete Ganesha assembly');
    setAssemblyPhase('complete');
    setTuskFloating(false);
    setGaneshaAssembled(true);
    setFeedbackMessage(`🎉 Glory to Lord Ganesha! Divine assembly complete through sacred music, ${profileName}!`);
    
    // Show magnificent completion sparkle
    setShowSparkle('ganesha-complete');
    
    // Callback to parent
    if (onGaneshaComplete) {
      safeSetTimeout(() => {
        onGaneshaComplete();
      }, 2500); // Allow time to appreciate the visual
    }
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="tusk-assembly-visual-container" style={visualContainerStyle}>
      
      {/* Cultural Instructions Overlay */}
      {showInstructions && (
        <div style={instructionsOverlayStyle}>
          🐘 Sacred Ganesha Assembly - Watch the divine transformation through musical harmony!
        </div>
      )}
      
      {/* Cultural Progress & Feedback */}
      <div style={feedbackOverlayStyle}>
        {feedbackMessage}
      </div>
      
      {/* Divine Power Level Indicator */}
      <div style={powerLevelStyle}>
        ✨ Divine Power: {tuskPower}/3
      </div>
      
      {/* Sacred Ganesha Outline - The divine form awaiting completion */}
      {!ganeshaAssembled && (
        <div style={ganeshaOutlineStyle}>
          <img 
            src={ganeshaOutline}
            alt="Sacred Ganesha Awaiting Assembly"
            style={{
              width: '100%',
              height: '100%',
              opacity: 0.6,
              filter: 'brightness(1.2)',
              transition: 'all 0.8s ease'
            }}
          />
          
          {/* Divine outline glow when tusk is powering up */}
          {tuskPower > 0 && (
            <div style={{
              position: 'absolute',
              top: '-10px',
              left: '-10px',
              right: '-10px',
              bottom: '-10px',
              background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'divineGlow 2.5s infinite'
            }} />
          )}
        </div>
      )}
      
      {/* Sacred Tusk Outline - Visual representation only */}
      {!tuskFloating && !ganeshaAssembled && (
        <div style={{
          ...tuskOutlineStyle,
          filter: tuskGlowing 
            ? 'brightness(1.6) drop-shadow(0 0 25px #ffd700) saturate(1.4)' 
            : 'brightness(1.1)',
          transition: 'all 0.8s ease'
        }}>
          <img 
            src={ganeshaTuskOutline}
            alt="Sacred Tusk Awaiting Power"
            style={{
              width: '100%',
              height: '100%',
              opacity: 0.8,
              transition: 'all 0.8s ease'
            }}
          />
          
          {/* Sacred tusk power glow effect */}
          {tuskPower > 0 && (
            <div style={{
              position: 'absolute',
              top: '-8px',
              left: '-8px',
              right: '-8px',
              bottom: '-8px',
              background: `radial-gradient(circle, rgba(255,215,0,${0.25 + tuskPower * 0.15}) 0%, transparent 70%)`,
              borderRadius: '50%',
              animation: `sacredPower${tuskPower} 2s infinite`
            }} />
          )}
          
          {/* Cultural significance indicator */}
          <div style={significanceIndicatorStyle}>
            🕉️ Sacred Tusk of Wisdom 🕉️
          </div>
        </div>
      )}
      
      {/* Floating Sacred Tusk - Divine ascension */}
      {tuskFloating && (
        <div style={floatingTuskStyle}>
          <img 
            src={ganeshaTuskOutline}
            alt="Sacred Tusk Ascending"
            style={{
              width: '100%',
              height: '100%',
              filter: 'brightness(2) drop-shadow(0 0 30px #ffd700) saturate(1.6)',
              animation: 'floatToGanesha 3.5s ease-in-out forwards'
            }}
          />
          
          {/* Divine ascension sparkles */}
          <SparkleAnimation
            type="glitter"
            count={40}
            color="#ffd700"
            size={14}
            duration={3500}
            fadeOut={true}
            area="full"
          />
        </div>
      )}
      
      {/* Complete Sacred Ganesha - Divine manifestation */}
      {ganeshaAssembled && (
        <div style={completeGaneshaStyle}>
          <img 
            src={ganeshaComplete}
            alt="Complete Lord Ganesha - Victory of Divine Music"
            style={{
              width: '100%',
              height: '100%',
              filter: 'brightness(1.5) saturate(1.5) drop-shadow(0 0 35px #ffd700)',
              animation: 'divineAppearance 2.5s ease-out forwards'
            }}
          />
          
          {/* Magnificent divine completion sparkles */}
          {showSparkle === 'ganesha-complete' && (
            <SparkleAnimation
              type="magic"
              count={60}
              color="#ffd700"
              size={18}
              duration={4500}
              fadeOut={true}
              area="full"
            />
          )}
        </div>
      )}
      
      {/* Power-up divine sparkle effects */}
      {showSparkle && showSparkle.startsWith('tusk-power-') && (
        <div style={{ 
          position: 'absolute', 
          top: '65%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '120px', 
          height: '120px' 
        }}>
          <SparkleAnimation
            type="star"
            count={25}
            color="#ffd700"
            size={12}
            duration={2500}
            fadeOut={true}
            area="full"
          />
        </div>
      )}
      
      {/* Sacred CSS Animations */}
      <style>{sacredAnimationsCSS}</style>
      
      {/* Close Button (optional) */}
      {onClose && (
        <button 
          style={closeButtonStyle}
          onClick={onClose}
          title="Close Sacred Assembly"
        >
          ✕
        </button>
      )}
    </div>
  );
};

// Enhanced Visual Styles
const visualContainerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 15, // Below the drop zone but above background
  pointerEvents: 'none' // Don't interfere with drops
};

const instructionsOverlayStyle = {
  position: 'absolute',
  top: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.95), rgba(255, 140, 0, 0.95))',
  padding: '15px 30px',
  borderRadius: '25px',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#8B4513',
  boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)',
  zIndex: 50,
  maxWidth: '600px',
  textAlign: 'center',
  border: '2px solid rgba(255, 215, 0, 0.6)'
};

const feedbackOverlayStyle = {
  position: 'absolute',
  top: '80px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.9), rgba(160, 82, 45, 0.9))',
  color: '#FFD700',
  padding: '12px 25px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: 'bold',
  zIndex: 50,
  minWidth: '350px',
  textAlign: 'center',
  transition: 'all 0.8s ease',
  border: '1px solid rgba(255, 215, 0, 0.5)'
};

const powerLevelStyle = {
  position: 'absolute',
  top: '140px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.9), rgba(255, 69, 0, 0.9))',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '15px',
  fontSize: '14px',
  fontWeight: 'bold',
  zIndex: 50,
  border: '2px solid rgba(255, 215, 0, 0.6)'
};

const ganeshaOutlineStyle = {
  position: 'absolute',
  top: '35%',
  left: '50%',
  width: '130px',
  height: '160px',
  transform: 'translate(-50%, -50%)',
  zIndex: 10
};

const tuskOutlineStyle = {
  position: 'absolute',
  top: '65%',
  left: '50%',
  width: '90px',
  height: '110px',
  transform: 'translate(-50%, -50%)',
  zIndex: 12
};

const significanceIndicatorStyle = {
  position: 'absolute',
  bottom: '-35px',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '10px',
  color: '#8B4513',
  background: 'rgba(255, 248, 220, 0.95)',
  padding: '4px 12px',
  borderRadius: '12px',
  whiteSpace: 'nowrap',
  border: '1px solid rgba(255, 215, 0, 0.6)'
};

const floatingTuskStyle = {
  position: 'absolute',
  top: '65%',
  left: '50%',
  width: '90px',
  height: '110px',
  transform: 'translate(-50%, -50%)',
  zIndex: 25
};

const completeGaneshaStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '160px',
  height: '200px',
  transform: 'translate(-50%, -50%)',
  zIndex: 30
};

const closeButtonStyle = {
  position: 'absolute',
  top: '15px',
  right: '20px',
  background: 'rgba(255, 255, 255, 0.9)',
  border: '2px solid rgba(255, 215, 0, 0.6)',
  borderRadius: '50%',
  width: '35px',
  height: '35px',
  fontSize: '16px',
  cursor: 'pointer',
  color: '#8B4513',
  zIndex: 60,
  pointerEvents: 'auto'
};

const sacredAnimationsCSS = `
  @keyframes floatToGanesha {
    0% { 
      transform: translate(-50%, -50%); 
      opacity: 1;
    }
    30% {
      transform: translate(-50%, -200%);
      opacity: 0.9;
    }
    70% {
      transform: translate(-50%, -320%);
      opacity: 0.7;
    }
    100% { 
      transform: translate(-50%, -380%); 
      opacity: 0;
    }
  }
  
  @keyframes divineAppearance {
    0% { 
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.7);
      filter: brightness(0.8) saturate(0.8);
    }
    40% {
      opacity: 0.8;
      transform: translate(-50%, -50%) scale(1.15);
      filter: brightness(1.8) saturate(1.8);
    }
    100% { 
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
      filter: brightness(1.5) saturate(1.5) drop-shadow(0 0 35px #ffd700);
    }
  }
  
  @keyframes divineGlow {
    0%, 100% { 
      opacity: 0.3;
      transform: scale(1);
    }
    50% { 
      opacity: 0.7;
      transform: scale(1.08);
    }
  }
  
  @keyframes sacredPower1 {
    0%, 100% { opacity: 0.25; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.03); }
  }
  
  @keyframes sacredPower2 {
    0%, 100% { opacity: 0.35; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.05); }
  }
  
  @keyframes sacredPower3 {
    0%, 100% { opacity: 0.45; transform: scale(1); }
    50% { opacity: 0.85; transform: scale(1.07); }
  }
`;

export default TuskAssemblyGame;
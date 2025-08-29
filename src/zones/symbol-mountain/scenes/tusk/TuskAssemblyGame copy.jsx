// zones/symbol-mountain/scenes/symbol/components/TuskAssemblyGame.jsx
// 🐘 Inline tusk assembly game component - drag musical notes to power up and assemble Ganesha

import React, { useState, useEffect, useRef } from 'react';
import SparkleAnimation from '../../../../lib/components/animation/SparkleAnimation';
import DropZone from '../../../../lib/components/interactive/DropZone';

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
  goldenNotes = [],
  onNoteFedToTusk,
  onTuskFullyPowered,
  onGaneshaComplete,
  onClose,
  profileName = 'little explorer',
  autoStart = false
}) => {
  console.log('🐘 TuskAssemblyGame render:', { isActive, tuskPower, goldenNotes, autoStart });

  // Game states
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSparkle, setShowSparkle] = useState(null);
  const [tuskGlowing, setTuskGlowing] = useState(false);
  const [tuskFloating, setTuskFloating] = useState(false);
  const [ganeshaAssembled, setGaneshaAssembled] = useState(false);
  const [assemblyPhase, setAssemblyPhase] = useState('waiting'); // 'waiting', 'powering', 'floating', 'complete'
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Refs
  const timeoutsRef = useRef([]);
  const tuskAreaRef = useRef(null);

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

  // Handle musical note drop on tusk
  const handleTuskNoteDrop = (dragData) => {
    console.log('🎵 Musical note dropped on tusk:', dragData);
    
    if (!isActive || assemblyPhase === 'complete') {
      console.log('🚫 Tusk not ready for feeding');
      return false;
    }
    
    const { id, data } = dragData;
    const noteId = data.noteId;
    
    console.log(`🎵 Note ${noteId} fed to tusk!`);
    
    // Visual feedback
    setShowSparkle(`note-${noteId}-fed`);
    setTuskGlowing(true);
    
    // Callback to parent to handle the note consumption
    if (onNoteFedToTusk) {
      onNoteFedToTusk(noteId);
    }
    
    return true; // Note was consumed
  };

  // Initialize game when activated
  useEffect(() => {
    if (isActive) {
      console.log('🐘 Initializing tusk assembly game');
      setShowInstructions(true);
      setAssemblyPhase('waiting');
      setTuskFloating(false);
      setGaneshaAssembled(false);
      setFeedbackMessage('');
      clearAllTimeouts();
      
      // Show initial instructions
      setFeedbackMessage(`Drag the golden musical notes to the sacred tusk, ${profileName}!`);
    }
  }, [isActive, profileName]);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && isActive && assemblyPhase === 'waiting') {
      console.log('🐘 Auto-starting tusk assembly');
      safeSetTimeout(() => {
        setShowInstructions(false);
      }, 2000);
    }
  }, [autoStart, isActive, assemblyPhase]);

  // Watch tusk power changes
  useEffect(() => {
    if (isActive && tuskPower > 0) {
      console.log(`🐘 Tusk power level: ${tuskPower}/3`);
      setAssemblyPhase('powering');
      setTuskGlowing(true);
      
      // Update feedback message
      if (tuskPower === 1) {
        setFeedbackMessage('🎵 Great! The tusk begins to glow with musical energy!');
      } else if (tuskPower === 2) {
        setFeedbackMessage('🎶 Excellent! Sacred harmony is building in the tusk!');
      } else if (tuskPower === 3) {
        setFeedbackMessage('✨ Perfect! The tusk is fully powered with divine music!');
        handleTuskFullyPowered();
      }
      
      // Show power-up sparkle
      setShowSparkle(`tusk-power-${tuskPower}`);
      safeSetTimeout(() => {
        setShowSparkle(null);
      }, 2000);
    }
  }, [tuskPower, isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  // Handle tusk fully powered
  const handleTuskFullyPowered = () => {
    console.log('🐘 Tusk fully powered - starting floating animation');
    setAssemblyPhase('floating');
    setTuskFloating(true);
    setFeedbackMessage('🚀 The sacred tusk rises to join Lord Ganesha!');
    
    // Callback to parent
    if (onTuskFullyPowered) {
      onTuskFullyPowered();
    }
    
    // Start Ganesha assembly after floating animation
    safeSetTimeout(() => {
      handleGaneshaAssembly();
    }, 3000);
  };

  // Handle Ganesha assembly
  const handleGaneshaAssembly = () => {
    console.log('🐘 Assembling complete Ganesha');
    setAssemblyPhase('complete');
    setTuskFloating(false);
    setGaneshaAssembled(true);
    setFeedbackMessage(`🎉 Divine assembly complete! You have awakened Lord Ganesha, ${profileName}!`);
    
    // Show completion sparkle
    setShowSparkle('ganesha-complete');
    
    // Callback to parent
    if (onGaneshaComplete) {
      safeSetTimeout(() => {
        onGaneshaComplete();
      }, 2000);
    }
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="tusk-assembly-game-inline" style={inlineContainerStyle}>
      
      {/* Instructions Overlay 
      {showInstructions && (
        <div style={instructionsOverlayStyle}>
          🐘 Sacred Tusk Assembly - Drag golden musical notes to the tusk to awaken Lord Ganesha!
        </div>
      )}
      
      {/* Progress & Feedback 
      <div style={feedbackOverlayStyle}>
        {feedbackMessage}
      </div>
      
      {/* Power Level Indicator */}
      <div style={powerLevelStyle}>
        🔥 Tusk Power: {tuskPower}/3
      </div>
      
      {/* Ganesha Outline - Appears when game starts */}
      {!ganeshaAssembled && (
        <div style={ganeshaOutlineStyle}>
          <img 
            src={ganeshaOutline}
            alt="Ganesha Assembly Outline"
            style={{
              width: '100%',
              height: '100%',
              opacity: 0.6,
              filter: 'brightness(1.2)',
              transition: 'all 0.5s ease'
            }}
          />
          
          {/* Ganesha outline glow when tusk is powering up */}
          {tuskPower > 0 && (
            <div style={{
              position: 'absolute',
              top: '-10px',
              left: '-10px',
              right: '-10px',
              bottom: '-10px',
              background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'ganeshaGlow 2s infinite'
            }} />
          )}
        </div>
      )}
      
      {/* Tusk Outline - Drop target */}
      {!tuskFloating && !ganeshaAssembled && (
        <div 
          ref={tuskAreaRef}
          style={{
            ...tuskOutlineStyle,
            filter: tuskGlowing 
              ? 'brightness(1.5) drop-shadow(0 0 20px #ffd700)' 
              : 'brightness(1.1)'
          }}
        >
          <DropZone
            id="tusk-feeding-zone"
            acceptTypes={['musical-note']}
            onDrop={handleTuskNoteDrop}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%'
            }}
          >
            <img 
              src={ganeshaTuskOutline}
              alt="Tusk Assembly Outline"
              style={{
                width: '100%',
                height: '100%',
                opacity: 0.7,
                transition: 'all 0.5s ease'
              }}
            />
          </DropZone>
          
          {/* Tusk power glow effect */}
          {tuskPower > 0 && (
            <div style={{
              position: 'absolute',
              top: '-5px',
              left: '-5px',
              right: '-5px',
              bottom: '-5px',
              background: `radial-gradient(circle, rgba(255,215,0,${0.2 + tuskPower * 0.1}) 0%, transparent 70%)`,
              borderRadius: '50%',
              animation: `tuskPower${tuskPower} 1.5s infinite`
            }} />
          )}
          
          {/* Drop zone indicator */}
          <div style={dropZoneIndicatorStyle}>
            🎵 Drop golden notes here 🎵
          </div>
        </div>
      )}
      
      {/* Floating Tusk - When fully powered */}
      {tuskFloating && (
        <div style={floatingTuskStyle}>
          <img 
            src={ganeshaTuskOutline}
            alt="Floating Sacred Tusk"
            style={{
              width: '100%',
              height: '100%',
              filter: 'brightness(1.8) drop-shadow(0 0 25px #ffd700)',
              animation: 'floatToGanesha 3s ease-in-out forwards'
            }}
          />
          
          {showSparkle === 'tusk-floating' && (
            <SparkleAnimation
              type="glitter"
              count={30}
              color="#ffd700"
              size={12}
              duration={3000}
              fadeOut={true}
              area="full"
            />
          )}
        </div>
      )}
      
      {/* Complete Ganesha - Final assembly */}
      {ganeshaAssembled && (
        <div style={completeGaneshaStyle}>
          <img 
            src={ganeshaComplete}
            alt="Complete Sacred Ganesha"
            style={{
              width: '100%',
              height: '100%',
              filter: 'brightness(1.4) saturate(1.4) drop-shadow(0 0 30px #ffd700)',
              animation: 'ganeshaAppear 2s ease-out forwards'
            }}
          />
          
          {showSparkle === 'ganesha-complete' && (
            <SparkleAnimation
              type="magic"
              count={50}
              color="#ffd700"
              size={15}
              duration={4000}
              fadeOut={true}
              area="full"
            />
          )}
        </div>
      )}
      
      {/* Power-up sparkle effects */}
      {showSparkle && showSparkle.startsWith('tusk-power-') && (
        <div style={{ position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)', width: '100px', height: '100px' }}>
          <SparkleAnimation
            type="star"
            count={20}
            color="#ffd700"
            size={10}
            duration={2000}
            fadeOut={true}
            area="full"
          />
        </div>
      )}
      
      {/* Note fed sparkle effects */}
      {showSparkle && showSparkle.startsWith('note-') && showSparkle.endsWith('-fed') && (
        <div style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px' }}>
          <SparkleAnimation
            type="glitter"
            count={15}
            color="#00ff00"
            size={8}
            duration={1500}
            fadeOut={true}
            area="full"
          />
        </div>
      )}
      
      {/* CSS Animations */}
      <style>{tuskAnimationsCSS}</style>
      
      {/* Close Button (optional) */}
      {onClose && (
        <button 
          style={closeButtonStyle}
          onClick={onClose}
        >
          ✕
        </button>
      )}
    </div>
  );
};

// Inline Styles
const inlineContainerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 20,
  pointerEvents: 'auto'
};

const instructionsOverlayStyle = {
  position: 'absolute',
  top: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(255, 255, 255, 0.95)',
  padding: '15px 25px',
  borderRadius: '20px',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#01579b',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  zIndex: 50,
  maxWidth: '500px',
  textAlign: 'center'
};

const feedbackOverlayStyle = {
  position: 'absolute',
  top: '120px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(76, 175, 80, 0.9)',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '15px',
  fontSize: '14px',
  fontWeight: 'bold',
  zIndex: 50,
  minWidth: '300px',
  textAlign: 'center',
  transition: 'all 0.5s ease'
};

const powerLevelStyle = {
  position: 'absolute',
  top: '170px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(255, 152, 0, 0.9)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: 'bold',
  zIndex: 50
};

const ganeshaOutlineStyle = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  width: '120px',
  height: '150px',
  transform: 'translate(-50%, -50%)',
  zIndex: 10
};

const tuskOutlineStyle = {
  position: 'absolute',
  top: '70%',
  left: '50%',
  width: '80px',
  height: '100px',
  transform: 'translate(-50%, -50%)',
  zIndex: 15,
  cursor: 'pointer',
  transition: 'all 0.5s ease'
};

const dropZoneIndicatorStyle = {
  position: 'absolute',
  bottom: '-30px',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '10px',
  color: '#666',
  background: 'rgba(255, 255, 255, 0.9)',
  padding: '2px 8px',
  borderRadius: '10px',
  whiteSpace: 'nowrap'
};

const floatingTuskStyle = {
  position: 'absolute',
  top: '70%',
  left: '50%',
  width: '80px',
  height: '100px',
  transform: 'translate(-50%, -50%)',
  zIndex: 35
};

const completeGaneshaStyle = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  width: '150px',
  height: '180px',
  transform: 'translate(-50%, -50%)',
  zIndex: 40
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '15px',
  background: 'rgba(255, 255, 255, 0.8)',
  border: 'none',
  borderRadius: '50%',
  width: '30px',
  height: '30px',
  fontSize: '16px',
  cursor: 'pointer',
  color: '#666',
  zIndex: 60
};

const tuskAnimationsCSS = `
  @keyframes floatToGanesha {
    0% { 
      transform: translate(-50%, -50%); 
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -300%);
      opacity: 0.8;
    }
    100% { 
      transform: translate(-50%, -350%); 
      opacity: 0;
    }
  }
  
  @keyframes ganeshaAppear {
    0% { 
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    50% {
      opacity: 0.7;
      transform: translate(-50%, -50%) scale(1.1);
    }
    100% { 
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  
  @keyframes ganeshaGlow {
    0%, 100% { 
      opacity: 0.3;
      transform: scale(1);
    }
    50% { 
      opacity: 0.6;
      transform: scale(1.05);
    }
  }
  
  @keyframes tuskPower1 {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.4; }
  }
  
  @keyframes tuskPower2 {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
  
  @keyframes tuskPower3 {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
`;

export default TuskAssemblyGame;
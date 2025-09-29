// STEP 1: Create this file: lib/components/missions/SaveAnimalMission.jsx

import React, { useState } from 'react';
import HelperSignatureAnimation from '../animation/HelperSignatureAnimation';
import './SaveAnimalMission.css';

const SaveAnimalMission = ({
  show,
  word, // 'vakratunda' or 'mahakaya'
  beforeImage,
  afterImage,
  powerConfig, // { name: 'Flexibility', icon: '🌀', color: '#FFD700' }
  smartwatchBase,
  smartwatchScreen,
  appImage,
  boyCharacter,
  onComplete,
  onCancel,  
  hideExternalElements = true  // ADD THIS PROP

}) => {
  const [rescuePhase, setRescuePhase] = useState('problem'); // 'problem', 'action', 'success'
  const [showParticles, setShowParticles] = useState(false);

  // FIXED: Reset state when component shows/hides
  React.useEffect(() => {
    if (show) {
      console.log('🎯 Save Animal Mission: Resetting to problem phase for', word);
      setRescuePhase('problem');
      setShowParticles(false);
    }
  }, [show, word]);

  const handleRescueAction = () => {
    console.log('🔥 RESCUE ACTION: Using power to help');
    setRescuePhase('action');
    
    // Show power effect
    setShowParticles(true);
    setTimeout(() => {
      setShowParticles(false);
      setRescuePhase('success');
    }, 3000);
  };

  const handleRescueComplete = () => {
    console.log('✅ Rescue complete for:', word);
    onComplete?.(word);
  };

  const handleCancel = () => {
    onCancel?.();
  };

  if (!show) return null;

  const problemMessages = {
    vakratunda: "Help! I want to eat that fruit!",
    mahakaya: "I'm so frightened, please help me!"
  };

  const actionMessages = {
    vakratunda: "My flexibility is flowing to you!",
    mahakaya: "Feel my inner strength!"
  };

  const successMessages = {
    vakratunda: "Thank you! I feel so brave now!",
    mahakaya: "Your strength helped me feel safe!"
  };

  const buttonTexts = {
    vakratunda: "Amazing! Continue Learning",
    mahakaya: "Awesome! End Scene"
  };

  return (
    <div className="save-animal-mission">
      {/* Scene Darkening Effect */}
      <div className="mission-overlay" />
      
      {/* Animal Scene Content */}
      <div className="mission-content">
        
        {rescuePhase === 'problem' && (
          <div className="mission-scene">
            <img 
              src={beforeImage}
              alt="Animal in trouble"
              className="mission-animal-image"
            />
            
            {/* Speech Bubble from Animal */}
            <div className="animal-speech-bubble">
              <div className="speech-text">
                {problemMessages[word]}
              </div>
              <div className="speech-pointer" />
            </div>
          </div>
        )}

        {rescuePhase === 'action' && (
          <div className="mission-scene">
            <img 
              src={beforeImage}
              alt="Using power to help"
              className="mission-animal-image glowing"
            />
            
            {/* Child's Speech Bubble */}
            <div className="child-speech-bubble">
              <div className="speech-text">
                {actionMessages[word]}
              </div>
              <div className="speech-pointer-child" />
            </div>
            
            {/* YES - HelperSignatureAnimation is included here */}
            <HelperSignatureAnimation
              helperId={word === 'vakratunda' ? 'snuggyshawl' : 'hammerhero'}
              fromPosition={{ x: 80, y: 80 }}
              toPosition={{ x: 20, y: 30 }}
              onAnimationComplete={() => {
                setTimeout(() => {
                  setRescuePhase('success');
                }, 1000);
              }}
            />
          </div>
        )}

        {rescuePhase === 'success' && (
          <div className="mission-scene">
            <img 
              src={afterImage}
              alt="Happy rescued animal"
              className="mission-animal-image celebrating"
            />
            
            {/* Happy Animal Speech Bubble */}
            <div className="animal-speech-bubble success">
              <div className="speech-text">
                {successMessages[word]}
              </div>
              <div className="speech-pointer" />
            </div>
            
            <button 
              className="mission-complete-btn"
              onClick={handleRescueComplete}
            >
              {buttonTexts[word]}
            </button>
          </div>
        )}
      </div>

      {/* Boy Character - Separate Positioning */}
      <div className="mission-boy-character">
        <img 
          src={boyCharacter}
          alt="Boy character"
          className="boy-image"
        />
      </div>

      {/* Smartwatch - Separate Components */}
      <div className="mission-smartwatch">
        {/* Base */}
        <img 
          src={smartwatchBase}
          alt="Smartwatch Base"
          className="smartwatch-base"
        />
        
        {/* Screen */}
        <img 
          src={smartwatchScreen}
          alt="Screen"
          className="smartwatch-screen"
        />
        
        {/* App */}
        <img 
          src={appImage}
          alt="Power App"
          onClick={(e) => {
            e.stopPropagation();
            console.log('App clicked!', rescuePhase);
            if (rescuePhase === 'problem') {
              handleRescueAction();
            }
          }}
          className={`smartwatch-app ${rescuePhase === 'problem' ? 'pulsing' : ''}`}
          style={{
            filter: rescuePhase === 'problem' 
              ? `drop-shadow(0 0 15px ${powerConfig?.color || '#FFD700'}) brightness(1.4)` 
              : 'none'
          }}
        />
        
        {/* Instruction Bubble */}
        {rescuePhase === 'problem' && (
          <div className="instruction-bubble">
            Tap your {powerConfig?.name} app!
            <div className="instruction-pointer" />
          </div>
        )}
      </div>

      {/* Power Particles */}
      {showParticles && (
        <div className="power-particles">
          {Array.from({length: 8}).map((_, i) => (
            <div 
              key={i} 
              className="particle"
              style={{ 
                '--delay': `${i * 0.3}s`,
                color: powerConfig?.color || '#FFD700'
              }}
            >
              {powerConfig?.icon || '✨'}
            </div>
          ))}
        </div>
      )}

      {/* Cancel Button (Optional) */}
      {rescuePhase === 'problem' && onCancel && (
        <button className="mission-cancel-btn" onClick={handleCancel}>
          ✕
        </button>
      )}
    </div>
  );
};

export default SaveAnimalMission;
import React, { useState, useEffect } from 'react';

const SceneCompletionCelebration = ({ 
  show = false, 
  sceneName = "Pond Adventure",
  sceneNumber = 2,
  totalScenes = 4,
  starsEarned = 5,
  totalStars = 5,
  discoveredSymbols = ['lotus', 'trunk', 'golden'],
  symbolImages = {},
  nextSceneName = "Temple Discovery",
  onContinue,
  onReplay,
  duration = 8000,
  
  // ✅ NEW PROPS FOR PROGRESS HANDLING
  sceneId = 'pond',
  completionData = null,  // { stars: 5, symbols: {}, completed: true }
  onComplete = null       // Function to save progress
}) => {
  const [stage, setStage] = useState('hidden'); // hidden -> celebration -> choice
  const [celebrationParticles, setCelebrationParticles] = useState([]);

  // Fallback emojis
  const symbolEmojis = {
    lotus: '🪷',
    trunk: '🐘', 
    golden: '⭐',
    om: '🕉️',
    temple: '🛕',
    garden: '🌺',
    water: '💧',
    mooshika: '🐭',
    modak: '🍯',
    belly: '🌌'
  };

  // Helper function to get symbol display
  const getSymbolDisplay = (symbolKey) => {
    if (symbolImages[symbolKey]) {
      return <img src={symbolImages[symbolKey]} alt={symbolKey} className="symbol-image" />;
    }
    return symbolEmojis[symbolKey] || '✨';
  };

  const createCelebrationParticle = (index) => ({
    id: `celebration-${index}-${Date.now()}`,
    left: Math.random() * 100,
    animationDelay: Math.random() * 2,
    animationDuration: 2 + Math.random() * 2,
    size: 0.8 + Math.random() * 0.4,
    rotation: Math.random() * 360,
    type: ['⭐', '✨', '🌟', '💫', '🎉'][Math.floor(Math.random() * 5)]
  });

  useEffect(() => {
    if (!show) {
      setStage('hidden');
      setCelebrationParticles([]);
      return;
    }

    // Stage 1: Show celebration
    setStage('celebration');
    
    // Create celebration particles
    const initialParticles = Array.from({ length: 30 }, (_, i) => createCelebrationParticle(i));
    setCelebrationParticles(initialParticles);

    // Continue creating particles
    const particleInterval = setInterval(() => {
      setCelebrationParticles(current => {
        const newParticles = Array.from({ length: 5 }, (_, i) => 
          createCelebrationParticle(current.length + i)
        );
        const recentParticles = current.slice(-25);
        return [...recentParticles, ...newParticles];
      });
    }, 1000);

    // Stage 2: Show choices
    const choiceTimer = setTimeout(() => {
      setStage('choice');
      clearInterval(particleInterval);
    }, 4000);

    return () => {
      clearInterval(particleInterval);
      clearTimeout(choiceTimer);
    };
  }, [show]);

  // Temporary debug version of SceneCompletionCelebration
// Replace your handleContinue and handleReplay functions with these:

const handleContinue = () => {
  console.log('🔥 DEBUG: handleContinue called');
  console.log('🔥 DEBUG: onComplete exists?', !!onComplete);
  console.log('🔥 DEBUG: completionData:', completionData);
  console.log('🔥 DEBUG: sceneId:', sceneId);
  
  setStage('exiting');
  setTimeout(() => {
    // ✅ SAVE PROGRESS FIRST
    if (onComplete && completionData) {
      console.log('🔥 DEBUG: About to call onComplete...');
      onComplete(sceneId, completionData);
      console.log('🔥 DEBUG: onComplete called successfully!');
    } else {
      console.error('🔥 DEBUG: Missing onComplete or completionData!', {
        onComplete: !!onComplete,
        completionData
      });
    }
    
    // THEN navigate
    console.log('🔥 DEBUG: About to call onContinue...');
    onContinue?.();
    console.log('🔥 DEBUG: onContinue called!');
  }, 500);
};

const handleReplay = () => {
  console.log('🔥 DEBUG: handleReplay called');
  console.log('🔥 DEBUG: onComplete exists?', !!onComplete);
  console.log('🔥 DEBUG: completionData:', completionData);
  console.log('🔥 DEBUG: sceneId:', sceneId);
  
  setStage('exiting');
  setTimeout(() => {
    // ✅ SAVE PROGRESS FIRST
    if (onComplete && completionData) {
      console.log('🔥 DEBUG: About to call onComplete...');
      onComplete(sceneId, completionData);
      console.log('🔥 DEBUG: onComplete called successfully!');
    } else {
      console.error('🔥 DEBUG: Missing onComplete or completionData!', {
        onComplete: !!onComplete,
        completionData
      });
    }
    
    // THEN navigate
    console.log('🔥 DEBUG: About to call onReplay...');
    onReplay?.();
    console.log('🔥 DEBUG: onReplay called!');
  }, 500);
};

  if (stage === 'hidden') return null;

  return (
    <div className={`scene-completion-celebration stage-${stage}`}>
      {/* Magical Background */}
      <div className="celebration-background">
        <div className="rainbow-overlay" />
        <div className="sparkle-overlay" />
      </div>

      {/* Floating Celebration Particles */}
      <div className="celebration-particles">
        {celebrationParticles.map(particle => (
          <div
            key={particle.id}
            className="celebration-particle"
            style={{
              left: `${particle.left}%`,
              fontSize: `${particle.size * 1.5}rem`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`,
              transform: `rotate(${particle.rotation}deg)`
            }}
          >
            {particle.type}
          </div>
        ))}
      </div>

      {/* Main Celebration Card */}
      <div className="celebration-card">
        <div className="card-header">
          <div className="celebration-badge">
            <div className="badge-text">Scene Complete!</div>
            <div className="badge-sparkles">✨</div>
          </div>
          
          <div className="scene-info">
            <h2 className="scene-title">{sceneName}</h2>
            <div className="scene-progress">
              Scene {sceneNumber} of {totalScenes} in Symbol Mountain
            </div>
          </div>
        </div>

        <div className="achievement-details">
          {/* Progress Bar */}
          <div className="zone-progress">
            <div className="progress-label">Zone Progress:</div>
            <div className="progress-bar">
              {Array.from({ length: totalScenes }).map((_, i) => (
                <div 
                  key={i} 
                  className={`progress-dot ${i < sceneNumber ? 'completed' : 'upcoming'}`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {i < sceneNumber ? '⭐' : '⚪'}
                </div>
              ))}
            </div>
            <div className="progress-text">
              {sceneNumber}/{totalScenes} Scenes Complete
            </div>
          </div>

          {/* Stars Earned */}
          <div className="stars-section">
            <div className="stars-label">Stars Earned:</div>
            <div className="star-display">
              {Array.from({ length: totalStars }).map((_, i) => (
                <span 
                  key={i} 
                  className={`star ${i < starsEarned ? 'earned' : 'empty'}`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  ⭐
                </span>
              ))}
            </div>
            <div className="star-count">{starsEarned}/{totalStars}</div>
          </div>

          {/* Discovered Symbols */}
          <div className="symbols-section">
            <div className="symbols-label">Symbols Discovered:</div>
            <div className="symbol-showcase">
              {discoveredSymbols.map((symbol, i) => (
                <div 
                  key={symbol} 
                  className="symbol-item"
                  style={{ animationDelay: `${i * 0.3 + 1}s` }}
                >
                  <div className="symbol-icon">{getSymbolDisplay(symbol)}</div>
                  <div className="symbol-name">{symbol}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {stage === 'choice' && (
        <div className="action-buttons">
          <button className="continue-btn" onClick={handleContinue}>
            <div className="btn-content">
              <span className="btn-icon">➡️</span>
              <span className="btn-text">Continue to {nextSceneName}</span>
            </div>
          </button>
          
          <button className="replay-btn" onClick={handleReplay}>
            <div className="btn-content">
              <span className="btn-icon">🔄</span>
              <span className="btn-text">Replay Scene</span>
            </div>
          </button>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .scene-completion-celebration {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9998;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.8s ease;
          padding: 1rem;
          box-sizing: border-box;
        }

        .stage-celebration, .stage-choice {
          opacity: 1;
        }

        .stage-exiting {
          opacity: 0;
          transform: scale(0.9);
          transition: all 0.5s ease;
        }

        .celebration-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(255, 182, 193, 0.9) 0%,
            rgba(173, 216, 230, 0.9) 25%,
            rgba(221, 160, 221, 0.9) 50%,
            rgba(255, 218, 185, 0.9) 75%,
            rgba(152, 251, 152, 0.9) 100%
          );
        }

        .rainbow-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 80%, rgba(255, 0, 150, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 255, 0, 0.1) 0%, transparent 50%);
          animation: rainbowShift 4s ease-in-out infinite;
        }

        @keyframes rainbowShift {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .sparkle-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.6), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.6), transparent);
          background-repeat: repeat;
          background-size: 150px 150px;
          animation: sparkleMove 20s linear infinite;
        }

        @keyframes sparkleMove {
          from { transform: translateY(0px); }
          to { transform: translateY(-150px); }
        }

        .celebration-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .celebration-particle {
          position: absolute;
          top: -50px;
          animation: particleFall linear;
          filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
        }

        @keyframes particleFall {
          0% {
            transform: translateY(-50px) rotateZ(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) rotateZ(360deg);
            opacity: 0;
          }
        }

        .celebration-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 248, 220, 0.95));
          border: 4px solid #FF69B4;
          border-radius: 25px;
          padding: 2rem;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            inset 0 0 20px rgba(255, 105, 180, 0.2);
          text-align: center;
          backdrop-filter: blur(15px);
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          animation: cardSlideIn 1s ease-out;
          position: relative;
          z-index: 10;
        }

        @keyframes cardSlideIn {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(100px);
          }
          60% {
            transform: scale(1.05) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .celebration-badge {
          position: relative;
          display: inline-block;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #8B4513;
          padding: 0.8rem 2rem;
          border-radius: 50px;
          font-size: 1.3rem;
          font-weight: bold;
          font-family: 'Comic Sans MS', cursive;
          margin-bottom: 1.5rem;
          box-shadow: 0 8px 16px rgba(255, 215, 0, 0.4);
          animation: badgeBounce 2s ease-in-out infinite;
        }

        @keyframes badgeBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.05); }
        }

        .badge-sparkles {
          position: absolute;
          top: -10px;
          right: -10px;
          font-size: 1.5rem;
          animation: sparkleRotate 2s linear infinite;
        }

        @keyframes sparkleRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .scene-info h2 {
          color: #8B4513;
          font-family: 'Comic Sans MS', cursive;
          font-size: 2rem;
          margin: 0 0 0.5rem 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .scene-progress {
          color: #4B0082;
          font-size: 1.1rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }

        .zone-progress {
          margin: 1.5rem 0;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 15px;
        }

        .progress-label, .stars-label, .symbols-label {
          color: #4B0082;
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 0.8rem;
        }

        .progress-bar {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 1rem 0;
        }

        .progress-dot {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          animation: dotPop 0.6s ease-out;
          transition: all 0.3s ease;
        }

        .progress-dot.completed {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
        }

        .progress-dot.upcoming {
          background: rgba(200, 200, 200, 0.5);
          border: 2px dashed #999;
        }

        @keyframes dotPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          60% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .progress-text {
          color: #8B4513;
          font-size: 1rem;
          font-weight: bold;
        }

        .stars-section {
          margin: 1.5rem 0;
          padding: 1rem;
          background: rgba(255, 215, 0, 0.1);
          border-radius: 15px;
        }

        .star-display {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin: 0.8rem 0;
        }

        .star {
          font-size: 2rem;
          animation: starPop 0.6s ease-out;
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
          transition: all 0.3s ease;
        }

        .star.empty {
          opacity: 0.3;
          filter: none;
        }

        @keyframes starPop {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          60% {
            transform: scale(1.3) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .star-count {
          color: #8B4513;
          font-size: 1.2rem;
          font-weight: bold;
        }

        .symbols-section {
          margin: 1.5rem 0;
          padding: 1rem;
          background: rgba(255, 105, 180, 0.1);
          border-radius: 15px;
        }

        .symbol-showcase {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }

        .symbol-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          animation: symbolReveal 0.8s ease-out;
        }

        .symbol-icon {
          font-size: 2.5rem;
          filter: drop-shadow(0 0 10px rgba(255, 20, 147, 0.6));
        }

        .symbol-image {
          width: 50px;
          height: 50px;
          object-fit: contain;
          border-radius: 8px;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
        }

        .symbol-name {
          color: #8B4513;
          font-size: 0.9rem;
          font-weight: bold;
          text-transform: capitalize;
        }

        @keyframes symbolReveal {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.5);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .action-buttons {
          display: flex;
          gap: 1.5rem;
          margin-top: 1.5rem;
          animation: buttonsSlideUp 1s ease-out 0.5s both;
          z-index: 10;
          position: relative;
        }

        @keyframes buttonsSlideUp {
          0% {
            opacity: 0;
            transform: translateY(50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .continue-btn, .replay-btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 20px;
          font-family: 'Comic Sans MS', cursive;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .continue-btn {
          background: linear-gradient(135deg, #32CD32, #228B22);
          color: white;
        }

        .continue-btn:hover {
          background: linear-gradient(135deg, #228B22, #006400);
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
        }

        .replay-btn {
          background: linear-gradient(135deg, #FF6347, #DC143C);
          color: white;
        }

        .replay-btn:hover {
          background: linear-gradient(135deg, #DC143C, #B22222);
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
        }

        .btn-content {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .btn-icon {
          font-size: 1.3rem;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .celebration-card {
            width: 95%;
            padding: 1.5rem;
            max-height: 85vh;
          }
          
          .scene-info h2 {
            font-size: 1.5rem;
          }
          
          .celebration-badge {
            font-size: 1.1rem;
            padding: 0.6rem 1.5rem;
          }
          
          .progress-bar {
            gap: 0.5rem;
          }
          
          .progress-dot {
            width: 35px;
            height: 35px;
            font-size: 1.2rem;
          }
          
          .action-buttons {
            flex-direction: column;
            gap: 1rem;
          }
          
          .continue-btn, .replay-btn {
            width: 100%;
          }
          
          .symbol-showcase {
            gap: 1rem;
          }
          
          .symbol-item .symbol-icon {
            font-size: 2rem;
          }
          
          .symbol-image {
            width: 40px;
            height: 40px;
          }
        }

        @media (orientation: portrait) and (max-height: 700px) {
          .celebration-card {
            max-height: 90vh;
            font-size: 0.9rem;
          }
          
          .scene-info h2 {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SceneCompletionCelebration;
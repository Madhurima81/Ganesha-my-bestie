// ZoneCompletionCelebration.jsx - Epic zone completion system
import React, { useState, useEffect } from 'react';
import EnhancedDivineBlessing from './EnhancedDivineBlessing';

const ZoneCompletionCelebration = ({
  show = false,
  zoneId = 'symbol-mountain',
  playerName = 'little explorer',
  discoveredSymbols = [],
  starsEarned = 8,
  totalStars = 8,
  onComplete,
  onContinueExploring,
  onViewProgress
}) => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [showBlessing, setShowBlessing] = useState(false);
  const [showManifiestation, setShowManifiestation] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  // Zone-specific configurations
  const ZONE_CONFIGS = {
    'symbol-mountain': {
      title: 'Guardian of Sacred Symbols',
      shortTitle: 'Symbol Guardian',
      blessing: `Divine Child ${playerName}, you have mastered the ancient symbols! You carry the wisdom of Symbol Mountain within your heart!`,
      achievement: 'Master of 8 Sacred Symbols',
      symbolEmojis: ['🕉️', '🐘', '🪷', '🦷', '👁️', '👂', '🍯', '🫄'],
      realmColor: '#FFD700',
      bgGradient: 'radial-gradient(ellipse at center, rgba(255,215,0,0.4) 0%, rgba(255,140,0,0.2) 60%, transparent 90%)',
      scrollBg: 'linear-gradient(145deg, rgba(255, 248, 220, 0.95), rgba(255, 235, 205, 0.9))',
      ganeshaForm: '🐘',
      realm: 'Symbol Mountain',
      wisdom: 'Sacred Symbol Knowledge'
    },
    'meaning-cave': {
      title: 'Keeper of Ancient Stories',
      shortTitle: 'Story Keeper',
      blessing: `Wise ${playerName}, you have unlocked the sacred stories! The ancient tales live within your spirit!`,
      achievement: 'Guardian of Sacred Tales',
      symbolEmojis: ['📜', '🏺', '💎', '🔥', '🌟', '📖', '🗿', '⚡'],
      realmColor: '#8A2BE2',
      bgGradient: 'radial-gradient(ellipse at center, rgba(138,43,226,0.4) 0%, rgba(147,112,219,0.2) 60%, transparent 90%)',
      scrollBg: 'linear-gradient(145deg, rgba(230, 230, 250, 0.95), rgba(221, 160, 221, 0.9))',
      ganeshaForm: '🐘',
      realm: 'Meaning Cave',
      wisdom: 'Ancient Story Wisdom'
    },
    'festival-square': {
      title: 'Master of Celebrations',
      shortTitle: 'Festival Master',
      blessing: `Joyful ${playerName}, you have learned the art of celebration! May every day be a festival in your heart!`,
      achievement: 'Champion of Joy',
      symbolEmojis: ['🎉', '🎊', '🪔', '🎭', '🥳', '🎨', '🌈', '💃'],
      realmColor: '#FF1493',
      bgGradient: 'radial-gradient(ellipse at center, rgba(255,20,147,0.4) 0%, rgba(255,105,180,0.2) 60%, transparent 90%)',
      scrollBg: 'linear-gradient(145deg, rgba(255, 240, 245, 0.95), rgba(255, 228, 225, 0.9))',
      ganeshaForm: '🐘',
      realm: 'Festival Square',
      wisdom: 'Celebration Mastery'
    },
    'shloka-river': {
      title: 'Voice of Sacred Songs',
      shortTitle: 'Sacred Singer',
      blessing: `Melodious ${playerName}, you have found your divine voice! The sacred songs flow through you like a river!`,
      achievement: 'Master of Divine Music',
      symbolEmojis: ['🎵', '🎶', '🌊', '🎤', '🔔', '📯', '🎼', '💫'],
      realmColor: '#00CED1',
      bgGradient: 'radial-gradient(ellipse at center, rgba(0,206,209,0.4) 0%, rgba(32,178,170,0.2) 60%, transparent 90%)',
      scrollBg: 'linear-gradient(145deg, rgba(240, 255, 255, 0.95), rgba(224, 255, 255, 0.9))',
      ganeshaForm: '🐘',
      realm: 'Shloka River',
      wisdom: 'Sacred Song Knowledge'
    }
  };

  const config = ZONE_CONFIGS[zoneId] || ZONE_CONFIGS['symbol-mountain'];

  // Phase timing
  const PHASE_DURATIONS = {
    1: 8000,  // Cosmic blessing rain
    2: 12000, // Divine manifestation + recognition
    3: 10000  // Sacred scroll + exploration invitation
  };

  useEffect(() => {
    if (!show) {
      setCurrentPhase(1);
      setShowBlessing(false);
      setShowManifiestation(false);
      setShowScroll(false);
      return;
    }

    console.log(`🌌 Starting Epic Zone Completion for ${zoneId}`);

    // Phase 1: Cosmic Divine Blessing
    setShowBlessing(true);
    setCurrentPhase(1);

    // Phase 2: Divine Manifestation
    const phase2Timer = setTimeout(() => {
      setCurrentPhase(2);
      setShowManifiestation(true);
    }, PHASE_DURATIONS[1] * 0.6);

    // Phase 3: Sacred Scroll
    const phase3Timer = setTimeout(() => {
      setCurrentPhase(3);
      setShowScroll(true);
    }, PHASE_DURATIONS[1] + PHASE_DURATIONS[2] * 0.5);

    // Cleanup timers
    return () => {
      clearTimeout(phase2Timer);
      clearTimeout(phase3Timer);
    };
  }, [show, zoneId]);

  const handleBlessingComplete = () => {
    console.log('🎆 Cosmic blessing phase complete');
    // Blessing handles its own completion, just continue the flow
  };

  const handleFullCelebrationComplete = () => {
    console.log('🏆 Full zone celebration complete');
    onComplete?.();
  };

  if (!show) return null;

  return (
    <div className="zone-completion-celebration">
      {/* Phase 1: Enhanced Cosmic Divine Blessing */}
      <EnhancedDivineBlessing
        show={showBlessing}
        duration={PHASE_DURATIONS[1]}
        intensity="COSMIC"
        zoneId={zoneId}
        playerName={playerName}
        discoveredSymbols={config.symbolEmojis}
        onComplete={handleBlessingComplete}
      />

      {/* Phase 2: Divine Manifestation & Recognition */}
      {showManifiestation && (
        <div className="divine-manifestation-overlay">
          <div className="manifestation-container">
            {/* Divine Ganesha Manifestation */}
            <div className="divine-ganesha-large">
              <div 
                className="ganesha-cosmic"
                style={{ color: config.realmColor }}
              >
                {config.ganeshaForm}
              </div>
              <div className="divine-aura-rings">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div 
                    key={i}
                    className={`aura-ring ring-${i + 1}`}
                    style={{ borderColor: `${config.realmColor}40` }}
                  />
                ))}
              </div>
            </div>

            {/* Title Granting Ceremony */}
            <div className="title-granting">
              <div 
                className="divine-title"
                style={{ color: config.realmColor }}
              >
                {config.title}
              </div>
              <div className="title-subtitle">
                Granted to {playerName}
              </div>
              <div className="achievement-badge">
                <div 
                  className="badge-icon"
                  style={{ backgroundColor: config.realmColor }}
                >
                  ⭐
                </div>
                <div className="badge-text">{config.achievement}</div>
              </div>
            </div>

            {/* Divine Blessing Speech */}
            <div className="divine-blessing-speech">
              <div className="blessing-text">
                {config.blessing}
              </div>
              <div className="blessing-signature">
                — Lord Ganesha
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 3: Sacred Scroll & Exploration Invitation */}
      {showScroll && (
        <div className="sacred-scroll-overlay">
          <div className="scroll-container">
            {/* Unfurling Sacred Scroll */}
            <div 
              className="sacred-scroll"
              style={{ background: config.scrollBg }}
            >
              <div className="scroll-header">
                <div className="scroll-title">Sacred Wisdom Mastered</div>
                <div 
                  className="realm-name"
                  style={{ color: config.realmColor }}
                >
                  {config.realm}
                </div>
              </div>

              <div className="scroll-content">
                {/* Symbols Mastered */}
                <div className="symbols-section">
                  <div className="section-title">Sacred Symbols Learned:</div>
                  <div className="symbols-grid">
                    {config.symbolEmojis.map((symbol, i) => (
                      <div 
                        key={i} 
                        className="mastered-symbol"
                        style={{ 
                          borderColor: config.realmColor,
                          animationDelay: `${i * 0.2}s`
                        }}
                      >
                        {symbol}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievement Summary */}
                <div className="achievement-summary">
                  <div className="summary-row">
                    <span>Stars Earned:</span>
                    <span 
                      className="stars-display"
                      style={{ color: config.realmColor }}
                    >
                      {starsEarned}/{totalStars} ⭐
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Wisdom Gained:</span>
                    <span style={{ color: config.realmColor }}>
                      {config.wisdom}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Title Earned:</span>
                    <span style={{ color: config.realmColor }}>
                      {config.shortTitle}
                    </span>
                  </div>
                </div>

                {/* Exploration Invitation */}
                <div className="exploration-invitation">
                  <div className="invitation-title">
                    🌟 Your Journey Continues! 🌟
                  </div>
                  <div className="invitation-text">
                    Other sacred realms await your wisdom, {playerName}!<br/>
                    Choose your next adventure and continue growing!
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="scroll-actions">
                    <button 
                      className="explore-button"
                      style={{ 
                        background: `linear-gradient(45deg, ${config.realmColor}, ${config.realmColor}CC)`,
                        borderColor: config.realmColor
                      }}
                      onClick={onContinueExploring}
                    >
                      🗺️ Explore Other Realms
                    </button>
                    <button 
                      className="progress-button"
                      onClick={onViewProgress}
                    >
                      📊 View My Progress
                    </button>
                    <button 
                      className="complete-button"
                      onClick={handleFullCelebrationComplete}
                    >
                      ✨ Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .zone-completion-celebration {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 10000;
          font-family: 'Comic Sans MS', cursive, sans-serif;
        }

        /* Phase 2: Divine Manifestation */
        .divine-manifestation-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(3px);
          animation: manifestationAppear 2s ease-out forwards;
          opacity: 0;
        }

        @keyframes manifestationAppear {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .manifestation-container {
          text-align: center;
          color: white;
          max-width: 800px;
          padding: 40px;
        }

        .divine-ganesha-large {
          position: relative;
          margin-bottom: 40px;
        }

        .ganesha-cosmic {
          font-size: 8rem;
          animation: cosmicGaneshaPulse 3s ease-in-out infinite;
          filter: drop-shadow(0 0 40px currentColor);
          position: relative;
          z-index: 10;
        }

        @keyframes cosmicGaneshaPulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 40px currentColor);
          }
          50% {
            transform: scale(1.1);
            filter: drop-shadow(0 0 60px currentColor);
          }
        }

        .divine-aura-rings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .aura-ring {
          position: absolute;
          border: 3px solid;
          border-radius: 50%;
          animation: auraExpand 4s ease-out infinite;
        }

        .ring-1 {
          width: 200px;
          height: 200px;
          margin: -100px 0 0 -100px;
          animation-delay: 0s;
        }

        .ring-2 {
          width: 300px;
          height: 300px;
          margin: -150px 0 0 -150px;
          animation-delay: 1s;
        }

        .ring-3 {
          width: 400px;
          height: 400px;
          margin: -200px 0 0 -200px;
          animation-delay: 2s;
        }

        .ring-4 {
          width: 500px;
          height: 500px;
          margin: -250px 0 0 -250px;
          animation-delay: 3s;
        }

        @keyframes auraExpand {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        .title-granting {
          margin-bottom: 40px;
          animation: titleDescend 2s ease-out 1s forwards;
          opacity: 0;
          transform: translateY(-50px);
        }

        @keyframes titleDescend {
          0% {
            opacity: 0;
            transform: translateY(-50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .divine-title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 10px;
          text-shadow: 0 0 30px currentColor;
          animation: titleGlow 2s ease-in-out infinite;
        }

        @keyframes titleGlow {
          0%, 100% {
            text-shadow: 0 0 30px currentColor;
          }
          50% {
            text-shadow: 0 0 50px currentColor, 0 0 70px currentColor;
          }
        }

        .title-subtitle {
          font-size: 1.3rem;
          color: #E0E0E0;
          margin-bottom: 20px;
        }

        .achievement-badge {
          display: inline-flex;
          align-items: center;
          gap: 15px;
          background: rgba(255, 255, 255, 0.1);
          padding: 15px 25px;
          border-radius: 25px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .badge-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
        }

        .badge-text {
          font-size: 1.2rem;
          font-weight: bold;
          color: #E0E0E0;
        }

        .divine-blessing-speech {
          animation: speechAppear 2s ease-out 2s forwards;
          opacity: 0;
        }

        @keyframes speechAppear {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .blessing-text {
          font-size: 1.4rem;
          line-height: 1.6;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .blessing-signature {
          font-size: 1.1rem;
          font-style: italic;
          color: #FFD700;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }

        /* Phase 3: Sacred Scroll */
        .sacred-scroll-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          animation: scrollOverlayAppear 1s ease-out forwards;
          opacity: 0;
        }

        @keyframes scrollOverlayAppear {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .scroll-container {
          max-width: 900px;
          max-height: 80vh;
          overflow-y: auto;
          padding: 20px;
        }

        .sacred-scroll {
          padding: 40px;
          border-radius: 20px;
          border: 4px solid #8B4513;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
          animation: scrollUnfurl 2s ease-out forwards;
          transform: scaleY(0);
          transform-origin: top center;
        }

        @keyframes scrollUnfurl {
          0% {
            transform: scaleY(0);
            opacity: 0.5;
          }
          100% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        .scroll-header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #8B4513;
          padding-bottom: 20px;
        }

        .scroll-title {
          font-size: 2.2rem;
          font-weight: bold;
          color: #8B4513;
          margin-bottom: 10px;
        }

        .realm-name {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .scroll-content {
          color: #654321;
        }

        .symbols-section {
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: bold;
          margin-bottom: 15px;
          color: #8B4513;
        }

        .symbols-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .mastered-symbol {
          font-size: 2.5rem;
          padding: 10px;
          background: rgba(255, 215, 0, 0.1);
          border-radius: 12px;
          border: 3px solid;
          text-align: center;
          animation: symbolReveal 0.6s ease-out forwards;
          opacity: 0;
          transform: scale(0.5);
        }

        @keyframes symbolReveal {
          0% {
            opacity: 0;
            transform: scale(0.5) rotate(-180deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        .achievement-summary {
          background: rgba(255, 215, 0, 0.1);
          border: 2px solid #FFD700;
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 30px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.1rem;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .stars-display {
          font-size: 1.3rem;
        }

        .exploration-invitation {
          text-align: center;
          padding: 25px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          border: 2px dashed #8B4513;
        }

        .invitation-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #8B4513;
          margin-bottom: 15px;
        }

        .invitation-text {
          font-size: 1.1rem;
          line-height: 1.5;
          margin-bottom: 25px;
          color: #654321;
        }

        .scroll-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .scroll-actions button {
          padding: 12px 24px;
          border-radius: 25px;
          border: 2px solid;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .explore-button {
          color: white;
          border-color: currentColor;
        }

        .explore-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .progress-button {
          background: linear-gradient(45deg, #4CAF50, #45a049);
          color: white;
          border-color: #4CAF50;
        }

        .progress-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
        }

        .complete-button {
          background: linear-gradient(45deg, #FF6B9D, #A855F7);
          color: white;
          border-color: #FF6B9D;
        }

        .complete-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255, 107, 157, 0.4);
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .manifestation-container {
            padding: 20px;
          }

          .ganesha-cosmic {
            font-size: 5rem;
          }

          .divine-title {
            font-size: 2rem;
          }

          .blessing-text {
            font-size: 1.2rem;
          }

          .sacred-scroll {
            padding: 25px;
          }

          .scroll-title {
            font-size: 1.8rem;
          }

          .symbols-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
          }

          .mastered-symbol {
            font-size: 1.8rem;
            padding: 8px;
          }

          .scroll-actions {
            flex-direction: column;
            align-items: center;
          }

          .scroll-actions button {
            width: 80%;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default ZoneCompletionCelebration;
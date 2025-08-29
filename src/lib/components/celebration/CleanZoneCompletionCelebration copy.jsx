// CleanZoneCompletionCelebration.jsx - Clean Portal + Certificate with Orbital Symbols + Cosmic Sound Waves
import React, { useState, useEffect } from 'react';

const CleanZoneCompletionCelebration = ({
  show = false,
  zoneId = 'symbol-mountain',
  playerName = 'little explorer',
  starsEarned = 8,
  totalStars = 8,
  onComplete,
  onContinueExploring,
  onViewProgress,
  // Symbol images
  ganeshaImage,
  symbolImages = {}
}) => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [showPortal, setShowPortal] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // Zone-specific configurations
  const ZONE_CONFIGS = {
    'symbol-mountain': {
      title: 'Guardian of Sacred Symbols',
      zoneName: 'Symbol Mountain',
      zoneIcon: '🏔️',
      achievement: '8 Sacred Elements Mastered',
      symbols: [
        { id: 'mooshika', name: 'Mooshika', image: symbolImages.mooshika },
        { id: 'om', name: 'Om', image: symbolImages.om },
        { id: 'lotus', name: 'Lotus', image: symbolImages.lotus },
        { id: 'trunk', name: 'Trunk', image: symbolImages.trunk },
        { id: 'eyes', name: 'Eyes', image: symbolImages.eyes },
        { id: 'ears', name: 'Ears', image: symbolImages.ears },
        { id: 'tusk', name: 'Tusk', image: symbolImages.tusk },
        { id: 'modak', name: 'Modak', image: symbolImages.modak },
        { id: 'belly', name: 'Belly', image: symbolImages.belly }
      ],
      realmColor: '#FFD700',
      bgGradient: 'radial-gradient(circle at center, rgba(255,215,0,0.2) 0%, rgba(138,43,226,0.4) 40%, rgba(25,25,112,0.8) 100%)'
    }
  };

  const config = ZONE_CONFIGS[zoneId] || ZONE_CONFIGS['symbol-mountain'];

  // Phase timing
  const PHASE_DURATIONS = {
    1: 3000,  // Portal with aura circles
    2: 5000   // Certificate display
  };

  // DEBUG: Log symbol images
  useEffect(() => {
    console.log('🔍 ZONE CELEBRATION DEBUG:');
    console.log('symbolImages prop:', symbolImages);
    console.log('config.symbols:', config.symbols);
    
    config.symbols.forEach(symbol => {
      console.log(`Symbol ${symbol.name}:`, symbol.image ? 'HAS IMAGE' : 'NO IMAGE');
    });
  }, [symbolImages]);

  useEffect(() => {
    if (!show) {
      setCurrentPhase(1);
      setShowPortal(false);
      setShowCertificate(false);
      return;
    }

    console.log(`🌟 Starting Clean Zone Completion for ${zoneId}`);

    // Phase 1: Clean Portal with Aura Circles
    setShowPortal(true);
    setCurrentPhase(1);

    // Phase 2: Certificate
    const certificateTimer = setTimeout(() => {
      setCurrentPhase(2);
      setShowCertificate(true);
    }, PHASE_DURATIONS[1]);

    // Cleanup
    return () => {
      clearTimeout(certificateTimer);
    };
  }, [show, zoneId]);

  const handleComplete = () => {
    console.log('✅ Clean zone celebration complete');
    onComplete?.();
  };

  const handleContinueExploring = () => {
    console.log('🗺️ Continue exploring clicked');
    onContinueExploring?.();
  };

  const handleViewProgress = () => {
    console.log('📊 View progress clicked');
    onViewProgress?.();
  };

  if (!show) return null;

  return (
    <div className="clean-zone-completion">
      {/* Phase 1: Clean Portal with Aura Circles, Orbital Symbols, and Cosmic Sound Waves */}
      {showPortal && (
        <div className="mystical-portal">
          <div className="portal-ring">
            <div className="portal-inner">
              <div className="portal-core">
                <div className="divine-ganesha-silhouette">
                  {ganeshaImage ? (
                    <img src={ganeshaImage} alt="Ganesha" className="ganesha-image" />
                  ) : (
                    <div className="ganesha-placeholder">🐘</div>
                  )}
                  
                  {/* NEW: Cosmic Sound Waves around Ganesha */}
                  <div className="cosmic-sound-waves">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`cosmic-sound-wave wave-${i + 1}`}
                        style={{
                          width: `${(i + 1) * 70}px`,
                          height: `${(i + 1) * 70}px`,
                          margin: `${-(i + 1) * 35}px 0 0 ${-(i + 1) * 35}px`
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Orbital Symbols around Ganesha */}
                  <div className="orbital-symbols-container">
                    {config.symbols.slice(0, 8).map((symbol, index) => (
                      <div
                        key={symbol.id}
                        className={`orbital-symbol orbital-symbol-${index}`}
                        style={{
                          animationDelay: `${index * 0.2}s`
                        }}
                      >
                        {symbol.image ? (
                          <img 
                            src={symbol.image} 
                            alt={symbol.name} 
                            className="orbital-symbol-image" 
                          />
                        ) : (
                          <div className="orbital-symbol-placeholder">✨</div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Divine Aura Rings - Clean expanding circles */}
                  <div className="divine-aura-rings">
                    <div className="aura-ring ring-1"></div>
                    <div className="aura-ring ring-2"></div>
                    <div className="aura-ring ring-3"></div>
                    <div className="aura-ring ring-4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: Clean Achievement Certificate */}
      {showCertificate && (
        <div className="achievement-certificate">
          <div className="certificate-header">
            <div className="certificate-title">{config.title}</div>
            <div className="zone-name">
              <span className="zone-icon">{config.zoneIcon}</span>
              <span>{config.zoneName}</span>
            </div>
          </div>

          {/* Stars Achievement */}
          <div className="stars-achievement">
            <div className="stars-title">Divine Mastery Achieved</div>
            <div className="stars-display">
              {Array.from({ length: totalStars }).map((_, i) => (
                <span 
                  key={i}
                  className={`achievement-star ${i < starsEarned ? 'earned' : 'empty'}`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  ⭐
                </span>
              ))}
            </div>
            <div className="stars-text">{starsEarned}/{totalStars} {config.achievement}</div>
          </div>

          {/* Clean Symbol Grid */}
          <div className="symbol-mastery">
            <div className="mastery-title">Sacred Symbols Learned</div>
            <div className="symbols-grid">
              {config.symbols.map((symbol, i) => (
                <div 
                  key={symbol.id}
                  className="mastered-symbol"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="symbol-icon">
                    {symbol.image ? (
                      <img src={symbol.image} alt={symbol.name} className="symbol-image" />
                    ) : (
                      <div className="symbol-placeholder">✨</div>
                    )}
                  </div>
                  <div className="symbol-name">{symbol.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-choices">
            <button 
              className="elegant-button continue-exploring"
              onClick={handleContinueExploring}
            >
              <span className="button-icon">🗺️</span>
              <span>Explore Other Realms</span>
            </button>
            
            <button 
              className="elegant-button view-progress"
              onClick={handleViewProgress}
            >
              <span className="button-icon">📊</span>
              <span>View My Journey</span>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .clean-zone-completion {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Comic Sans MS', cursive, sans-serif;
        }

        /* Phase 1: Clean Portal */
        .mystical-portal {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${config.bgGradient};
          animation: portalOpenFade 3s ease-out forwards;
        }

        @keyframes portalOpenFade {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }

        .portal-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 350px;
          height: 350px;
          border: 6px solid rgba(255, 215, 0, 0.9);
          border-radius: 50%;
          animation: portalRotate 8s linear infinite;
          box-shadow: 
            0 0 60px rgba(255, 215, 0, 0.7),
            inset 0 0 40px rgba(255, 215, 0, 0.3);
        }

        @keyframes portalRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .portal-inner {
          position: absolute;
          top: 15px;
          left: 15px;
          right: 15px;
          bottom: 15px;
          border: 4px solid rgba(255, 20, 147, 0.6);
          border-radius: 50%;
          animation: portalRotate 6s linear infinite reverse;
        }

        .portal-core {
          position: absolute;
          top: 25px;
          left: 25px;
          right: 25px;
          bottom: 25px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 215, 0, 0.4) 30%,
            transparent 70%
          );
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(15px);
        }

        .divine-ganesha-silhouette {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.9), rgba(255, 140, 0, 0.7));
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          animation: ganeshaGlow 3s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
          z-index: 10;
        }

        .ganesha-image {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(255, 255, 255, 0.8);
        }

        .ganesha-placeholder {
          font-size: 3rem;
          color: rgba(75, 0, 130, 0.8);
        }

        @keyframes ganeshaGlow {
          0%, 100% { 
            transform: scale(1);
            filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
          }
          50% { 
            transform: scale(1.05);
            filter: drop-shadow(0 0 30px rgba(255, 20, 147, 1));
          }
        }

        /* NEW: Cosmic Sound Waves around Ganesha */
        .cosmic-sound-waves {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 5;
        }

        .cosmic-sound-wave {
          position: absolute;
          border: 3px solid rgba(255, 215, 0, 0.6);
          border-radius: 50%;
          animation: cosmicSoundWaveExpand 2.5s ease-out infinite;
        }

        .wave-1 { animation-delay: 0s; }
        .wave-2 { animation-delay: 0.5s; }
        .wave-3 { animation-delay: 1s; }
        .wave-4 { animation-delay: 1.5s; }

        @keyframes cosmicSoundWaveExpand {
          0% {
            transform: scale(0);
            opacity: 1;
            border-color: rgba(255, 215, 0, 0.8);
          }
          50% {
            border-color: rgba(255, 140, 0, 0.6);
          }
          100% {
            transform: scale(1);
            opacity: 0;
            border-color: rgba(255, 215, 0, 0.2);
          }
        }

        /* Orbital Symbols around Ganesha */
        .orbital-symbols-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          animation: orbitalRotate 12s linear infinite;
          pointer-events: none;
          z-index: 8;
        }

        @keyframes orbitalRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .orbital-symbol {
          position: absolute;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(255, 215, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
          animation: symbolPulse 2s ease-in-out infinite;
        }

        @keyframes symbolPulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
          }
          50% { 
            transform: scale(1.1);
            box-shadow: 0 0 25px rgba(255, 20, 147, 0.8);
          }
        }

        .orbital-symbol-image {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          object-fit: cover;
        }

        .orbital-symbol-placeholder {
          font-size: 1.2rem;
          color: rgba(255, 215, 0, 0.9);
        }

        /* Position orbital symbols in circle (8 symbols = 45° apart) */
        .orbital-symbol-0 { 
          top: 0; 
          left: 50%; 
          transform: translateX(-50%); 
        }
        .orbital-symbol-1 { 
          top: 15%; 
          right: 15%; 
          transform: translate(50%, -50%); 
        }
        .orbital-symbol-2 { 
          top: 50%; 
          right: 0; 
          transform: translateY(-50%); 
        }
        .orbital-symbol-3 { 
          bottom: 15%; 
          right: 15%; 
          transform: translate(50%, 50%); 
        }
        .orbital-symbol-4 { 
          bottom: 0; 
          left: 50%; 
          transform: translateX(-50%); 
        }
        .orbital-symbol-5 { 
          bottom: 15%; 
          left: 15%; 
          transform: translate(-50%, 50%); 
        }
        .orbital-symbol-6 { 
          top: 50%; 
          left: 0; 
          transform: translateY(-50%); 
        }
        .orbital-symbol-7 { 
          top: 15%; 
          left: 15%; 
          transform: translate(-50%, -50%); 
        }

        /* Divine Aura Rings */
        .divine-aura-rings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
        }

        .aura-ring {
          position: absolute;
          border: 3px solid rgba(255, 215, 0, 0.4);
          border-radius: 50%;
          animation: auraExpand 4s ease-out infinite;
        }

        .ring-1 {
          width: 160px;
          height: 160px;
          margin: -80px 0 0 -80px;
          animation-delay: 0s;
        }

        .ring-2 {
          width: 220px;
          height: 220px;
          margin: -110px 0 0 -110px;
          animation-delay: 1s;
        }

        .ring-3 {
          width: 280px;
          height: 280px;
          margin: -140px 0 0 -140px;
          animation-delay: 2s;
        }

        .ring-4 {
          width: 340px;
          height: 340px;
          margin: -170px 0 0 -170px;
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

        /* Phase 2: Clean Achievement Certificate */
        .achievement-certificate {
          position: relative;
          z-index: 20;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.98) 0%, 
            rgba(255, 248, 220, 0.95) 100%);
          border: 5px solid #FFD700;
          border-radius: 30px;
          padding: 2.5rem;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.4),
            inset 0 0 30px rgba(255, 215, 0, 0.2);
          text-align: center;
          backdrop-filter: blur(15px);
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          transform: scale(0) rotate(-10deg);
          opacity: 0;
          animation: certificateAppear 1s ease-out 3s forwards;
        }

        @keyframes certificateAppear {
          0% {
            transform: scale(0) rotate(-10deg);
            opacity: 0;
          }
          60% {
            transform: scale(1.1) rotate(2deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .certificate-header {
          margin-bottom: 2rem;
          border-bottom: 3px solid #8B4513;
          padding-bottom: 1.5rem;
        }

        .certificate-title {
          font-size: 2.5rem;
          color: #8B4513;
          font-weight: bold;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          animation: titleShine 2s ease-in-out 4s;
        }

        @keyframes titleShine {
          0%, 100% { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); }
          50% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
        }

        .zone-name {
          font-size: 1.8rem;
          color: #4B0082;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .zone-icon {
          font-size: 2.2rem;
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6));
        }

        /* Stars Achievement */
        .stars-achievement {
          margin: 2rem 0;
          padding: 1.5rem;
          background: rgba(255, 215, 0, 0.1);
          border: 2px solid #FFD700;
          border-radius: 20px;
        }

        .stars-title {
          font-size: 1.4rem;
          color: #8B4513;
          margin-bottom: 1rem;
          font-weight: bold;
        }

        .stars-display {
          display: flex;
          justify-content: center;
          gap: 0.8rem;
          margin-bottom: 1rem;
        }

        .achievement-star {
          font-size: 2.5rem;
          filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.9));
          animation: starReveal 0.6s ease-out 4s forwards;
          opacity: 0;
        }

        .achievement-star.empty {
          opacity: 0.3;
          filter: none;
        }

        @keyframes starReveal {
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

        .stars-text {
          font-size: 1.3rem;
          color: #8B4513;
          font-weight: bold;
        }

        /* Clean Symbol Mastery */
        .symbol-mastery {
          margin: 2rem 0;
        }

        .mastery-title {
          font-size: 1.5rem;
          color: #4B0082;
          margin-bottom: 1.5rem;
          font-weight: bold;
        }

        .symbols-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.2rem;
          justify-items: center;
        }

        .mastered-symbol {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.8);
          border: 2px solid rgba(255, 215, 0, 0.6);
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(30px);
          opacity: 0;
          animation: symbolFloat 0.8s ease-out 5s forwards;
        }

        @keyframes symbolFloat {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .symbol-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .symbol-image {
          width: 45px;
          height: 45px;
          border-radius: 8px;
          object-fit: cover;
          border: 2px solid rgba(255, 215, 0, 0.8);
          filter: drop-shadow(0 0 8px rgba(255, 20, 147, 0.6));
        }

        .symbol-placeholder {
          font-size: 2.2rem;
          filter: drop-shadow(0 0 8px rgba(255, 20, 147, 0.6));
        }

        .symbol-name {
          font-size: 0.9rem;
          color: #8B4513;
          font-weight: bold;
          text-transform: capitalize;
        }

        /* Action Buttons */
        .action-choices {
          display: flex;
          gap: 2rem;
          margin-top: 1.5rem;
          opacity: 0;
          animation: buttonsSlideUp 1s ease-out 6s forwards;
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

        .elegant-button {
          padding: 1.2rem 2.5rem;
          border: none;
          border-radius: 25px;
          font-family: 'Comic Sans MS', cursive;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .continue-exploring {
          background: linear-gradient(135deg, #32CD32, #228B22);
          color: white;
        }

        .continue-exploring:hover {
          background: linear-gradient(135deg, #228B22, #006400);
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
        }

        .view-progress {
          background: linear-gradient(135deg, #FF6347, #DC143C);
          color: white;
        }

        .view-progress:hover {
          background: linear-gradient(135deg, #DC143C, #B22222);
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
        }

        .button-icon {
          font-size: 1.3rem;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .portal-ring {
            width: 280px;
            height: 280px;
          }
          
          .orbital-symbols-container {
            width: 160px;
            height: 160px;
          }
          
          .orbital-symbol {
            width: 28px;
            height: 28px;
          }
          
          .orbital-symbol-image {
            width: 20px;
            height: 20px;
          }

          .cosmic-sound-wave {
            border-width: 2px;
          }
          
          .achievement-certificate {
            max-width: 90vw;
            padding: 2rem;
          }
          
          .certificate-title {
            font-size: 2rem;
          }
          
          .symbols-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          
          .action-choices {
            flex-direction: column;
            gap: 1rem;
          }
          
          .elegant-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default CleanZoneCompletionCelebration;
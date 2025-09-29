// Simplified ZoneCompletionCelebration.jsx
import React, { useState, useEffect } from 'react';
import './SimpleZoneCompletionCelebration.css';

const SimpleZoneCompletionCelebration = ({
  show = false,
  zoneId = 'shloka-river',
  playerName = 'little explorer',
  collectedApps = [], // The apps they gained during the zone
  starsEarned = 8,
  totalStars = 8,
  onComplete,
  onContinueExploring,
  ganeshaImage, // Pass the same Ganesha from scenes
  //smartwatchBase,
  smartwatchScreen
}) => {
  const [showCard, setShowCard] = useState(false);

  // Zone configurations - simplified
  const ZONE_CONFIGS = {
    'shloka-river': {
      title: 'Voice of Sacred Songs',
      subtitle: 'Shloka River Complete!',
      icon: '🌊',
      message: `${playerName}, you have mastered the sacred chants! Your divine voice flows like a river!`,
      bgColor: '#00CED1'
    },
    'symbol-mountain': {
      title: 'Guardian of Sacred Symbols', 
      subtitle: 'Symbol Mountain Complete!',
      icon: '⛰️',
      message: `${playerName}, you are now a guardian of ancient wisdom!`,
      bgColor: '#FFD700'
    }
  };

  const config = ZONE_CONFIGS[zoneId] || ZONE_CONFIGS['shloka-river'];

  useEffect(() => {
    if (show) {
      setTimeout(() => setShowCard(true), 500);
    } else {
      setShowCard(false);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="simple-zone-completion">
      {/* Simple backdrop */}
      <div className="simple-backdrop" />
      
      {showCard && (
        <div className="simple-completion-card">
          
          {/* Zone Title */}
          <div className="simple-zone-header">
            <div className="zone-icon">{config.icon}</div>
            <h2 className="zone-title">{config.title}</h2>
            <p className="zone-subtitle">{config.subtitle}</p>
          </div>

          {/* Ganesha Character - Same as scenes */}
          <div className="completion-ganesha">
            <img 
              src={ganeshaImage}
              alt="Ganesha celebrating"
              className="ganesha-celebration breathing-animation"
            />
            
            {/* Simple speech bubble */}
            <div className="ganesha-completion-speech">
              <div className="speech-content">
                {config.message}
              </div>
            </div>
          </div>

{/* Apps Collection Display */}
<div className="collected-apps-section">
  <h3>Powers Gained:</h3>
  
  {/* Just the screen, no base */}
  <div className="completion-smartwatch-screen">
    <img src={smartwatchScreen} alt="Smartwatch Screen" className="screen-only" />
    
    {/* Show all 8 collected apps */}
    <div className="completion-apps">
      {collectedApps.map((app, index) => (
        <div 
          key={app.id} 
          className="completion-app"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <img src={app.image} alt={app.name} />
          <div className="app-power-name">{app.power?.name}</div>
        </div>
      ))}
    </div>
  </div>
</div>
          

         <div className="completion-stats">
  <div className="stat-item">
    <span className="stat-icon">⭐</span>
    <span>{starsEarned}/{totalStars} Stars</span>
  </div>
  <div className="stat-item">
    <span className="stat-icon">📱</span>
    <span>8 Powers Gained</span> {/* Changed from {collectedApps.length} to 8 */}
  </div>
</div>

          {/* Action buttons */}
          <div className="simple-action-buttons">
            <button 
              className="primary-btn"
              onClick={onContinueExploring}
            >
              🌟 Next Adventure
            </button>
            
            <button 
              className="secondary-btn"
              onClick={onComplete}
            >
              🏠 Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleZoneCompletionCelebration;
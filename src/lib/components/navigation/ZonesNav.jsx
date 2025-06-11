import React, { useState } from 'react';
import './ZonesNav.css';

const ZonesNav = ({
  zones = [
    { id: 1, name: 'Symbol Mountain', icon: '🏔️', unlocked: true, stars: 2, totalStars: 3 },
    { id: 2, name: 'Rainbow Valley', icon: '🌈', unlocked: true, stars: 0, totalStars: 3 },
    { id: 3, name: 'Ocean Depths', icon: '🌊', unlocked: false, stars: 0, totalStars: 4 },
    { id: 4, name: 'Sky Kingdom', icon: '☁️', unlocked: false, stars: 0, totalStars: 3 },
    { id: 5, name: 'Forest Haven', icon: '🌲', unlocked: false, stars: 0, totalStars: 5 },
    { id: 6, name: 'Desert Oasis', icon: '🏜️', unlocked: false, stars: 0, totalStars: 3 },
    { id: 7, name: 'Ice Palace', icon: '❄️', unlocked: false, stars: 0, totalStars: 4 },
    { id: 8, name: 'Volcano Peak', icon: '🌋', unlocked: false, stars: 0, totalStars: 5 }
  ],
  currentZoneId = 1,
  onZoneSelect,
  onClose,
  showAsModal = true
}) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [showZonePreview, setShowZonePreview] = useState(false);

  const handleZoneClick = (zone) => {
    if (!zone.unlocked) {
      // Show locked message
      setSelectedZone(zone);
      setShowZonePreview(true);
      setTimeout(() => setShowZonePreview(false), 2000);
      return;
    }

    // Animate selection then navigate
    setSelectedZone(zone);
    setTimeout(() => {
      onZoneSelect(zone);
      if (showAsModal) onClose();
    }, 300);
  };

  const getStarDisplay = (stars, totalStars) => {
    const filled = '⭐'.repeat(stars);
    const empty = '☆'.repeat(totalStars - stars);
    return filled + empty;
  };

  const calculateProgress = () => {
    const totalStars = zones.reduce((sum, zone) => sum + zone.totalStars, 0);
    const earnedStars = zones.reduce((sum, zone) => sum + zone.stars, 0);
    return { earned: earnedStars, total: totalStars, percentage: (earnedStars / totalStars) * 100 };
  };

  const progress = calculateProgress();

  const renderZoneGrid = () => (
    <div className="zones-grid">
      {zones.map((zone) => (
        <button
          key={zone.id}
          className={`zone-card ${zone.unlocked ? 'unlocked' : 'locked'} 
                     ${zone.id === currentZoneId ? 'current' : ''} 
                     ${selectedZone?.id === zone.id ? 'selected' : ''}`}
          onClick={() => handleZoneClick(zone)}
        >
          <div className="zone-icon">{zone.icon}</div>
          <div className="zone-name">{zone.name}</div>
          
          {zone.unlocked ? (
            <div className="zone-stars">
              {getStarDisplay(zone.stars, zone.totalStars)}
            </div>
          ) : (
            <div className="zone-lock">🔒</div>
          )}
          
          {zone.id === currentZoneId && (
            <div className="current-indicator">Current</div>
          )}
        </button>
      ))}
    </div>
  );

  const renderContent = () => (
    <>
      <div className="zones-header">
        <h2>Choose Your Adventure!</h2>
        <div className="zones-progress">
          <div className="progress-text">
            {progress.earned} / {progress.total} Stars
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {renderZoneGrid()}

      {showZonePreview && selectedZone && !selectedZone.unlocked && (
        <div className="zone-preview-message">
          <p>🔒 Complete more stars to unlock {selectedZone.name}!</p>
        </div>
      )}
    </>
  );

  if (showAsModal) {
    return (
      <div className="zones-modal-overlay" onClick={onClose}>
        <div className="zones-modal" onClick={(e) => e.stopPropagation()}>
          <button className="zones-close" onClick={onClose}>
            ×
          </button>
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="zones-container">
      {renderContent()}
    </div>
  );
};

// Zone selector button component to add to nav
export const ZoneNavButton = ({ currentZone, onClick }) => {
  return (
    <button className="zone-nav-button" onClick={onClick}>
      <span className="zone-nav-icon">{currentZone.icon}</span>
      <span className="zone-nav-name">{currentZone.name}</span>
      <span className="zone-nav-arrow">▼</span>
    </button>
  );
};

export default ZonesNav;
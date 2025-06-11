// MapZone.jsx - Updated with all zones unlocked
import React, { useState, useEffect } from 'react';
import './MapZone.css';
import GameStateManager from '../lib/services/GameStateManager';

console.log('MapZone file loaded');

// Updated zone configuration - ALL ZONES UNLOCKED
const zoneConfig = {
  'symbol-mountain': {
    name: 'Symbol Mountain',
    image: '/images/symbol-mountain.png',
    emoji: '🏔️',
    description: 'Learn about Ganesha\'s sacred symbols in this mystical mountain.',
    unlocked: true, // ✅ UNLOCKED
    requiredStars: 0,
    scenes: [
      {
        id: 'modak',
        name: 'Modak Forest',
        emoji: '🍯',
        description: 'Help Mooshika collect sweet modaks',
        unlocked: true,
        order: 1
      },
      {
        id: 'pond',
        name: 'Sacred Pond',
        emoji: '🪷',
        description: 'Find lotus flowers and meet the elephant',
        unlocked: true,
        order: 2
      }
    ]
  },
  'cave-of-secrets': {
    name: 'Cave of Secrets',
    image: '/images/cave-of-secrets.png',
    emoji: '🌈',
    description: 'Discover hidden treasures and ancient mysteries.',
    unlocked: true, // ✅ UNLOCKED (was false)
    requiredStars: 0 // ✅ NO STARS REQUIRED (was 6)
  },
  'obstacle-forest': {
    name: 'Obstacle Forest',
    image: '/images/obstacle-forest.png',
    emoji: '🌊',
    description: 'Navigate through challenges and forest paths.',
    unlocked: true, // ✅ UNLOCKED (was false)
    requiredStars: 0 // ✅ NO STARS REQUIRED (was 12)
  },
  'shloka-river': {
    name: 'Shloka River',
    image: '/images/shloka-river.png',
    emoji: '☁️',
    description: 'Learn sacred chants by the flowing river.',
    unlocked: true, // ✅ UNLOCKED (was false)
    requiredStars: 0 // ✅ NO STARS REQUIRED (was 18)
  },
  'about-me-hut': {
    name: 'About Me Hut',
    image: '/images/about-me-hut.png',
    emoji: '🌲',
    description: 'Learn about Ganesha\'s life and stories.',
    unlocked: true, // ✅ UNLOCKED (was false)
    requiredStars: 0 // ✅ NO STARS REQUIRED (was 24)
  },
  'story-treehouse': {
    name: 'Story Treehouse',
    image: '/images/story-treehouse.png',
    emoji: '🏜️',
    description: 'Magical stories told among the trees.',
    unlocked: true, // ✅ UNLOCKED (was false)
    requiredStars: 0 // ✅ NO STARS REQUIRED (was 30)
  },
  'festival-square': {
    name: 'Festival Square',
    image: '/images/festival-square.png',
    emoji: '❄️',
    description: 'Celebrate festivals and special occasions.',
    unlocked: true, // ✅ UNLOCKED (was false)
    requiredStars: 0 // ✅ NO STARS REQUIRED (was 36)
  }
};

// Scene emojis
const sceneEmojis = {
  'modak': '🍯',
  'pond': '🪷'
};

// Zone positions optimized for visual flow - 7 zones
const zonePositions = {
  'symbol-mountain': {
    landscape: { x: 15, y: 25 },
    portrait: { x: 20, y: 15 }
  },
  'cave-of-secrets': {
    landscape: { x: 35, y: 35 },
    portrait: { x: 50, y: 25 }
  },
  'obstacle-forest': {
    landscape: { x: 55, y: 20 },
    portrait: { x: 75, y: 35 }
  },
  'shloka-river': {
    landscape: { x: 75, y: 30 },
    portrait: { x: 65, y: 50 }
  },
  'about-me-hut': {
    landscape: { x: 25, y: 60 },
    portrait: { x: 25, y: 65 }
  },
  'story-treehouse': {
    landscape: { x: 55, y: 70 },
    portrait: { x: 50, y: 80 }
  },
  'festival-square': {
    landscape: { x: 80, y: 65 },
    portrait: { x: 75, y: 75 }
  }
};

const MapZone = ({ onZoneSelect }) => {
  console.log('MapZone rendered with onZoneSelect:', typeof onZoneSelect);
  
  const [zones] = useState(Object.entries(zoneConfig).map(([id, config]) => ({
    id,
    ...config,
    stars: 0,
    totalStars: config.scenes ? config.scenes.length * 3 : 15
  })));
  
  const [progress] = useState({ 
    earnedStars: 0, 
    totalStars: 150, 
    percentage: 0 
  });
  
  const [orientation, setOrientation] = useState('landscape');
  const [selectedZone, setSelectedZone] = useState(null);
  const [showZoneDetails, setShowZoneDetails] = useState(false);
  const [showSceneSelector, setShowSceneSelector] = useState(false);
  const [sceneProgress, setSceneProgress] = useState({});

  // Load scene progress
  useEffect(() => {
    loadSceneProgress();
  }, []);

  const loadSceneProgress = () => {
    try {
      const modakProgress = GameStateManager.getSceneProgress('symbol-mountain', 'modak');
      const pondProgress = GameStateManager.getSceneProgress('symbol-mountain', 'pond');
      
      setSceneProgress({
        modak: modakProgress || { completed: false, stars: 0 },
        pond: pondProgress || { completed: false, stars: 0 }
      });
    } catch (error) {
      console.log('Error loading scene progress:', error);
      setSceneProgress({
        modak: { completed: false, stars: 0 },
        pond: { completed: false, stars: 0 }
      });
    }
  };
  
  // Detect orientation changes
  useEffect(() => {
    const checkOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };
    
    window.addEventListener('resize', checkOrientation);
    checkOrientation();
    
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);
  
  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
    
    // If zone has scenes, show scene selector, otherwise show zone details
    if (zone.scenes && zone.scenes.length > 0) {
      setShowSceneSelector(true);
    } else {
      setShowZoneDetails(true);
    }
  };
  
  const handleSceneSelect = (sceneId) => {
    console.log('Scene selected:', sceneId);
    if (onZoneSelect) {
      // Pass both zone and scene to App.jsx
      onZoneSelect(selectedZone.id, sceneId);
    }
    closeModals();
  };

  const getSceneStatus = (sceneId) => {
    const progress = sceneProgress[sceneId];
    if (!progress) return { status: 'available', stars: 0 };
    
    if (progress.completed) {
      return { status: 'completed', stars: progress.stars || 0 };
    } else if (progress.stars > 0) {
      return { status: 'in-progress', stars: progress.stars };
    } else {
      return { status: 'available', stars: 0 };
    }
  };

  const renderStars = (count) => {
    return Array.from({ length: 3 }, (_, i) => (
      <span key={i} className={`star ${i < count ? 'earned' : 'empty'}`}>
        {i < count ? '⭐' : '☆'}
      </span>
    ));
  };
  
  const handleZoneEnter = () => {
    if (selectedZone) { // ✅ REMOVED unlocked check - all zones accessible
      console.log('Entering zone:', selectedZone.id);
      if (onZoneSelect) {
        onZoneSelect(selectedZone.id);
      }
      closeModals();
    }
  };
  
  const closeModals = () => {
    setShowZoneDetails(false);
    setShowSceneSelector(false);
    setSelectedZone(null);
  };

  // Scene Selector Modal
  if (showSceneSelector && selectedZone) {
    return (
      <div className="zone-details-overlay" onClick={closeModals}>
        <div className="zone-details-modal scene-selector" onClick={e => e.stopPropagation()}>
          <button className="close-button" onClick={closeModals}>×</button>
          
          <div className="zone-detail-icon">
            <img 
              src={selectedZone.image} 
              alt={selectedZone.name}
              className="zone-detail-image"
            />
          </div>
          
          <h2>{selectedZone.name}</h2>
          <p>Choose your adventure:</p>
          
          <div className="scenes-grid">
            {selectedZone.scenes.map((scene) => {
              const status = getSceneStatus(scene.id);
              
              return (
                <div 
                  key={scene.id}
                  className={`scene-card ${status.status}`}
                  onClick={() => handleSceneSelect(scene.id)}
                >
                  <div className="scene-emoji">{scene.emoji}</div>
                  <h3>{scene.name}</h3>
                  <p>{scene.description}</p>
                  
                  <div className="scene-progress">
                    <div className="stars">
                      {renderStars(status.stars)}
                    </div>
                    <div className="status-text">
                      {status.status === 'completed' && '✅ Complete'}
                      {status.status === 'in-progress' && '🎯 In Progress'}
                      {status.status === 'available' && '🚀 Start Adventure'}
                    </div>
                  </div>
                  
                  <div className="recommended-order">
                    {scene.order === 1 && '🌟 Start Here'}
                    {scene.order === 2 && '⭐ Play Next'}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flow-suggestion">
            <p>💡 <strong>Suggested Flow:</strong> Modak Forest first, then Sacred Pond</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`map-container ${orientation}`}>
      {/* Beautiful Map Background */}
      <div 
        className="map-background" 
        style={{
          backgroundImage: 'url(/images/map-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Zone Markers with Beautiful Images - ALL UNLOCKED */}
      {zones.map(zone => {
        const position = zonePositions[zone.id]?.[orientation] || { x: 50, y: 50 };
        const isUnlocked = true; // ✅ ALL ZONES ALWAYS UNLOCKED
        const zoneProgress = zone.stars;
        
        return (
          <div
            key={zone.id}
            className={`zone-marker ${isUnlocked ? 'unlocked' : 'locked'} ${selectedZone?.id === zone.id ? 'selected' : ''}`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`
            }}
            onClick={() => handleZoneClick(zone)}
          >
            {/* Zone Icon - Beautiful Images */}
            <div className="zone-icon-wrapper">
              <img 
                src={zone.image} 
                alt={zone.name}
                className="zone-icon-image"
                onError={(e) => {
                  // Fallback to emoji if image fails
                  console.error('Failed to load zone image:', zone.image);
                  e.target.style.display = 'none';
                  const fallback = e.target.nextElementSibling;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              {/* Emoji fallback */}
              <div className="zone-icon-emoji-fallback" style={{ display: 'none' }}>
                {zone.emoji}
              </div>
              
              {/* ✅ REMOVED LOCK OVERLAY - no more locks! */}
            </div>
            
            {/* Zone Name */}
            <div className="zone-label">
              <span className="zone-name">{zone.name}</span>
              <div className="zone-stars">
                {'⭐'.repeat(Math.min(zoneProgress, 3))} {'☆'.repeat(Math.max(0, Math.min(3, zone.totalStars) - zoneProgress))}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Zone Details Modal (for zones without scenes) - NO LOCK MESSAGES */}
      {showZoneDetails && selectedZone && (
        <div className="zone-details-overlay" onClick={closeModals}>
          <div className="zone-details-modal" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={closeModals}>×</button>
            
            <div className="zone-detail-icon">
              <img 
                src={selectedZone.image} 
                alt={selectedZone.name}
                className="zone-detail-image"
              />
            </div>
            
            <h2>{selectedZone.name}</h2>
            
            <div className="zone-progress">
              <div className="stars-display">
                {[...Array(Math.min(selectedZone.totalStars, 5))].map((_, i) => (
                  <span key={i} className={i < selectedZone.stars ? 'star filled' : 'star'}>
                    {i < selectedZone.stars ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
              <p>{selectedZone.stars} / {selectedZone.totalStars} Stars</p>
            </div>
            
            {/* ✅ ALL ZONES ALWAYS ACCESSIBLE - NO LOCK MESSAGES */}
            <p className="zone-description">{selectedZone.description}</p>
            <button className="enter-button" onClick={handleZoneEnter}>
              Enter Zone
            </button>
          </div>
        </div>
      )}
      
      {/* Overall Progress Bar */}
      <div className="overall-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <span className="progress-text">
          {progress.earnedStars} / {progress.totalStars} Total Stars
        </span>
      </div>
    </div>
  );
};

export default MapZone;
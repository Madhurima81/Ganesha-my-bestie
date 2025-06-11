// src/features/map/MapZone.jsx
import React, { useState, useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import './MapZone.css';

// Zone data with different positioning for portrait/landscape
const zoneData = [
  {
    id: 'intro-zone',
    name: 'Introduction',
    icon: '/assets/images/zones/intro-icon.png',
    position: {
      landscape: { x: 20, y: 30 },
      portrait: { x: 25, y: 20 }
    }
  },
  {
    id: 'story-zone',
    name: 'Ganesha Story',
    icon: '/assets/images/zones/story-icon.png',
    position: {
      landscape: { x: 40, y: 20 },
      portrait: { x: 50, y: 30 }
    }
  },
  // More zones...
];

const MapZone = ({ onZoneSelect }) => {
  const { unlockedZones } = useGameContext();
  const [orientation, setOrientation] = useState('landscape');
  
  // Detect orientation changes
  useEffect(() => {
    const checkOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };
    
    window.addEventListener('resize', checkOrientation);
    checkOrientation(); // Initial check
    
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);
  
  return (
    <div className={`map-container ${orientation}`}>
      <div className="map-background" />
      
      {zoneData.map(zone => {
        const isUnlocked = unlockedZones.includes(zone.id);
        const position = zone.position[orientation];
        
        return (
          <div
            key={zone.id}
            className={`zone-marker ${isUnlocked ? 'unlocked' : 'locked'}`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`
            }}
            onClick={() => isUnlocked && onZoneSelect(zone.id)}
          >
            <img src={zone.icon} alt={zone.name} />
            <div className="zone-name">{zone.name}</div>
            {!isUnlocked && <div className="lock-icon">🔒</div>}
          </div>
        );
      })}
    </div>
  );
};

export default MapZone;
import React, { useState, useEffect } from 'react';
import smartwatchBase from '../assets/images/smartwatch-base.png';
import smartwatchScreen from '../assets/images/smartwatch-screen.png';

const SmartwatchWidget = ({ 
  profileId,
  onAppClick,
  position = { bottom: '20px', right: '20px' }
}) => {
  const [unlockedApps, setUnlockedApps] = useState([]);

  // Load saved apps from localStorage
  useEffect(() => {
    if (profileId) {
      const saved = localStorage.getItem(`smartwatch_apps_${profileId}`);
      if (saved) {
        setUnlockedApps(JSON.parse(saved));
      }
    }
  }, [profileId]);

  // Save apps to localStorage
  const saveApps = (apps) => {
    if (profileId) {
      localStorage.setItem(`smartwatch_apps_${profileId}`, JSON.stringify(apps));
    }
  };

  // Add app (called from scenes)
  const addApp = (appData) => {
    setUnlockedApps(prev => {
      const exists = prev.find(app => app.id === appData.id);
      if (!exists) {
        const newApps = [...prev, appData];
        saveApps(newApps);
        return newApps;
      }
      return prev;
    });
  };

  // Expose addApp function to parent
  useEffect(() => {
    window.smartwatchWidget = { addApp };
  }, []);

  return (
    <div className="smartwatch-widget" style={{
      position: 'fixed',
      ...position,
      zIndex: 1000
    }}>
      <div className="smartwatch-apps-overlay">
        <img 
          src={smartwatchScreen} 
          alt="screen" 
          className={`smartwatch-screen ${unlockedApps.length > 0 ? 'active' : ''}`} 
        />
        
        {unlockedApps.map((app, index) => (
          <img 
            key={app.id}
            src={app.image}
            alt={app.name}
            className={`smartwatch-app app-${index + 1} unlocked`}
            onClick={() => onAppClick?.(app)}
            style={{
              position: 'absolute',
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              cursor: 'pointer',
              // Position apps in grid
              left: `${20 + (index % 2) * 35}px`,
              top: `${15 + Math.floor(index / 2) * 35}px`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SmartwatchWidget;
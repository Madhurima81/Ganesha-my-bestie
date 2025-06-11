// src/context/GameContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [unlockedZones, setUnlockedZones] = useState(['intro-zone']);
  const [completedActivities, setCompletedActivities] = useState({});
  const [userProgress, setUserProgress] = useState({
    chantProgress: 0, // 0 to 100%
    bookProgress: 0,  // 0 to 100%
    lastZoneVisited: 'intro-zone'
  });
  
  // Save progress to localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('ganeshaGameProgress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setUnlockedZones(parsed.unlockedZones || ['intro-zone']);
        setCompletedActivities(parsed.completedActivities || {});
        setUserProgress(parsed.userProgress || {
          chantProgress: 0,
          bookProgress: 0,
          lastZoneVisited: 'intro-zone'
        });
      } catch (e) {
        console.error('Error loading saved progress', e);
      }
    }
  }, []);
  
  // Save progress when it changes
  useEffect(() => {
    localStorage.setItem('ganeshaGameProgress', JSON.stringify({
      unlockedZones,
      completedActivities,
      userProgress
    }));
  }, [unlockedZones, completedActivities, userProgress]);
  
  // Function to mark an activity as complete
  const completeActivity = (zoneId, activityId) => {
    setCompletedActivities(prev => ({
      ...prev,
      [zoneId]: [...(prev[zoneId] || []), activityId]
    }));
    
    // Check if all activities in zone are complete
    const zoneActivities = allActivities[zoneId] || [];
    const completedInZone = [...(completedActivities[zoneId] || []), activityId];
    
    if (zoneActivities.length > 0 && 
        zoneActivities.every(id => completedInZone.includes(id))) {
      unlockNextZone(zoneId);
    }
  };
  
  // Function to unlock the next zone
  const unlockNextZone = (currentZoneId) => {
    const zoneIds = zones.map(z => z.id);
    const currentIndex = zoneIds.indexOf(currentZoneId);
    
    if (currentIndex >= 0 && currentIndex < zoneIds.length - 1) {
      const nextZoneId = zoneIds[currentIndex + 1];
      if (!unlockedZones.includes(nextZoneId)) {
        setUnlockedZones(prev => [...prev, nextZoneId]);
      }
    }
  };
  
  // Update progress for chant or book
  const updateProgress = (type, value) => {
    setUserProgress(prev => ({
      ...prev,
      [`${type}Progress`]: value
    }));
  };
  
  return (
    <GameContext.Provider value={{
      unlockedZones,
      completedActivities,
      userProgress,
      completeActivity,
      unlockNextZone,
      updateProgress
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
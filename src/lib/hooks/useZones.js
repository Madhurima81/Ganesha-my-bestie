// useZones.js - A custom hook for managing zones state
import { useState, useEffect } from 'react';
import { ZONES, calculateProgress } from '../config/zones.config';

export const useZones = () => {
  const [zones, setZones] = useState(ZONES);
  const [currentZone, setCurrentZone] = useState(ZONES[0]);
  const [progress, setProgress] = useState(calculateProgress());

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('zonesProgress');
    if (savedProgress) {
      const parsedProgress = JSON.parse(savedProgress);
      setZones(parsedProgress);
      setProgress(calculateProgress());
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (updatedZones) => {
    localStorage.setItem('zonesProgress', JSON.stringify(updatedZones));
  };

  // Update zone stars
  const updateZoneStars = (zoneId, stars) => {
    const updatedZones = zones.map(zone => 
      zone.id === zoneId ? { ...zone, stars } : zone
    );
    setZones(updatedZones);
    saveProgress(updatedZones);
    setProgress(calculateProgress());
  };

  // Unlock a zone
  const unlockZone = (zoneId) => {
    const updatedZones = zones.map(zone => 
      zone.id === zoneId ? { ...zone, unlocked: true } : zone
    );
    setZones(updatedZones);
    saveProgress(updatedZones);
  };

  // Check if should unlock next zone
  const checkUnlockConditions = () => {
    const currentProgress = calculateProgress();
    
    // Example: Unlock next zone after earning 3 stars total
    if (currentProgress.earnedStars >= 3 && zones[2].unlocked === false) {
      unlockZone(3); // Unlock Ocean Depths
    }
    // Add more unlock conditions as needed
  };

  return {
    zones,
    currentZone,
    progress,
    setCurrentZone,
    updateZoneStars,
    unlockZone,
    checkUnlockConditions
  };
};
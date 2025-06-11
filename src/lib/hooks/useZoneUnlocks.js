// lib/hooks/useZoneUnlocks.js
// 🎯 React hook to manage zone unlocks across the entire app
// ✅ UPDATED: Modak is now the first scene, Pond is second

import { useState, useEffect, useCallback } from 'react';
import zoneUnlockManager from '../services/ZoneUnlockManager.js'

export const useZoneUnlocks = (profileId) => {
  const [unlockState, setUnlockState] = useState({
    unlocked: ['symbol-mountain.modak'], // ✅ CHANGED: Always start with modak first
    completed: [],
    loading: true
  });

  const [progressData, setProgressData] = useState(null);

  // 🔄 Load progress data from localStorage
  const loadProgressData = useCallback(() => {
    if (!profileId) {
      setUnlockState({
        unlocked: ['symbol-mountain.modak'], // ✅ CHANGED: Modak first
        completed: [],
        loading: false
      });
      return;
    }

    try {
      const progressKey = `${profileId}_gameProgress`;
      const savedProgress = localStorage.getItem(progressKey);
      
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        console.log('🔄 Loaded progress data:', parsedProgress);
        setProgressData(parsedProgress);
        
        // Calculate unlocks based on progress
        const unlockData = zoneUnlockManager.calculateUnlockedScenes(parsedProgress);
        setUnlockState({
          ...unlockData,
          loading: false
        });
      } else {
        // No saved progress - only first scene unlocked
        console.log('🔄 No saved progress found');
        setUnlockState({
          unlocked: ['symbol-mountain.modak'], // ✅ CHANGED: Modak first
          completed: [],
          loading: false
        });
      }
    } catch (error) {
      console.error('❌ Error loading progress data:', error);
      setUnlockState({
        unlocked: ['symbol-mountain.modak'], // ✅ CHANGED: Modak first
        completed: [],
        loading: false
      });
    }
  }, [profileId]);

  // 🎯 Check if specific scene is unlocked
  const isSceneUnlocked = useCallback((zoneId, sceneId) => {
    const sceneKey = `${zoneId}.${sceneId}`;
    return unlockState.unlocked.includes(sceneKey);
  }, [unlockState.unlocked]);

  // ✅ Check if specific scene is completed
  const isSceneCompleted = useCallback((zoneId, sceneId) => {
    const sceneKey = `${zoneId}.${sceneId}`;
    return unlockState.completed.includes(sceneKey);
  }, [unlockState.completed]);

  // 🎯 Get scene status (locked/unlocked/completed)
  const getSceneStatus = useCallback((zoneId, sceneId) => {
    return zoneUnlockManager.getSceneStatus(zoneId, sceneId, progressData);
  }, [progressData]);

  // 🏔️ Get zone status
  const getZoneStatus = useCallback((zoneId) => {
    return zoneUnlockManager.getZoneStatus(zoneId, progressData);
  }, [progressData]);

  // 📊 Get zone progress
  const getZoneProgress = useCallback((zoneId) => {
    return zoneUnlockManager.getZoneProgress(zoneId, progressData);
  }, [progressData]);

  // 🌟 Get zone stars
  const getZoneStars = useCallback((zoneId) => {
    return zoneUnlockManager.getZoneStars(zoneId, progressData);
  }, [progressData]);

  // 🏆 Check if zone is complete
  const isZoneComplete = useCallback((zoneId) => {
    return zoneUnlockManager.isZoneComplete(zoneId, progressData);
  }, [progressData]);

  // 📋 Get all zones with status
  const getAllZonesStatus = useCallback(() => {
    return zoneUnlockManager.getAllZonesStatus(progressData);
  }, [progressData]);

  // 🔄 Refresh unlock state (call after scene completion)
  const refreshUnlocks = useCallback(() => {
    console.log('🔄 Refreshing unlock state...');
    loadProgressData();
  }, [loadProgressData]);

  // 🔧 Debug current state
  const debugUnlocks = useCallback(() => {
    zoneUnlockManager.debugUnlockState(progressData);
    console.log('Current hook state:', unlockState);
  }, [progressData, unlockState]);

  // 📈 Get next unlocked scene for "Continue Adventure"
  const getNextScene = useCallback(() => {
    // Find first unlocked but not completed scene
    const allZones = zoneUnlockManager.getAllZonesStatus(progressData);
    
    for (const zone of allZones) {
      for (const scene of zone.scenes) {
        if (scene.status === 'unlocked') {
          return {
            zoneId: zone.id,
            sceneId: scene.id,
            zoneName: zone.name,
            sceneName: scene.name
          };
        }
      }
    }
    
    // If all completed, return last completed scene
    for (const zone of allZones.reverse()) {
      for (const scene of zone.scenes.reverse()) {
        if (scene.status === 'completed') {
          return {
            zoneId: zone.id,
            sceneId: scene.id,
            zoneName: zone.name,
            sceneName: scene.name
          };
        }
      }
    }
    
    // ✅ CHANGED: Fallback to first scene (now modak)
    return {
      zoneId: 'symbol-mountain',
      sceneId: 'modak',           // ✅ CHANGED: Now modak
      zoneName: 'Symbol Mountain',
      sceneName: 'Modak Forest'   // ✅ CHANGED: Now Modak Forest
    };
  }, [progressData]);

  // Load initial data
  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  // Listen for storage changes (when other tabs complete scenes)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key && event.key.includes('_gameProgress')) {
        console.log('🔄 Storage changed, refreshing unlocks');
        loadProgressData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadProgressData]);

  return {
    // State
    unlocked: unlockState.unlocked,
    completed: unlockState.completed,
    loading: unlockState.loading,
    progressData,
    
    // Scene checks
    isSceneUnlocked,
    isSceneCompleted,
    getSceneStatus,
    
    // Zone checks
    getZoneStatus,
    getZoneProgress,
    getZoneStars,
    isZoneComplete,
    getAllZonesStatus,
    
    // Navigation
    getNextScene,
    
    // Actions
    refreshUnlocks,
    debugUnlocks
  };
};
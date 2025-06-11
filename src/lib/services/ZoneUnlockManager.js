// lib/services/ZoneUnlockManager.js
// 🎯 Centralized unlock logic for all 28 scenes across 7 zones
// ✅ UPDATED: Modak is now the first scene, Pond is second

class ZoneUnlockManager {
  constructor() {
    // Define the complete zone structure
    this.zoneStructure = {
      'symbol-mountain': {
        name: 'Symbol Mountain',
        order: 1,
        scenes: [
          { id: 'modak', name: 'Modak Forest', order: 1 },      // ✅ CHANGED: Now first
          { id: 'pond', name: 'Sacred Pond', order: 2 },        // ✅ CHANGED: Now second
          { id: 'temple', name: 'Ancient Temple', order: 3 },
          { id: 'garden', name: 'Sacred Garden', order: 4 }
        ]
      },
      'cave-secrets': {
        name: 'Cave of Secrets',
        order: 2,
        scenes: [
          { id: 'cave', name: 'Mystery Cave', order: 1 }
        ]
      },
      'obstacle-forest': {
        name: 'Obstacle Forest',
        order: 3,
        scenes: [
          { id: 'forest', name: 'Dense Forest', order: 1 },
          { id: 'logs', name: 'Fallen Logs', order: 2 },
          { id: 'leaves', name: 'Whispering Leaves', order: 3 },
          { id: 'mud', name: 'Muddy Path', order: 4 }
        ]
      },
      'shloka-river': {
        name: 'Shloka River',
        order: 4,
        scenes: [
          { id: 'river', name: 'Sacred River', order: 1 },
          { id: 'boat', name: 'River Crossing', order: 2 },
          { id: 'lotus', name: 'Lotus Garden', order: 3 }
        ]
      },
      'aboutme-hut': {
        name: 'About Me Hut',
        order: 5,
        scenes: [
          { id: 'hut', name: 'Wisdom Hut', order: 1 }
        ]
      },
      'story-treehouse': {
        name: 'Story Treehouse',
        order: 6,
        scenes: [
          { id: 'tree', name: 'Ancient Tree', order: 1 },
          { id: 'treehouse', name: 'Tree House', order: 2 },
          { id: 'books', name: 'Story Books', order: 3 }
        ]
      },
      'festival-square': {
        name: 'Festival Square',
        order: 7,
        scenes: [
          { id: 'ground', name: 'Open Ground', order: 1 },
          { id: 'mandap', name: 'Sacred Mandap', order: 2 },
          { id: 'ganesha', name: 'Ganesha Celebration', order: 3 }
        ]
      }
    };
  }

  // 🔓 MAIN UNLOCK LOGIC - Determines what should be unlocked
  calculateUnlockedScenes(progressData) {
    console.log('🔓 ZoneUnlockManager: Calculating unlocks from progress:', progressData);
    
    if (!progressData || !progressData.zones) {
      console.log('🔓 No progress data - only first scene unlocked');
      return this.getInitialUnlocks();
    }

    const unlockedScenes = new Set();
    const completedScenes = new Set();
    
    // ✅ CHANGED: Always unlock the very first scene (now modak)
    unlockedScenes.add('symbol-mountain.modak');

    // Process each zone in order
    Object.entries(this.zoneStructure).forEach(([zoneId, zoneConfig]) => {
      const zoneProgress = progressData.zones[zoneId];
      
      if (!zoneProgress || !zoneProgress.scenes) {
        // If no progress in this zone, stop unlocking
        return;
      }

      // Process scenes in this zone
      zoneConfig.scenes.forEach((sceneConfig, index) => {
        const sceneKey = `${zoneId}.${sceneConfig.id}`;
        const sceneProgress = zoneProgress.scenes[sceneConfig.id];
        
        if (sceneProgress && sceneProgress.completed) {
          // Scene is completed
          completedScenes.add(sceneKey);
          unlockedScenes.add(sceneKey);
          
          // Unlock next scene in this zone
          const nextScene = zoneConfig.scenes[index + 1];
          if (nextScene) {
            const nextSceneKey = `${zoneId}.${nextScene.id}`;
            unlockedScenes.add(nextSceneKey);
            console.log(`🔓 Unlocked next scene: ${nextSceneKey}`);
          } else {
            // This zone is complete, unlock first scene of next zone
            const nextZone = this.getNextZone(zoneId);
            if (nextZone) {
              const firstSceneOfNextZone = `${nextZone.id}.${nextZone.scenes[0].id}`;
              unlockedScenes.add(firstSceneOfNextZone);
              console.log(`🔓 Zone complete! Unlocked first scene of next zone: ${firstSceneOfNextZone}`);
            }
          }
        } else if (this.isPreviousSceneCompleted(zoneId, sceneConfig.id, progressData)) {
          // Previous scene completed, so this one is unlocked but not completed
          unlockedScenes.add(sceneKey);
          console.log(`🔓 Previous scene completed, unlocked: ${sceneKey}`);
        }
      });
    });

    const result = {
      unlocked: Array.from(unlockedScenes),
      completed: Array.from(completedScenes)
    };
    
    console.log('🔓 Final unlock calculation:', result);
    return result;
  }

  // 🔍 Check if previous scene is completed
  isPreviousSceneCompleted(zoneId, sceneId, progressData) {
    const zoneConfig = this.zoneStructure[zoneId];
    if (!zoneConfig) return false;

    const sceneIndex = zoneConfig.scenes.findIndex(s => s.id === sceneId);
    
    if (sceneIndex === 0) {
      // First scene in zone - check if previous zone is complete
      const prevZone = this.getPreviousZone(zoneId);
      if (!prevZone) return true; // Very first scene in game
      
      // Check if previous zone's last scene is completed
      const lastSceneOfPrevZone = prevZone.scenes[prevZone.scenes.length - 1];
      const prevZoneProgress = progressData.zones[prevZone.id];
      
      return prevZoneProgress && 
             prevZoneProgress.scenes && 
             prevZoneProgress.scenes[lastSceneOfPrevZone.id] && 
             prevZoneProgress.scenes[lastSceneOfPrevZone.id].completed;
    } else {
      // Check if previous scene in same zone is completed
      const prevScene = zoneConfig.scenes[sceneIndex - 1];
      const zoneProgress = progressData.zones[zoneId];
      
      return zoneProgress && 
             zoneProgress.scenes && 
             zoneProgress.scenes[prevScene.id] && 
             zoneProgress.scenes[prevScene.id].completed;
    }
  }

  // ✅ CHANGED: Get initial unlocks (now modak first)
  getInitialUnlocks() {
    return {
      unlocked: ['symbol-mountain.modak'],
      completed: []
    };
  }

  // 🔄 Get next zone
  getNextZone(currentZoneId) {
    const currentZone = this.zoneStructure[currentZoneId];
    if (!currentZone) return null;

    const nextZoneId = Object.keys(this.zoneStructure).find(zoneId => 
      this.zoneStructure[zoneId].order === currentZone.order + 1
    );

    return nextZoneId ? { id: nextZoneId, ...this.zoneStructure[nextZoneId] } : null;
  }

  // ⬅️ Get previous zone
  getPreviousZone(currentZoneId) {
    const currentZone = this.zoneStructure[currentZoneId];
    if (!currentZone) return null;

    const prevZoneId = Object.keys(this.zoneStructure).find(zoneId => 
      this.zoneStructure[zoneId].order === currentZone.order - 1
    );

    return prevZoneId ? { id: prevZoneId, ...this.zoneStructure[prevZoneId] } : null;
  }

  // 📊 Get scene status for UI
  getSceneStatus(zoneId, sceneId, progressData) {
    const unlockData = this.calculateUnlockedScenes(progressData);
    const sceneKey = `${zoneId}.${sceneId}`;
    
    const isCompleted = unlockData.completed.includes(sceneKey);
    const isUnlocked = unlockData.unlocked.includes(sceneKey);
    
    if (isCompleted) return 'completed';
    if (isUnlocked) return 'unlocked';
    return 'locked';
  }

  // 🌟 Get total stars for a zone
  getZoneStars(zoneId, progressData) {
    if (!progressData || !progressData.zones || !progressData.zones[zoneId]) {
      return 0;
    }

    const zoneProgress = progressData.zones[zoneId];
    let totalStars = 0;

    if (zoneProgress.scenes) {
      Object.values(zoneProgress.scenes).forEach(scene => {
        totalStars += scene.stars || 0;
      });
    }

    return totalStars;
  }

  // 📈 Get zone completion percentage
  getZoneProgress(zoneId, progressData) {
    const zoneConfig = this.zoneStructure[zoneId];
    if (!zoneConfig) return { completed: 0, total: 0, percentage: 0 };

    const totalScenes = zoneConfig.scenes.length;
    let completedScenes = 0;

    if (progressData && progressData.zones && progressData.zones[zoneId]) {
      const zoneProgress = progressData.zones[zoneId];
      if (zoneProgress.scenes) {
        completedScenes = Object.values(zoneProgress.scenes).filter(
          scene => scene.completed
        ).length;
      }
    }

    return {
      completed: completedScenes,
      total: totalScenes,
      percentage: Math.round((completedScenes / totalScenes) * 100)
    };
  }

  // 🏆 Check if zone is complete
  isZoneComplete(zoneId, progressData) {
    const progress = this.getZoneProgress(zoneId, progressData);
    return progress.completed === progress.total;
  }

  // 📋 Get all zones with their status
  getAllZonesStatus(progressData) {
    return Object.entries(this.zoneStructure).map(([zoneId, zoneConfig]) => ({
      id: zoneId,
      name: zoneConfig.name,
      order: zoneConfig.order,
      status: this.getZoneStatus(zoneId, progressData),
      progress: this.getZoneProgress(zoneId, progressData),
      stars: this.getZoneStars(zoneId, progressData),
      scenes: zoneConfig.scenes.map(scene => ({
        ...scene,
        status: this.getSceneStatus(zoneId, scene.id, progressData)
      }))
    }));
  }

  // 🎯 Get zone status
  getZoneStatus(zoneId, progressData) {
    const unlockData = this.calculateUnlockedScenes(progressData);
    const zoneScenes = this.zoneStructure[zoneId].scenes;
    
    const hasAnyUnlocked = zoneScenes.some(scene => 
      unlockData.unlocked.includes(`${zoneId}.${scene.id}`)
    );
    
    const allCompleted = zoneScenes.every(scene => 
      unlockData.completed.includes(`${zoneId}.${scene.id}`)
    );
    
    if (allCompleted) return 'completed';
    if (hasAnyUnlocked) return 'unlocked';
    return 'locked';
  }

  // 🔧 Debug: Print current unlock state
  debugUnlockState(progressData) {
    console.log('🔧 DEBUG: Current unlock state');
    console.log('Progress data:', progressData);
    
    const unlockData = this.calculateUnlockedScenes(progressData);
    console.log('Unlocked scenes:', unlockData.unlocked);
    console.log('Completed scenes:', unlockData.completed);
    
    Object.entries(this.zoneStructure).forEach(([zoneId, zoneConfig]) => {
      console.log(`\n🏔️ ${zoneConfig.name}:`);
      zoneConfig.scenes.forEach(scene => {
        const status = this.getSceneStatus(zoneId, scene.id, progressData);
        console.log(`  📍 ${scene.name}: ${status}`);
      });
    });
  }
}

// Export singleton instance
const zoneUnlockManager = new ZoneUnlockManager();
export default zoneUnlockManager;
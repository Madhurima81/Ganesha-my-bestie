// CulturalProgressExtractor.js - Extract learning progress for celebration modal
import GameStateManager from './GameStateManager';

class CulturalProgressExtractor {
  
  // Main function to get all cultural progress data
  static getCulturalProgressData() {
    try {
      const progress = GameStateManager.getGameProgress();
      const currentProfile = GameStateManager.getCurrentProfile();
      
      if (!progress || !currentProfile) {
        return this.getEmptyProgressData();
      }

      // Extract learning achievements
      const symbolsDiscovered = this.extractDiscoveredSymbols(progress);
      const storiesLearned = this.extractLearnedStories(progress);
      const shlokasChanted = this.extractChantedShlokas(progress);
      const totalLearnings = symbolsDiscovered.length + storiesLearned.length + shlokasChanted.length;

      // Calculate cultural level
      const culturalLevelInfo = this.calculateCulturalLevel(totalLearnings, progress.totalStars);

      // Get zone progress for temple building
      const zoneProgress = this.getZoneProgress(progress);

      return {
        // Basic info
        childName: currentProfile.name || "Cultural Explorer",
        
        // Learning achievements
        discoveredSymbols: symbolsDiscovered,
        learnedShlokas: shlokasChanted,
        heardStories: storiesLearned,
        
        // Cultural level
        culturalLevel: culturalLevelInfo.level,
        culturalTitle: culturalLevelInfo.title,
        
        // Stats for display
        totalStars: progress.totalStars || 0,
        totalLearnings: totalLearnings,
        
        // Zone progress for temple building
        zoneProgress: zoneProgress,
        
        // Overall progress
        completedScenes: progress.completedScenes || 0,
        totalScenes: this.getTotalAvailableScenes()
      };

    } catch (error) {
      console.error('Error extracting cultural progress:', error);
      return this.getEmptyProgressData();
    }
  }

  // Extract discovered symbols from completed scenes
  static extractDiscoveredSymbols(progress) {
    const symbols = [];
    
    if (!progress.zones) return symbols;

    Object.entries(progress.zones).forEach(([zoneId, zone]) => {
      if (!zone.scenes) return;
      
      Object.entries(zone.scenes).forEach(([sceneId, scene]) => {
        if (scene.completed && scene.symbols) {
          // Add symbols from this scene
          Object.entries(scene.symbols).forEach(([symbolName, discovered]) => {
            if (discovered && !symbols.find(s => s.name === symbolName)) {
              symbols.push({
                name: symbolName,
                zone: zoneId,
                scene: sceneId,
                discoveredAt: scene.completedAt || Date.now()
              });
            }
          });
        }
      });
    });

    return symbols;
  }

  // Extract learned stories (story-based scenes)
  static extractLearnedStories(progress) {
    const stories = [];
    
    // Define which scenes are story-based
    const storyScenes = {
      'symbol-mountain': ['modak', 'pond'], // These teach symbol stories
      'about-me-hut': ['all'], // All scenes in this zone are stories
      'story-treehouse': ['all'] // All scenes in this zone are stories
    };

    if (!progress.zones) return stories;

    Object.entries(progress.zones).forEach(([zoneId, zone]) => {
      if (!zone.scenes || !storyScenes[zoneId]) return;
      
      Object.entries(zone.scenes).forEach(([sceneId, scene]) => {
        if (scene.completed) {
          const isStoryScene = storyScenes[zoneId].includes('all') || 
                              storyScenes[zoneId].includes(sceneId);
          
          if (isStoryScene) {
            stories.push({
              name: this.getStoryName(zoneId, sceneId),
              zone: zoneId,
              scene: sceneId,
              learnedAt: scene.completedAt || Date.now()
            });
          }
        }
      });
    });

    return stories;
  }

  // Extract chanted shlokas (shloka-based scenes)
  static extractChantedShlokas(progress) {
    const shlokas = [];
    
    // Define which scenes are shloka-based
    const shlokaScenes = {
      'shloka-river': ['all'], // All scenes teach chanting
      'cave-of-secrets': ['all'] // All scenes teach meanings
    };

    if (!progress.zones) return shlokas;

    Object.entries(progress.zones).forEach(([zoneId, zone]) => {
      if (!zone.scenes || !shlokaScenes[zoneId]) return;
      
      Object.entries(zone.scenes).forEach(([sceneId, scene]) => {
        if (scene.completed) {
          const isShlokaScene = shlokaScenes[zoneId].includes('all') || 
                               shlokaScenes[zoneId].includes(sceneId);
          
          if (isShlokaScene) {
            shlokas.push({
              name: this.getShlokaName(zoneId, sceneId),
              zone: zoneId,
              scene: sceneId,
              masteredAt: scene.completedAt || Date.now()
            });
          }
        }
      });
    });

    return shlokas;
  }

  // Calculate cultural level based on total learnings
  static calculateCulturalLevel(totalLearnings, totalStars) {
    if (totalLearnings >= 20 || totalStars >= 50) {
      return { level: 5, title: "Cultural Ambassador", emoji: "🌟" };
    } else if (totalLearnings >= 15 || totalStars >= 35) {
      return { level: 4, title: "Heritage Guardian", emoji: "🛡️" };
    } else if (totalLearnings >= 10 || totalStars >= 25) {
      return { level: 3, title: "Wisdom Keeper", emoji: "🕉️" };
    } else if (totalLearnings >= 5 || totalStars >= 15) {
      return { level: 2, title: "Symbol Scholar", emoji: "📚" };
    } else {
      return { level: 1, title: "Wisdom Seeker", emoji: "🔍" };
    }
  }

  // Get zone progress for temple building visual
  static getZoneProgress(progress) {
    const zoneProgress = {};
    
    if (!progress.zones) return zoneProgress;

    Object.entries(progress.zones).forEach(([zoneId, zone]) => {
const zoneInfo = GameStateManager.ZONES?.[zoneId];
 if (!zoneInfo) return; // ← Changed from 'continue' to 'return'

    if (!zone.scenes) return; // ← Also fix this one

      const totalScenes = zoneInfo.scenes.length;
      const completedScenes = Object.values(zone.scenes).filter(s => s.completed).length;
      const zoneStars = zone.stars || 0;

      zoneProgress[zoneId] = {
        name: zoneInfo.name,
        icon: zoneInfo.icon,
        completed: completedScenes,
        total: totalScenes,
        stars: zoneStars,
        unlocked: zone.unlocked || false,
        percentage: totalScenes > 0 ? Math.round((completedScenes / totalScenes) * 100) : 0
      };
    });

    return zoneProgress;
  }

  // Helper functions for naming
  static getStoryName(zoneId, sceneId) {
    const storyNames = {
      'symbol-mountain': {
        'modak': 'Mooshika and the Sacred Modaks',
        'pond': 'The Sacred Lotus Pond'
      },
      'about-me-hut': {
        'birth': 'How Ganesha Got His Elephant Head',
        'childhood': 'Young Ganesha\'s Adventures'
      }
    };

    return storyNames[zoneId]?.[sceneId] || `Story from ${sceneId}`;
  }

  static getShlokaName(zoneId, sceneId) {
    const shlokaNames = {
      'shloka-river': {
        'basic': 'Om Gam Ganapataye Namaha',
        'advanced': 'Vakratunda Mahakaya'
      },
      'cave-of-secrets': {
        'meaning1': 'Understanding Om Gam',
        'meaning2': 'Meaning of Vakratunda'
      }
    };

    return shlokaNames[zoneId]?.[sceneId] || `Shloka from ${sceneId}`;
  }

 // Get total available scenes across all zones
static getTotalAvailableScenes() {
  let total = 0;
  try {
    if (GameStateManager.ZONES) {
      Object.values(GameStateManager.ZONES).forEach(zone => {
        if (zone && zone.scenes) {
          total += zone.scenes.length;
        }
      });
    }
  } catch (error) {
    console.warn('Error calculating total scenes:', error);
    total = 32; // Fallback: approximate total scenes
  }
  return total;
}

// Empty progress data fallback
static getEmptyProgressData() {
  return {
    childName: "Cultural Explorer",
    discoveredSymbols: [],
    learnedShlokas: [],
    heardStories: [],
    culturalLevel: 1,
    culturalTitle: "Wisdom Seeker",
    totalStars: 0,
    totalLearnings: 0,
    zoneProgress: {},
    completedScenes: 0,
    totalScenes: 32
  };
}

  // Quick method to get just the celebration stats
  static getCelebrationStats() {
    const data = this.getCulturalProgressData();
    
    return {
      symbolsCount: data.discoveredSymbols.length,
      storiesCount: data.heardStories.length,
      shlokasCount: data.learnedShlokas.length,
      culturalLevel: data.culturalLevel,
      culturalTitle: data.culturalTitle,
      totalStars: data.totalStars
    };
  }
}

export default CulturalProgressExtractor;
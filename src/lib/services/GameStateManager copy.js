// GameStateManager.js - Fixed createProfile method

class GameStateManager {
  constructor() {
    this.currentZone = null;
    this.currentScene = null;
    this.activeProfileId = null;
    this.initializeProfiles();
  }

  // Zone structure remains the same
  static ZONES = {
    'symbol-mountain': {
      id: 1,
      name: 'Symbol Mountain',
      icon: '🏔️',
  scenes: ['modak', 'pond', 'temple', 'garden']  // ← Match ZoneConfig!
    },
    'rainbow-valley': {
      id: 2,
      name: 'Rainbow Valley',
      icon: '🌈',
      scenes: ['meadow', 'bridge', 'cave', 'stream', 'village']
    },
    'ocean-depths': {
      id: 3,
      name: 'Ocean Depths',
      icon: '🌊',
      scenes: ['reef', 'trench', 'kelp-forest', 'shipwreck', 'atlantis']
    },
    'sky-kingdom': {
      id: 4,
      name: 'Sky Kingdom',
      icon: '☁️',
      scenes: ['cloud-palace', 'rainbow-bridge', 'wind-temple', 'star-observatory', 'sky-port']
    },
    'forest-haven': {
      id: 5,
      name: 'Forest Haven',
      icon: '🌲',
      scenes: ['ancient-tree', 'mushroom-circle', 'fairy-glen', 'bear-cave', 'owl-roost']
    },
    'desert-oasis': {
      id: 6,
      name: 'Desert Oasis',
      icon: '🏜️',
      scenes: ['pyramid', 'oasis-pool', 'camel-station', 'sand-dunes', 'mirage-city']
    },
    'ice-palace': {
      id: 7,
      name: 'Ice Palace',
      icon: '❄️',
      scenes: ['frozen-throne', 'crystal-cave', 'penguin-colony', 'aurora-hall', 'glacier-bridge']
    },
    'volcano-peak': {
      id: 8,
      name: 'Volcano Peak',
      icon: '🌋',
      scenes: ['lava-chamber', 'obsidian-path', 'fire-temple', 'dragon-lair', 'summit-crater']
    }
  };

  // Profile colors and avatars for kids
  static PROFILE_AVATARS = ['🦁', '🐧', '🦊', '🐼', '🦝', '🐯', '🐨', '🦉'];
  static PROFILE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#DDA0DD', '#98FB98', '#FFB6C1'];

  // Initialize profile system
  initializeProfiles() {
    const profiles = this.getProfiles();
    if (!profiles || !profiles.profiles) {
      // First time setup
      const initialProfiles = {
        profiles: {},
        lastUpdated: Date.now()
      };
      localStorage.setItem('gameProfiles', JSON.stringify(initialProfiles));
    }

    // Get active profile from localStorage
    this.activeProfileId = localStorage.getItem('activeProfileId');
  }

  // Get all profiles - FIXED to always return valid structure
  getProfiles() {
    const saved = localStorage.getItem('gameProfiles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing profiles:', e);
        // Return default structure on parse error
        return {
          profiles: {},
          lastUpdated: Date.now()
        };
      }
    }
    // Return default structure instead of null
    return {
      profiles: {},
      lastUpdated: Date.now()
    };
  }

  // 🔧 FIXED: Create a new profile - now accepts direct avatar and color values
  createProfile(name, avatar, color) {
    console.log('🎯 GameStateManager.createProfile called with:', { name, avatar, color });
    
    let profiles = this.getProfiles();
    
    // Ensure profiles has the correct structure
    if (!profiles || !profiles.profiles) {
      profiles = {
        profiles: {},
        lastUpdated: Date.now()
      };
    }
    
    // Check if we already have 4 profiles
    const profileCount = Object.keys(profiles.profiles).length;
    if (profileCount >= 4) {
      console.error('Maximum of 4 profiles allowed');
      return null;
    }

    // Generate unique ID
    const profileId = `profile_${Date.now()}`;
    
    // 🔧 FIXED: Use avatar and color directly instead of array indices
    const newProfile = {
      id: profileId,
      name: name.substring(0, 12), // Limit name length for UI
      avatar: avatar || '🦉', // Use the passed avatar directly (emoji or animal ID)
      color: color || '#8B4513', // Use the passed color directly
      createdAt: Date.now(),
      lastPlayed: Date.now(),
      totalStars: 0,
      completedScenes: 0,
      currentZone: 'symbol-mountain',
      currentScene: 'pond'
    };

    console.log('🎯 Creating new profile:', newProfile);

    // Add to profiles
    profiles.profiles[profileId] = newProfile;
    profiles.lastUpdated = Date.now();
    
    // Save
    localStorage.setItem('gameProfiles', JSON.stringify(profiles));
    console.log('🎯 Profile saved to localStorage');
    
    // Set as active profile
    this.setActiveProfile(profileId);
    
    // Initialize game progress for this profile
    this.initializeProfileProgress(profileId);
    
    console.log('🎯 Profile creation complete, returning:', newProfile);
    return newProfile;
  }

  // Initialize game progress for a new profile
  initializeProfileProgress(profileId) {
    const progress = {
      totalStars: 0,
      completedScenes: 0,
      currentZone: 'symbol-mountain',
      currentScene: 'pond',
      zones: {}
    };
    
    // Initialize all zones and scenes
    Object.entries(GameStateManager.ZONES).forEach(([zoneId, zone]) => {
      progress.zones[zoneId] = {
        unlocked: zoneId === 'symbol-mountain', // Only first zone unlocked initially
        stars: 0,
        completed: false,
        scenes: {}
      };
      
      zone.scenes.forEach(sceneId => {
        progress.zones[zoneId].scenes[sceneId] = {
          completed: false,
          stars: 0,
          symbols: {},
          lastPlayed: null
        };
      });
    });
    
    localStorage.setItem(`${profileId}_gameProgress`, JSON.stringify(progress));
  }

  // Set active profile - FIXED to handle missing profiles
  setActiveProfile(profileId) {
    this.activeProfileId = profileId;
    localStorage.setItem('activeProfileId', profileId);
    
    // Update last played time
    const profiles = this.getProfiles();
    if (profiles && profiles.profiles && profiles.profiles[profileId]) {
      profiles.profiles[profileId].lastPlayed = Date.now();
      localStorage.setItem('gameProfiles', JSON.stringify(profiles));
    }
  }

  // Get current active profile - FIXED null checks
  getCurrentProfile() {
    if (!this.activeProfileId) return null;
    
    const profiles = this.getProfiles();
    if (profiles && profiles.profiles) {
      return profiles.profiles[this.activeProfileId] || null;
    }
    return null;
  }

  // Delete a profile (with all its data) - FIXED null checks
  deleteProfile(profileId) {
    const profiles = this.getProfiles();
    
    if (!profiles || !profiles.profiles || !profiles.profiles[profileId]) {
      console.error('Profile not found');
      return false;
    }
    
    // Delete profile
    delete profiles.profiles[profileId];
    profiles.lastUpdated = Date.now();
    localStorage.setItem('gameProfiles', JSON.stringify(profiles));
    
    // Delete all game data for this profile
    const keysToDelete = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(profileId)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => localStorage.removeItem(key));
    
    // If this was the active profile, clear it
    if (this.activeProfileId === profileId) {
      this.activeProfileId = null;
      localStorage.removeItem('activeProfileId');
    }
    
    return true;
  }

  // Update profile stats - FIXED null checks
  updateProfileStats(stars, completedScenes) {
    const profile = this.getCurrentProfile();
    if (!profile) return;
    
    const profiles = this.getProfiles();
    if (profiles && profiles.profiles && profiles.profiles[this.activeProfileId]) {
      profiles.profiles[this.activeProfileId].totalStars = stars;
      profiles.profiles[this.activeProfileId].completedScenes = completedScenes;
      profiles.profiles[this.activeProfileId].lastPlayed = Date.now();
      
      localStorage.setItem('gameProfiles', JSON.stringify(profiles));
    }
  }

  // Updated save method with profile support
  saveGameState(zoneId, sceneId, sceneState) {
    if (!this.activeProfileId) {
      console.error('No active profile selected');
      return;
    }
    
    const gameProgress = this.getGameProgress();
    
    // Save specific scene state with profile ID
    const sceneKey = `${this.activeProfileId}_${zoneId}_${sceneId}_state`;
    localStorage.setItem(sceneKey, JSON.stringify({
      ...sceneState,
      lastSaved: Date.now()
    }));
    
    // Update overall progress
    if (gameProgress.zones && gameProgress.zones[zoneId] && gameProgress.zones[zoneId].scenes) {
      gameProgress.zones[zoneId].scenes[sceneId] = {
        completed: sceneState.completed || false,
        stars: sceneState.stars || 0,
        symbols: sceneState.symbols || {},
        lastPlayed: Date.now()
      };
    }
    
    // Update current location
    gameProgress.currentZone = zoneId;
    gameProgress.currentScene = sceneId;
    
    // Save with profile ID
    localStorage.setItem(`${this.activeProfileId}_gameProgress`, JSON.stringify(gameProgress));
    
    // Update profile stats
    this.recalculateTotals(gameProgress);
    this.updateProfileStats(gameProgress.totalStars, gameProgress.completedScenes);
  }

  // Updated get progress method with profile support
  getGameProgress() {
    if (!this.activeProfileId) {
      console.warn('No active profile, returning empty progress');
      return this.initializeEmptyProgress();
    }
    
    const saved = localStorage.getItem(`${this.activeProfileId}_gameProgress`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing game progress:', e);
        return this.initializeEmptyProgress();
      }
    }
    
    // Initialize new game progress for this profile
    this.initializeProfileProgress(this.activeProfileId);
    const newProgress = localStorage.getItem(`${this.activeProfileId}_gameProgress`);
    return newProgress ? JSON.parse(newProgress) : this.initializeEmptyProgress();
  }

  // Check if current profile has saved progress
  hasSavedProgress() {
    if (!this.activeProfileId) return false;
    
    const progress = this.getGameProgress();
    return progress && (progress.completedScenes > 0 || progress.totalStars > 0);
  }

  // Updated get scene state with profile support
  getSceneState(zoneId, sceneId) {
    if (!this.activeProfileId) return null;
    
    const sceneKey = `${this.activeProfileId}_${zoneId}_${sceneId}_state`;
    const saved = localStorage.getItem(sceneKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing scene state:', e);
        return null;
      }
    }
    return null;
  }

  // Updated reset methods with profile support
  resetScene(zoneId, sceneId) {
    if (!this.activeProfileId) return;
    
    const sceneKey = `${this.activeProfileId}_${zoneId}_${sceneId}_state`;
    localStorage.removeItem(sceneKey);
    
    // Update overall progress
    const progress = this.getGameProgress();
    if (progress.zones && progress.zones[zoneId] && progress.zones[zoneId].scenes && progress.zones[zoneId].scenes[sceneId]) {
      progress.zones[zoneId].scenes[sceneId] = {
        completed: false,
        stars: 0,
        symbols: {},
        lastPlayed: null
      };
      
      // Recalculate totals
      this.recalculateTotals(progress);
      localStorage.setItem(`${this.activeProfileId}_gameProgress`, JSON.stringify(progress));
    }
  }

  // Reset current profile's game
  resetGame() {
    if (!this.activeProfileId) return;
    
    // Clear all game data for current profile
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.activeProfileId) && key !== `${this.activeProfileId}_profileData`) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Initialize fresh game state for this profile
    this.initializeProfileProgress(this.activeProfileId);
    
    // Update profile stats
    this.updateProfileStats(0, 0);
  }

  // Get last played location for current profile
  getLastPlayedLocation() {
    const progress = this.getGameProgress();
    return {
      zone: progress.currentZone || 'symbol-mountain',
      scene: progress.currentScene || 'pond'
    };
  }

  // Helper method to get empty progress
  initializeEmptyProgress() {
    const progress = {
      totalStars: 0,
      completedScenes: 0,
      currentZone: 'symbol-mountain',
      currentScene: 'pond',
      zones: {}
    };
    
    // Initialize zone structure
    Object.entries(GameStateManager.ZONES).forEach(([zoneId, zone]) => {
      progress.zones[zoneId] = {
        unlocked: zoneId === 'symbol-mountain',
        stars: 0,
        completed: false,
        scenes: {}
      };
      
      zone.scenes.forEach(sceneId => {
        progress.zones[zoneId].scenes[sceneId] = {
          completed: false,
          stars: 0,
          symbols: {},
          lastPlayed: null
        };
      });
    });
    
    return progress;
  }

  // Existing methods remain the same...
  recalculateTotals(progress) {
    let totalStars = 0;
    let completedScenes = 0;
    
    if (progress.zones) {
      Object.values(progress.zones).forEach(zone => {
        let zoneStars = 0;
        let zoneCompleted = 0;
        
        if (zone.scenes) {
          Object.values(zone.scenes).forEach(scene => {
            totalStars += scene.stars || 0;
            zoneStars += scene.stars || 0;
            
            if (scene.completed) {
              completedScenes++;
              zoneCompleted++;
            }
          });
        }
        
        zone.stars = zoneStars;
        zone.completed = zoneCompleted === Object.keys(zone.scenes || {}).length;
      });
    }
    
    progress.totalStars = totalStars;
    progress.completedScenes = completedScenes;
  }

  // Navigation helpers remain the same
  getNextScene(currentZone, currentScene) {
    const zone = GameStateManager.ZONES[currentZone];
    if (!zone) return null;
    
    const currentIndex = zone.scenes.indexOf(currentScene);
    if (currentIndex === -1 || currentIndex === zone.scenes.length - 1) {
      return null;
    }
    
    return {
      zone: currentZone,
      scene: zone.scenes[currentIndex + 1]
    };
  }

  isSceneUnlocked(zoneId, sceneId) {
    const progress = this.getGameProgress();
    if (!progress.zones || !progress.zones[zoneId]) return false;
    
    const zone = progress.zones[zoneId];
    if (!zone || !zone.unlocked) return false;
    
    const zoneScenes = GameStateManager.ZONES[zoneId].scenes;
    if (sceneId === zoneScenes[0]) return true;
    
    const sceneIndex = zoneScenes.indexOf(sceneId);
    if (sceneIndex > 0) {
      const previousScene = zoneScenes[sceneIndex - 1];
      return zone.scenes && zone.scenes[previousScene] && zone.scenes[previousScene].completed || false;
    }
    
    return false;
  }

  // 🔧 FIXED: Helper method to get scene progress
  getSceneProgress(zoneId, sceneId) {
    const progress = this.getGameProgress();
    if (!progress.zones || !progress.zones[zoneId] || !progress.zones[zoneId].scenes) {
      return null;
    }
    return progress.zones[zoneId].scenes[sceneId] || null;
  }
}

// Create singleton instance
const gameStateManager = new GameStateManager();

export default gameStateManager;
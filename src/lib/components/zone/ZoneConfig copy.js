// ZoneConfig.js - Centralized zone and scene definitions
// Path: lib/components/zone/ZoneConfig.js

export const ZONE_CONFIGS = {
  'symbol-mountain': {
    id: 'symbol-mountain',
    name: 'Symbol Mountain',
    icon: '🏔️',
    background: '/images/symbol-mountain-bg.png',
    description: 'Learn about Ganesha\'s sacred symbols in this mystical mountain.',
    unlocked: true,
    totalStars: 12,
    requiredStars: 0,
    sequence: 3,
    scenes: [
      {
        id: 'modak',
        name: 'Modak Forest',
        emoji: '🍯',
        description: 'Help Mooshika collect sweet modaks',
        unlocked: true,
        order: 1,
        position: { top: 35, left: 25 }
      },
      {
        id: 'pond',
        name: 'Sacred Pond',
        emoji: '🪷',
        description: 'Find lotus flowers and meet the elephant',
        unlocked: true,
        order: 2,
        position: { top: 65, left: 75 }
      },
      {
        id: 'temple',
        name: 'Ancient Temple',
        emoji: '🛕',
        description: 'Discover hidden symbols in the temple',
        unlocked: false,
        order: 3,
        position: { top: 45, left: 50 }
      },
      {
        id: 'garden',
        name: 'Sacred Garden',
        emoji: '🌸',
        description: 'Plant and grow magical flowers',
        unlocked: false,
        order: 4,
        position: { top: 75, left: 30 }
      }
    ]
  },

  'cave-of-secrets': {
    id: 'cave-of-secrets',
    name: 'Cave of Secrets',
    icon: '🌈',
    background: '/images/cave-of-secrets.png',
    description: 'Discover hidden treasures and ancient wisdom.',
    unlocked: false,
    totalStars: 15,
    requiredStars: 15,
    sequence: 4,
    scenes: [
      {
        id: 'crystal-cave',
        name: 'Crystal Cave',
        emoji: '💎',
        description: 'Find glowing crystals in the darkness',
        unlocked: false,
        order: 1,
        position: { top: 40, left: 30 }
      },
      {
        id: 'treasure-chamber',
        name: 'Treasure Chamber',
        emoji: '💰',
        description: 'Unlock the ancient treasure chest',
        unlocked: false,
        order: 2,
        position: { top: 60, left: 70 }
      },
      {
        id: 'wisdom-hall',
        name: 'Wisdom Hall',
        emoji: '📜',
        description: 'Learn ancient secrets from scrolls',
        unlocked: false,
        order: 3,
        position: { top: 30, left: 60 }
      }
    ]
  },

  'obstacle-forest': {
    id: 'obstacle-forest',
    name: 'Obstacle Forest',
    icon: '🌊',
    background: '/images/obstacle-forest.png',
    description: 'Navigate through challenges with courage and wit.',
    unlocked: false,
    totalStars: 12,
    requiredStars: 25,
    sequence: 5,
    scenes: [
      {
        id: 'fallen-logs',
        name: 'Fallen Logs',
        emoji: '🪵',
        description: 'Cross the river using fallen logs',
        unlocked: false,
        order: 1,
        position: { top: 50, left: 25 }
      },
      {
        id: 'thorny-maze',
        name: 'Thorny Maze',
        emoji: '🌿',
        description: 'Find your way through the thorny maze',
        unlocked: false,
        order: 2,
        position: { top: 35, left: 65 }
      },
      {
        id: 'muddy-path',
        name: 'Muddy Path',
        emoji: '🥾',
        description: 'Navigate the slippery muddy trail',
        unlocked: false,
        order: 3,
        position: { top: 70, left: 45 }
      },
      {
        id: 'rope-bridge',
        name: 'Rope Bridge',
        emoji: '🌉',
        description: 'Cross the dangerous rope bridge',
        unlocked: false,
        order: 4,
        position: { top: 25, left: 40 }
      }
    ]
  },

  'shloka-river': {
    id: 'shloka-river',
    name: 'Shloka River',
    icon: '☁️',
    background: '/images/shloka-river.png',
    description: 'Learn sacred chants by the flowing waters.',
    unlocked: false,
    totalStars: 18,
    requiredStars: 60,
    sequence: 7,
    scenes: [
      {
        id: 'river-bank',
        name: 'River Bank',
        emoji: '🏞️',
        description: 'Start your journey at the peaceful river bank',
        unlocked: false,
        order: 1,
        position: { top: 45, left: 20 }
      },
      {
        id: 'floating-boat',
        name: 'Floating Boat',
        emoji: '🛶',
        description: 'Sail across the sacred waters',
        unlocked: false,
        order: 2,
        position: { top: 35, left: 55 }
      },
      {
        id: 'lotus-temple',
        name: 'Lotus Temple',
        emoji: '🏛️',
        description: 'Reach the temple in the middle of the river',
        unlocked: false,
        order: 3,
        position: { top: 60, left: 75 }
      }
    ]
  },

  'about-me-hut': {
    id: 'about-me-hut',
    name: 'About Me Hut',
    icon: '🌲',
    background: '/images/about-me-hut.png',
    description: 'Start your journey! Discover your inner self and personal growth.',
    unlocked: true,
    totalStars: 9,
    requiredStars: 0,
    sequence: 1,
    scenes: [
      {
        id: 'mirror-room',
        name: 'Mirror Room',
        emoji: '🪞',
        description: 'Look into the magical mirror and discover yourself',
        unlocked: true,
        order: 1,
        position: { top: 40, left: 35 }
      },
      {
        id: 'memory-chest',
        name: 'Memory Chest',
        emoji: '📦',
        description: 'Open the chest and explore your memories',
        unlocked: false,
        order: 2,
        position: { top: 65, left: 65 }
      },
      {
        id: 'dream-cloud',
        name: 'Dream Cloud',
        emoji: '☁️',
        description: 'Float on the cloud and share your dreams',
        unlocked: false,
        order: 3,
        position: { top: 25, left: 60 }
      }
    ]
  },

  'story-treehouse': {
    id: 'story-treehouse',
    name: 'Story Treehouse',
    icon: '🏜️',
    background: '/images/story-treehouse.png',
    description: 'Listen to magical tales from ancient times.',
    unlocked: true,
    totalStars: 21,
    requiredStars: 0,
    sequence: 2,
    scenes: [
      {
        id: 'magic-tree',
        name: 'Magic Tree',
        emoji: '🌳',
        description: 'Climb the ancient storytelling tree',
        unlocked: true,
        order: 1,
        position: { top: 55, left: 30 }
      },
      {
        id: 'book-nook',
        name: 'Book Nook',
        emoji: '📚',
        description: 'Read magical stories in the cozy nook',
        unlocked: false,
        order: 2,
        position: { top: 35, left: 65 }
      },
      {
        id: 'story-stage',
        name: 'Story Stage',
        emoji: '🎭',
        description: 'Perform your own stories on the stage',
        unlocked: false,
        order: 3,
        position: { top: 70, left: 55 }
      }
    ]
  },

  'festival-square': {
    id: 'festival-square',
    name: 'Festival Square',
    icon: '❄️',
    background: '/images/festival-square.png',
    description: 'Celebrate with music, dance, and joy!',
    unlocked: false,
    totalStars: 24,
    requiredStars: 40,
    sequence: 6,
    scenes: [
      {
        id: 'decoration-corner',
        name: 'Decoration Corner',
        emoji: '🎨',
        description: 'Create beautiful decorations for the festival',
        unlocked: false,
        order: 1,
        position: { top: 35, left: 25 }
      },
      {
        id: 'music-pavilion',
        name: 'Music Pavilion',
        emoji: '🎵',
        description: 'Play instruments and create music',
        unlocked: false,
        order: 2,
        position: { top: 50, left: 60 }
      },
      {
        id: 'dance-floor',
        name: 'Dance Floor',
        emoji: '💃',
        description: 'Dance and celebrate with everyone',
        unlocked: false,
        order: 3,
        position: { top: 70, left: 40 }
      },
      {
        id: 'ganesha-shrine',
        name: 'Ganesha Shrine',
        emoji: '🕉️',
        description: 'Pay respects at the beautiful shrine',
        unlocked: false,
        order: 4,
        position: { top: 25, left: 55 }
      }
    ]
  }
};

// Helper functions for zone management
export const getZoneConfig = (zoneId) => {
  return ZONE_CONFIGS[zoneId] || null;
};

export const getAllZones = () => {
  return Object.values(ZONE_CONFIGS);
};

export const getZoneScenes = (zoneId) => {
  const zone = getZoneConfig(zoneId);
  return zone ? zone.scenes : [];
};

export const getSceneById = (zoneId, sceneId) => {
  const scenes = getZoneScenes(zoneId);
  return scenes.find(scene => scene.id === sceneId) || null;
};

export const getUnlockedScenes = (zoneId, progressData = {}) => {
  const scenes = getZoneScenes(zoneId);
  return scenes.filter(scene => {
    if (scene.order === 1) return true; // First scene always unlocked
    
    // Check if previous scene is completed
    const previousScene = scenes.find(s => s.order === scene.order - 1);
    if (!previousScene) return false;
    
    const previousProgress = progressData[previousScene.id];
    return previousProgress && previousProgress.completed;
  });
};

export const calculateZoneProgress = (zoneId, progressData = {}) => {
  const scenes = getZoneScenes(zoneId);
  const totalScenes = scenes.length;
  const completedScenes = scenes.filter(scene => {
    const progress = progressData[scene.id];
    return progress && progress.completed;
  }).length;
  
  const totalStars = scenes.reduce((sum, scene) => {
    const progress = progressData[scene.id];
    return sum + (progress ? progress.stars || 0 : 0);
  }, 0);
  
  return {
    completed: completedScenes,
    total: totalScenes,
    percentage: Math.round((completedScenes / totalScenes) * 100),
    stars: totalStars
  };
};
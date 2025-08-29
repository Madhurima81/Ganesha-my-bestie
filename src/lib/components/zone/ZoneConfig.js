// ZoneConfig.js - Updated to ensure temple unlocks after pond
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
        order: 1,  // ✅ FIRST SCENE
        position: { top: 25, left: 25 }
      },
      {
        id: 'pond',
        name: 'Sacred Pond',
        emoji: '🪷',
        description: 'Find lotus flowers and meet the elephant',
        unlocked: false,  // Will be unlocked after modak
        order: 2,  // ✅ SECOND SCENE
        position: { top: 25, left: 75 }
      },
      
      {
  id: 'symbol',
  name: 'Sacred Tusk',
  emoji: '🐘',
  description: 'Master the musical tusk assembly',
  unlocked: false,
  order: 3,
  position: { top: 25, left: 50 }
},
    {
  id: 'final-scene',
  name: 'Sacred Assembly',
  emoji: '🕉️', 
  description: 'Assemble all sacred symbols to awaken Ganesha',
  unlocked: false,
  order: 4,
  position: { top: 75, left: 30 }
}
    ]
  },

'cave-of-secrets': {
  id: 'cave-of-secrets',
  name: 'Cave of Secrets',
  icon: '🕳️',
  background: '/images/cave-of-secrets-background.png',
  description: 'Discover the complete Vakratunda Mahakaya mantra through mystical cave adventures.',
  unlocked: false,
  totalStars: 40,  // 5 scenes × 8 stars each
  requiredStars: 12, // Unlock after completing Symbol Mountain
  sequence: 4,
  scenes: [
    {
      id: 'vakratunda-mahakaya',
      name: 'Vakratunda Mahakaya',
      emoji: '🐘',
      description: 'Learn about Ganesha\'s curved trunk and mighty form',
      unlocked: false,
      order: 1,
      position: { top: 25, left: 20 }
    },
    {
      id: 'suryakoti-samaprabha', 
      name: 'Surya Koti Samaprabha',
      emoji: '☀️',
      description: 'Awaken a million suns and discover divine brilliance',
      unlocked: false,
      order: 2,
      position: { top: 35, left: 45 }
    },
    {
      id: 'nirvighnam-kurumedeva',
      name: 'Nirvighnam Kurume Deva',
      emoji: '🛤️', 
      description: 'Clear obstacles with divine power and build bridges',
      unlocked: false,
      order: 3,
      position: { top: 60, left: 25 }
    },
    {
      id: 'sarvakaryeshu-sarvada',
      name: 'Sarvakaryeshu Sarvada',
      emoji: '🌟',
      description: 'Experience divine presence in all daily activities',
      unlocked: false,
      order: 4,
      position: { top: 70, left: 55 }
    },
    {
      id: 'mantra-assembly',
      name: 'Sacred Mantra Assembly',
      emoji: '🕉️',
      description: 'Assemble the complete Vakratunda Mahakaya mantra',
      unlocked: false,
      order: 5,
      position: { top: 45, left: 75 }
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
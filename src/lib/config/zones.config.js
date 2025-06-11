// zones.config.js - A reusable configuration file
export const ZONES = [
  { 
    id: 1, 
    name: 'Symbol Mountain', 
    icon: '🏔️', 
    path: '/zones/symbol-mountain',
    unlocked: true, 
    stars: 0, 
    totalStars: 3,
    description: 'Learn about symbols and their meanings'
  },
  { 
    id: 2, 
    name: 'Rainbow Valley', 
    icon: '🌈', 
    path: '/zones/rainbow-valley',
    unlocked: true, 
    stars: 0, 
    totalStars: 3,
    description: 'Explore colors and emotions'
  },
  { 
    id: 3, 
    name: 'Ocean Depths', 
    icon: '🌊', 
    path: '/zones/ocean-depths',
    unlocked: false, 
    stars: 0, 
    totalStars: 4,
    description: 'Dive into water adventures'
  },
  { 
    id: 4, 
    name: 'Sky Kingdom', 
    icon: '☁️', 
    path: '/zones/sky-kingdom',
    unlocked: false, 
    stars: 0, 
    totalStars: 3,
    description: 'Soar through the clouds'
  },
  { 
    id: 5, 
    name: 'Forest Haven', 
    icon: '🌲', 
    path: '/zones/forest-haven',
    unlocked: false, 
    stars: 0, 
    totalStars: 5,
    description: 'Discover nature secrets'
  },
  { 
    id: 6, 
    name: 'Desert Oasis', 
    icon: '🏜️', 
    path: '/zones/desert-oasis',
    unlocked: false, 
    stars: 0, 
    totalStars: 3,
    description: 'Find treasures in the sand'
  },
  { 
    id: 7, 
    name: 'Ice Palace', 
    icon: '❄️', 
    path: '/zones/ice-palace',
    unlocked: false, 
    stars: 0, 
    totalStars: 4,
    description: 'Frozen wonders await'
  },
  { 
    id: 8, 
    name: 'Volcano Peak', 
    icon: '🌋', 
    path: '/zones/volcano-peak',
    unlocked: false, 
    stars: 0, 
    totalStars: 5,
    description: 'Brave the fiery mountain'
  }
];

// Helper function to get zone by ID
export const getZoneById = (id) => {
  return ZONES.find(zone => zone.id === id);
};

// Helper function to get unlocked zones
export const getUnlockedZones = () => {
  return ZONES.filter(zone => zone.unlocked);
};

// Helper function to calculate total progress
export const calculateProgress = () => {
  const totalStars = ZONES.reduce((sum, zone) => sum + zone.totalStars, 0);
  const earnedStars = ZONES.reduce((sum, zone) => sum + zone.stars, 0);
  const unlockedCount = ZONES.filter(zone => zone.unlocked).length;
  
  return {
    earnedStars,
    totalStars,
    unlockedZones: unlockedCount,
    totalZones: ZONES.length,
    percentage: Math.round((earnedStars / totalStars) * 100)
  };
};
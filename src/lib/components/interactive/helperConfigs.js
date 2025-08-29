// ===== INTERACTION TYPE DEFINITIONS =====
export const INTERACTION_TYPES = {
  pour: {
    instruction: 'Tilt to pour!',
    gestureType: 'tilt',
    threshold: 30,
    fallbackText: 'Pour Now!'
  },
  flip: {
    instruction: 'Flip it over!',
    gestureType: 'rotate', 
    threshold: 180,
    fallbackText: 'Flip Now!'
  },
  stir: {
    instruction: 'Stir in circles!',
    gestureType: 'circular',
    threshold: 360,
    fallbackText: 'Stir Now!'
  },
  wipe: {
    instruction: 'Wipe it clean!',
    gestureType: 'swipe',
    threshold: 100,
    fallbackText: 'Wipe Now!'
  },
  tap: {
    instruction: 'Tap to activate!',
    gestureType: 'click',
    threshold: 1,
    fallbackText: 'Activate!'
  },
  hug: {
    instruction: 'Give a squeeze!',
    gestureType: 'pinch',
    threshold: 50,
    fallbackText: 'Hug Now!'
  },
  swing: {
    instruction: 'Power swing!',
    gestureType: 'arc',
    threshold: 90,
    fallbackText: 'Swing Now!'
  }
};

// ===== ALL 24 HELPER CONFIGURATIONS =====
export const HELPER_CONFIGS = {
  // GRANDPARENTS MISSION (4 helpers)
  timmytime: { 
    type: 'flip', 
    color: '#FFD700', 
    icon: '⏳',
    phrase: "No hurry, let's take our time!",
    particleColor: '#FFD700'
  },
  clearolens: { 
    type: 'wipe', 
    color: '#87CEEB', 
    icon: '🔍',
    phrase: "I'll make things crystal clear!",
    particleColor: '#87CEEB'
  },
  memoleaf: { 
    type: 'tap', 
    color: '#90EE90', 
    icon: '🍃',
    phrase: "I'll help you remember!",
    particleColor: '#90EE90'
  },
  snuggyshawl: { 
    type: 'hug', 
    color: '#FFB6C1', 
    icon: '🧣',
    phrase: "Feel cozy, you've got this!",
    particleColor: '#FFB6C1'
  },

  // DOG MISSION (4 helpers)  
  snuggyblanket: { 
    type: 'hug', 
    color: '#DDA0DD', 
    icon: '🛏️',
    phrase: "Warm hugs for you!",
    particleColor: '#DDA0DD'
  },
  aquabuddy: { 
    type: 'pour', 
    color: '#00CED1', 
    icon: '💧',
    phrase: "Here's a cool sip!",
    particleColor: '#00CED1'
  },
  happytail: { 
    type: 'swing', 
    color: '#F4A460', 
    icon: '🐾',
    phrase: "Let's wag away the fear!",
    particleColor: '#F4A460'
  },
  brighttorch: { 
    type: 'tap', 
    color: '#FFFF00', 
    icon: '🔦',
    phrase: "I'll keep you safe in the dark!",
    particleColor: '#FFFF00'
  },

  // CONSTRUCTION MISSION (4 helpers)
  melodymug: { 
    type: 'stir', 
    color: '#8B4513', 
    icon: '☕',
    phrase: "Sip and sing!",
    particleColor: '#8B4513'
  },
  rhythmoradio: { 
    type: 'tap', 
    color: '#FF6347', 
    icon: '📻',
    phrase: "Shake off the tiredness!",
    particleColor: '#FF6347'
  },
  hammerhero: { 
    type: 'swing', 
    color: '#C0C0C0', 
    icon: '🔨',
    phrase: "Strong and steady!",
    particleColor: '#C0C0C0'
  },
  sunnyspark: { 
    type: 'tap', 
    color: '#FFA500', 
    icon: '🌞',
    phrase: "A boost of sunshine for you!",
    particleColor: '#FFA500'
  },

  // MOM MISSION (4 helpers)
  chefchintu: { 
    type: 'stir', 
    color: '#FF69B4', 
    icon: '🍲',
    phrase: "I'll help stir things up!",
    particleColor: '#FF69B4'
  },
  bubblybottle: { 
    type: 'pour', 
    color: '#00FF7F', 
    icon: '🥤',
    phrase: "Here's some energy for you!",
    particleColor: '#00FF7F'
  },
  gigglesspoon: { 
    type: 'stir', 
    color: '#FFD700', 
    icon: '🥄',
    phrase: "Let's make cooking fun!",
    particleColor: '#FFD700'
  },
  peacemittens: { 
    type: 'hug', 
    color: '#98FB98', 
    icon: '🧤',
    phrase: "Stay cool, you're amazing!",
    particleColor: '#98FB98'
  },

  // SIBLINGS MISSION (4 helpers)
  gigglebox: { 
    type: 'tap', 
    color: '#FF1493', 
    icon: '📦',
    phrase: "Let's play together!",
    particleColor: '#FF1493'
  },
  peaceballoon: { 
    type: 'tap', 
    color: '#87CEFA', 
    icon: '🎈',
    phrase: "Float away the anger!",
    particleColor: '#87CEFA'
  },
  huggypillow: { 
    type: 'hug', 
    color: '#DEB887', 
    icon: '🛋️',
    phrase: "One big hug time!",
    particleColor: '#DEB887'
  },
  sharebear: { 
    type: 'hug', 
    color: '#CD853F', 
    icon: '🧸',
    phrase: "Sharing is caring!",
    particleColor: '#CD853F'
  },

  // PARK MISSION (4 helpers)
  leafyfriend: { 
    type: 'tap', 
    color: '#228B22', 
    icon: '🍀',
    phrase: "Keep nature smiling!",
    particleColor: '#228B22'
  },
  cleaniebucket: { 
    type: 'pour', 
    color: '#4169E1', 
    icon: '🪣',
    phrase: "Let's clean up together!",
    particleColor: '#4169E1'
  },
  bloomyflower: { 
    type: 'tap', 
    color: '#FF69B4', 
    icon: '🌸',
    phrase: "I love a tidy garden!",
    particleColor: '#FF69B4'
  },
  sparklestar: { 
    type: 'tap', 
    color: '#FFD700', 
    icon: '✨',
    phrase: "Shine bright when you help!",
    particleColor: '#FFD700'
  }
};
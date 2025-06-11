// games.config.js - Centralized game configurations
export const GAME_CONFIGS = {
  memory: {
    default: {
      gridSize: '4x4',
      timeLimit: 120,
      cardFlipSpeed: 300
    },
    byZone: {
      'symbol-mountain': {
        cards: ['om', 'ganesha', 'lotus', 'trishul'],
        theme: 'spiritual',
        difficulty: 'medium'
      },
      'ocean-depths': {
        cards: ['fish', 'coral', 'seaweed', 'shell'],
        theme: 'underwater',
        difficulty: 'easy'
      }
    }
  },
  
  tracing: {
    default: {
      strokeWidth: 5,
      helpLinesEnabled: true,
      soundEnabled: true
    },
    byZone: {
      'symbol-mountain': {
        symbols: ['ॐ', 'श्री', '卐'],
        guideColor: '#FFD700'
      },
      'rainbow-valley': {
        symbols: ['🌈', '☀️', '🌙'],
        guideColor: '#FF69B4'
      }
    }
  },
  
  quiz: {
    default: {
      questionsPerRound: 10,
      timePerQuestion: 30,
      hintsEnabled: true
    },
    byZone: {
      'sky-kingdom': {
        topic: 'weather',
        difficulty: 'medium'
      },
      'forest-haven': {
        topic: 'animals',
        difficulty: 'easy'
      }
    }
  }
};
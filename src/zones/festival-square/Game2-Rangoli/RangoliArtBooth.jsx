import React, { useState, useEffect, useRef } from 'react';
import './RangoliArtBooth.css';

import FestivalSquareCompletion from '../components/FestivalSquareCompletion';
// Create a placeholder for art badge - replace with actual image later
const artBadge = './assets/images/art-badge.png';

// Game phases for progression
const PHASES = {
  PATTERN_SELECTION: 'pattern_selection',
  COLOR_DISCOVERY: 'color_discovery', 
  CREATIVE_ART: 'creative_art',
  COMPLETE: 'complete'
};

// Pattern configurations
const PATTERNS = [
  {
    id: 'lotus-garden',
    name: 'Lotus Garden',
    description: 'Beautiful flower design',
    color: '#FF69B4'
  },
  {
    id: 'peacock-paradise',
    name: 'Peacock Paradise', 
    description: 'Graceful bird pattern',
    color: '#4169E1'
  },
  {
    id: 'festival-lights',
    name: 'Festival Lights',
    description: 'Sparkling celebration',
    color: '#FFD700'
  }
];

// Color palette for art creation
const COLORS = [
  { id: 'red', name: 'Crimson Red', hex: '#DC143C' },
  { id: 'yellow', name: 'Golden Yellow', hex: '#FFD700' },
  { id: 'orange', name: 'Bright Orange', hex: '#FF8C00' },
  { id: 'green', name: 'Forest Green', hex: '#32CD32' },
  { id: 'blue', name: 'Ocean Blue', hex: '#4169E1' },
  { id: 'purple', name: 'Royal Purple', hex: '#9370DB' }
];

const RangoliArtBooth = ({ onComplete, onNavigate }) => {
  // Game state
  const [gameState, setGameState] = useState({
    phase: PHASES.PATTERN_SELECTION,
    selectedPattern: null,
    selectedColor: null,
    discoveredColors: new Set(),
    filledSections: new Map(), // Changed to Map to store section -> color mapping
    totalTaps: 0,
    gameStartTime: Date.now(),
    stars: 0,
    completed: false,
    showDoneButton: false
  });

  // UI state
  const [showSparkle, setShowSparkle] = useState(null);
  const [ganeshaMessage, setGaneshaMessage] = useState('');
  const [showGaneshaMessage, setShowGaneshaMessage] = useState(false);
  const [showCompletionBadge, setShowCompletionBadge] = useState(false);
  const [showSceneCompletion, setShowSceneCompletion] = useState(false);

  const [svgContent, setSvgContent] = useState(null);


  // Audio context for Web Audio API
  const audioContextRef = useRef(null);
  const timeoutsRef = useRef([]);

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    };

    initAudio();

    // Cleanup timeouts on unmount
    return () => {
      timeoutsRef.current.forEach(id => clearTimeout(id));
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Safe timeout function
  const safeSetTimeout = (callback, delay) => {
    const id = setTimeout(callback, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  // Generate color selection sound
  const playColorSound = (color) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Different frequencies for different colors
    const frequencies = {
      red: 220,
      yellow: 330,
      orange: 275,
      green: 440,
      blue: 550,
      purple: 660
    };
    
    osc.frequency.setValueAtTime(frequencies[color.id] || 440, now);
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    osc.start(now);
    osc.stop(now + 0.5);
  };

  // Generate fill sound
  const playFillSound = () => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Create a pleasant "fill" sound
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    
    osc1.frequency.setValueAtTime(880, now);
    osc2.frequency.setValueAtTime(1320, now);
    osc1.type = 'sine';
    osc2.type = 'triangle';
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.8);
    osc2.stop(now + 0.8);
  };

  // Handle pattern selection
  const handlePatternSelect = (pattern) => {
    console.log(`Selected pattern: ${pattern.name}`);
    
    setGameState(prev => ({
      ...prev,
      selectedPattern: pattern,
      phase: PHASES.COLOR_DISCOVERY
    }));

    setGaneshaMessage(`Beautiful choice! Now pick your favorite colors to paint with!`);
    setShowGaneshaMessage(true);
    
    safeSetTimeout(() => setShowGaneshaMessage(false), 3000);
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    console.log(`Selected color: ${color.name}`);
    
    playColorSound(color);
    
    const newDiscovered = new Set(gameState.discoveredColors);
    newDiscovered.add(color.id);
    
    setGameState(prev => ({
      ...prev,
      selectedColor: color,
      discoveredColors: newDiscovered,
      phase: PHASES.CREATIVE_ART
    }));

    // First color discovery message
    if (!gameState.discoveredColors.has(color.id)) {
      setGaneshaMessage(`What a gorgeous ${color.name}! Start painting your beautiful art!`);
      setShowGaneshaMessage(true);
      safeSetTimeout(() => setShowGaneshaMessage(false), 2500);
    }
  };

  // Handle manual completion (unchanged)
  const handleManualCompletion = () => {
    console.log('Manual completion triggered');
    
    setGameState(prev => ({
      ...prev,
      phase: PHASES.COMPLETE,
      completed: true,
      stars: Math.max(6, prev.stars)
    }));

    // Show completion badge briefly, then show Festival completion
    setShowCompletionBadge(true);
    setGaneshaMessage("You created beautiful art! You're now a Sacred Artist!");
    setShowGaneshaMessage(true);

    safeSetTimeout(() => {
      setShowCompletionBadge(false);
      setShowGaneshaMessage(false);
      setShowSceneCompletion(true);
    }, 3000);
  };

  // Welcome message on mount
  useEffect(() => {
    safeSetTimeout(() => {
      setGaneshaMessage("Welcome to the magical art studio! Choose a beautiful pattern to color!");
      setShowGaneshaMessage(true);
      
      safeSetTimeout(() => setShowGaneshaMessage(false), 4000);
    }, 1000);
  }, []);

  // Render the selected pattern SVG
  const renderPatternSVG = () => {
    if (!gameState.selectedPattern) return null;

    const patternId = gameState.selectedPattern.id;
    
    // Create SVG based on pattern selection
    if (patternId === 'lotus-garden') {
      return (
        <svg viewBox="0 0 400 400" className="rangoli-pattern" id="lotus-garden-pattern">
          <defs>
            <pattern id="marble-texture" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <rect width="50" height="50" fill="#F5F5DC" opacity="0.3"/>
              <circle cx="25" cy="25" r="2" fill="#E6E6E6" opacity="0.5"/>
            </pattern>
          </defs>
          
          <rect width="400" height="400" fill="url(#marble-texture)"/>
          
          {/* Corner decorations */}
          <circle cx="50" cy="50" r="6" fill="#FFD700" opacity="0.6"/>
          <circle cx="350" cy="50" r="6" fill="#FFD700" opacity="0.6"/>
          <circle cx="50" cy="350" r="6" fill="#FFD700" opacity="0.6"/>
          <circle cx="350" cy="350" r="6" fill="#FFD700" opacity="0.6"/>
          
          {/* Fillable sections */}
          <circle 
            id="lotus-center" 
            cx="200" cy="200" r="25" 
            className="fillable-section"
            fill={gameState.filledSections.get('lotus-center') || 
                  (previewSection?.id === 'lotus-center' ? previewSection.color : 'none')}
            onClick={() => handleSectionFill('lotus-center')}
            onMouseEnter={() => handleSectionPreview('lotus-center', true)}
            onMouseLeave={() => handleSectionPreview('lotus-center', false)}
          />
          
          <path 
            id="petal-top" 
            d="M200,175 Q185,155 200,135 Q215,155 200,175 Z"
            className="fillable-section"
            fill={gameState.filledSections.get('petal-top') || 
                  (previewSection?.id === 'petal-top' ? previewSection.color : 'none')}
            onClick={() => handleSectionFill('petal-top')}
            onMouseEnter={() => handleSectionPreview('petal-top', true)}
            onMouseLeave={() => handleSectionPreview('petal-top', false)}
          />
          
          <path 
            id="petal-right" 
            d="M225,200 Q245,185 265,200 Q245,215 225,200 Z"
            className="fillable-section"
            fill={gameState.filledSections.get('petal-right') || 
                  (previewSection?.id === 'petal-right' ? previewSection.color : 'none')}
            onClick={() => handleSectionFill('petal-right')}
            onMouseEnter={() => handleSectionPreview('petal-right', true)}
            onMouseLeave={() => handleSectionPreview('petal-right', false)}
          />
          
          <path 
            id="petal-bottom" 
            d="M200,225 Q215,245 200,265 Q185,245 200,225 Z"
            className="fillable-section"
            fill={gameState.filledSections.get('petal-bottom') || 
                  (previewSection?.id === 'petal-bottom' ? previewSection.color : 'none')}
            onClick={() => handleSectionFill('petal-bottom')}
            onMouseEnter={() => handleSectionPreview('petal-bottom', true)}
            onMouseLeave={() => handleSectionPreview('petal-bottom', false)}
          />
          
          <path 
            id="petal-left" 
            d="M175,200 Q155,215 135,200 Q155,185 175,200 Z"
            className="fillable-section"
            fill={gameState.filledSections.get('petal-left') || 
                  (previewSection?.id === 'petal-left' ? previewSection.color : 'none')}
            onClick={() => handleSectionFill('petal-left')}
            onMouseEnter={() => handleSectionPreview('petal-left', true)}
            onMouseLeave={() => handleSectionPreview('petal-left', false)}
          />
          
          <path 
            id="diamond-ring-top" 
            d="M200,120 L230,150 L200,180 L170,150 Z"
            className="fillable-section"
            fill={gameState.filledSections.get('diamond-ring-top') || 
                  (previewSection?.id === 'diamond-ring-top' ? previewSection.color : 'none')}
            onClick={() => handleSectionFill('diamond-ring-top')}
            onMouseEnter={() => handleSectionPreview('diamond-ring-top', true)}
            onMouseLeave={() => handleSectionPreview('diamond-ring-top', false)}
          />
          
          <path 
            id="diamond-ring-bottom" 
            d="M200,220 L170,250 L200,280 L230,250 Z"
            className="fillable-section"
            fill={gameState.filledSections.get('diamond-ring-bottom') || 
                  (previewSection?.id === 'diamond-ring-bottom' ? previewSection.color : 'none')}
            onClick={() => handleSectionFill('diamond-ring-bottom')}
            onMouseEnter={() => handleSectionPreview('diamond-ring-bottom', true)}
            onMouseLeave={() => handleSectionPreview('diamond-ring-bottom', false)}
          />
          
          <path 
            id="outer-border" 
            d="M100,100 Q150,80 200,100 Q250,80 300,100 Q320,150 300,200 Q320,250 300,300 Q250,320 200,300 Q150,320 100,300 Q80,250 100,200 Q80,150 100,100 Z"
            className="fillable-section"
            fill={gameState.filledSections.get('outer-border') || 
                  (previewSection?.id === 'outer-border' ? previewSection.color : 'none')}
            onClick={() => handleSectionFill('outer-border')}
            onMouseEnter={() => handleSectionPreview('outer-border', true)}
            onMouseLeave={() => handleSectionPreview('outer-border', false)}
          />
          
          {/* Guide lines */}
          <line x1="200" y1="0" x2="200" y2="400" stroke="#D2B48C" strokeWidth="1" opacity="0.3"/>
          <line x1="0" y1="200" x2="400" y2="200" stroke="#D2B48C" strokeWidth="1" opacity="0.3"/>
        </svg>
      );
    } else if (patternId === 'peacock-paradise') {
      return (
        <svg viewBox="0 0 400 400" className="rangoli-pattern" id="peacock-paradise-pattern">
          <rect width="400" height="400" fill="url(#marble-texture)"/>
          
          <circle cx="60" cy="60" r="8" fill="#FF69B4" opacity="0.4"/>
          <circle cx="340" cy="60" r="8" fill="#FF69B4" opacity="0.4"/>
          <circle cx="60" cy="340" r="8" fill="#FF69B4" opacity="0.4"/>
          <circle cx="340" cy="340" r="8" fill="#FF69B4" opacity="0.4"/>
          
          <ellipse 
            id="peacock-body" 
            cx="200" cy="250" rx="30" ry="45"
            className="fillable-section"
            fill={gameState.filledSections.has('peacock-body') ? 
                   gameState.selectedColor?.hex : 
                   (previewSection?.id === 'peacock-body' ? previewSection.color : 'none')}
            onClick={() => handleSectionFill('peacock-body')}
            onMouseEnter={() => handleSectionPreview('peacock-body', true)}
            onMouseLeave={() => handleSectionPreview('peacock-body', false)}
          />
          
          {/* Add more peacock sections similarly... */}
        </svg>
      );
    } else if (patternId === 'festival-lights') {
      return (
        <svg viewBox="0 0 400 400" className="rangoli-pattern" id="festival-lights-pattern">
          <rect width="400" height="400" fill="url(#marble-texture)"/>
          
          {/* Corner stars */}
          <polygon points="60,50 65,65 80,65 68,75 73,90 60,82 47,90 52,75 40,65 55,65" 
                   fill="#FFD700" opacity="0.5"/>
          
          <ellipse 
            id="central-diya" 
            cx="200" cy="200" rx="35" ry="25"
            className="fillable-section"
            fill={gameState.filledSections.has('central-diya') ? 
                   gameState.selectedColor?.hex : 
                   (previewSection?.id === 'central-diya' ? previewSection.color : 'none')}
            onClick={() => handleSectionFill('central-diya')}
            onMouseEnter={() => handleSectionPreview('central-diya', true)}
            onMouseLeave={() => handleSectionPreview('central-diya', false)}
          />
          
          {/* Add more festival sections similarly... */}
        </svg>
      );
    }

    return null;
  };

  return (
    <div className="rangoli-art-container">
      {/* Background */}
      <div className="art-background" />
      
      {/* Ganesha Character */}
      <div className="ganesha-character">
        <div className="ganesha-image" />
        {showGaneshaMessage && (
          <div className="ganesha-speech-bubble">
            {ganeshaMessage}
          </div>
        )}
      </div>

      {/* Pattern Selection */}
      {gameState.phase === PHASES.PATTERN_SELECTION && (
        <div className="pattern-selection">
          {PATTERNS.map(pattern => (
            <div 
              key={pattern.id}
              className="pattern-option"
              onClick={() => handlePatternSelect(pattern)}
            >
              <div 
                className={`pattern-preview pattern-${pattern.id}`}
                style={{ background: pattern.color }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Art Canvas - Using the working pattern from Ganesha examples */}
      {gameState.phase !== PHASES.PATTERN_SELECTION && svgContent && (
        <div className="art-canvas">
          <div 
            ref={svgCanvasRef}
            className="rangoli-pattern"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
          
          {/* Sparkle Effects */}
          {showSparkle && (
            <div className="section-sparkles">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="sparkle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Color Pots */}
      {gameState.phase !== PHASES.PATTERN_SELECTION && (
        <div className="color-pots-container">
          {COLORS.map(color => (
            <div
              key={color.id}
              className={`color-pot pot-${color.id} ${
                gameState.selectedColor?.id === color.id ? 'selected' : ''
              } ${gameState.discoveredColors.has(color.id) ? 'discovered' : ''}`}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </div>
      )}

      {/* Magic Brush */}
      <div className={`magic-brush ${gameState.selectedColor ? 'active' : ''}`}>
        <div className="brush-handle" />
        <div className="brush-ferrule" />
        <div className="brush-bristles" />
        
        {gameState.selectedColor && (
          <div 
            className="color-preview active"
            style={{ 
              backgroundColor: gameState.selectedColor.hex,
              color: gameState.selectedColor.hex 
            }}
          />
        )}
        
        <div className="brush-sparkles">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Counter */}
      <div className="progress-counter">
        <div className="stars">⭐ {gameState.stars}</div>
        <div className="sections">🎨 {gameState.filledSections.size}</div>
        <div className="colors">🌈 {gameState.discoveredColors.size}/6</div>
      </div>

      {/* I'm Done Creating Button */}
      {gameState.showDoneButton && !gameState.completed && (
        <div className="done-creating-button" onClick={handleManualCompletion}>
          <span>🎨</span>
          <span>I'm Done Creating!</span>
        </div>
      )}

      {/* Completion Badge */}
      {showCompletionBadge && (
        <div className="completion-badge">
          <div className="badge-content">
            <div className="art-badge-icon" />
            <div className="badge-title">Sacred Artist!</div>
            <div className="badge-stars">
              {Array.from({ length: gameState.stars }).map((_, i) => (
                <span key={i} className="star">⭐</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gentle Celebration Effects */}
      {showSparkle === 'gentle-celebration' && (
        <div className="gentle-celebration-effects">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="celebration-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)].hex
              }}
            />
          ))}
        </div>
      )}

      {/* Festival Square Completion */}
      {showSceneCompletion && (
        <FestivalSquareCompletion
          show={showSceneCompletion}
          sceneName="Rangoli Artistry"
          sceneNumber={2}
          totalScenes={4}
          starsEarned={gameState.stars}
          totalStars={8}
          discoveredBadges={['artist']}
          badgeImages={{
            artist: artBadge
          }}
          nextSceneName="Dance Performance"
          childName="little artist"
          onContinue={() => {
            console.log('Continue to next festival activity');
            if (onComplete) {
              onComplete({
                stars: gameState.stars,
                completed: true,
                badges: ['artist']
              });
            }
          }}
          onReplay={() => {
            // Reset game state
            setGameState({
              phase: PHASES.PATTERN_SELECTION,
              selectedPattern: null,
              selectedColor: null,
              discoveredColors: new Set(),
              filledSections: new Map(), // Reset to empty Map
              totalTaps: 0,
              gameStartTime: Date.now(),
              stars: 0,
              completed: false,
              showDoneButton: false
            });
            setShowSceneCompletion(false);
            setPreviewSection(null);
          }}
          onHome={() => {
            if (onNavigate) {
              onNavigate('home');
            }
          }}
        />
      )}
    </div>
  );
};

export default RangoliArtBooth;
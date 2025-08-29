// SimpleTraceMaze.jsx - Pure Path Tracing (FIXED VERSION)
import React, { useState, useRef } from 'react';
import './SimpleTraceMaze.css';

// Import your segment images as background
import trunkGuideImg from '../assets/images/trunk-guide.png';
import pathSegment1 from '../assets/images/path-segment-1.png';
import pathSegment2 from '../assets/images/path-segment-2.png';
import pathSegment3 from '../assets/images/path-segment-3.png';
import pathSegment4 from '../assets/images/path-segment-4.png';
import pathSegment5 from '../assets/images/path-segment-5.png';

const SEGMENT_IMAGES = {
  segment1: pathSegment1,
  segment2: pathSegment2,
  segment3: pathSegment3,
  segment4: pathSegment4,
  segment5: pathSegment5,
  trunkGuide: trunkGuideImg
};

const SimpleTraceMaze = () => {
  const [gameState, setGameState] = useState({
    mazeStarted: false,
    isTracing: false,
    tracedPoints: [],
    traceProgress: 0,
    mazeCompleted: false,
    trunkPosition: { x: 50, y: 100 }
  });

  const [messages, setMessages] = useState([]);
  const [showEffect, setShowEffect] = useState(null);
  const timeoutsRef = useRef([]);

  // Complex trunk-like maze path (like the reference image)
  const trunkPath = "M 80 60 Q 120 30 160 70 Q 200 110 150 150 Q 100 180 160 200 Q 220 220 280 180 Q 340 140 300 100 Q 320 60 380 90 Q 440 120 410 160 Q 380 200 440 190 Q 500 180 530 140 Q 560 100 520 80 Q 580 70 620 110";

  const addMessage = (message) => {
    console.log(`🐘 ${message}`);
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`].slice(-3));
  };

  const safeSetTimeout = (callback, delay) => {
    const id = setTimeout(callback, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  // Get coordinates from mouse/touch
  const getCoordinates = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    
    let clientX, clientY;
    if (event.touches && event.touches[0]) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // Check if near the complex trunk path (DEBUG VERSION)
  const isNearTrunkPath = (x, y) => {
    const tolerance = 50;
    
    // Calculate distance to red dot FIRST
    const distanceToEnd = Math.sqrt((x - 620) * (x - 620) + (y - 110) * (y - 110));
    
    // ALWAYS LOG: Show exactly what coordinates we're detecting
    console.log(`🔍 TOUCH DETECTED: x=${x.toFixed(0)}, y=${y.toFixed(0)}, distance to red dot=${distanceToEnd.toFixed(0)}px`);
    
    // PRIORITY CHECK: Red dot area gets 100% completion immediately  
    if (distanceToEnd < 120) { // INCREASED to 120px - very generous!
      console.log(`🏆 RED DOT REACHED! Distance: ${distanceToEnd.toFixed(0)}px - FORCING 100%!`);
      return { isNear: true, progress: 100, area: 7 };
    }
    
    // Check if we're in the visual red dot area (even if SVG coordinates are off)
    if (x > 580 && x < 660 && y > 70 && y < 150) {
      console.log(`🎯 VISUAL RED DOT AREA! x=${x.toFixed(0)}, y=${y.toFixed(0)} - FORCING 100%!`);
      return { isNear: true, progress: 100, area: 7 };
    }
    
    // Zone definitions
    const pathZones = [
      { x1: 50, x2: 180, y1: 20, y2: 140, progress: 0 },    // Start area (0-15%)
      { x1: 120, x2: 250, y1: 30, y2: 160, progress: 15 },  // Early curves (15-30%) 
      { x1: 180, x2: 320, y1: 90, y2: 220, progress: 30 },  // Loop section (30-45%)
      { x1: 250, x2: 420, y1: 60, y2: 200, progress: 45 },  // Middle section (45-60%)
      { x1: 320, x2: 520, y1: 40, y2: 180, progress: 60 },  // Upper section (60-75%)
      { x1: 450, x2: 600, y1: 50, y2: 170, progress: 75 },  // Right section (75-90%)
      { x1: 550, x2: 680, y1: 40, y2: 150, progress: 90 }   // FINAL ZONE (90-100%)
    ];
    
    // Check zones from END to START (prioritize later zones)
    for (let i = pathZones.length - 1; i >= 0; i--) {
      const zone = pathZones[i];
      if (x >= zone.x1 - tolerance && x <= zone.x2 + tolerance && 
          y >= zone.y1 - tolerance && y <= zone.y2 + tolerance) {
        
        // Calculate progress within zone
        const zoneWidth = zone.x2 - zone.x1;
        const positionInZone = Math.max(0, Math.min(zoneWidth, x - zone.x1));
        const zoneProgressPercent = (positionInZone / zoneWidth) * 15; // 15% per zone
        let totalProgress = zone.progress + zoneProgressPercent;
        
        // SPECIAL: If in final zones, be more generous
        if (i >= 5 && x > 500) { // Zone 6 or 7 and past x=500
          totalProgress = Math.max(90, totalProgress); // Minimum 90% in final areas
        }
        if (i === 6 && x > 550) { // Zone 7 and past x=550
          totalProgress = Math.max(95, totalProgress); // Minimum 95% in final area
        }
        
        totalProgress = Math.min(100, totalProgress);
        
        console.log(`🎯 Zone ${i+1}: x=${x.toFixed(0)}, y=${y.toFixed(0)}, progress=${totalProgress.toFixed(1)}%, distance=${distanceToEnd.toFixed(0)}px`);
        
        return { 
          isNear: true, 
          progress: totalProgress,
          area: i + 1
        };
      }
    }
    
    console.log(`❌ Off path: x=${x.toFixed(0)}, y=${y.toFixed(0)}, distance to end=${distanceToEnd.toFixed(0)}px`);
    return { isNear: false, progress: 0, area: 0 };
  };

  // Start maze
  const handleStartMaze = () => {
    if (gameState.mazeStarted) return;
    
    addMessage("🐘 Starting trunk path maze!");
    
    setGameState(prev => ({
      ...prev,
      mazeStarted: true
    }));

    setShowEffect('maze-start');
    safeSetTimeout(() => setShowEffect(null), 1000);
  };

  // Start tracing
  const handleTraceStart = (event) => {
    if (!gameState.mazeStarted || gameState.mazeCompleted) return;
    
    const coords = getCoordinates(event);
    const pathCheck = isNearTrunkPath(coords.x, coords.y);
    
    addMessage(`Trace started at (${Math.round(coords.x)}, ${Math.round(coords.y)})`);
    
    if (!pathCheck.isNear) {
      addMessage("❌ Start tracing from the beginning of the trunk path!");
      setShowEffect('start-error');
      safeSetTimeout(() => setShowEffect(null), 1500);
      return;
    }
    
    addMessage("✅ Started tracing Ganesha's trunk path!");
    
    setGameState(prev => ({
      ...prev,
      isTracing: true,
      tracedPoints: [{ x: coords.x, y: coords.y, progress: pathCheck.progress }],
      traceProgress: pathCheck.progress,
      trunkPosition: { x: coords.x, y: coords.y }
    }));

    setShowEffect('trace-start');
    safeSetTimeout(() => setShowEffect(null), 800);
  };

  // Continue tracing
  const handleTraceMove = (event) => {
    if (!gameState.isTracing) return;
    
    const coords = getCoordinates(event);
    const pathCheck = isNearTrunkPath(coords.x, coords.y);
    
    const newPoint = {
      x: coords.x,
      y: coords.y,
      progress: pathCheck.progress,
      onPath: pathCheck.isNear
    };
    
    const newTracedPoints = [...gameState.tracedPoints, newPoint];
    const maxProgress = Math.max(gameState.traceProgress, pathCheck.progress);
    
    // Enhanced debugging
    if (pathCheck.isNear) {
      console.log(`✅ ON PATH: Progress ${maxProgress.toFixed(1)}% (was ${gameState.traceProgress.toFixed(1)}%)`);
    } else {
      console.log(`❌ OFF PATH: x=${coords.x.toFixed(0)}, y=${coords.y.toFixed(0)}`);
    }
    
    setGameState(prev => ({
      ...prev,
      tracedPoints: newTracedPoints,
      traceProgress: maxProgress,
      trunkPosition: { x: coords.x, y: coords.y }
    }));

    // Show sparkles for good tracing
    if (pathCheck.isNear && Math.random() > 0.8) {
      setShowEffect(`sparkle-${Date.now()}`);
      safeSetTimeout(() => setShowEffect(null), 400);
    }

    // Check for completion (more generous threshold)
    if (maxProgress >= 95) {
      console.log(`🏆 COMPLETION TRIGGERED! Progress: ${maxProgress}%`);
      completeMaze();
    }
  };

  // End tracing
  const handleTraceEnd = () => {
    if (!gameState.isTracing) return;
    
    addMessage(`Trace ended. Progress: ${Math.round(gameState.traceProgress)}%`);
    
    setGameState(prev => ({
      ...prev,
      isTracing: false
    }));

    if (gameState.traceProgress < 80) {
      addMessage("🐘 Keep following the trunk path to the end!");
      setShowEffect('encourage-more');
      safeSetTimeout(() => setShowEffect(null), 2000);
    }
  };

  // Complete maze
  const completeMaze = () => {
    if (gameState.mazeCompleted) return;
    
    addMessage("🏆 Mooshak reached Ganesha! Vakratunda wisdom unlocked!");
    
    setGameState(prev => ({
      ...prev,
      mazeCompleted: true,
      isTracing: false,
      traceProgress: 100
    }));

    setShowEffect('maze-complete');
    safeSetTimeout(() => setShowEffect(null), 4000);
  };

  // Reset maze
  const resetMaze = () => {
    addMessage("🔄 Resetting trunk path maze...");
    timeoutsRef.current.forEach(id => clearTimeout(id));
    timeoutsRef.current = [];
    
    setGameState({
      mazeStarted: false,
      isTracing: false,
      tracedPoints: [],
      traceProgress: 0,
      mazeCompleted: false,
      trunkPosition: { x: 50, y: 100 }
    });
    
    setShowEffect(null);
    setMessages([]);
  };

  // TEST FUNCTION: Force test red dot detection
  const testRedDot = () => {
    console.log('🧪 Testing red dot detection...');
    const testResult = isNearTrunkPath(620, 110);
    console.log('Red dot test result:', testResult);
    if (testResult.progress === 100) {
      addMessage("🏆 Red dot test successful - completing maze!");
      completeMaze();
    } else {
      addMessage(`❌ Red dot test failed - only got ${testResult.progress}% progress`);
    }
  };

  // Render background segments
  const renderBackgroundSegments = () => {
    const segmentImages = [
      { img: SEGMENT_IMAGES.segment1, style: { top: '20px', left: '80px', width: '120px', height: '60px' } },
      { img: SEGMENT_IMAGES.segment2, style: { top: '50px', left: '200px', width: '80px', height: '80px' } },
      { img: SEGMENT_IMAGES.segment3, style: { top: '40px', left: '300px', width: '100px', height: '60px' } },
      { img: SEGMENT_IMAGES.segment4, style: { top: '70px', left: '420px', width: '80px', height: '70px' } },
      { img: SEGMENT_IMAGES.segment5, style: { top: '60px', left: '520px', width: '100px', height: '60px' } }
    ];

    return segmentImages.map((segment, index) => (
      <div
        key={index}
        className="background-segment"
        style={segment.style}
      >
        <img src={segment.img} alt={`Segment ${index + 1}`} />
      </div>
    ));
  };

  // Render traced path
  const renderTracedPath = () => {
    if (gameState.tracedPoints.length < 2) return null;
    
    const pathPoints = gameState.tracedPoints
      .map(point => `${point.x},${point.y}`)
      .join(' ');
    
    return (
      <svg className="traced-path-svg">
        <polyline
          points={pathPoints}
          stroke={gameState.mazeCompleted ? "#00ff00" : "#ffd700"}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
          filter="drop-shadow(0 0 6px rgba(255, 215, 0, 0.8))"
        />
      </svg>
    );
  };

  return (
    <div className="simple-trace-maze-container">
      <h2>🐘 Ganesha's Trunk Path</h2>
      
      {/* Controls */}
      <div className="controls">
        <button onClick={resetMaze}>🔄 Reset</button>
        <button onClick={testRedDot} style={{background: 'linear-gradient(45deg, #ff9800, #f57c00)'}}>
          🧪 Test Red Dot
        </button>
        <div className="status">
          <span>Started: {gameState.mazeStarted ? '✅' : '🎯'}</span>
          <span>Tracing: {gameState.isTracing ? '✋' : '🐘'}</span>
          <span>Progress: {Math.round(gameState.traceProgress)}%</span>
          <span>Complete: {gameState.mazeCompleted ? '🏆' : '⏳'}</span>
        </div>
      </div>

      {/* Instructions */}
      {!gameState.mazeStarted && (
        <div className="instructions">
          <p>🎯 <strong>Vakratunda - curved trunk, wise path!</strong></p>
          <p>Help Mooshak find the wise way to Ganesha's blessing!</p>
        </div>
      )}

      {gameState.mazeStarted && !gameState.mazeCompleted && (
        <div className="trace-instructions">
          <p>🐘 <strong>Follow the curved trunk path - lead Mooshak to wisdom!</strong></p>
        </div>
      )}

      {/* Maze Area */}
      <div className="simple-trace-area">
        
        {/* Start Button */}
        {!gameState.mazeStarted && (
          <div className="start-button" onClick={handleStartMaze}>
            <img src={SEGMENT_IMAGES.trunkGuide} alt="Start" />
            <div className="start-label">Click to Begin!</div>
          </div>
        )}

        {/* Background Segments */}
        {gameState.mazeStarted && renderBackgroundSegments()}

        {/* Tracing Area */}
        {gameState.mazeStarted && (
          <div
            className="trace-overlay"
            onMouseDown={handleTraceStart}
            onMouseMove={handleTraceMove}
            onMouseUp={handleTraceEnd}
            onTouchStart={handleTraceStart}
            onTouchMove={handleTraceMove}
            onTouchEnd={handleTraceEnd}
            style={{ touchAction: 'none' }}
          >
            {/* Path Guide */}
            <svg className="path-guide-svg" viewBox="0 0 700 250">
              {/* Cave crystals decoration */}
              <circle cx="100" cy="30" r="3" fill="#ffd700" opacity="0.6">
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="200" cy="25" r="2" fill="#ff8c42" opacity="0.5">
                <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="300" cy="35" r="4" fill="#ffd700" opacity="0.7">
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="450" cy="20" r="3" fill="#ff8c42" opacity="0.6">
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="580" cy="30" r="2" fill="#ffd700" opacity="0.5">
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.5s" repeatCount="indefinite" />
              </circle>
              
              {/* Main trunk path */}
              <path
                d={trunkPath}
                stroke="#ff8c42"
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="10,5"
                opacity="0.8"
                className="guide-path"
              />
              
              {/* Mooshak at start */}
              <g transform="translate(80, 60)">
                <circle cx="0" cy="0" r="8" fill="#8B4513" />
                <circle cx="-3" cy="-2" r="2" fill="#000" />
                <circle cx="3" cy="-2" r="2" fill="#000" />
                <circle cx="0" cy="2" r="1" fill="#000" />
                <ellipse cx="6" cy="0" rx="3" ry="1" fill="#FFB6C1" />
                <path d="M -8 2 Q -10 5 -6 6 Q -8 8 -4 6" stroke="#8B4513" strokeWidth="1" fill="none" />
                <text x="0" y="20" textAnchor="middle" fill="#ffd700" fontSize="8" fontWeight="bold">Mooshak</text>
              </g>
              
              {/* Ganesha glow at end */}
              <g transform="translate(620, 110)">
                <circle cx="0" cy="0" r="25" fill="url(#ganeshaGlow)" opacity="0.6">
                  <animate attributeName="r" values="20;30;20" dur="3s" repeatCount="indefinite" />
                </circle>
                <text x="0" y="5" textAnchor="middle" fill="#ffd700" fontSize="16">🐘</text>
                <text x="0" y="40" textAnchor="middle" fill="#ffd700" fontSize="8" fontWeight="bold">Ganesha</text>
              </g>
              
              {/* Start circle */}
              <circle cx="80" cy="60" r="12" fill="#00ff00" opacity="0.7">
                <animate attributeName="r" values="10;16;10" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="80" y="85" textAnchor="middle" fill="#00ff00" fontSize="10" fontWeight="bold">START</text>
              
              {/* End circle - MADE MORE VISIBLE */}
              <circle cx="620" cy="110" r="15" fill="#ff4444" opacity="0.9">
                <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="620" y="135" textAnchor="middle" fill="#ff4444" fontSize="12" fontWeight="bold">GOAL</text>
              
              {/* Gradient definitions */}
              <defs>
                <radialGradient id="ganeshaGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffd700" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#ff8c42" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.1" />
                </radialGradient>
              </defs>
            </svg>

            {/* Traced Path */}
            {renderTracedPath()}

            {/* Moving Trunk */}
            <div 
              className="moving-trunk-indicator"
              style={{
                left: `${gameState.trunkPosition.x}px`,
                top: `${gameState.trunkPosition.y}px`,
                opacity: gameState.isTracing ? 1 : 0
              }}
            >
              🐘
            </div>
          </div>
        )}

        {/* Effects */}
        {showEffect === 'start-error' && (
          <div className="effect-message error">
            ❌ Help Mooshak start from the green circle!
          </div>
        )}
        
        {showEffect === 'trace-start' && (
          <div className="effect-message success">
            ✅ Great! Mooshak is following the wise path!
          </div>
        )}
        
        {showEffect === 'encourage-more' && (
          <div className="effect-message encourage">
            🐘 Keep guiding Mooshak! {Math.round(gameState.traceProgress)}% to Ganesha!
          </div>
        )}
        
        {showEffect === 'maze-complete' && (
          <div className="effect-message complete">
            🏆 AMAZING! Mooshak found the wise way! Vakratunda blessing received! 🎉
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {gameState.mazeStarted && !gameState.mazeCompleted && (
        <div className="progress-container">
          <div className="progress-label">Mooshak's Journey to Wisdom: {Math.round(gameState.traceProgress)}%</div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${gameState.traceProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Completion Message */}
      {gameState.mazeCompleted && (
        <div className="completion-message">
          <h3>🏆 Vakratunda Wisdom Discovered!</h3>
          <p><strong>वक्रतुण्ड</strong> (Vakratunda) = Curved trunk, wise path</p>
          <p>Mooshak learned that wisdom comes from following the curved, patient path - not the straight, hurried one!</p>
        </div>
      )}

      {/* Debug */}
      <div className="debug-messages">
        <h4>🐛 Debug:</h4>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
    </div>
  );
};

export default SimpleTraceMaze;
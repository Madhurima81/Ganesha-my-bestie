import React, { useEffect, useRef, useState } from 'react';
import * as Matter from 'matter-js';

const BuildingBlocksChallenge = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  const [currentPair, setCurrentPair] = useState(0);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [showMeaning, setShowMeaning] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [blockPositions, setBlockPositions] = useState([]);
  const [score, setScore] = useState(0);
  const [highestBlockY, setHighestBlockY] = useState(0);
  const [gameRestarted, setGameRestarted] = useState(false);
  
  // Sanskrit word-meaning pairs from the Vakratunda Mantra
  const wordPairs = [
    { word: "Vakratunda", meaning: "Curved Trunk", color: "#FF9800" },
    { word: "Mahakaya", meaning: "Big Body", color: "#2196F3" },
    { word: "Suryakoti", meaning: "Million Suns", color: "#4CAF50" },
    { word: "Samaprabha", meaning: "Equal Radiance", color: "#9C27B0" },
    { word: "Nirvighnam", meaning: "Without Obstacles", color: "#FF5722" },
    { word: "Kuru", meaning: "Make", color: "#795548" },
    { word: "Me Deva", meaning: "For Me, Oh Lord", color: "#607D8B" },
    { word: "Sarva-Kaaryeshu", meaning: "All Works", color: "#FFC107" },
    { word: "Sarvada", meaning: "Always", color: "#E91E63" }
  ];

  // Physics engine setup
  useEffect(() => {
    // Initialize MatterJS engine
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Events = Matter.Events;
    const Runner = Matter.Runner;
    const Composite = Matter.Composite;
    
    engineRef.current = Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 } // Reduce gravity for gentler physics
    });
    
    const engine = engineRef.current;
    const world = engine.world;
    
    // Set up the renderer
    renderRef.current = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 400,
        height: 600,
        wireframes: false,
        background: '#f5f5f5',
        showAngleIndicator: false
      }
    });
    
    const render = renderRef.current;
    
    // Add the ground
    const ground = Bodies.rectangle(200, 590, 400, 20, {
      isStatic: true,
      render: {
        fillStyle: '#333'
      },
      label: 'ground'
    });
    
    // Add left and right walls
    const leftWall = Bodies.rectangle(10, 300, 20, 600, {
      isStatic: true,
      render: {
        fillStyle: '#333'
      },
      label: 'leftWall'
    });
    
    const rightWall = Bodies.rectangle(390, 300, 20, 600, {
      isStatic: true,
      render: {
        fillStyle: '#333'
      },
      label: 'rightWall'
    });
    
    // Add all bodies to the world
    World.add(world, [ground, leftWall, rightWall]);
    
    // Start the renderer and runner
    Render.run(render);
    runnerRef.current = Runner.create();
    Runner.run(runnerRef.current, engine);
    
    // Track collisions
    Events.on(engine, 'collisionStart', (event) => {
      // Just for demonstration - you can add sound effects or other feedback here
    });
    
    // Track the highest position of blocks for tower height
    Events.on(engine, 'afterUpdate', () => {
      const bodies = Composite.allBodies(world).filter(body => 
        body.label !== 'ground' && 
        body.label !== 'leftWall' && 
        body.label !== 'rightWall'
      );
      
      if (bodies.length > 0) {
        // Find the highest block (lowest y value)
        const minY = Math.min(...bodies.map(body => body.position.y - body.circleRadius));
        setHighestBlockY(minY);
      }
    });
    
    // Cleanup
    return () => {
      // Stop the runner and clear the world
      if (runnerRef.current) {
        Runner.stop(runnerRef.current);
      }
      
      if (renderRef.current) {
        Render.stop(renderRef.current);
        renderRef.current.canvas.remove();
      }
      
      Events.off(engine, 'collisionStart');
      Events.off(engine, 'afterUpdate');
      World.clear(world, false);
      Engine.clear(engine);
    };
  }, [gameRestarted]);

  // Function to add a new block
  const addBlock = (x, y) => {
    if (currentPair >= wordPairs.length) {
      setGameCompleted(true);
      return;
    }
    
    const Bodies = Matter.Bodies;
    const World = Matter.World;
    
    const currentWord = wordPairs[currentPair];
    const blockSize = 120; // Width of block
    const blockHeight = 40; // Height of block
    
    // Create a new block
    const block = Bodies.rectangle(x, y, blockSize, blockHeight, {
      restitution: 0.3, // Bouncy factor
      friction: 0.9,
      render: {
        fillStyle: currentWord.color,
        strokeStyle: '#333',
        lineWidth: 1
      },
      label: `block_${currentPair}`,
      isStatic: false
    });
    
    // Add the block to the world
    World.add(engineRef.current.world, block);
    
    // Track the block's position
    setBlockPositions(prev => [...prev, { 
      id: currentPair, 
      word: currentWord.word,
      meaning: currentWord.meaning,
      body: block
    }]);
    
    // Move to the next word pair
    setCurrentPair(currentPair + 1);
    setScore(score + 1);
    
    // Show meaning briefly
    setShowMeaning(true);
    setTimeout(() => {
      setShowMeaning(false);
    }, 2000);
  };

  // Handle mouse/touch events for dragging
  const handleMouseDown = (e) => {
    if (currentPair >= wordPairs.length || gameCompleted) return;
    
    // Get coordinates relative to the canvas
    const rect = sceneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDraggedBlock({ x, y });
  };

  const handleMouseMove = (e) => {
    if (!draggedBlock || currentPair >= wordPairs.length) return;
    
    // Update position
    const rect = sceneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDraggedBlock({ x, y });
  };

  const handleMouseUp = (e) => {
    if (!draggedBlock || currentPair >= wordPairs.length) return;
    
    // Add block at final position
    addBlock(draggedBlock.x, draggedBlock.y);
    setDraggedBlock(null);
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    if (currentPair >= wordPairs.length || gameCompleted) return;
    
    const touch = e.touches[0];
    const rect = sceneRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setDraggedBlock({ x, y });
  };

  const handleTouchMove = (e) => {
    if (!draggedBlock || currentPair >= wordPairs.length) return;
    
    const touch = e.touches[0];
    const rect = sceneRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setDraggedBlock({ x, y });
    e.preventDefault(); // Prevent scrolling while dragging
  };

  const handleTouchEnd = (e) => {
    if (!draggedBlock || currentPair >= wordPairs.length) return;
    
    // Add block at last known position
    addBlock(draggedBlock.x, draggedBlock.y);
    setDraggedBlock(null);
  };

  // Restart the game
  const handleRestart = () => {
    setCurrentPair(0);
    setScore(0);
    setHighestBlockY(0);
    setGameCompleted(false);
    setBlockPositions([]);
    setDraggedBlock(null);
    setShowMeaning(false);
    setGameRestarted(!gameRestarted); // Toggle to trigger useEffect
  };

  // Calculate tower height percentage
  const calculateHeightPercentage = () => {
    if (highestBlockY === 0) return 0;
    const totalHeight = 590; // Ground y-position
    const currentHeight = totalHeight - highestBlockY;
    return Math.min(Math.max(Math.round((currentHeight / 400) * 100), 0), 100);
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '15px'
      }}>
        <h2 style={{
          marginBottom: '10px',
          color: '#673AB7'
        }}>Building Blocks Challenge</h2>
        <p>Drag and drop blocks to build a tower. Learn the Vakratunda Mantra!</p>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px'
      }}>
        <div style={{
          backgroundColor: '#f0f0f0',
          padding: '8px 12px',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}>
          <span>Blocks: {score}/{wordPairs.length}</span>
        </div>
        <div style={{
          backgroundColor: '#f0f0f0',
          padding: '8px 12px',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}>
          <span>Tower Height: {calculateHeightPercentage()}%</span>
          <div style={{
            backgroundColor: '#e0e0e0',
            height: '10px',
            width: '100%',
            borderRadius: '5px',
            marginTop: '5px'
          }}>
            <div 
              style={{
                backgroundColor: '#4CAF50',
                height: '100%',
                borderRadius: '5px',
                transition: 'width 0.3s ease',
                width: `${calculateHeightPercentage()}%`
              }}
            ></div>
          </div>
        </div>
      </div>
      
      <div 
        style={{
          position: 'relative',
          width: '400px',
          height: '600px',
          margin: '0 auto',
          border: '2px solid #ccc',
          borderRadius: '8px',
          overflow: 'hidden',
          touchAction: 'none'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div style={{ width: '100%', height: '100%' }} ref={sceneRef}></div>
        
        {/* Current block preview */}
        {draggedBlock && currentPair < wordPairs.length && (
          <div 
            style={{
              position: 'absolute',
              left: `${draggedBlock.x - 60}px`,
              top: `${draggedBlock.y - 20}px`,
              backgroundColor: wordPairs[currentPair].color,
              width: '120px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '5px',
              border: '1px solid #333',
              pointerEvents: 'none',
              zIndex: 10,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
            }}
          >
            {wordPairs[currentPair].word}
          </div>
        )}
        
        {/* Block meaning tooltip */}
        {showMeaning && currentPair > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '8px 12px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 20,
            animation: 'fadeIn 0.3s ease'
          }}>
            <p><strong>{wordPairs[currentPair-1].word}</strong>: {wordPairs[currentPair-1].meaning}</p>
          </div>
        )}
        
        {/* Block labels */}
        {blockPositions.map((block, index) => {
          // Get the current position of the block from Matter.js
          if (!block.body.position) return null;
          
          return (
            <div 
              key={index}
              style={{
                position: 'absolute',
                left: `${block.body.position.x}px`,
                top: `${block.body.position.y}px`,
                width: '120px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                pointerEvents: 'none',
                transformOrigin: 'center',
                transform: `rotate(${block.body.angle}rad)`,
                textAlign: 'center',
                textShadow: '1px 1px 1px rgba(0, 0, 0, 0.5)',
                zIndex: 5
              }}
            >
              {block.word}
            </div>
          );
        })}
        
        {/* Next block hint */}
        {currentPair < wordPairs.length && !draggedBlock && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '8px 12px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
            zIndex: 5
          }}>
            <p>Next Word: <strong>{wordPairs[currentPair].word}</strong></p>
            <p>Drag to place on the tower</p>
          </div>
        )}
        
        {/* Game completion message */}
        {gameCompleted && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            textAlign: 'center',
            zIndex: 30,
            minWidth: '250px'
          }}>
            <h3>Great Job!</h3>
            <p>You've built the complete Vakratunda Mantra tower!</p>
            <button 
              style={{
                display: 'block',
                margin: '20px auto 0',
                padding: '10px 20px',
                backgroundColor: '#673AB7',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onClick={handleRestart}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      
      {/* Current word pair display */}
      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
      }}>
        {currentPair < wordPairs.length ? (
          <>
            <h3>Current Sanskrit Word:</h3>
            <p style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#673AB7',
              margin: '10px 0'
            }}>{wordPairs[currentPair].word}</p>
            <p style={{
              color: '#666',
              fontStyle: 'italic'
            }}>Drag and place it on the tower</p>
          </>
        ) : (
          <p>All blocks placed! 👏</p>
        )}
      </div>
      
      {/* Restart button */}
      <button 
        style={{
          display: 'block',
          margin: '20px auto 0',
          padding: '10px 20px',
          backgroundColor: '#673AB7',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
        onClick={handleRestart}
      >
        Restart Game
      </button>
      
      {/* Define some animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default BuildingBlocksChallenge;
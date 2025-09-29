import React, { useState } from 'react';

// Simplified coloring component with direct SVG rendering
const SimplestColoringTest = () => {
  // State for tracking colors of each part
  const [colors, setColors] = useState({
    'head': 'white',
    'body': 'white',
    'ear-left': 'white',
    'ear-right': 'white',
    'trunk': 'white',
    'eye-left': 'white',
    'eye-right': 'white'
  });
  
  // Currently selected color
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  
  // Color palette
  const colorPalette = [
    '#FF6B6B', // Red
    '#FFD93D', // Yellow
    '#6BCB77', // Green
    '#4D96FF', // Blue
    '#9D65C9', // Purple
    '#FF9A3C', // Orange
    '#FF5677', // Pink
    '#2BCDC1', // Teal
    '#F5EFE7', // Light Cream
    '#6E5773', // Purple Gray
  ];
  
  // Handle part click
  const handlePartClick = (part) => {
    console.log(`Coloring ${part} with ${selectedColor}`);
    setColors({
      ...colors,
      [part]: selectedColor
    });
  };
  
  // Reset all colors
  const resetColors = () => {
    setColors({
      'head': 'white',
      'body': 'white',
      'ear-left': 'white',
      'ear-right': 'white',
      'trunk': 'white',
      'eye-left': 'white',
      'eye-right': 'white'
    });
  };
  
  // Save artwork
  const saveArtwork = () => {
    // Create an SVG string
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <ellipse id="head" cx="150" cy="100" rx="70" ry="60" stroke="#333" stroke-width="2" fill="${colors['head']}" />
        <ellipse id="body" cx="150" cy="220" rx="80" ry="60" stroke="#333" stroke-width="2" fill="${colors['body']}" />
        <ellipse id="ear-left" cx="80" cy="100" rx="30" ry="40" stroke="#333" stroke-width="2" fill="${colors['ear-left']}" />
        <ellipse id="ear-right" cx="220" cy="100" rx="30" ry="40" stroke="#333" stroke-width="2" fill="${colors['ear-right']}" />
        <ellipse id="trunk" cx="150" cy="160" rx="20" ry="40" stroke="#333" stroke-width="2" fill="${colors['trunk']}" />
        <ellipse id="eye-left" cx="130" cy="90" rx="10" ry="15" stroke="#333" stroke-width="2" fill="${colors['eye-left']}" />
        <ellipse id="eye-right" cx="170" cy="90" rx="10" ry="15" stroke="#333" stroke-width="2" fill="${colors['eye-right']}" />
      </svg>
    `;
    
    // Create blob and download
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-ganesha-artwork.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '100%',
      padding: '1rem',
      backgroundColor: '#f8f4f0',
      borderRadius: '12px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ color: '#FF6347', marginBottom: '0.5rem', textAlign: 'center', fontSize: '1.5rem' }}>
        Color Lord Ganesha
      </h2>
      
      <p style={{ color: '#555', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Click on a color below, then click on a part of Ganesha to color it.
      </p>
      
      {/* Color palette */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '1rem', maxWidth: '300px' }}>
        {colorPalette.map(color => (
          <button
            key={color}
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: color,
              borderRadius: '50%',
              border: selectedColor === color ? '3px solid #333' : '2px solid #ddd',
              cursor: 'pointer',
              transform: selectedColor === color ? 'scale(1.2)' : 'scale(1)',
              transition: 'transform 0.2s, border-color 0.2s',
              boxShadow: selectedColor === color ? '0 0 8px rgba(0, 0, 0, 0.3)' : 'none'
            }}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>
      
      {/* Current color indicator */}
      <div style={{ marginBottom: '10px', fontSize: '14px' }}>
        Current color: <span style={{
          display: 'inline-block',
          width: '20px',
          height: '20px',
          backgroundColor: selectedColor,
          border: '1px solid #333',
          verticalAlign: 'middle',
          marginLeft: '5px'
        }}></span>
      </div>
      
      {/* SVG container */}
      <div style={{
        width: '100%',
        maxWidth: '320px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Directly render SVG here */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 300 300" 
          width="100%" 
          height="100%"
          style={{ touchAction: 'none' }}
        >
          {/* Key SVG styling to make parts clickable */}
          <defs>
            <style>
              {`
                ellipse {
                  pointer-events: all;
                  cursor: pointer;
                  stroke-width: 2px;
                  transition: fill 0.3s;
                }
              `}
            </style>
          </defs>
          
          {/* Ganesha Body Parts */}
          <ellipse 
            cx="150" cy="100" rx="70" ry="60" 
            stroke="#333" fill={colors['head']} 
            onClick={() => handlePartClick('head')}
          />
          <ellipse 
            cx="150" cy="220" rx="80" ry="60" 
            stroke="#333" fill={colors['body']} 
            onClick={() => handlePartClick('body')}
          />
          <ellipse 
            cx="80" cy="100" rx="30" ry="40" 
            stroke="#333" fill={colors['ear-left']} 
            onClick={() => handlePartClick('ear-left')}
          />
          <ellipse 
            cx="220" cy="100" rx="30" ry="40" 
            stroke="#333" fill={colors['ear-right']} 
            onClick={() => handlePartClick('ear-right')}
          />
          <ellipse 
            cx="150" cy="160" rx="20" ry="40" 
            stroke="#333" fill={colors['trunk']} 
            onClick={() => handlePartClick('trunk')}
          />
          <ellipse 
            cx="130" cy="90" rx="10" ry="15" 
            stroke="#333" fill={colors['eye-left']} 
            onClick={() => handlePartClick('eye-left')}
          />
          <ellipse 
            cx="170" cy="90" rx="10" ry="15" 
            stroke="#333" fill={colors['eye-right']} 
            onClick={() => handlePartClick('eye-right')}
          />
        </svg>
      </div>
      
      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button 
          onClick={resetColors}
          style={{
            padding: '0.7rem 1.2rem',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: 'none',
            borderRadius: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s, transform 0.2s'
          }}
        >
          Start Over
        </button>
        <button 
          onClick={saveArtwork}
          style={{
            padding: '0.7rem 1.2rem',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: 'none',
            borderRadius: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s, transform 0.2s'
          }}
        >
          Save My Art
        </button>
      </div>
    </div>
  );
};

export default SimplestColoringTest;
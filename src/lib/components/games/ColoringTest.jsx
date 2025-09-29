import React, { useState, useRef, useEffect } from 'react';

const ColoringTest = () => {
  // State for tracking the currently selected color
  const [selectedColor, setSelectedColor] = useState('#2BCDC1'); // Set initial color to teal
  // State to track colored parts
  const [coloredParts, setColoredParts] = useState({});
  const svgRef = useRef(null);
  const [svgCreated, setSvgCreated] = useState(false);

  // Color palette
  const colors = [
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

  // Initial SVG setup
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Using a basic SVG directly in the component
    const baseSvg = `
      <svg id="ganesha-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
        <ellipse id="ganesha-head" cx="150" cy="100" rx="70" ry="60" 
          stroke="#333" stroke-width="2" fill="white" fill-opacity="0.01" />
        <ellipse id="ganesha-body" cx="150" cy="220" rx="80" ry="60" 
          stroke="#333" stroke-width="2" fill="white" fill-opacity="0.01" />
        <ellipse id="ganesha-ear-left" cx="80" cy="100" rx="30" ry="40" 
          stroke="#333" stroke-width="2" fill="white" fill-opacity="0.01" />
        <ellipse id="ganesha-ear-right" cx="220" cy="100" rx="30" ry="40" 
          stroke="#333" stroke-width="2" fill="white" fill-opacity="0.01" />
        <ellipse id="ganesha-trunk" cx="150" cy="160" rx="20" ry="40" 
          stroke="#333" stroke-width="2" fill="white" fill-opacity="0.01" />
        <ellipse id="ganesha-eye-left" cx="130" cy="90" rx="10" ry="15" 
          stroke="#333" stroke-width="2" fill="white" fill-opacity="0.01" />
        <ellipse id="ganesha-eye-right" cx="170" cy="90" rx="10" ry="15" 
          stroke="#333" stroke-width="2" fill="white" fill-opacity="0.01" />
      </svg>
    `;
    
    // Insert the SVG
    svgRef.current.innerHTML = baseSvg;
    setSvgCreated(true);
    
    // Add single click handler to the parent SVG
    const svgElement = svgRef.current.querySelector('#ganesha-svg');
    if (svgElement) {
      svgElement.addEventListener('click', handleSvgClick);
    }
    
    // Make all parts clickable
    const parts = svgRef.current.querySelectorAll('[id^="ganesha-"]');
    parts.forEach(part => {
      part.style.cursor = 'pointer';
    });
    
    return () => {
      // Cleanup event listener
      if (svgElement) {
        svgElement.removeEventListener('click', handleSvgClick);
      }
    };
  }, []);

  // Update SVG whenever coloredParts changes
  useEffect(() => {
    if (!svgCreated || !svgRef.current) return;
    
    // Apply colors from coloredParts state
    Object.entries(coloredParts).forEach(([partId, color]) => {
      const part = svgRef.current.querySelector(`#${partId}`);
      if (part) {
        console.log(`Applying stored color ${color} to ${partId}`);
        part.setAttribute('fill', color);
        part.style.fill = color;
        part.setAttribute('fill-opacity', '1');
      }
    });
  }, [coloredParts, svgCreated]);

  // Event delegation - single event handler for all SVG parts
  const handleSvgClick = (e) => {
    // Check if clicked element has an ID starting with 'ganesha-'
    let targetElement = e.target;
    
    // Only proceed if we clicked on a part
    if (targetElement.id && targetElement.id.startsWith('ganesha-')) {
      console.log(`CLICK: Coloring ${targetElement.id} with current color: ${selectedColor}`);
      
      // Store in state - this will trigger the effect to apply the color
      setColoredParts(prev => ({
        ...prev,
        [targetElement.id]: selectedColor
      }));
    }
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    console.log(`Selected color: ${color}`);
    setSelectedColor(color);
  };

  // Reset all colors
  const resetColoring = () => {
    // Clear state
    setColoredParts({});
    
    if (!svgRef.current) return;
    
    // Reset all parts to default
    const parts = svgRef.current.querySelectorAll('[id^="ganesha-"]');
    parts.forEach(part => {
      part.setAttribute('fill', 'white');
      part.style.fill = 'white';
      part.setAttribute('fill-opacity', '0.01');
    });
  };

  // Save artwork
  const saveArtwork = () => {
    if (!svgRef.current) return;
    
    const svgElement = svgRef.current.querySelector('svg');
    if (!svgElement) return;
    
    // Clone SVG for saving
    const clonedSvg = svgElement.cloneNode(true);
    
    // Serialize and save
    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([
      '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n',
      svgData
    ], { type: 'image/svg+xml;charset=utf-8' });
    
    const url = URL.createObjectURL(svgBlob);
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
      <h2 style={{color: '#FF6347', marginBottom: '0.5rem', textAlign: 'center', fontSize: '1.5rem'}}>
        Color Lord Ganesha
      </h2>
      
      <p style={{color: '#555', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem'}}>
        Click on a color below, then click on a part of Ganesha to color it.
      </p>
      
      {/* Color palette */}
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '1rem', maxWidth: '300px'}}>
        {colors.map(color => (
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
            onClick={() => handleColorSelect(color)}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>
      
      {/* Current color indicator */}
      <div style={{marginBottom: '10px', fontSize: '14px'}}>
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
        <div ref={svgRef} style={{width: '100%', height: '100%'}}></div>
      </div>
      
      {/* Action buttons */}
      <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
        <button 
          onClick={resetColoring}
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

export default ColoringTest;
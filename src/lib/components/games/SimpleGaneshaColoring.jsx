import React, { useState, useRef, useEffect } from 'react';
import './SimpleGaneshaColoring.css';

const SimpleGaneshaColoring = () => {
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [svgLoaded, setSvgLoaded] = useState(false);
  const svgRef = useRef(null);

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

  // Part information
  const partInfo = {
    'ganesha-head': 'The head of Lord Ganesha',
    'ganesha-crown': 'The crown worn by Lord Ganesha',
    'ganesha-ear-left': 'The left ear',
    'ganesha-ear-right': 'The right ear',
    'ganesha-trunk': 'The elephant trunk',
    'ganesha-body': 'The body of Lord Ganesha',
    'ganesha-eye': 'The eye of Lord Ganesha'
  };

  // Load SVG file
  useEffect(() => {
    console.log('Loading SVG file...');
    
    fetch('/assets/image/ganesh-outline.svg')
      .then(response => {
        if (!response.ok) {
          throw new Error(`SVG file not found: ${response.status}`);
        }
        return response.text();
      })
      .then(svgText => {
        console.log('SVG loaded successfully');
        if (svgRef.current) {
          svgRef.current.innerHTML = svgText;
          setSvgLoaded(true);
        }
      })
      .catch(error => {
        console.error('Error loading SVG:', error);
      });
  }, []);

  // Add click handlers once SVG is loaded
  useEffect(() => {
    if (!svgLoaded || !svgRef.current) return;
    
    console.log('Setting up SVG click handlers');
    
    // Get all elements with IDs starting with "ganesha-"
    const parts = svgRef.current.querySelectorAll('[id^="ganesha-"]');
    console.log(`Found ${parts.length} colorable parts`);
    
    // Add click handlers to each part
    parts.forEach(part => {
      console.log(`Setting up part: ${part.id}`);
      
      // Make sure we only add the handler once
      part.removeEventListener('click', () => {});
      
      // Add cursor style
      part.style.cursor = 'pointer';
      
      // Add click handler
      part.addEventListener('click', () => {
        console.log(`Coloring ${part.id} with ${selectedColor}`);
        
        // Set both the fill attribute and style
        part.setAttribute('fill', selectedColor);
        part.style.fill = selectedColor;
        
        // Log for debugging
        console.log(`Applied color to ${part.id}`);
      });
      
      // Add title tooltip
      if (partInfo[part.id]) {
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = partInfo[part.id];
        part.appendChild(title);
      }
    });
  }, [svgLoaded, selectedColor]);

  // Reset all colors
  const resetColoring = () => {
    if (!svgRef.current) return;
    
    console.log('Resetting all colors');
    
    const parts = svgRef.current.querySelectorAll('[id^="ganesha-"]');
    parts.forEach(part => {
      part.setAttribute('fill', 'none');
      part.style.fill = 'none';
    });
  };

  // Save artwork
  const saveArtwork = () => {
    if (!svgRef.current) return;
    
    // Get the SVG element
    const svgElement = svgRef.current.querySelector('svg');
    if (!svgElement) return;
    
    // Clone it to avoid modifying the display version
    const clonedSvg = svgElement.cloneNode(true);
    
    // Serialize to string
    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    
    // Create a blob with the SVG data
    const svgBlob = new Blob([
      '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n',
      svgData
    ], { type: 'image/svg+xml;charset=utf-8' });
    
    // Create object URL and download link
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-ganesha-artwork.svg';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="simple-ganesha-coloring">
      <h2>Color Lord Ganesha</h2>
      <p className="instructions">
        Click on a color below, then click on a part of Ganesha to color it.
        Hover over parts to see what they represent.
      </p>
      
      {/* Color palette */}
      <div className="color-palette">
        {colors.map(color => (
          <button
            key={color}
            className={`color-button ${selectedColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>
      
      {/* SVG container */}
      <div className="svg-container">
        <div ref={svgRef} className="svg-wrapper"></div>
        {!svgLoaded && <div className="loading">Loading Ganesha...</div>}
      </div>
      
      {/* Action buttons */}
      <div className="action-buttons">
        <button className="reset-button" onClick={resetColoring}>
          Start Over
        </button>
        <button className="save-button" onClick={saveArtwork}>
          Save My Art
        </button>
      </div>
    </div>
  );
};

export default SimpleGaneshaColoring;
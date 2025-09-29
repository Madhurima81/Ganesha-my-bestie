import React, { useState, useEffect, useRef } from 'react';
import './GaneshaColoringActivity.css';

const GaneshaColoringActivity = () => {
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [svgContent, setSvgContent] = useState(null);
  const [activeInfo, setActiveInfo] = useState(null);
  const [coloredParts, setColoredParts] = useState({});
  const svgRef = useRef(null);
  
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

  // Information about each part of Ganesha
  const ganeshaInfo = {
    'ganesha-head': {
      title: 'The Head',
      content: 'Ganesha\'s head represents wisdom and knowledge. The elephant head was given to him by Lord Shiva.',
    },
    'ganesha-trunk': {
      title: 'The Trunk',
      content: 'The trunk symbolizes efficiency and adaptability. It can perform both delicate and powerful tasks.',
    },
    'ganesha-ears-left': {
      title: 'The Left Ear',
      content: 'Ganesha\'s large ears remind us to listen more and talk less, gathering wisdom from all around us.',
    },
    'ganesha-ears-right': {
      title: 'The Right Ear',
      content: 'Ganesha\'s large ears remind us to listen more and talk less, gathering wisdom from all around us.',
    },
    'ganesha-body': {
      title: 'The Body',
      content: 'The large body represents abundance and the ability to enjoy life\'s pleasures with moderation.',
    },
    'ganesha-modak': {
      title: 'The Modak',
      content: 'The sweet modak in Ganesha\'s hand symbolizes the rewards of spiritual pursuit and hard work.',
    },
    'ganesha-crown': {
      title: 'The Crown',
      content: 'The crown symbolizes Ganesha\'s royal status as the son of Shiva and Parvati, and his divine nature.',
    },
    'ganesha-eyes': {
      title: 'The Eyes',
      content: 'Ganesha\'s eyes represent focus and concentration, teaching us to see things clearly.',
    }
  };

  // Load SVG file
  useEffect(() => {
    console.log('Loading SVG file...');
    
    // Path to the SVG file
    fetch('/image/ganesha-outline.svg')
      .then(response => {
        if (!response.ok) {
          throw new Error(`SVG file not found: ${response.status}`);
        }
        return response.text();
      })
      .then(svgText => {
        console.log('SVG loaded successfully');
        
        // Store the SVG content in state
        setSvgContent(svgText);
      })
      .catch(error => {
        console.error('Error loading SVG:', error);
      });
  }, []);

  // Setup click handling for the SVG parts and apply current colors
  useEffect(() => {
    if (!svgContent || !svgRef.current) return;
    
    // The coloredParts state holds all the current colors
    // This will apply colors when the component remounts or coloredParts changes
    const applyCurrentColors = () => {
      const svgElement = svgRef.current.querySelector('svg');
      if (!svgElement) return;
      
      // Apply each color from the state
      Object.entries(coloredParts).forEach(([partId, color]) => {
        const part = svgElement.getElementById(partId);
        if (part) {
          console.log(`Applying saved color ${color} to ${partId}`);
          
          // For Inkscape SVGs, we need to use both fill and style.fill
          // and we need to set stroke to the original or "currentColor"
          part.setAttribute('fill', color);
          part.style.fill = color;
          
          // Make sure stroke is preserved
          if (!part.hasAttribute('stroke')) {
            part.setAttribute('stroke', '#000000');
          }
        }
      });
    };
    
    // Wait for SVG to be fully rendered
    setTimeout(() => {
      applyCurrentColors();
    }, 100);
  }, [svgContent, coloredParts]);

  // Handle clicking on a part to color it
  const handlePartClick = (partId) => {
    if (!svgRef.current) return;
    
    const svgElement = svgRef.current.querySelector('svg');
    if (!svgElement) return;
    
    const part = svgElement.getElementById(partId);
    if (!part) {
      console.error(`Part ${partId} not found`);
      return;
    }
    
    console.log(`Coloring ${partId} with ${selectedColor}`);
    
    // Update both the visual appearance and the state
    part.setAttribute('fill', selectedColor);
    part.style.fill = selectedColor;
    
    // Update state to remember this color
    setColoredParts(prev => ({
      ...prev,
      [partId]: selectedColor
    }));
  };

  // Handle clicking on an info hotspot
  const handleInfoClick = (partId, e) => {
    if (e) e.stopPropagation();
    setActiveInfo(activeInfo === partId ? null : partId);
  };

  // Reset all colors
  const resetColoring = () => {
    if (!svgRef.current) return;
    
    const svgElement = svgRef.current.querySelector('svg');
    if (!svgElement) return;
    
    // Find all parts with ganesha IDs
    const parts = Array.from(svgElement.querySelectorAll('[id^="ganesha-"]'));
    console.log(`Resetting ${parts.length} parts`);
    
    // Clear the fill on each part
    parts.forEach(part => {
      part.setAttribute('fill', 'none');
      part.style.fill = 'none';
    });
    
    // Clear the state
    setColoredParts({});
  };

  // Save the artwork as an SVG file
  const saveArtwork = () => {
    if (!svgRef.current) return;
    
    const svgElement = svgRef.current.querySelector('svg');
    if (!svgElement) return;
    
    // Create a deep clone of the SVG
    const clonedSvg = svgElement.cloneNode(true);
    
    // Remove the info hotspots and other added elements
    const infoHotspots = clonedSvg.querySelectorAll('.info-hotspot');
    infoHotspots.forEach(hotspot => hotspot.remove());
    
    // Convert to string with proper XML declaration
    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([
      '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n',
      svgData
    ], { type: 'image/svg+xml;charset=utf-8' });
    
    // Create download link
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-ganesha-artwork.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // Add click handlers to SVG elements after loading
  useEffect(() => {
    if (!svgContent || !svgRef.current) return;
    
    const setupSvgInteractions = () => {
      const svgElement = svgRef.current.querySelector('svg');
      if (!svgElement) {
        console.error('SVG element not found in DOM');
        return;
      }
      
      // Find all parts with ganesha-* IDs
      const parts = Array.from(svgElement.querySelectorAll('[id^="ganesha-"]'));
      console.log(`Found ${parts.length} colorable parts`);
      
      if (parts.length === 0) {
        console.error('No parts with ganesha-* IDs found');
        return;
      }
      
      // Set up each part
      parts.forEach(part => {
        // Make it clickable
        part.style.cursor = 'pointer';
        
        // Remove any existing click handler to avoid duplicates
        const newPart = part.cloneNode(true);
        part.parentNode.replaceChild(newPart, part);
        
        // Add a new click handler
        newPart.addEventListener('click', () => handlePartClick(newPart.id));
        
        // Add info hotspot if we have info for this part
        if (ganeshaInfo[newPart.id]) {
          try {
            // Get position for the hotspot
            const bbox = newPart.getBBox();
            const x = bbox.x + bbox.width/2;
            const y = bbox.y + bbox.height/2;
            
            // Create the hotspot circle
            const hotspot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            hotspot.setAttribute('cx', x);
            hotspot.setAttribute('cy', y);
            hotspot.setAttribute('r', '8');
            hotspot.setAttribute('fill', 'white');
            hotspot.setAttribute('stroke', 'black');
            hotspot.setAttribute('class', 'info-hotspot');
            hotspot.style.cursor = 'pointer';
            
            // Create the "i" text
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', y + 4);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '12');
            text.textContent = 'i';
            text.style.pointerEvents = 'none';
            
            // Add info click handler
            hotspot.addEventListener('click', (e) => {
              e.stopPropagation();
              handleInfoClick(newPart.id);
            });
            
            // Add to SVG
            svgElement.appendChild(hotspot);
            svgElement.appendChild(text);
          } catch (error) {
            console.error(`Error adding hotspot for ${newPart.id}:`, error);
          }
        }
      });
    };
    
    // Wait for SVG to be in DOM
    setTimeout(setupSvgInteractions, 500);
  }, [svgContent]);
  
  return (
    <div className="ganesha-coloring-activity">
      <h2>Color Lord Ganesha</h2>
      <p className="instructions">
        Click on a color below, then click on a part of Ganesha to color it. 
        Click the info icons to learn about each part.
      </p>
      
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
      
      <div className="svg-container">
        {svgContent ? (
          <div 
            ref={svgRef}
            className="ganesha-svg"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="loading">Loading Ganesha...</div>
        )}
      </div>
      
      {activeInfo && (
        <div className="info-popup">
          <div className="info-content">
            <h3>{ganeshaInfo[activeInfo]?.title}</h3>
            <p>{ganeshaInfo[activeInfo]?.content}</p>
            <button onClick={() => setActiveInfo(null)}>Close</button>
          </div>
        </div>
      )}
      
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

export default GaneshaColoringActivity;
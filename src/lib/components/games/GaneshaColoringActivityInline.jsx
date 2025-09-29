import React, { useState, useRef } from 'react';
import './GaneshaColoringActivity.css';

const GaneshaColoringActivityInline = () => {
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
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

  const ganeshaInfo = {
    'ganesha-head': {
      title: 'The Head',
      content: 'Ganesha\'s head represents wisdom and knowledge. The elephant head was given to him by Lord Shiva.',
    },
    'ganesha-trunk': {
      title: 'The Trunk',
      content: 'The trunk symbolizes efficiency and adaptability. It can perform both delicate and powerful tasks.',
    },
    'ganesha-ears': {
      title: 'The Big Ears',
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
    'ganesha-axe': {
      title: 'The Axe',
      content: 'The axe helps cut off attachment to the material world, allowing spiritual growth.',
    },
  };

  const handlePartClick = (partId) => {
    setColoredParts(prev => ({
      ...prev,
      [partId]: selectedColor
    }));
  };

  const handleInfoClick = (partId, e) => {
    e.stopPropagation();
    setActiveInfo(activeInfo === partId ? null : partId);
  };

  const resetColoring = () => {
    setColoredParts({});
  };

  const saveArtwork = () => {
    if (!svgRef.current) return;
    
    // Clone the SVG for downloading
    const svgElement = svgRef.current.cloneNode(true);
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'my-ganesha-artwork.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

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
        <svg 
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 600 800" 
          width="100%" 
          height="100%"
          className="ganesha-svg"
        >
          {/* Head */}
          <path 
            id="ganesha-head" 
            d="M300 150 Q400 100 420 200 Q450 300 400 350 Q380 380 300 390 Q220 380 200 350 Q150 300 180 200 Q200 100 300 150" 
            stroke="black" 
            strokeWidth="3" 
            fill={coloredParts['ganesha-head'] || 'none'}
            onClick={() => handlePartClick('ganesha-head')}
            style={{ cursor: 'pointer' }}
          />
          
          {/* Trunk */}
          <path 
            id="ganesha-trunk" 
            d="M300 300 C320 330, 340 360, 330 390 C320 420, 310 450, 320 480 C330 510, 350 530, 370 540" 
            stroke="black" 
            strokeWidth="3" 
            fill={coloredParts['ganesha-trunk'] || 'none'}
            onClick={() => handlePartClick('ganesha-trunk')}
            style={{ cursor: 'pointer' }}
          />
          
          {/* Ears */}
          <path 
            id="ganesha-ears" 
            d="M180 200 C140 150, 120 180, 130 220 C140 260, 160 270, 180 250 Z M420 200 C460 150, 480 180, 470 220 C460 260, 440 270, 420 250 Z" 
            stroke="black" 
            strokeWidth="3" 
            fill={coloredParts['ganesha-ears'] || 'none'}
            onClick={() => handlePartClick('ganesha-ears')}
            style={{ cursor: 'pointer' }}
          />
          
          {/* Body */}
          <path 
            id="ganesha-body" 
            d="M240 390 C200 400, 180 450, 170 500 C160 550, 180 600, 220 650 C260 700, 340 700, 380 650 C420 600, 440 550, 430 500 C420 450, 400 400, 360 390" 
            stroke="black" 
            strokeWidth="3" 
            fill={coloredParts['ganesha-body'] || 'none'}
            onClick={() => handlePartClick('ganesha-body')}
            style={{ cursor: 'pointer' }}
          />
          
          {/* Arms */}
          <path 
            id="ganesha-arms" 
            d="M230 450 C200 460, 180 480, 170 520 M370 450 C400 460, 420 480, 430 520" 
            stroke="black" 
            strokeWidth="3" 
            fill={coloredParts['ganesha-arms'] || 'none'}
            onClick={() => handlePartClick('ganesha-arms')}
            style={{ cursor: 'pointer' }}
          />
          
          {/* Modak (sweet) */}
          <path 
            id="ganesha-modak" 
            d="M370 540 C390 530, 400 510, 390 490 C380 470, 360 460, 340 470 C320 480, 310 500, 320 520 C330 540, 350 550, 370 540 Z" 
            stroke="black" 
            strokeWidth="3" 
            fill={coloredParts['ganesha-modak'] || 'none'}
            onClick={() => handlePartClick('ganesha-modak')}
            style={{ cursor: 'pointer' }}
          />
          
          {/* Axe */}
          <path 
            id="ganesha-axe" 
            d="M170 520 L120 480 L140 460 L190 500 Z" 
            stroke="black" 
            strokeWidth="3" 
            fill={coloredParts['ganesha-axe'] || 'none'}
            onClick={() => handlePartClick('ganesha-axe')}
            style={{ cursor: 'pointer' }}
          />
          
          {/* Info Hotspots */}
          <g>
            {/* Head Info */}
            <circle cx="300" cy="200" r="12" fill="white" stroke="black" className="info-hotspot"
              onClick={(e) => handleInfoClick('ganesha-head', e)} />
            <text x="300" y="205" fontSize="14" textAnchor="middle" pointerEvents="none">i</text>
            
            {/* Trunk Info */}
            <circle cx="330" cy="400" r="12" fill="white" stroke="black" className="info-hotspot"
              onClick={(e) => handleInfoClick('ganesha-trunk', e)} />
            <text x="330" y="405" fontSize="14" textAnchor="middle" pointerEvents="none">i</text>
            
            {/* Ears Info */}
            <circle cx="150" cy="220" r="12" fill="white" stroke="black" className="info-hotspot"
              onClick={(e) => handleInfoClick('ganesha-ears', e)} />
            <text x="150" y="225" fontSize="14" textAnchor="middle" pointerEvents="none">i</text>
            
            {/* Body Info */}
            <circle cx="300" cy="550" r="12" fill="white" stroke="black" className="info-hotspot"
              onClick={(e) => handleInfoClick('ganesha-body', e)} />
            <text x="300" y="555" fontSize="14" textAnchor="middle" pointerEvents="none">i</text>
            
            {/* Modak Info */}
            <circle cx="350" cy="510" r="12" fill="white" stroke="black" className="info-hotspot"
              onClick={(e) => handleInfoClick('ganesha-modak', e)} />
            <text x="350" y="515" fontSize="14" textAnchor="middle" pointerEvents="none">i</text>
            
            {/* Axe Info */}
            <circle cx="140" cy="490" r="12" fill="white" stroke="black" className="info-hotspot"
              onClick={(e) => handleInfoClick('ganesha-axe', e)} />
            <text x="140" y="495" fontSize="14" textAnchor="middle" pointerEvents="none">i</text>
          </g>
        </svg>
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

export default GaneshaColoringActivityInline;
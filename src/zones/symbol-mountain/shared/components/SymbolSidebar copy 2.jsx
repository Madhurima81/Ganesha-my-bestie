// Fixed SymbolSidebar.jsx

import React, { useState, useRef, useEffect } from 'react';
import './SymbolSidebar.css';

// Import all the symbol icons - make sure these paths are correct
import symbolBellyGray from '../images/icons/symbol-belly-gray.png';
import symbolBellyColored from '../images/icons/symbol-belly-colored.png';
import symbolEarGray from '../images/icons/symbol-ear-gray.png';
import symbolEarColored from '../images/icons/symbol-ear-colored.png';
import symbolEyesGray from '../images/icons/symbol-eyes-gray.png';
import symbolEyesColored from '../images/icons/symbol-eyes-colored.png';
import symbolLotusGray from '../images/icons/symbol-lotus-gray.png';
import symbolLotusColored from '../images/icons/symbol-lotus-colored.png';
import symbolModakGray from '../images/icons/symbol-modak-gray.png';
import symbolModakColored from '../images/icons/symbol-modak-colored.png';
import symbolMooshikaGray from '../images/icons/symbol-mooshika-gray.png';
import symbolMooshikaColored from '../images/icons/symbol-mooshika-colored.png';
import symbolTrunkGray from '../images/icons/symbol-trunk-gray.png';
import symbolTrunkColored from '../images/icons/symbol-trunk-colored.png';
import symbolTuskGray from '../images/icons/symbol-tusk-gray.png';
import symbolTuskColored from '../images/icons/symbol-tusk-colored.png';

// Symbol information
const symbolInfo = {
  modak: {
    title: "Modak - Ganesha's Favorite Sweet",
    description: "Modak is Lord Ganesha's favorite sweet!",
    colorIcon: symbolModakColored,
    grayIcon: symbolModakGray,
    popupImage: symbolModakColored
  },
  mooshika: {
    title: "Mooshika - Ganesha's Vehicle",
    description: "Mooshika is Lord Ganesha's faithful mouse vehicle!",
    colorIcon: symbolMooshikaColored,
    grayIcon: symbolMooshikaGray,
    popupImage: symbolMooshikaColored
  },
  belly: {
    title: "Ganesha's Belly",
    description: "Ganesha's large belly contains the entire universe!",
    colorIcon: symbolBellyColored,
    grayIcon: symbolBellyGray,
    popupImage: symbolBellyColored
  },
  lotus: {
    title: "Lotus - Symbol of Purity",
    description: "The lotus flower represents purity and spiritual awakening.",
    colorIcon: symbolLotusColored,
    grayIcon: symbolLotusGray,
    popupImage: symbolLotusColored
  },
  ear: {
    title: "Large Ears",
    description: "Ganesha's large ears symbolize the importance of listening.",
    colorIcon: symbolEarColored,
    grayIcon: symbolEarGray,
    popupImage: symbolEarColored
  },
  trunk: {
    title: "Elephant Trunk",
    description: "Ganesha's trunk represents strength and adaptability.",
    colorIcon: symbolTrunkColored,
    grayIcon: symbolTrunkGray,
    popupImage: symbolTrunkColored
  },
  tusk: {
    title: "Single Tusk",
    description: "Ganesha's broken tusk symbolizes sacrifice.",
    colorIcon: symbolTuskColored,
    grayIcon: symbolTuskGray,
    popupImage: symbolTuskColored
  },
  eyes: {
    title: "Small Eyes",
    description: "Ganesha's small eyes represent concentration.",
    colorIcon: symbolEyesColored,
    grayIcon: symbolEyesGray,
    popupImage: symbolEyesColored
  }
};

const SymbolSidebar = ({ discoveredSymbols = {}, onSymbolClick, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const sidebarRef = useRef(null);
  
  const symbolOrder = ['modak', 'mooshika', 'belly', 'lotus', 'trunk', 'eyes', 'ear', 'tusk'];
  const discoveredCount = Object.values(discoveredSymbols).filter(v => v).length;
  const totalSymbols = symbolOrder.length;
  const progressPercentage = (discoveredCount / totalSymbols) * 100;
  
  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleCounterClick = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleSymbolClick = (symbolId) => {
    if (discoveredSymbols[symbolId]) {
      setSelectedSymbol(symbolId);
      setShowPopup(true);
      setIsExpanded(false);
      if (onSymbolClick) {
        onSymbolClick(symbolId);
      }
    }
  };
  
  const closePopup = () => {
    setShowPopup(false);
    setSelectedSymbol(null);
  };
  
  return (
    <>
      <div 
        ref={sidebarRef}
        className={`symbol-sidebar ${isExpanded ? 'expanded' : ''} ${className}`}
      >
        {/* Compact counter pill */}
        <div 
          className="symbol-counter"
          onClick={handleCounterClick}
        >
          <span className="counter-icon">🎁</span>
          <span>{discoveredCount}/{totalSymbols}</span>
          
          {/* Progress bar */}
          <div className="progress-bar-mini">
            <div 
              className="progress-fill-mini" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Expandable grid - only shows when expanded */}
        <div className="symbols-grid">
          {symbolOrder.map((symbolId) => {
            const symbol = symbolInfo[symbolId];
            const isDiscovered = discoveredSymbols[symbolId];
            
            return (
              <div
                key={symbolId}
                className={`symbol-icon ${isDiscovered ? 'discovered' : 'undiscovered'}`}
                onClick={() => handleSymbolClick(symbolId)}
                style={{
                  backgroundImage: `url(${isDiscovered ? symbol.colorIcon : symbol.grayIcon})`
                }}
                title={isDiscovered ? symbol.title : 'Not yet discovered'}
              />
            );
          })}
        </div>
      </div>
      
      {/* Popup */}
      {showPopup && selectedSymbol && (
        <div className="symbol-popup-overlay" onClick={closePopup}>
          <div className="symbol-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-btn" onClick={closePopup}>×</button>
            
            <div className="popup-symbol-icon">
              <img 
                src={symbolInfo[selectedSymbol].popupImage} 
                alt={symbolInfo[selectedSymbol].title}
                className="popup-custom-image"
              />
            </div>
            
            <h2 className="popup-title">{symbolInfo[selectedSymbol].title}</h2>
            <p className="popup-description">{symbolInfo[selectedSymbol].description}</p>
            
            <button className="popup-continue-btn" onClick={closePopup}>
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SymbolSidebar; // Changed from RightMinimalistSymbolSidebar
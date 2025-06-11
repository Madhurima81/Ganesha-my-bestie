// src/components/flipbook/Flipbook.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import './Flipbook.css';

const Flipbook = ({ pages, onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const { updateProgress } = useGameContext();
  const bookRef = useRef(null);
  
  // Update progress when page changes
  useEffect(() => {
    const progress = Math.round((currentPage / (pages.length - 1)) * 100);
    updateProgress('book', progress);
    
    // Check if book is completed
    if (currentPage === pages.length - 1) {
      onComplete && onComplete();
    }
  }, [currentPage, pages.length, updateProgress, onComplete]);
  
  const goToNextPage = () => {
    if (currentPage < pages.length - 1 && !flipping) {
      setFlipping(true);
      setCurrentPage(currentPage + 1);
      setTimeout(() => setFlipping(false), 500); // Match animation duration
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 0 && !flipping) {
      setFlipping(true);
      setCurrentPage(currentPage - 1);
      setTimeout(() => setFlipping(false), 500); // Match animation duration
    }
  };
  
  return (
    <div className="flipbook-container">
      <div className={`book ${flipping ? 'flipping' : ''}`} ref={bookRef}>
        <div className="page current-page">
          <img src={pages[currentPage].image} alt={`Page ${currentPage + 1}`} />
          <div className="page-content">
            <h3>{pages[currentPage].title}</h3>
            <p>{pages[currentPage].content}</p>
          </div>
        </div>
        
        {currentPage < pages.length - 1 && (
          <div className="page next-page">
            <img src={pages[currentPage + 1].image} alt={`Page ${currentPage + 2}`} />
          </div>
        )}
      </div>
      
      <div className="flipbook-controls">
        <button 
          className="prev-button" 
          onClick={goToPrevPage}
          disabled={currentPage === 0 || flipping}
        >
          Previous
        </button>
        
        <div className="page-indicator">
          Page {currentPage + 1} of {pages.length}
        </div>
        
        <button 
          className="next-button" 
          onClick={goToNextPage}
          disabled={currentPage === pages.length - 1 || flipping}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Flipbook;
import React, { useState, useRef, useEffect } from 'react';
import './BenefitsWheel.css';

const BenefitsWheel = () => {
  // State for tracking wheel rotation and selected benefit
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const wheelRef = useRef(null);

  // Benefits data with descriptions and animations
  const benefits = [
    {
      id: 1,
      name: "Concentration",
      description: "Improves focus and concentration in studies",
      animationClass: "concentration-animation"
    },
    {
      id: 2,
      name: "Wisdom",
      description: "Enhances knowledge and wisdom",
      animationClass: "wisdom-animation"
    },
    {
      id: 3,
      name: "Positivity",
      description: "Creates positive energy and good vibes",
      animationClass: "positivity-animation"
    },
    {
      id: 4,
      name: "Courage",
      description: "Builds courage to overcome obstacles",
      animationClass: "courage-animation"
    },
    {
      id: 5,
      name: "Happiness",
      description: "Brings joy and happiness in life",
      animationClass: "happiness-animation"
    },
    {
      id: 6,
      name: "Creativity",
      description: "Enhances creative thinking",
      animationClass: "creativity-animation"
    }
  ];

  // Number of sections in the wheel
  const numSections = benefits.length;
  // Angle for each section
  const sectionAngle = 360 / numSections;

  // Function to spin the wheel
  const spinWheel = () => {
    if (isSpinning) return;
    
    // Clear any previous selection
    setSelectedBenefit(null);
    setShowAnimation(false);
    
    // Set spinning state
    setIsSpinning(true);
    
    // Calculate a random number of full rotations (2-5 rotations) plus a random angle
    const spinRotations = Math.floor(Math.random() * 3) + 2; // 2-5 rotations
    const spinAngle = Math.floor(Math.random() * 360); // Random final position
    const totalRotation = spinRotations * 360 + spinAngle;
    
    // Create new absolute rotation (add to current to keep spinning in same direction)
    const newRotation = rotation + totalRotation;
    setRotation(newRotation);
    
    // Calculate which benefit is selected after spinning
    setTimeout(() => {
      const normalizedRotation = newRotation % 360;
      const selectedIndex = Math.floor(((360 - normalizedRotation) % 360) / sectionAngle);
      setSelectedBenefit(benefits[selectedIndex]);
      setIsSpinning(false);
      
      // Show animation after a short delay
      setTimeout(() => {
        setShowAnimation(true);
      }, 500);
    }, 3000); // Match this to the CSS transition time
  };

  // Create the wheel segments
  const renderWheelSegments = () => {
    return benefits.map((benefit, index) => {
      // Calculate rotation for this segment
      const segmentRotation = index * sectionAngle;
      const isEven = index % 2 === 0;
      
      return (
        <div 
          key={benefit.id}
          className={`wheel-segment ${isEven ? 'segment-even' : 'segment-odd'}`}
          style={{ 
            transform: `rotate(${segmentRotation}deg) skewY(${90 - sectionAngle}deg)`,
            transformOrigin: 'bottom right'
          }}
        >
          <div className="segment-content">
            <span>{benefit.name}</span>
          </div>
        </div>
      );
    });
  };
  
  // Render benefit animation based on selected benefit
  const renderBenefitAnimation = () => {
    if (!selectedBenefit || !showAnimation) return null;
    
    return (
      <div className="benefit-animation-container">
        <h3>{selectedBenefit.name}</h3>
        <p>{selectedBenefit.description}</p>
        <div className={`benefit-animation ${selectedBenefit.animationClass}`}></div>
      </div>
    );
  };

  return (
    <div className="benefits-wheel-container">
      <h2>Spin the Wheel to Discover Shloka Benefits</h2>
      
      <div className="wheel-container">
        {/* Wheel */}
        <div 
          ref={wheelRef}
          className={`wheel ${isSpinning ? 'spinning' : ''}`} 
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {renderWheelSegments()}
          <div className="wheel-center">
            <img src="/ganesha-icon.png" alt="Ganesha" className="ganesha-icon" />
          </div>
        </div>
        
        {/* Pointer/Marker */}
        <div className="wheel-pointer"></div>
        
        {/* Spin button */}
        <button 
          className="spin-button" 
          onClick={spinWheel}
          disabled={isSpinning}
        >
          {isSpinning ? 'Spinning...' : 'SPIN!'}
        </button>
      </div>
      
      {/* Benefit display area */}
      <div className="benefit-display">
        {selectedBenefit ? (
          renderBenefitAnimation()
        ) : (
          <p className="instruction-text">Spin the wheel to see the benefits of reciting the Ganesha shloka!</p>
        )}
      </div>
    </div>
  );
};

export default BenefitsWheel;
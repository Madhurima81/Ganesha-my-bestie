import React, { useState, useEffect, useRef } from 'react';

const DailyMomentsClock = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [hourHandAngle, setHourHandAngle] = useState(0);
  const [minuteHandAngle, setMinuteHandAngle] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [hintActive, setHintActive] = useState(true);
  
  const clockRef = useRef(null);
  const clockCenterX = 150; // Center X of SVG viewBox
  const clockCenterY = 150; // Center Y of SVG viewBox
  
  // Available time moments and their associations with the shloka
  const timeMoments = [
    {
      id: 'morning',
      hourAngle: 90, // 6:00 AM
      minuteAngle: 0,
      time: '6:00 AM',
      title: 'Morning Wake-Up',
      message: 'Starting your day with the Vakratunda shloka helps you have a peaceful, happy day! Ganesha removes obstacles before they even appear.',
      icon: '🌅',
      color: '#FFD166' // yellow/orange for sunrise
    },
    {
      id: 'school',
      hourAngle: 135, // 9:00 AM
      minuteAngle: 0,
      time: '9:00 AM',
      title: 'Before School',
      message: 'Saying the shloka before school helps you learn better and stay focused in class. Ganesha is the lord of wisdom and knowledge!',
      icon: '🏫',
      color: '#06D6A0' // teal for school
    },
    {
      id: 'lunchtime',
      hourAngle: 180, // 12:00 PM
      minuteAngle: 0,
      time: '12:00 PM',
      title: 'Lunchtime',
      message: 'Saying the shloka before eating shows gratitude for your food. Ganesha loves modaks - he understands how important food is!',
      icon: '🍱',
      color: '#EF476F' // red for food
    },
    {
      id: 'homework',
      hourAngle: 225, // 3:00 PM
      minuteAngle: 0,
      time: '3:00 PM',
      title: 'Homework Time',
      message: 'When homework feels difficult, the shloka helps clear your mind and solve problems more easily. Ganesha brings wisdom!',
      icon: '📚',
      color: '#118AB2' // blue for focus
    },
    {
      id: 'playtime',
      hourAngle: 270, // 6:00 PM
      minuteAngle: 0,
      time: '6:00 PM',
      title: 'Playtime',
      message: 'Even during fun activities, saying the shloka helps you be kind and fair to friends. Ganesha brings harmony to your play!',
      icon: '🎮',
      color: '#8338EC' // purple for fun
    },
    {
      id: 'bedtime',
      hourAngle: 315, // 9:00 PM
      minuteAngle: 0,
      time: '9:00 PM',
      title: 'Bedtime',
      message: 'The shloka helps calm your mind before sleep and keeps nightmares away. Ganesha watches over you while you rest!',
      icon: '🌙',
      color: '#073B4C' // dark blue for night
    }
  ];
  
  // Calculate angle from center of clock
  const calculateAngle = (x, y) => {
    if (!clockRef.current) return 0;
    
    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate angle in radians, then convert to degrees
    let angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
    
    // Adjust angle to start from 12 o'clock position (270 degrees in standard coordinate system)
    angle = (angle + 270) % 360;
    
    return angle;
  };
  
  // Find the closest time moment to a given angle
  const findClosestTimeMoment = (angle) => {
    // Normalize angle to 0-360 range
    const normalizedAngle = (angle + 360) % 360;
    
    // Find closest time moment
    let closestMoment = timeMoments[0];
    let smallestDifference = 360;
    
    timeMoments.forEach(moment => {
      // Calculate the absolute difference between angles
      let difference = Math.abs(normalizedAngle - moment.hourAngle);
      // Take the smaller arc (e.g., 350° and 10° are 20° apart, not 340°)
      if (difference > 180) difference = 360 - difference;
      
      if (difference < smallestDifference) {
        smallestDifference = difference;
        closestMoment = moment;
      }
    });
    
    return closestMoment;
  };
  
  // Handle mouse/touch down on clock
  const handleMouseDown = (e) => {
    setDragging(true);
    setHintActive(false);
    
    // Get coordinates, handling both mouse and touch events
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    
    const angle = calculateAngle(clientX, clientY);
    updateClockHands(angle);
  };
  
  // Handle mouse/touch move while dragging
  const handleMouseMove = (e) => {
    if (!dragging) return;
    
    // Get coordinates, handling both mouse and touch events
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    
    const angle = calculateAngle(clientX, clientY);
    updateClockHands(angle);
  };
  
  // Handle mouse/touch release
  const handleMouseUp = () => {
    if (!dragging) return;
    setDragging(false);
    
    // Find the closest time moment to current angle
    const closestMoment = findClosestTimeMoment(hourHandAngle);
    
    // Snap to that time moment
    setHourHandAngle(closestMoment.hourAngle);
    setMinuteHandAngle(closestMoment.minuteAngle);
    
    // Show the message for this time
    showMessage(closestMoment);
  };
  
  // Update clock hands based on angle
  const updateClockHands = (angle) => {
    setHourHandAngle(angle);
    // For simplicity, minute hand just follows hour hand in this demo
    setMinuteHandAngle(angle * 12); // Minute hand moves 12x faster
  };
  
  // Show message for a time moment
  const showMessage = (moment) => {
    // If selecting the same moment, just toggle animation
    if (selectedTime && selectedTime.id === moment.id) {
      setAnimate(false);
      setTimeout(() => setAnimate(true), 50);
    } else {
      // Hide current message first if there is one
      setAnimate(false);
      
      // Then show new message after a brief delay
      setTimeout(() => {
        setSelectedTime(moment);
        setCurrentMessage(moment);
        setAnimate(true);
      }, 300);
    }
  };
  
  // Handle clicking directly on a time marker
  const handleTimeMarkerClick = (moment) => {
    setHourHandAngle(moment.hourAngle);
    setMinuteHandAngle(moment.minuteAngle);
    showMessage(moment);
    setHintActive(false);
  };

  // Close the message panel
  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => setCurrentMessage(null), 300);
  };
  
  // Set up event listeners for document to handle mouse/touch up outside component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (dragging) {
        handleMouseUp();
      }
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [dragging]);

  return (
    <div className="daily-moments-container" style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '15px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      fontFamily: "'Comic Sans MS', 'Bubblegum Sans', sans-serif",
      position: 'relative',
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#5D1049',
        fontSize: 'clamp(1.5rem, 5vw, 2rem)',
        marginBottom: '15px'
      }}>
        When to Say Ganesha's Shloka?
      </h2>
      
      <p style={{
        textAlign: 'center',
        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
        color: '#333',
        marginBottom: '20px'
      }}>
        Move the clock hands to see special times to say the shloka!
      </p>
      
      {/* Main clock container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px',
        position: 'relative',
      }}>
        {/* Hint arrow when component first loads */}
        {hintActive && (
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '65%',
            zIndex: 5,
            animation: 'bounce 2s infinite'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: '#EF476F',
              fontWeight: 'bold',
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
            }}>
              <span style={{ fontSize: '24px', marginBottom: '5px' }}>👆</span>
              Move me!
            </div>
          </div>
        )}
        
        {/* SVG Clock */}
        <svg 
          ref={clockRef}
          viewBox="0 0 300 300"
          width="280"
          height="280"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          style={{ cursor: 'pointer', userSelect: 'none', touchAction: 'none' }}
        >
          {/* Clock face */}
          <circle cx={clockCenterX} cy={clockCenterY} r="140" fill="#f0f0f0" stroke="#333" strokeWidth="3" />
          <circle cx={clockCenterX} cy={clockCenterY} r="5" fill="#333" />
          
          {/* Hour markers */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, index) => {
            const isMainHour = index % 3 === 0;
            const radians = angle * Math.PI / 180;
            const markerLength = isMainHour ? 15 : 10;
            const outerRadius = 130;
            const innerRadius = outerRadius - markerLength;
            
            const x1 = clockCenterX + innerRadius * Math.cos(radians);
            const y1 = clockCenterY + innerRadius * Math.sin(radians);
            const x2 = clockCenterX + outerRadius * Math.cos(radians);
            const y2 = clockCenterY + outerRadius * Math.sin(radians);
            
            return (
              <line 
                key={`marker-${angle}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#333"
                strokeWidth={isMainHour ? 3 : 2}
              />
            );
          })}
          
          {/* Hour numbers */}
          {[12, 3, 6, 9].map((hour, index) => {
            const angle = index * 90 * Math.PI / 180;
            const radius = 110;
            const x = clockCenterX + radius * Math.cos(angle);
            const y = clockCenterY + radius * Math.sin(angle);
            
            return (
              <text
                key={`hour-${hour}`}
                x={x}
                y={y}
                fontSize="22"
                fontWeight="bold"
                fill="#333"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {hour}
              </text>
            );
          })}
          
          {/* Time moment markers with icons */}
          {timeMoments.map((moment, index) => {
            const radians = moment.hourAngle * Math.PI / 180;
            const radius = 90;
            const x = clockCenterX + radius * Math.cos(radians);
            const y = clockCenterY + radius * Math.sin(radians);
            
            return (
              <g 
                key={`moment-${index}`}
                onClick={() => handleTimeMarkerClick(moment)}
                style={{ cursor: 'pointer' }}
              >
                <circle 
                  cx={x}
                  cy={y}
                  r="20"
                  fill={moment.color}
                  stroke="#fff"
                  strokeWidth="2"
                  style={{
                    transition: 'transform 0.3s, opacity 0.3s',
                    transform: selectedTime?.id === moment.id ? 'scale(1.2)' : 'scale(1)',
                    transformOrigin: `${x}px ${y}px`,
                    opacity: selectedTime?.id === moment.id ? 1 : 0.8
                  }}
                />
                <text
                  x={x}
                  y={y}
                  fontSize="16"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {moment.icon}
                </text>
              </g>
            );
          })}
          
          {/* Hour hand */}
          <line
            x1={clockCenterX}
            y1={clockCenterY}
            x2={clockCenterX + 60 * Math.cos(hourHandAngle * Math.PI / 180)}
            y2={clockCenterY + 60 * Math.sin(hourHandAngle * Math.PI / 180)}
            stroke="#333"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ transition: dragging ? 'none' : 'all 0.3s ease' }}
          />
          
          {/* Minute hand */}
          <line
            x1={clockCenterX}
            y1={clockCenterY}
            x2={clockCenterX + 90 * Math.cos(minuteHandAngle * Math.PI / 180)}
            y2={clockCenterY + 90 * Math.sin(minuteHandAngle * Math.PI / 180)}
            stroke="#666"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ transition: dragging ? 'none' : 'all 0.3s ease' }}
          />
          
          {/* Center cap */}
          <circle cx={clockCenterX} cy={clockCenterY} r="8" fill="#333" />
        </svg>
      </div>
      
      {/* Message panel */}
      {currentMessage && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
          marginTop: '10px',
          position: 'relative',
          borderLeft: `8px solid ${currentMessage.color}`,
          opacity: animate ? 1 : 0,
          transform: animate ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}>
          <button 
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#aaa',
            }}
          >
            ✕
          </button>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '15px',
          }}>
            <span style={{ 
              fontSize: '40px', 
              marginRight: '15px',
              backgroundColor: currentMessage.color,
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              {currentMessage.icon}
            </span>
            <div>
              <h3 style={{ 
                margin: '0 0 5px 0',
                fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                color: currentMessage.color 
              }}>
                {currentMessage.title}
              </h3>
              <p style={{ 
                margin: '0',
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                fontStyle: 'italic',
                color: '#666'
              }}>
                {currentMessage.time}
              </p>
            </div>
          </div>
          
          <p style={{
            margin: '0 0 15px 0',
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            lineHeight: '1.5',
            color: '#333'
          }}>
            {currentMessage.message}
          </p>
          
          <div style={{
            backgroundColor: '#F8F9FA',
            borderRadius: '10px',
            padding: '12px',
            marginTop: '15px'
          }}>
            <p style={{
              margin: '0',
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
              fontWeight: 'bold',
              color: '#5D1049'
            }}>
              Try saying the shloka at this time tomorrow!
            </p>
          </div>
        </div>
      )}
      
      {/* Add some animations */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default DailyMomentsClock;
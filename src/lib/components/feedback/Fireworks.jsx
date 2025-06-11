import React, { useEffect, useState } from 'react';
import './Fireworks.css';

const Fireworks = ({ 
  show = false, 
  duration = 5000, 
  count = 5,
  colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
  onComplete = () => {}
}) => {
  const [fireworks, setFireworks] = useState([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (show) {
      setIsActive(true);
      createFireworksSequence();
      
      // End animation after duration
      const timer = setTimeout(() => {
        setIsActive(false);
        setFireworks([]);
        onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  const createFireworksSequence = () => {
    const newFireworks = [];
    
    for (let i = 0; i < count; i++) {
      const delay = i * (duration / count / 2) + Math.random() * 500;
      const firework = createSingleFirework(i, delay);
      newFireworks.push(firework);
    }
    
    setFireworks(newFireworks);
  };

  const createSingleFirework = (index, delay) => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = 10 + Math.random() * 80; // 10% to 90% of screen width
    const y = 20 + Math.random() * 40; // 20% to 60% of screen height for burst
    const particles = [];
    const particleCount = 30 + Math.random() * 20;
    
    // Create particles for this firework
    for (let i = 0; i < particleCount; i++) {
      const angle = (360 / particleCount) * i;
      const velocity = 3 + Math.random() * 3;
      const size = 2 + Math.random() * 3;
      const trail = Math.random() > 0.5;
      
      particles.push({
        id: `${index}-${i}`,
        angle,
        velocity,
        size,
        trail,
        color: Math.random() > 0.7 ? colors[Math.floor(Math.random() * colors.length)] : color
      });
    }
    
    return {
      id: index,
      x,
      y,
      color,
      delay,
      particles,
      type: Math.random() > 0.5 ? 'circle' : 'star'
    };
  };

  if (!show || !isActive) return null;

  return (
    <div className="fireworks-container">
      {fireworks.map(firework => (
        <div
          key={firework.id}
          className="firework-burst"
          style={{
            left: `${firework.x}%`,
            top: `${firework.y}%`,
            animationDelay: `${firework.delay}ms`
          }}
        >
          {/* Launch trail */}
          <div 
            className="launch-trail"
            style={{
              animationDelay: `${firework.delay}ms`,
              background: `linear-gradient(to top, transparent, ${firework.color})`
            }}
          />
          
          {/* Explosion */}
          <div 
            className="explosion"
            style={{ animationDelay: `${firework.delay + 1000}ms` }}
          >
            {firework.particles.map(particle => (
              <div
                key={particle.id}
                className={`particle ${particle.trail ? 'with-trail' : ''}`}
                style={{
                  '--angle': `${particle.angle}deg`,
                  '--velocity': `${particle.velocity * 30}px`,
                  '--size': `${particle.size}px`,
                  '--color': particle.color,
                  transform: `rotate(${particle.angle}deg)`,
                  animationDelay: `${firework.delay + 1000}ms`
                }}
              >
                <div className="particle-inner" />
                {particle.trail && <div className="particle-trail" />}
              </div>
            ))}
          </div>
          
          {/* Central flash */}
          <div 
            className="center-flash"
            style={{ 
              animationDelay: `${firework.delay + 1000}ms`,
              backgroundColor: firework.color
            }}
          />
        </div>
      ))}
      
      {/* Additional sparkles */}
      <div className="sparkle-overlay">
        {[...Array(20)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="floating-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * duration}ms`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >✨</div>
        ))}
      </div>
    </div>
  );
};

export default Fireworks;
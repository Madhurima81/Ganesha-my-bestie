// zones/shloka-river/scenes/Scene2/components/SunRayArc.jsx
import React from 'react';

const SunRayArc = ({ 
  sourcePosition, 
  targetPosition, 
  isActive, 
  rayCount = 12,
  duration = 1500
}) => {
  if (!isActive || !sourcePosition || !targetPosition) return null;

  // Calculate distance and arc parameters
  const sourceX = parseFloat(sourcePosition.left);
  const sourceY = parseFloat(sourcePosition.top);
  const targetX = parseFloat(targetPosition.left);
  const targetY = parseFloat(targetPosition.top);
  
  const deltaX = targetX - sourceX;
  const deltaY = targetY - sourceY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  // Arc height based on distance (solar rays have gentle arc)
  const arcHeight = Math.max(8, distance * 0.15);
  
  // Solar ray particles
  const rayParticles = ['✨', '⭐', '🌟', '💫', '🔆'];
  
  return (
    <>
      <div className="sun-ray-container">
        {Array.from({ length: rayCount }).map((_, i) => {
          const progress = i / rayCount;
          const delay = i * 45; // Faster stagger for rays
          const spread = (Math.random() - 0.5) * 8; // Less spread for focused rays
          const sizeVariation = 0.7 + Math.random() * 0.6; // Size variety
          const rotationVariation = Math.random() * 180; // Random rotation
          const particleType = rayParticles[Math.floor(Math.random() * rayParticles.length)];
          
          return (
            <div
              key={i}
              className="sun-ray"
              style={{
                '--start-x': `${sourceX}%`,
                '--start-y': `${sourceY}%`,
                '--end-x': `${targetX}%`,
                '--end-y': `${targetY}%`,
                '--arc-height': `${arcHeight}vh`,
                '--duration': `${duration}ms`,
                '--delay': `${delay}ms`,
                '--spread': `${spread}px`,
                '--size': sizeVariation,
                '--rotation': `${rotationVariation}deg`,
                animationDelay: `${delay}ms`,
                fontSize: `${14 * sizeVariation}px`
              }}
            >
              {particleType}
            </div>
          );
        })}
      </div>
      
      {/* Golden ray trail effect */}
      <div className="ray-trail-container">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`trail-${i}`}
            className="ray-trail"
            style={{
              '--start-x': `${sourceX}%`,
              '--start-y': `${sourceY}%`,
              '--end-x': `${targetX}%`,
              '--end-y': `${targetY}%`,
              '--arc-height': `${arcHeight}vh`,
              '--duration': `${duration + i * 80}ms`,
              '--delay': `${i * 60}ms`,
              '--opacity': 0.4 - (i * 0.05),
              animationDelay: `${i * 60}ms`
            }}
          />
        ))}
      </div>
      
      {/* Concentrated beam effect */}
      <div className="solar-beam">
        <div
          className="beam-core"
          style={{
            '--start-x': `${sourceX}%`,
            '--start-y': `${sourceY}%`,
            '--end-x': `${targetX}%`,
            '--end-y': `${targetY}%`,
            '--arc-height': `${arcHeight}vh`,
            '--duration': `${duration * 0.8}ms`
          }}
        />
      </div>
      
      {/* CSS Styles */}
      <style jsx>{`
        .sun-ray-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 25;
        }
        
        .ray-trail-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 24;
        }
        
        .solar-beam {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 23;
        }
        
        .sun-ray {
          position: absolute;
          left: var(--start-x);
          top: var(--start-y);
          pointer-events: none;
          z-index: 25;
          animation: solarArc var(--duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          transform: scale(var(--size)) rotate(var(--rotation));
          filter: drop-shadow(0 2px 6px rgba(255, 165, 0, 0.4));
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
        }
        
        .ray-trail {
          position: absolute;
          left: var(--start-x);
          top: var(--start-y);
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #FFD700 0%, #FFA500 50%, transparent 100%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 24;
          opacity: var(--opacity);
          animation: rayTrail var(--duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          box-shadow: 0 0 6px rgba(255, 215, 0, 0.5);
        }
        
        .beam-core {
          position: absolute;
          left: var(--start-x);
          top: var(--start-y);
          width: 2px;
          height: 2px;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          border-radius: 50%;
          pointer-events: none;
          z-index: 23;
          animation: beamCore var(--duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          box-shadow: 
            0 0 10px rgba(255, 215, 0, 0.8),
            0 0 20px rgba(255, 165, 0, 0.4);
        }
        
        @keyframes solarArc {
          0% {
            left: var(--start-x);
            top: var(--start-y);
            opacity: 1;
            transform: translateX(var(--spread)) scale(var(--size)) rotate(var(--rotation));
            filter: drop-shadow(0 2px 6px rgba(255, 165, 0, 0.4)) brightness(1.2);
          }
          10% {
            opacity: 0.95;
            transform: translateX(var(--spread)) scale(calc(var(--size) * 1.2)) rotate(calc(var(--rotation) + 20deg));
            filter: drop-shadow(0 2px 8px rgba(255, 165, 0, 0.5)) brightness(1.4);
          }
          25% {
            opacity: 0.9;
            transform: translateX(var(--spread)) scale(calc(var(--size) * 1.3)) rotate(calc(var(--rotation) + 45deg));
            filter: drop-shadow(0 2px 10px rgba(255, 165, 0, 0.6)) brightness(1.5);
          }
          50% {
            left: calc((var(--start-x) + var(--end-x)) / 2);
            top: calc((var(--start-y) + var(--end-y)) / 2 - var(--arc-height));
            opacity: 0.85;
            transform: translateX(var(--spread)) scale(calc(var(--size) * 1.4)) rotate(calc(var(--rotation) + 90deg));
            filter: drop-shadow(0 2px 12px rgba(255, 165, 0, 0.7)) brightness(1.6);
          }
          75% {
            opacity: 0.7;
            transform: translateX(var(--spread)) scale(calc(var(--size) * 1.2)) rotate(calc(var(--rotation) + 135deg));
            filter: drop-shadow(0 2px 8px rgba(255, 165, 0, 0.5)) brightness(1.3);
          }
          90% {
            opacity: 0.4;
            transform: translateX(var(--spread)) scale(calc(var(--size) * 0.9)) rotate(calc(var(--rotation) + 160deg));
            filter: drop-shadow(0 2px 6px rgba(255, 165, 0, 0.3)) brightness(1.1);
          }
          100% {
            left: var(--end-x);
            top: var(--end-y);
            opacity: 0;
            transform: translateX(var(--spread)) scale(calc(var(--size) * 0.6)) rotate(calc(var(--rotation) + 180deg));
            filter: drop-shadow(0 2px 4px rgba(255, 165, 0, 0.2)) brightness(1);
          }
        }
        
        @keyframes rayTrail {
          0% {
            left: var(--start-x);
            top: var(--start-y);
            opacity: var(--opacity);
            transform: scale(0.8);
            box-shadow: 0 0 6px rgba(255, 215, 0, 0.5);
          }
          15% {
            opacity: calc(var(--opacity) * 1.2);
            transform: scale(1.1);
            box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
          }
          30% {
            opacity: calc(var(--opacity) * 1.1);
            transform: scale(1.3);
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
          }
          50% {
            left: calc((var(--start-x) + var(--end-x)) / 2);
            top: calc((var(--start-y) + var(--end-y)) / 2 - var(--arc-height));
            opacity: calc(var(--opacity) * 0.9);
            transform: scale(1.5);
            box-shadow: 0 0 12px rgba(255, 215, 0, 0.8);
          }
          70% {
            opacity: calc(var(--opacity) * 0.6);
            transform: scale(1.2);
            box-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
          }
          85% {
            opacity: calc(var(--opacity) * 0.3);
            transform: scale(0.9);
            box-shadow: 0 0 6px rgba(255, 215, 0, 0.3);
          }
          100% {
            left: var(--end-x);
            top: var(--end-y);
            opacity: 0;
            transform: scale(0.6);
            box-shadow: 0 0 4px rgba(255, 215, 0, 0.2);
          }
        }
        
        @keyframes beamCore {
          0% {
            left: var(--start-x);
            top: var(--start-y);
            opacity: 0.8;
            transform: scale(1);
            box-shadow: 
              0 0 10px rgba(255, 215, 0, 0.8),
              0 0 20px rgba(255, 165, 0, 0.4);
          }
          20% {
            opacity: 1;
            transform: scale(1.5);
            box-shadow: 
              0 0 15px rgba(255, 215, 0, 1),
              0 0 30px rgba(255, 165, 0, 0.6);
          }
          50% {
            left: calc((var(--start-x) + var(--end-x)) / 2);
            top: calc((var(--start-y) + var(--end-y)) / 2 - var(--arc-height));
            opacity: 0.9;
            transform: scale(2);
            box-shadow: 
              0 0 20px rgba(255, 215, 0, 0.9),
              0 0 40px rgba(255, 165, 0, 0.5);
          }
          80% {
            opacity: 0.6;
            transform: scale(1.2);
            box-shadow: 
              0 0 12px rgba(255, 215, 0, 0.6),
              0 0 25px rgba(255, 165, 0, 0.3);
          }
          100% {
            left: var(--end-x);
            top: var(--end-y);
            opacity: 0;
            transform: scale(0.8);
            box-shadow: 
              0 0 8px rgba(255, 215, 0, 0.3),
              0 0 15px rgba(255, 165, 0, 0.2);
          }
        }
        
        /* Enhanced sparkle effect for special rays */
        .sun-ray:nth-child(3n) {
          filter: drop-shadow(0 2px 6px rgba(255, 165, 0, 0.4)) 
                  drop-shadow(0 0 12px rgba(255, 215, 0, 0.6))
                  brightness(1.3);
          animation-duration: calc(var(--duration) * 0.9);
        }
        
        .sun-ray:nth-child(5n) {
          filter: drop-shadow(0 2px 6px rgba(255, 165, 0, 0.4)) 
                  drop-shadow(0 0 15px rgba(255, 140, 0, 0.7))
                  brightness(1.4);
          animation-duration: calc(var(--duration) * 1.1);
        }
        
        /* Pulsing golden trails */
        .ray-trail:nth-child(odd) {
          background: radial-gradient(circle, #FFA500 0%, #FF8C00 50%, transparent 100%);
          animation-duration: calc(var(--duration) * 0.95);
        }
        
        .ray-trail:nth-child(even) {
          background: radial-gradient(circle, #FFD700 0%, #DAA520 50%, transparent 100%);
          animation-duration: calc(var(--duration) * 1.05);
        }
      `}</style>
    </>
  );
};

export default SunRayArc;
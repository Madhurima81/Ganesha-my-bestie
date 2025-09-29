import React, { useState, useEffect } from 'react';

const GaneshaProfile = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [animation, setAnimation] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width when resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle click on a section with animation
  const handleSectionClick = (section) => {
    // If already active, just close it
    if (activeSection === section) {
      setActiveSection(null);
      return;
    }
    
    // Set animation first
    setAnimation(section);
    
    // Then set active section after a short delay
    setTimeout(() => {
      setActiveSection(section);
      // Reset animation after it's done
      setTimeout(() => {
        setAnimation(null);
      }, 500);
    }, 300);
  };

  // Determine if we need to use mobile layout
  const isMobile = windowWidth < 768;

  return (
    <div className="ganesha-profile" style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: isMobile ? '10px' : '20px',
      background: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive",
      overflow: 'hidden'
    }}>
      {/* Title Cloud */}
      <div style={{
        position: 'relative',
        textAlign: 'center',
        marginBottom: '25px'
      }}>
        <svg viewBox="0 0 300 80" style={{ width: '100%', height: 'auto' }}>
          <path
            d="M20,50 C10,40 10,20 20,10 C30,0 50,0 60,10 C70,0 90,0 100,10 C110,0 130,0 140,10 C150,0 170,0 180,10 C190,0 210,0 220,10 C230,0 250,0 260,10 C270,20 270,40 260,50 C270,60 270,80 260,90 C250,100 230,100 220,90 C210,100 190,100 180,90 C170,100 150,100 140,90 C130,100 110,100 100,90 C90,100 70,100 60,90 C50,100 30,100 20,90 C10,80 10,60 20,50 Z"
            fill="#FFD6E0"
            stroke="#000000"
            strokeWidth="2"
          />
          <text x="150" y="55" textAnchor="middle" fontSize={isMobile ? "22" : "28"} fontWeight="bold">ALL ABOUT ME</text>
        </svg>
      </div>

      {/* Profile Grid - Responsive layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gridTemplateRows: 'auto',
        gridGap: '15px',
        gridTemplateAreas: isMobile ? `
          "name name"
          "photo photo"
          "birthday birthday"
          "favorite favorite"
          "bestfriend family"
          "wanttobe goto"
          "ilike goodat"
        ` : `
          "name name photo"
          "birthday birthday photo"
          "favorite bestfriend family"
          "favorite wanttobe family"
          "goto ilike goodat"
        `
      }}>
        {/* Name Section */}
        <div 
          className={`profile-section ${animation === 'name' ? 'flip-animation' : ''}`}
          style={{
            gridArea: 'name',
            padding: '15px',
            border: '2px solid #000',
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            textAlign: 'center',
            transition: 'transform 0.6s, box-shadow 0.3s',
            cursor: 'pointer',
            boxShadow: activeSection === 'name' ? '0 8px 16px rgba(0,0,0,0.2)' : '0 4px 8px rgba(0,0,0,0.1)',
            transform: animation === 'name' ? 'scale(1.02)' : 'scale(1)',
            perspective: '1000px'
          }}
          onClick={() => handleSectionClick('name')}
        >
          <div className="flipper" style={{
            position: 'relative',
            width: '100%',
            height: '100%'
          }}>
            <div className="front" style={{
              backfaceVisibility: 'hidden',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transform: activeSection === 'name' ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.6s',
              zIndex: activeSection === 'name' ? 0 : 1
            }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: isMobile ? '18px' : '20px' }}>
                My name is <span style={{ fontSize: isMobile ? '22px' : '24px' }}>Ganesha</span>
              </h3>
              <p style={{ margin: '0', fontSize: isMobile ? '16px' : '18px' }}>
                I am <span style={{ fontWeight: 'bold' }}>very old</span> years old
              </p>
            </div>
            <div className="back" style={{
              backfaceVisibility: 'hidden',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transform: activeSection === 'name' ? 'rotateY(0deg)' : 'rotateY(-180deg)',
              transition: 'transform 0.6s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              zIndex: activeSection === 'name' ? 1 : 0
            }}>
              <div>
                <p style={{ fontWeight: 'bold', margin: '0 0 10px 0', fontSize: isMobile ? '16px' : '18px' }}>
                  I'm also called Ganapati and Vinayaka!
                </p>
                <p style={{ fontSize: isMobile ? '14px' : '16px', margin: '0' }}>
                  I am the son of Lord Shiva and Goddess Parvati.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Birthday Section */}
        <div 
          className={`profile-section ${animation === 'birthday' ? 'bounce-animation' : ''}`}
          style={{
            gridArea: 'birthday',
            padding: '15px',
            border: '2px solid #000',
            borderRadius: '10px',
            backgroundColor: '#FFF1CF',
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.3s, box-shadow 0.3s',
            cursor: 'pointer',
            boxShadow: activeSection === 'birthday' ? '0 8px 16px rgba(0,0,0,0.2)' : '0 4px 8px rgba(0,0,0,0.1)',
            transform: animation === 'birthday' ? 'scale(1.02)' : 'scale(1)'
          }}
          onClick={() => handleSectionClick('birthday')}
        >
          <div style={{ flex: '0 0 auto', marginRight: '20px' }}>
            <svg width={isMobile ? "50" : "60"} height={isMobile ? "50" : "60"} viewBox="0 0 60 60">
              <path d="M30,10 L35,20 L25,20 Z" fill="#FFC107" /> {/* Candle */}
              <rect x="25" y="20" width="10" height="5" fill="#FFC107" /> {/* Candle base */}
              <rect x="10" y="25" width="40" height="15" rx="5" fill="#FF9800" /> {/* Top tier */}
              <rect x="5" y="40" width="50" height="15" rx="5" fill="#FF5722" /> {/* Bottom tier */}
              <path d="M10,25 Q30,15 50,25" stroke="#FFFFFF" strokeWidth="2" fill="none" /> {/* Decoration */}
              <path d="M5,40 Q30,30 55,40" stroke="#FFFFFF" strokeWidth="2" fill="none" /> {/* Decoration */}
              
              {/* Animate candle flame if section is active */}
              {activeSection === 'birthday' && (
                <circle cx="30" cy="8" r="3" fill="#FFEB3B">
                  <animate 
                    attributeName="r" 
                    values="2;3;2;3;2" 
                    dur="1s" 
                    repeatCount="indefinite" 
                  />
                </circle>
              )}
            </svg>
          </div>
          <div style={{ flex: '1' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '18px' : '20px' }}>My Birthday is</h3>
            <p style={{ margin: '0', fontWeight: 'bold', fontSize: isMobile ? '16px' : '18px' }}>Ganesh Chaturthi</p>
            
            {activeSection === 'birthday' && (
              <div style={{ 
                marginTop: '10px', 
                padding: '8px', 
                backgroundColor: 'rgba(255,255,255,0.7)',
                borderRadius: '5px',
                fontSize: isMobile ? '12px' : '14px',
                animation: 'fadeIn 0.5s'
              }}>
                This is usually celebrated in August or September. People celebrate with 
                lots of singing, dancing, and offering modaks!
              </div>
            )}
          </div>
        </div>

        {/* Photo Section */}
        <div 
          className={`profile-section ${animation === 'photo' ? 'wiggle-animation' : ''}`}
          style={{
            gridArea: 'photo',
            padding: '10px',
            border: '2px solid #000',
            borderRadius: '10px',
            backgroundColor: '#E2F0CB',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'transform 0.3s, box-shadow 0.3s',
            cursor: 'pointer',
            boxShadow: activeSection === 'photo' ? '0 8px 16px rgba(0,0,0,0.2)' : '0 4px 8px rgba(0,0,0,0.1)',
            transform: animation === 'photo' ? 'scale(1.05)' : 'scale(1)'
          }}
          onClick={() => handleSectionClick('photo')}
        >
          <div className={activeSection === 'photo' ? 'elephant-animate' : ''} style={{
            width: isMobile ? '70px' : '80px',
            height: isMobile ? '70px' : '80px',
            borderRadius: '50%',
            backgroundColor: '#FFC7D1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '50px' : '60px',
            marginBottom: '10px',
            transition: 'transform 0.3s'
          }}>
            🐘
          </div>
          <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: isMobile ? '16px' : '18px' }}>
            Photo of me
          </p>
          
          {activeSection === 'photo' && (
            <div style={{ 
              marginTop: '10px', 
              padding: '8px', 
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: '5px',
              fontSize: isMobile ? '12px' : '14px',
              animation: 'fadeIn 0.5s',
              width: '100%',
              textAlign: 'center'
            }}>
              My elephant head helps me be wise and remove obstacles!
            </div>
          )}
        </div>

        {/* Favorite Things Section */}
        <div 
          className={`profile-section ${animation === 'favorite' ? 'zoom-animation' : ''}`}
          style={{
            gridArea: 'favorite',
            padding: '15px',
            border: '2px solid #000',
            borderRadius: '10px',
            backgroundColor: '#D4F1F9',
            transition: 'transform 0.3s, box-shadow 0.3s',
            cursor: 'pointer',
            boxShadow: activeSection === 'favorite' ? '0 8px 16px rgba(0,0,0,0.2)' : '0 4px 8px rgba(0,0,0,0.1)',
            transform: animation === 'favorite' ? 'scale(1.02)' : 'scale(1)'
          }}
          onClick={() => handleSectionClick('favorite')}
        >
          <h3 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '18px' : '20px' }}>My favorite</h3>
          <p style={{ margin: '5px 0', fontSize: isMobile ? '14px' : '16px' }}>
            <strong>Food:</strong> Modak
          </p>
          <p style={{ margin: '5px 0', fontSize: isMobile ? '14px' : '16px' }}>
            <strong>Color:</strong> Orange
          </p>
          <p style={{ margin: '5px 0', fontSize: isMobile ? '14px' : '16px' }}>
            <strong>Music:</strong> Devotional songs
          </p>
          
          <div className={activeSection === 'favorite' ? 'fold-down' : 'fold-up'} style={{
            height: activeSection === 'favorite' ? 'auto' : '0px',
            overflow: 'hidden',
            transition: 'height 0.4s ease-in-out'
          }}>
            <div style={{ 
              marginTop: '10px', 
              padding: '8px', 
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: '5px',
              fontSize: isMobile ? '12px' : '14px'
            }}>
              <p style={{ margin: '0' }}>
                Modaks are sweet dumplings filled with coconut and jaggery. I love them!
              </p>
              <p style={{ marginTop: '5px', marginBottom: '0' }}>
                🍡 They're my favorite treat!
              </p>
            </div>
          </div>
        </div>

        {/* Best Friend Section */}
        <div 
          className={`profile-section ${animation === 'bestfriend' ? 'slide-animation' : ''}`}
          style={{
            gridArea: 'bestfriend',
            padding: '15px',
            border: '2px solid #000',
            borderRadius: '10px',
            backgroundColor: '#DCDCFF',
            transition: 'transform 0.3s, box-shadow 0.3s',
            cursor: 'pointer',
            boxShadow: activeSection === 'bestfriend' ? '0 8px 16px rgba(0,0,0,0.2)' : '0 4px 8px rgba(0,0,0,0.1)',
            transform: animation === 'bestfriend' ? 'translateX(5px)' : 'translateX(0)'
          }}
          onClick={() => handleSectionClick('bestfriend')}
        >
          <h3 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '18px' : '20px' }}>My best friend is</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ margin: '0', fontWeight: 'bold', fontSize: isMobile ? '16px' : '18px' }}>Mooshika (mouse)</p>
            <span style={{ marginLeft: '5px', fontSize: '20px' }}>🐁</span>
          </div>
          
          <div className={activeSection === 'bestfriend' ? 'fold-down' : 'fold-up'} style={{
            height: activeSection === 'bestfriend' ? 'auto' : '0px',
            overflow: 'hidden',
            transition: 'height 0.4s ease-in-out'
          }}>
            <div style={{ 
              marginTop: '10px', 
              padding: '8px', 
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: '5px',
              fontSize: isMobile ? '12px' : '14px'
            }}>
              <p style={{ margin: '0' }}>
                Mooshika is a small mouse who helps me travel everywhere!
              </p>
              {!isMobile && (
                <p style={{ marginTop: '5px', marginBottom: '0' }}>
                  Even though he's small, he's very strong and loyal.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Family Section */}
        <div 
          className={`profile-section ${animation === 'family' ? 'pulse-animation' : ''}`}
          style={{
            gridArea: 'family',
            padding: '15px',
            border: '2px solid #000',
            borderRadius: '10px',
            backgroundColor: '#FFCCE5',
            transition: 'transform 0.3s, box-shadow 0.3s',
            cursor: 'pointer',
            boxShadow: activeSection === 'family' ? '0 8px 16px rgba(0,0,0,0.2)' : '0 4px 8px rgba(0,0,0,0.1)',
            transform: animation === 'family' ? 'scale(1.02)' : 'scale(1)'
          }}
          onClick={() => handleSectionClick('family')}
        >
          <h3 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '18px' : '20px' }}>My Family</h3>
          <p style={{ margin: '0', fontWeight: 'bold', fontSize: isMobile ? '16px' : '18px' }}>Shiva and Parvati</p>
          
          <div className={activeSection === 'family' ? 'fold-down' : 'fold-up'} style={{
            height: activeSection === 'family' ? 'auto' : '0px',
            overflow: 'hidden',
            transition: 'height 0.4s ease-in-out'
          }}>
            <div style={{ 
              marginTop: '10px', 
              padding: '8px', 
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: '5px',
              fontSize: isMobile ? '12px' : '14px'
            }}>
              <p style={{ margin: '0' }}>
                My father is Lord Shiva and my mother is Goddess Parvati. I also have a brother named Kartikeya.
              </p>
            </div>
          </div>
        </div>

        {/* Want to Be Section */}
        <div 
          className={`profile-section ${animation === 'wanttobe' ? 'rotate-animation' : ''}`}
          style={{
            gridArea: 'wanttobe',
            padding: '15px',
            border: '2px solid #000',
            borderRadius: '10px',
            backgroundColor: '#FFADAD',
            transition: 'transform 0.3s, box-shadow 0.3s',
            cursor: 'pointer',
            boxShadow: activeSection === 'wanttobe' ? '0 8px 16px rgba(0,0,0,0.2)' : '0 4px 8px rgba(0,0,0,0.1)',
            transform: animation === 'wanttobe' ? 'rotate(1deg)' : 'rotate(0deg)'
          }}
          onClick={() => handleSectionClick('wanttobe')}
        >
          <h3 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '18px' : '20px' }}>I want to be</h3>
          <p style={{ margin: '0', fontWeight: 'bold', fontSize: isMobile ? '16px' : '18px' }}>The remover of obstacles</p>
          <p style={{ margin: '5px 0 0 0', fontSize: isMobile ? '14px' : '16px' }}>when I grow up.</p>
          
          {activeSection === 'wanttobe' && (
            <div style={{ 
              marginTop: '10px', 
              padding: '8px', 
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: '5px',
              fontSize: isMobile ? '12px' : '14px',
              animation: 'fadeIn 0.5s'
            }}>
              People pray to me before starting new things because I help clear their path to success!
            </div>
          )}
        </div>

        {/* Want to Go To Section */}
        <div 
          className={`profile-section ${animation === 'goto' ? 'float-animation' : ''}`}
          style={{
            gridArea: 'goto',
            padding: '15px',
            border: '2px solid #000',
            borderRadius: '10px',
            backgroundColor: '#FFF1CF',
            transition: 'transform 0.3s, box-shadow 0.3s',
            cursor: 'pointer',
            boxShadow: activeSection === 'goto' ? '0 8px 16px rgba(0,0,0,0.2)' : '0 4px 8px rgba(0,0,0,0.1)'
          }}
          onClick={() => handleSectionClick('goto')}
        >
          <h3 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '18px' : '20px' }}>I want to go to</h3>
          <p style={{ margin: '0', fontWeight: 'bold', fontSize: isMobile ? '16px' : '18px' }}>Your home and bless you</p>
          
          {activeSection === 'goto' && (
            <div style={{ 
              marginTop: '10px', 
              padding: '8px', 
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: '5px',
              fontSize: isMobile ? '12px' : '14px',
              animation: 'fadeIn 0.5s'
            }}>
              Many people have a special place for me in their homes. It helps them remember to stay positive and overcome challenges!
            </div>
          )}
        </div>

        {/* I Like Section */}
        <div 
          className={`profile-section ${animation === 'likes' ? 'shake-animation' : ''}`}
          style={{
            gridArea: 'ilike',
            padding: '15px',
            border: '2px solid #000',
            borderRadius: '10px',
            backgroundColor: '#BDE0FE',
            transition: 'transform 0.3s, box-shadow 0.3s',
            cursor: 'pointer',
            boxShadow: activeSection === 'likes' ? '0 8px 16px rgba(0,0,0,0.2)' : '0 4px 8px rgba(0,0,0,0.1)'
          }}
          onClick={() => handleSectionClick('likes')}
        >
          <h3 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '18px' : '20px' }}>I like:</h3>
          <p style={{ margin: '0', fontWeight: 'bold', fontSize: isMobile ? '16px' : '18px' }}>Modaks, Wisdom, Writing</p>
          <h3 style={{ margin: '10px 0 5px 0', fontSize: isMobile ? '18px' : '20px' }}>I don't like:</h3>
          <p style={{ margin: '0', fontWeight: 'bold', fontSize: isMobile ? '16px' : '18px' }}>Obstacles</p>
          
          <div className={activeSection === 'likes' ? 'fold-down' : 'fold-up'} style={{
            height: activeSection === 'likes' ? 'auto' : '0px',
            overflow: 'hidden',
            transition: 'height 0.4s ease-in-out'
          }}>
            <div style={{ 
              marginTop: '10px', 
              padding: '8px', 
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: '5px',
              fontSize: isMobile ? '12px' : '14px'
            }}>
              <p style={{ margin: '0' }}>
                I wrote down the Mahabharata using my broken tusk as a pen! I love sharing wisdom.
              </p>
            </div>
          </div>
        </div>

        {/* Good At Section */}
        <div 
          className={`profile-section ${animation === 'goodat' ? 'grow-animation' : ''}`}
          style={{
            gridArea: 'goodat',
            padding: '15px',
            border: '2px solid #000',
            borderRadius: '10px',
            backgroundColor: '#E2F0CB',
            transition: 'transform 0.3s, box-shadow 0.3s',
            cursor: 'pointer',
            boxShadow: activeSection === 'goodat' ? '0 8px 16px rgba(0,0,0,0.2)' : '0 4px 8px rgba(0,0,0,0.1)',
            transform: animation === 'goodat' ? 'scale(1.05)' : 'scale(1)'
          }}
          onClick={() => handleSectionClick('goodat')}
        >
          <h3 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '18px' : '20px' }}>I am good at</h3>
          <p style={{ margin: '0', fontWeight: 'bold', fontSize: isMobile ? '16px' : '18px' }}>Removing obstacles and bringing good luck!</p>
          
          {activeSection === 'goodat' && (
            <div style={{ 
              marginTop: '10px', 
              padding: '8px', 
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: '5px',
              fontSize: isMobile ? '12px' : '14px',
              animation: 'fadeIn 0.5s'
            }}>
              People call me "Vighnaharta" which means "remover of obstacles." I use my wisdom to help people overcome challenges!
            </div>
          )}
        </div>
      </div>
      
      {/* Fun Fact Footer */}
      <div 
        className={`profile-section ${animation === 'funfact' ? 'pulse-animation' : ''}`}
        style={{
          backgroundColor: '#FFF9C4',
          padding: '15px',
          borderRadius: '10px',
          border: '2px solid #000',
          marginTop: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          boxShadow: activeSection === 'funfact' ? '0 8px 16px rgba(0,0,0,0.2)' : '0 4px 8px rgba(0,0,0,0.1)',
          transform: animation === 'funfact' ? 'scale(1.02)' : 'scale(1)',
          transition: 'transform 0.3s, box-shadow 0.3s'
        }}
        onClick={() => handleSectionClick('funfact')}
      >
        <h3 style={{ margin: '0 0 10px 0', color: '#5D1049', fontSize: isMobile ? '18px' : '20px' }}>Fun Fact! ✨</h3>
        <p style={{ margin: '0', fontSize: isMobile ? '14px' : '16px' }}>
          I wrote down the Mahabharata, one of the longest poems in the world!
          {!isMobile && " My trunk helped me write really fast!"}
        </p>
        
        {activeSection === 'funfact' && (
          <div style={{ 
            marginTop: '10px', 
            padding: '8px', 
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderRadius: '5px',
            fontSize: isMobile ? '12px' : '14px',
            animation: 'fadeIn 0.5s',
            textAlign: 'left'
          }}>
            <p style={{ margin: '0' }}>
              The sage Vyasa asked me to write down the Mahabharata as he dictated it. I broke off my tusk to use as a pen when my regular pen broke!
            </p>
          </div>
        )}
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '20px',
        fontSize: isMobile ? '12px' : '14px',
        fontStyle: 'italic',
        color: '#666'
      }}>
        <p>Click on sections to learn more about Ganesha!</p>
      </div>
      
      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes flip {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(180deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        
        @keyframes zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes slide {
          0% { transform: translateX(0); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(0); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(1deg); }
          75% { transform: rotate(-1deg); }
          100% { transform: rotate(0deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        
        @keyframes grow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .flip-animation {
          animation: flip 0.6s;
        }
        
        .bounce-animation {
          animation: bounce 0.5s;
        }
        
        .wiggle-animation {
          animation: wiggle 0.5s;
        }
        
        .zoom-animation {
          animation: zoom 0.5s;
        }
        
        .slide-animation {
          animation: slide 0.5s;
        }
        
        .pulse-animation {
          animation: pulse 0.5s;
        }
        
        .rotate-animation {
          animation: rotate 0.5s;
        }
        
        .float-animation {
          animation: float 2s infinite;
        }
        
        .shake-animation {
          animation: shake 0.5s;
        }
        
        .grow-animation {
          animation: grow 0.5s;
        }
        
        .elephant-animate {
          animation: wiggle 1s infinite;
        }
        
        .fold-down {
          animation: fadeIn 0.5s;
        }
        
        @media (max-width: 768px) {
          .ganesha-profile {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default GaneshaProfile;
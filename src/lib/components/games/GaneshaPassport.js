import React, { useState, useEffect } from 'react';

const GaneshaPassport = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [stampCollected, setStampCollected] = useState([false, false, false, false, false, false]);
  const [showStampAnimation, setShowStampAnimation] = useState(false);
  const [stampAnimationPosition, setStampAnimationPosition] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Passport pages data
  const pages = [
    {
      id: 'cover',
      title: "Ganesha's Passport",
      content: "Open to learn about me!",
      color: "#FF9800",
      stampPosition: { top: '70%', left: '50%' }
    },
    {
      id: 'identity',
      title: "Personal Details",
      content: {
        name: "Lord Ganesha",
        otherNames: "Ganapati, Vinayaka",
        birthday: "Ganesh Chaturthi (usually in August-September)",
        family: "Father: Lord Shiva, Mother: Goddess Parvati",
      },
      color: "#E91E63",
      stampPosition: { top: '75%', right: '20%' }
    },
    {
      id: 'appearance',
      title: "My Appearance",
      content: {
        head: "Elephant head with a curved trunk",
        body: "Large body with human form",
        specialFeature: "One broken tusk that I use as a pen",
        vahana: "I travel on a mouse named Mooshika"
      },
      color: "#9C27B0",
      stampPosition: { top: '20%', right: '25%' }
    },
    {
      id: 'favorites',
      title: "My Favorites",
      content: {
        food: "Modak (sweet dumplings with coconut and jaggery)",
        activity: "Writing and sharing wisdom",
        position: "Lord of Beginnings",
        specialty: "Removing obstacles from your path"
      },
      color: "#4CAF50",
      stampPosition: { top: '70%', left: '25%' }
    },
    {
      id: 'stories',
      title: "My Stories",
      content: {
        elephantHead: "When my father Lord Shiva returned home, I was guarding my mother's door. He got angry and cut off my head! To console my mother, he replaced it with an elephant's head.",
        brokenTusk: "I broke my own tusk to write down the Mahabharata epic when my pen broke.",
        raceWithKartikeya: "My brother Kartikeya and I had a race around the world. He went traveling, but I simply walked around my parents saying they were my world, and I won!"
      },
      color: "#2196F3",
      stampPosition: { top: '30%', left: '30%' }
    },
    {
      id: 'blessings',
      title: "My Blessings",
      content: "I remove obstacles from your path and bring good fortune. People pray to me before starting anything new. My blessing will help you overcome challenges with wisdom and intelligence. May all your endeavors be successful!",
      color: "#8bc34a",
      stampPosition: { top: '60%', right: '30%' }
    }
  ];

  const isMobile = windowWidth < 768;
  const bookWidth = isMobile ? windowWidth * 0.9 : 600;
  const pageWidth = bookWidth / 2;
  const pageHeight = isMobile ? 500 : 600;

  const nextPage = () => {
    if (currentPage < pages.length - 1 && !flipping) {
      setFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setFlipping(false);
      }, 500);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !flipping) {
      setFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setFlipping(false);
      }, 500);
    }
  };

  const collectStamp = (pageIndex) => {
    if (!stampCollected[pageIndex]) {
      // Set stamp animation position
      const position = pages[pageIndex].stampPosition;
      setStampAnimationPosition(position);
      setShowStampAnimation(true);
      
      // After animation, update stamp collection
      setTimeout(() => {
        setShowStampAnimation(false);
        setStampCollected(prev => {
          const newStamps = [...prev];
          newStamps[pageIndex] = true;
          return newStamps;
        });
      }, 1000);
    }
  };

  // Count collected stamps
  const collectedStampsCount = stampCollected.filter(stamp => stamp).length;

  const renderPage = (page, index) => {
    // Cover page
    if (page.id === 'cover') {
      return (
        <div className="passport-page" style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(145deg, ${page.color}, ${adjustColor(page.color, -20)})`,
          borderRadius: '10px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>PASSPORT</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Stamps: {collectedStampsCount}/{pages.length - 1}
            </span>
          </div>
          
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#FFC7D1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '60px',
            margin: '20px'
          }}>
            🐘
          </div>
          
          <h1 style={{ 
            fontSize: isMobile ? '28px' : '36px', 
            margin: '15px 0',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            {page.title}
          </h1>
          
          <p style={{ 
            fontSize: isMobile ? '16px' : '20px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            {page.content}
          </p>
          
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            fontSize: '14px'
          }}>
            Collect stamps by learning about me!
          </div>
          
          {/* Passport decorative elements */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            width: '80px',
            height: '50px',
            borderRadius: '5px',
            border: '1px dashed rgba(255,255,255,0.5)'
          }}></div>
          
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '20px',
            transform: 'translateY(-50%)',
            width: '3px',
            height: '70%',
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '3px'
          }}></div>
          
          {/* Stamp spot */}
          {stampCollected[0] && (
            <div style={{
              position: 'absolute',
              top: page.stampPosition.top,
              left: page.stampPosition.left,
              transform: 'translate(-50%, -50%) rotate(-15deg)',
              padding: '15px',
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: '5px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#FF5722',
              border: '2px solid #FF5722'
            }}>
              WELCOME
            </div>
          )}
        </div>
      );
    }
    
    // Regular pages
    return (
      <div className="passport-page" style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(145deg, ${page.color}, ${adjustColor(page.color, -20)})`,
        borderRadius: '10px',
        padding: '20px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => collectStamp(index)}
      >
        <h2 style={{ 
          fontSize: isMobile ? '22px' : '28px', 
          margin: '10px 0 20px 0',
          textAlign: 'center',
          borderBottom: '2px dashed rgba(255,255,255,0.5)',
          paddingBottom: '10px',
          textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
        }}>
          {page.title}
        </h2>
        
        {typeof page.content === 'string' ? (
          <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: '1.6' }}>
            {page.content}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {Object.entries(page.content).map(([key, value]) => (
              <div key={key}>
                <strong style={{ 
                  fontSize: isMobile ? '16px' : '18px',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  padding: '3px 8px',
                  borderRadius: '5px'
                }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </strong>
                <p style={{ 
                  margin: '5px 0 0 10px',
                  fontSize: isMobile ? '15px' : '17px',
                  lineHeight: '1.4'
                }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {/* Page number */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          backgroundColor: 'rgba(255,255,255,0.3)',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          {index}
        </div>
        
        {/* Passport decorative elements */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '40px',
          height: '40px',
          borderRadius: '5px',
          border: '1px dashed rgba(255,255,255,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          🇮🇳
        </div>
        
        {/* Stamp spot */}
        {stampCollected[index] && (
          <div style={{
            position: 'absolute',
            top: page.stampPosition.top || '50%',
            left: page.stampPosition.left,
            right: page.stampPosition.right,
            transform: 'translate(-50%, -50%) rotate(-15deg)',
            padding: '15px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: '5px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#FF5722',
            border: '2px solid #FF5722'
          }}>
            VISITED
          </div>
        )}
        
        {!stampCollected[index] && (
          <div style={{
            position: 'absolute',
            bottom: '15px',
            left: '15px',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.7)'
          }}>
            Tap anywhere to collect stamp
          </div>
        )}
      </div>
    );
  };

  // Helper function to adjust color brightness
  function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    );
  }

  return (
    <div style={{
      width: '100%',
      padding: '20px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f5f7fa, #e4e8eb)',
      fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive"
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#5D1049',
        marginBottom: '20px',
        fontSize: isMobile ? '24px' : '32px'
      }}>
        Get to Know Ganesha!
      </h1>
      
      {/* Passport Book */}
      <div style={{
        width: bookWidth + 'px',
        height: pageHeight + 'px',
        position: 'relative',
        perspective: '1500px',
        marginBottom: '20px'
      }}>
        {/* Pages */}
        {pages.map((page, index) => {
          const isRightPage = currentPage === index;
          const isLeftPage = currentPage === index - 1;
          const shouldRender = isRightPage || isLeftPage;
          
          if (!shouldRender) return null;
          
          const zIndex = isRightPage ? 1 : 2;
          const rotateY = flipping ? (isRightPage ? '-180deg' : '0deg') : (isRightPage ? '0deg' : '-180deg');
          
          return (
            <div
              key={page.id}
              style={{
                position: 'absolute',
                width: pageWidth + 'px',
                height: pageHeight + 'px',
                top: 0,
                left: isLeftPage ? 0 : pageWidth,
                transformStyle: 'preserve-3d',
                transformOrigin: isLeftPage ? 'right center' : 'left center',
                transition: 'transform 0.5s ease-in-out',
                transform: isLeftPage ? `rotateY(${rotateY})` : 'rotateY(0deg)',
                zIndex: zIndex,
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                borderRadius: '10px'
              }}
            >
              {/* Front of page (visible when book is open) */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}
              >
                {renderPage(page, index)}
              </div>
              
              {/* Back of page (visible when turning) */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  color: '#666'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <h3>Ganesha's Passport</h3>
                  <p>Keep exploring to learn more about me!</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Navigation buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '20px'
      }}>
        <button
          onClick={prevPage}
          disabled={currentPage === 0 || flipping}
          style={{
            padding: '10px 20px',
            backgroundColor: currentPage === 0 ? '#e0e0e0' : '#FF9800',
            color: currentPage === 0 ? '#999' : '#fff',
            border: 'none',
            borderRadius: '50px',
            fontSize: isMobile ? '14px' : '16px',
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          <span>◀</span> Previous
        </button>
        
        <span style={{ 
          fontSize: isMobile ? '14px' : '16px',
          color: '#666',
          alignSelf: 'center' 
        }}>
          Page {currentPage + 1} of {pages.length}
        </span>
        
        <button
          onClick={nextPage}
          disabled={currentPage === pages.length - 1 || flipping}
          style={{
            padding: '10px 20px',
            backgroundColor: currentPage === pages.length - 1 ? '#e0e0e0' : '#FF9800',
            color: currentPage === pages.length - 1 ? '#999' : '#fff',
            border: 'none',
            borderRadius: '50px',
            fontSize: isMobile ? '14px' : '16px',
            cursor: currentPage === pages.length - 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          Next <span>▶</span>
        </button>
      </div>
      
      {/* Stamp collection progress */}
      <div style={{
        marginTop: '25px',
        padding: '15px',
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: '10px',
        width: isMobile ? '90%' : '450px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#5D1049' }}>
          Passport Stamps: {collectedStampsCount}/{pages.length - 1}
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          {pages.slice(1).map((page, index) => (
            <div 
              key={index} 
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: stampCollected[index + 1] ? page.color : '#e0e0e0',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                boxShadow: stampCollected[index + 1] ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {stampCollected[index + 1] ? '✓' : (index + 1)}
            </div>
          ))}
        </div>
        {collectedStampsCount === pages.length - 1 && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: '5px',
            animation: 'pulse 2s infinite'
          }}>
            Congratulations! You've collected all stamps!
          </div>
        )}
      </div>
      
      {/* Stamp animation */}
      {showStampAnimation && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '150px',
          height: '150px',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '24px',
          color: '#FF5722',
          border: '3px solid #FF5722',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          zIndex: 1000,
          animation: 'stamping 1s forwards'
        }}>
          VISITED
        </div>
      )}
      
      <style jsx>{`
        @keyframes stamping {
          0% { transform: translate(-50%, -50%) scale(3) rotate(45deg); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.2) rotate(-15deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1) rotate(-15deg); opacity: 1; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default GaneshaPassport;
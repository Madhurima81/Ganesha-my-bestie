import React, { useState, useEffect, useRef } from 'react';

const GaneshaStoryHighlight = () => {
  // State for tracking story progress
  const [currentPage, setCurrentPage] = useState(0);
  const [highlightedPart, setHighlightedPart] = useState(null);
  const [partInfo, setPartInfo] = useState(null);
  const [waitingForInteraction, setWaitingForInteraction] = useState(false);
  const [allPagesCompleted, setAllPagesCompleted] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  
  // Refs
  const storyContainerRef = useRef(null);
  
  // Story pages with their content, highlighted parts, and interactions
  const storyPages = [
    {
      text: "Once upon a time, there was a special God named Ganesha. Ganesha had a very special head that made him unique.",
      highlightPart: 'head',
      requireInteraction: true,
      background: '#FFF9C4'
    },
    {
      text: "Ganesha's head was not like others. He had the head of an elephant! This elephant head made him very wise and smart.",
      highlightPart: 'head',
      requireInteraction: false,
      background: '#E1F5FE'
    },
    {
      text: "Ganesha had big, big ears. These weren't just any ears - they were special. Can you find Ganesha's ears?",
      highlightPart: 'ears',
      requireInteraction: true,
      background: '#F9FBE7'
    },
    {
      text: "His big ears helped him listen carefully to everyone. Ganesha teaches us that good listeners learn more!",
      highlightPart: 'ears',
      requireInteraction: false,
      background: '#E8F5E9'
    },
    {
      text: "Look at Ganesha's trunk! It's curved in a special way. Can you find the trunk?",
      highlightPart: 'trunk',
      requireInteraction: true,
      background: '#FFF3E0'
    },
    {
      text: "Ganesha's trunk is very clever! It can do big jobs and tiny ones too. It shows that we should be flexible and adapt to different situations.",
      highlightPart: 'trunk',
      requireInteraction: false,
      background: '#FFEBEE'
    },
    {
      text: "Ganesha has a big round tummy! Can you find it?",
      highlightPart: 'belly',
      requireInteraction: true,
      background: '#E8EAF6'
    },
    {
      text: "His big belly shows that he can digest all experiences in life - both the good and the bad. Everything becomes wisdom inside Ganesha!",
      highlightPart: 'belly',
      requireInteraction: false,
      background: '#F3E5F5'
    },
    {
      text: "Look at Ganesha's little friend! There's a small mouse near his feet. Can you find the mouse?",
      highlightPart: 'mouse',
      requireInteraction: true,
      background: '#E0F7FA'
    },
    {
      text: "The mouse is Ganesha's vehicle and friend. Even though the mouse is small, it helps mighty Ganesha travel. This teaches us that everyone, big or small, has importance!",
      highlightPart: 'mouse',
      requireInteraction: false,
      background: '#FFF8E1'
    },
    {
      text: "In Ganesha's hand, there's a special axe. Can you find it?",
      highlightPart: 'axe',
      requireInteraction: true,
      background: '#EFEBE9'
    },
    {
      text: "The axe helps Ganesha cut away obstacles in our path. When things get difficult, Ganesha helps remove the problems!",
      highlightPart: 'axe',
      requireInteraction: false,
      background: '#F1F8E9'
    },
    {
      text: "Ganesha loves sweets! He's holding his favorite sweet called a modak. Can you find the modak?",
      highlightPart: 'modak',
      requireInteraction: true,
      background: '#FFECB3'
    },
    {
      text: "The sweet modak represents the rewards we get from working hard and being good. Ganesha reminds us that good actions bring sweet results!",
      highlightPart: 'modak',
      requireInteraction: false,
      background: '#FFCDD2'
    },
    {
      text: "Now you know all about Ganesha! Each part of him has a special meaning. Ganesha is the Remover of Obstacles and brings good luck to all who remember him.",
      highlightPart: null,
      requireInteraction: false,
      background: '#DCEDC8'
    }
  ];
  
  // Ganesha's parts with their positions and info
  const ganeshaParts = {
    head: {
      name: 'Elephant Head',
      position: { top: '15%', left: '50%', width: '40%', height: '30%' },
      info: 'The elephant head represents wisdom and intelligence. Elephants are very smart animals!'
    },
    ears: {
      name: 'Big Ears',
      position: { top: '20%', left: '80%', width: '25%', height: '20%' },
      info: 'The large ears symbolize the importance of listening well and being a good student.'
    },
    trunk: {
      name: 'Curved Trunk',
      position: { top: '35%', left: '60%', width: '30%', height: '20%' },
      info: 'The trunk shows adaptability and efficiency. It can do many different tasks!'
    },
    belly: {
      name: 'Big Belly',
      position: { top: '60%', left: '50%', width: '40%', height: '25%' },
      info: 'The large belly represents Ganesha\'s ability to digest all experiences and consume obstacles.'
    },
    mouse: {
      name: 'Mouse Friend',
      position: { top: '85%', left: '30%', width: '20%', height: '15%' },
      info: 'The mouse is Ganesha\'s vehicle. Even though it\'s small, it helps mighty Ganesha get around!'
    },
    axe: {
      name: 'Axe',
      position: { top: '40%', left: '20%', width: '20%', height: '20%' },
      info: 'The axe symbolizes cutting away attachments and obstacles that hold us back.'
    },
    modak: {
      name: 'Sweet Modak',
      position: { top: '50%', left: '80%', width: '15%', height: '15%' },
      info: 'The modak (sweet) represents the rewards of spiritual seeking and good actions.'
    }
  };
  
  // Check when all pages are completed
  useEffect(() => {
    if (currentPage >= storyPages.length - 1) {
      setAllPagesCompleted(true);
    }
  }, [currentPage]);
  
  // Setup or reset wait state when page changes
  useEffect(() => {
    if (currentPage < storyPages.length) {
      const page = storyPages[currentPage];
      setHighlightedPart(page.highlightPart);
      setWaitingForInteraction(page.requireInteraction);
      setPartInfo(null);
      
      // Scroll to top of story container when page changes
      if (storyContainerRef.current) {
        storyContainerRef.current.scrollTop = 0;
      }
    }
  }, [currentPage]);
  
  // Start the story
  const startStory = () => {
    setShowStartScreen(false);
    setCurrentPage(0);
    setAllPagesCompleted(false);
  };
  
  // Go to next page in the story
  const goToNextPage = () => {
    if (currentPage < storyPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Go to previous page in the story
  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Handle clicking on a highlighted part
  const handlePartClick = (partKey) => {
    if (partKey === highlightedPart && waitingForInteraction) {
      setPartInfo(ganeshaParts[partKey].info);
      setWaitingForInteraction(false);
    }
  };
  
  // Reset the story
  const resetStory = () => {
    setShowStartScreen(true);
    setCurrentPage(0);
    setHighlightedPart(null);
    setPartInfo(null);
    setWaitingForInteraction(false);
    setAllPagesCompleted(false);
  };
  
  // Render the current background color
  const getCurrentBackground = () => {
    if (currentPage < storyPages.length) {
      return storyPages[currentPage].background || '#ffffff';
    }
    return '#ffffff';
  };
  
  return (
    <div className="ganesha-story-highlight" style={{ 
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: "'Comic Sans MS', 'Bubblegum Sans', sans-serif",
      backgroundColor: '#f5f5f5',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Start Screen */}
      {showStartScreen ? (
        <div style={{
          padding: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            color: '#5D1049',
            marginBottom: '20px'
          }}>
            The Story of Ganesha's Symbols
          </h2>
          
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#FFE0B2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '80px',
            margin: '0 auto 20px'
          }}>
            🐘
          </div>
          
          <p style={{
            marginBottom: '25px',
            fontSize: '16px',
            color: '#333',
            lineHeight: '1.5'
          }}>
            Join us on a magical journey to learn about Lord Ganesha and discover the special meaning behind each part of him! 
            When the story asks you to find something, click on that part of Ganesha.
          </p>
          
          <button
            onClick={startStory}
            style={{
              padding: '12px 30px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            Begin the Story
          </button>
        </div>
      ) : (
        /* Story content */
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '500px'
        }}>
          {/* Story progress indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '10px',
            backgroundColor: '#fff',
          }}>
            <div style={{
              display: 'flex',
              gap: '5px'
            }}>
              {storyPages.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: index <= currentPage ? '#FF9800' : '#e0e0e0',
                    transition: 'background-color 0.3s'
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Story page */}
          <div 
            ref={storyContainerRef}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: getCurrentBackground(),
              transition: 'background-color 0.5s',
              padding: '20px'
            }}
          >
            {/* Page content */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Story text */}
              <div style={{
                fontSize: '18px',
                lineHeight: '1.6',
                padding: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '10px',
                marginBottom: '20px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                <p>{currentPage < storyPages.length ? storyPages[currentPage].text : ''}</p>
                
                {partInfo && (
                  <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: '#FFF9C4',
                    borderRadius: '5px',
                    fontSize: '16px',
                    animation: 'fadeIn 0.5s'
                  }}>
                    <p>{partInfo}</p>
                  </div>
                )}
                
                {waitingForInteraction && (
                  <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: '#FFE0B2',
                    borderRadius: '5px',
                    fontSize: '16px',
                    animation: 'pulse 1.5s infinite',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    Click on the {ganeshaParts[highlightedPart]?.name} to continue!
                  </div>
                )}
              </div>
              
              {/* Ganesha image with clickable parts */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '300px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '10px',
                overflow: 'hidden',
                marginBottom: '20px'
              }}>
                {/* This would be replaced with an actual Ganesha image */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '80%',
                  height: '80%',
                  borderRadius: '50%',
                  border: '2px dashed #ccc',
                  opacity: 0.3
                }}></div>
                
                {/* Clickable parts */}
                {Object.keys(ganeshaParts).map(partKey => (
                  <div
                    key={partKey}
                    onClick={() => handlePartClick(partKey)}
                    style={{
                      position: 'absolute',
                      top: ganeshaParts[partKey].position.top,
                      left: ganeshaParts[partKey].position.left,
                      width: ganeshaParts[partKey].position.width,
                      height: ganeshaParts[partKey].position.height,
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: highlightedPart === partKey 
                        ? 'rgba(255, 152, 0, 0.5)' 
                        : 'transparent',
                      border: highlightedPart === partKey 
                        ? '2px solid #FF9800' 
                        : '1px dashed rgba(0,0,0,0.2)',
                      borderRadius: '10px',
                      cursor: waitingForInteraction && highlightedPart === partKey 
                        ? 'pointer' 
                        : 'default',
                      zIndex: 10,
                      transition: 'all 0.3s',
                      animation: waitingForInteraction && highlightedPart === partKey 
                        ? 'highlight 2s infinite' 
                        : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {/* Part label - only visible if highlighted or hovered */}
                    <span style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      padding: '3px 8px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      opacity: highlightedPart === partKey ? 1 : 0,
                      transition: 'opacity 0.3s'
                    }}>
                      {ganeshaParts[partKey].name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px'
            }}>
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                style={{
                  padding: '8px 20px',
                  backgroundColor: currentPage === 0 ? '#e0e0e0' : '#9C27B0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: currentPage === 0 ? 'default' : 'pointer',
                  opacity: currentPage === 0 ? 0.5 : 1
                }}
              >
                Previous
              </button>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage >= storyPages.length - 1 || waitingForInteraction}
                style={{
                  padding: '8px 20px',
                  backgroundColor: (currentPage >= storyPages.length - 1 || waitingForInteraction) 
                    ? '#e0e0e0' 
                    : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: (currentPage >= storyPages.length - 1 || waitingForInteraction) 
                    ? 'default' 
                    : 'pointer',
                  opacity: (currentPage >= storyPages.length - 1 || waitingForInteraction) ? 0.5 : 1
                }}
              >
                Next
              </button>
            </div>
          </div>
          
          {/* Story complete screen */}
          {allPagesCompleted && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 20,
              animation: 'fadeIn 0.5s'
            }}>
              <div style={{
                backgroundColor: '#fff',
                padding: '30px',
                borderRadius: '15px',
                maxWidth: '80%',
                textAlign: 'center'
              }}>
                <h2 style={{ 
                  color: '#4CAF50',
                  marginBottom: '20px'
                }}>
                  Story Complete! 🎉
                </h2>
                
                <p style={{
                  marginBottom: '20px',
                  fontSize: '16px'
                }}>
                  Congratulations! You've learned all about Ganesha's special parts and what they mean.
                </p>
                
                <button
                  onClick={resetStory}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#FF9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  Read Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Animation styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes highlight {
            0%, 100% { box-shadow: 0 0 5px rgba(255, 152, 0, 0.5); }
            50% { box-shadow: 0 0 20px rgba(255, 152, 0, 0.8); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @media (max-width: 600px) {
            .ganesha-story-highlight [style*="fontSize: 18px"] {
              font-size: 16px !important;
            }
            
            .ganesha-story-highlight [style*="height: 300px"] {
              height: 250px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default GaneshaStoryHighlight;
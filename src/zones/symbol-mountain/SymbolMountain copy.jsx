import { useState, useEffect, useRef } from 'react';
import './SymbolMountain.css';

const SymbolMountain = () => {
  // State variables
  const [gameState, setGameState] = useState({
    foundSymbols: {
      modak: false,
      mooshika: false,
      belly: false
    },
    modaksInBasket: 0,
    rockVisible: false,
    rockFeedCount: 0,
    mooshikaFound: false,
    mudMoundClicked: null,
    popupOpen: false,
    currentPopupSymbol: null
  });

  // Refs
  const dragElementRef = useRef(null);
  const offsetXRef = useRef(0);
  const offsetYRef = useRef(0);
  const gameContainerRef = useRef(null);
  const mudMoundsRef = useRef([]);
  const modaksRef = useRef([]);
  const mooshikaRef = useRef(null);
  const basketRef = useRef(null);
  const rockOrBellyRef = useRef(null);
  const confettiContainerRef = useRef(null);
  const celebrationMessageRef = useRef(null);
  const mooshikaSpeechRef = useRef(null);
  const rockSpeechRef = useRef(null);

  // Symbol information
  const symbolInfo = {
    modak: {
      title: "Modak - Ganesha's Favorite Sweet",
      image: "/images/icons/symbol-modak-colored.png",
      text: "Modak is Lord Ganesha's favorite sweet! This dumpling-shaped dessert is made with rice flour and filled with coconut and jaggery. It symbolizes the reward of spiritual pursuit and the sweetness of the realized inner self. Ganesha's love for modaks teaches us to enjoy the simple pleasures of life!"
    },
    mooshika: {
      title: "Mooshika - Ganesha's Mouse Vehicle",
      image: "/images/icons/symbol-mooshika-colored.png",
      text: "Mooshika is Lord Ganesha's faithful mouse vehicle! This small creature carries the large elephant-headed god, teaching us about balancing strengths and weaknesses. The mouse represents our ego and desires that need to be controlled, while also symbolizing Ganesha's ability to navigate through small spaces and remove obstacles."
    },
    belly: {
      title: "Ganesha's Belly - Symbol of Abundance",
      image: "/images/icons/symbol-belly-colored.png",
      text: "Ganesha's large belly contains the entire universe! It represents his ability to consume and digest all experiences, both good and bad. The belly symbolizes abundance, prosperity, and the acceptance of all of life's experiences. It teaches us to fully digest our life lessons and hold space for everything that comes our way."
    }
  };

  // Listen for orientation changes to adjust layout
  useEffect(() => {
    const handleResize = () => {
      const container = gameContainerRef.current;
      if (!container) return;
      
      // Force a repaint when orientation changes
      if (window.innerHeight > window.innerWidth) {
        // Portrait mode
        container.style.width = '95vw';
        container.style.height = 'calc(95vw * 0.625)';
        container.style.maxHeight = '80vh';
      } else {
        // Landscape mode
        container.style.height = '95vh';
        container.style.width = 'calc(95vh * 1.6)';
        container.style.maxWidth = '95vw';
      }
    };

    // Initial call
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  useEffect(() => {
    // Initialize the game when component mounts
    initGame();
    
    // Hide mooshika behind a random mound
    hideMouseBehindRandomMound();

    // Set up event listeners for drop targets
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: true });
    document.addEventListener('mouseup', drop);
    document.addEventListener('touchend', drop);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', drop);
      document.removeEventListener('touchend', drop);
    };
  }, []);

  // Initialize the game
  const initGame = () => {
    // Apply pulse animation to basket
    if (basketRef.current) {
      basketRef.current.classList.add('pulse');
    }
  };

  // Create confetti
  const createConfetti = () => {
    const confettiContainer = confettiContainerRef.current;
    if (!confettiContainer) return;
    
    confettiContainer.innerHTML = ''; // Clear any previous confetti
    confettiContainer.style.display = 'block';
    
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = -10 + 'px';
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = Math.random() * 10 + 5 + 'px';
      confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
      
      confettiContainer.appendChild(confetti);
    }
    
    // Remove confetti after animation completes
    setTimeout(() => {
      confettiContainer.style.display = 'none';
    }, 4000);
  };

  // Function to show celebratory messages
  const showCelebration = (message) => {
    const celebrationElement = celebrationMessageRef.current;
    if (!celebrationElement) return;
    
    celebrationElement.textContent = message;
    celebrationElement.style.display = 'block';
    
    // Hide after a few seconds
    setTimeout(() => {
      celebrationElement.style.display = 'none';
    }, 2000);
  };

  // Show educational popup
  const showEducationalPopup = (symbolType) => {
    // Don't show another popup if one is already open
    if (gameState.popupOpen) return;
    
    setGameState(prevState => ({
      ...prevState,
      popupOpen: true,
      currentPopupSymbol: symbolType
    }));
  };

  // Close popup
  const closePopup = () => {
    const popupSymbol = gameState.currentPopupSymbol;
    
    setGameState(prevState => ({
      ...prevState,
      popupOpen: false
    }));
    
    // Update sidebar icon
    if (popupSymbol) {
      const symbolIcon = document.getElementById('symbol-' + popupSymbol);
      if (symbolIcon) {
        symbolIcon.style.backgroundImage = 
          `url('/images/icons/symbol-${popupSymbol}-colored.png')`;
        symbolIcon.classList.add('star-burst');
        symbolIcon.classList.add('discovered');
        
        // Remove animation class after it completes
        setTimeout(() => {
          symbolIcon.classList.remove('star-burst');
        }, 500);
      }
    }
    
    // Check if all games are complete
    checkGameCompletion();
  };

  // Check if all games are complete
  const checkGameCompletion = () => {
    if (gameState.foundSymbols.modak && gameState.foundSymbols.mooshika && gameState.foundSymbols.belly) {
      // All games are complete
      const instructionsElement = document.querySelector('.game-instructions');
      if (instructionsElement) {
        instructionsElement.innerHTML = 
          "Congratulations! You've completed all the games!";
      }
      
      // Show celebratory confetti
      createConfetti();
    } else {
      // Some games still need to be completed
      let remainingTasks = [];
      if (!gameState.foundSymbols.modak) remainingTasks.push("collect all modaks");
      if (!gameState.foundSymbols.mooshika) remainingTasks.push("find mooshika");
      if (!gameState.foundSymbols.belly) remainingTasks.push("transform rock to belly");
      
      const instructionsElement = document.querySelector('.game-instructions');
      if (instructionsElement && remainingTasks.length > 0) {
        instructionsElement.innerHTML = 
          `Great job! Still need to: ${remainingTasks.join(" and ")}.`;
      }
    }
  };

  // Hide mooshika behind a random mud mound
  const hideMouseBehindRandomMound = () => {
    const moundIndex = Math.floor(Math.random() * 5) + 1;
    const mooshika = mooshikaRef.current;
    const mound = document.getElementById('mound' + moundIndex);
    
    if (mooshika && mound) {
      // Get computed style to get actual position values
      const moundStyle = window.getComputedStyle(mound);
      const moundTop = parseFloat(moundStyle.top);
      const moundLeft = parseFloat(moundStyle.left);
      
      // Position mooshika relative to the mound
      mooshika.style.top = moundTop + 'px';
      mooshika.style.left = moundLeft + 'px';
    }
  };

  // Check if the clicked mound contains mooshika
  const checkForMooshika = (event) => {
    // Don't process if popup is open
    if (gameState.popupOpen) return;
    
    const mound = event.currentTarget;
    setGameState(prevState => ({
      ...prevState,
      mudMoundClicked: mound
    }));
    
    const mooshika = mooshikaRef.current;
    if (!mooshika) return;
    
    // Get the position of the mound and mooshika
    const moundRect = mound.getBoundingClientRect();
    const mooshikaRect = mooshika.getBoundingClientRect();
    
    // Check if the centers are close enough
    const moundCenterX = moundRect.left + moundRect.width / 2;
    const moundCenterY = moundRect.top + moundRect.height / 2;
    const mooshikaCenterX = mooshikaRect.left + mooshikaRect.width / 2;
    const mooshikaCenterY = mooshikaRect.top + mooshikaRect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(moundCenterX - mooshikaCenterX, 2) + 
      Math.pow(moundCenterY - mooshikaCenterY, 2)
    );
    
    // If the distance is small enough, reveal mooshika
    if (distance < 100) { // Adjusted threshold
      revealMooshika();
    } else {
      mound.style.opacity = '0.7'; // Show it's been checked
      setTimeout(() => {
        mound.style.opacity = '1'; // Reset opacity after a short delay
      }, 500);
    }
  };

  // Reveal mooshika when found
  const revealMooshika = () => {
    const mooshika = mooshikaRef.current;
    if (!mooshika) return;
    
    mooshika.style.visibility = 'visible';
    // Add jumping animation
    mooshika.classList.add('jumping');
    
    setGameState(prevState => ({
      ...prevState,
      mooshikaFound: true,
      foundSymbols: {
        ...prevState.foundSymbols,
        mooshika: true
      }
    }));
    
    // Show speech bubble
    const speechBubble = mooshikaSpeechRef.current;
    if (speechBubble) {
      speechBubble.style.display = 'block';
      speechBubble.style.opacity = '1';
      
      // Position the speech bubble above mooshika
      const mooshikaRect = mooshika.getBoundingClientRect();
      const containerRect = gameContainerRef.current.getBoundingClientRect();
      speechBubble.style.left = ((mooshikaRect.left + mooshikaRect.width/2) - containerRect.left - speechBubble.offsetWidth/2) + 'px';
      speechBubble.style.top = ((mooshikaRect.top - speechBubble.offsetHeight - 20) - containerRect.top) + 'px';
      
      // Hide speech bubble after a few seconds
      setTimeout(() => {
        speechBubble.style.opacity = '0';
        setTimeout(() => {
          speechBubble.style.display = 'none';
        }, 300);
      }, 3000);
    }
    
    // Show success indicator
    showSuccess();
    
    // Remove the clicked mound
    const mudMoundClicked = gameState.mudMoundClicked;
    if (mudMoundClicked) {
      mudMoundClicked.style.visibility = 'hidden';
    }
    
    // Show celebratory message
    showCelebration("Yay! You found Mooshika, Ganesha's faithful vehicle!");
    
    // Show educational popup after the celebration
    setTimeout(() => {
      showEducationalPopup('mooshika');
    }, 2500);
  };

  // Check basket when clicked
  const checkBasket = () => {
    // Don't process if popup is open
    if (gameState.popupOpen) return;
    
    if (gameState.modaksInBasket === 5 && !gameState.rockVisible) {
      const rockOrBelly = rockOrBellyRef.current;
      if (!rockOrBelly) return;
      
      // Reveal the rock when 5 modaks are in the basket
      rockOrBelly.style.backgroundImage = "url('/images/items/rock.png')";
      rockOrBelly.style.display = 'block';
      rockOrBelly.classList.add('bounce');
      rockOrBelly.classList.add('rock'); // Add rock class for CSS-only version
      
      setGameState(prevState => ({
        ...prevState,
        rockVisible: true
      }));
      
      // Apply pulse animation to the rock
      setTimeout(() => {
        rockOrBelly.classList.add('pulse');
        rockOrBelly.classList.remove('bounce');
      }, 1000);
      
      // Update instructions
      const instructionsElement = document.querySelector('.game-instructions');
      if (instructionsElement) {
        instructionsElement.innerHTML = 
          "Now feed the rock with modaks from the basket!";
      }
    }
  };

  // Drag and Drop Functions
  const dragStart = (e, modak) => {
    // Don't process if popup is open
    if (gameState.popupOpen) return;
    
    if (e.type === 'touchstart') {
      // Don't prevent default for touchstart - it's a passive event
      dragElementRef.current = modak;
      const touch = e.touches[0];
      offsetXRef.current = touch.clientX - modak.getBoundingClientRect().left;
      offsetYRef.current = touch.clientY - modak.getBoundingClientRect().top;
    } else {
      dragElementRef.current = modak;
      offsetXRef.current = e.clientX - modak.getBoundingClientRect().left;
      offsetYRef.current = e.clientY - modak.getBoundingClientRect().top;
    }
    
    modak.style.opacity = '0.7';
    modak.style.zIndex = '1000'; // Bring to front when dragging
  };

  const drag = (e) => {
    if (!dragElementRef.current || gameState.popupOpen) return;
    
    // Don't use preventDefault in touchmove passive event listener
    
    let clientX, clientY;
    
    if (e.type === 'touchmove') {
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Get container position
    const containerRect = gameContainerRef.current.getBoundingClientRect();
    
    // Calculate position relative to container
    const relativeX = clientX - containerRect.left - offsetXRef.current;
    const relativeY = clientY - containerRect.top - offsetYRef.current;
    
    // Keep modak within container bounds
    const modakWidth = dragElementRef.current.offsetWidth;
    const modakHeight = dragElementRef.current.offsetHeight;
    
    const boundedX = Math.max(0, Math.min(containerRect.width - modakWidth, relativeX));
    const boundedY = Math.max(0, Math.min(containerRect.height - modakHeight, relativeY));
    
    dragElementRef.current.style.position = 'absolute';
    dragElementRef.current.style.left = boundedX + 'px';
    dragElementRef.current.style.top = boundedY + 'px';
  };

  const drop = (e) => {
    if (!dragElementRef.current || gameState.popupOpen) return;
    
    const basket = basketRef.current;
    const rockOrBelly = rockOrBellyRef.current;
    const modak = dragElementRef.current;
    
    if (!basket || !modak) return;
    
    // Get element positions
    const modakRect = modak.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();
    
    const modakCenterX = modakRect.left + modakRect.width / 2;
    const modakCenterY = modakRect.top + modakRect.height / 2;
    
    // Check if dropped on basket
    if (modakCenterX > basketRect.left && modakCenterX < basketRect.right &&
        modakCenterY > basketRect.top && modakCenterY < basketRect.bottom) {
        
      // Only count if not already in basket
      if (!modak.dataset.inBasket) {
        const newModaksInBasket = gameState.modaksInBasket + 1;
        modak.dataset.inBasket = "true";
        
        // Update counter
        const counterElement = document.getElementById('modak-counter');
        if (counterElement) {
          counterElement.textContent = `Modaks: ${newModaksInBasket}/5`;
        }
        
        // Position modaks in a semicircle or grid pattern in the basket
        // rather than stacking them on top of each other
        const basketCenterX = basketRect.left + basketRect.width / 2;
        const basketCenterY = basketRect.top + basketRect.height / 2;
        const containerRect = gameContainerRef.current.getBoundingClientRect();
        
        // Position based on how many modaks are already in the basket
        let relativeX, relativeY;
        
        switch(newModaksInBasket) {
          case 1: // Center modak
            relativeX = (basketCenterX - containerRect.left) - modakRect.width/2;
            relativeY = (basketCenterY - containerRect.top) - modakRect.height/2;
            break;
          case 2: // Top left
            relativeX = (basketCenterX - containerRect.left) - modakRect.width - 5;
            relativeY = (basketCenterY - containerRect.top) - modakRect.height - 5;
            break;
          case 3: // Top right
            relativeX = (basketCenterX - containerRect.left) + 5;
            relativeY = (basketCenterY - containerRect.top) - modakRect.height - 5;
            break;
          case 4: // Bottom left
            relativeX = (basketCenterX - containerRect.left) - modakRect.width - 5;
            relativeY = (basketCenterY - containerRect.top) + 5;
            break;
          case 5: // Bottom right
            relativeX = (basketCenterX - containerRect.left) + 5;
            relativeY = (basketCenterY - containerRect.top) + 5;
            break;
          default:
            relativeX = (basketCenterX - containerRect.left);
            relativeY = (basketCenterY - containerRect.top);
        }
        
        // Apply position
        modak.style.left = relativeX + 'px';
        modak.style.top = relativeY + 'px';
        
        // Add bounce animation
        modak.classList.add('bounce');
        setTimeout(() => {
          modak.classList.remove('bounce');
        }, 1000);
        
        setGameState(prevState => ({
          ...prevState,
          modaksInBasket: newModaksInBasket
        }));
        
        // Check if all 5 modaks are collected
        if (newModaksInBasket === 5) {
          // Show success
          showSuccess();
          
          // Show celebratory message
          showCelebration("Amazing! You've collected all the modaks for Ganesha!");
          
          // Automatically show the rock when 5 modaks are collected
          if (!gameState.rockVisible) {
            const rockOrBelly = rockOrBellyRef.current;
            if (rockOrBelly) {
              rockOrBelly.style.backgroundImage = "url('/images/items/rock.png')";
              rockOrBelly.style.display = 'block';
              rockOrBelly.classList.add('bounce');
              rockOrBelly.classList.add('rock'); // Add rock class for CSS-only version
              
              setGameState(prevState => ({
                ...prevState,
                rockVisible: true,
                foundSymbols: {
                  ...prevState.foundSymbols,
                  modak: true
                }
              }));
              
              // Apply pulse animation after bounce
              setTimeout(() => {
                rockOrBelly.classList.add('pulse');
                rockOrBelly.classList.remove('bounce');
              }, 1000);
              
              // Update instructions
              const instructionsElement = document.querySelector('.game-instructions');
              if (instructionsElement) {
                instructionsElement.innerHTML = 
                  "Now feed the rock with modaks from the basket!";
              }
            }
          } else {
            setGameState(prevState => ({
              ...prevState,
              foundSymbols: {
                ...prevState.foundSymbols,
                modak: true
              }
            }));
          }
          
          // Show educational popup after a short delay
          setTimeout(() => {
            showEducationalPopup('modak');
          }, 2500);
        }
      }
    }
    
    // Check if the rock is visible and modak is dropped on it
    if (gameState.rockVisible && rockOrBelly && rockOrBelly.style.display === 'block') {
      const rockRect = rockOrBelly.getBoundingClientRect();
      
      if (modakCenterX > rockRect.left && modakCenterX < rockRect.right &&
          modakCenterY > rockRect.top && modakCenterY < rockRect.bottom) {
          
        // Only count if modak is from basket
        if (modak.dataset.inBasket === "true") {
          const newRockFeedCount = gameState.rockFeedCount + 1;
          const newModaksInBasket = gameState.modaksInBasket - 1;
          
          // Remove this modak with an animation
          modak.classList.add('star-burst');
          setTimeout(() => {
            modak.style.display = 'none';
          }, 500);
          
          // Update counter
          const counterElement = document.getElementById('modak-counter');
          if (counterElement) {
            counterElement.textContent = `Modaks: ${newModaksInBasket}/5`;
          }
          
          // Rock grows slightly with each feeding
          rockOrBelly.style.transform = `scale(${1 + (newRockFeedCount * 0.05)})`;
          
          // Add increasing glow with each feeding
          rockOrBelly.className = 'rock-or-belly rock';  // Reset classes but keep rock class
          rockOrBelly.classList.add(`rock-glow-${newRockFeedCount}`);
          
          setGameState(prevState => ({
            ...prevState,
            rockFeedCount: newRockFeedCount,
            modaksInBasket: newModaksInBasket
          }));
          
          // Show speech bubble
          const speechBubble = rockSpeechRef.current;
          if (speechBubble) {
            speechBubble.style.display = 'block';
            speechBubble.style.opacity = '1';
            
            // Position the speech bubble above rock
            const rockRect = rockOrBelly.getBoundingClientRect();
            const containerRect = gameContainerRef.current.getBoundingClientRect();
            speechBubble.style.left = ((rockRect.left + rockRect.width/2) - containerRect.left - speechBubble.offsetWidth/2) + 'px';
            speechBubble.style.top = ((rockRect.top - speechBubble.offsetHeight - 20) - containerRect.top) + 'px';
            
            // Hide speech bubble after a few seconds
            setTimeout(() => {
              speechBubble.style.opacity = '0';
              setTimeout(() => {
                speechBubble.style.display = 'none';
              }, 300);
            }, 1500);
          }
          
          // Check if rock has been fed 5 times
          if (newRockFeedCount >= 5) {
            // Transform rock to belly with animation
            rockOrBelly.classList.add('star-burst');
            setTimeout(() => {
              rockOrBelly.style.backgroundImage = "url('/images/items/belly.png')";
              rockOrBelly.classList.remove('star-burst');
              rockOrBelly.classList.add('pulse');
              rockOrBelly.classList.remove('rock'); // Remove rock class
              rockOrBelly.classList.add('belly');   // Add belly class
            }, 500);
            
            // Show success
            showSuccess();
            
            // Show celebratory message
            showCelebration("Hooray! You've transformed the rock into Ganesha's belly!");
            
            // Mark as found
            setGameState(prevState => ({
              ...prevState,
              foundSymbols: {
                ...prevState.foundSymbols,
                belly: true
              }
            }));
            
            // Show educational popup after a short delay
            setTimeout(() => {
              showEducationalPopup('belly');
            }, 2500);
          }
        }
      }
    }
    
    // Reset drag state
    if (dragElementRef.current) {
      dragElementRef.current.style.opacity = '1';
      dragElementRef.current.style.zIndex = '10'; // Reset z-index
      dragElementRef.current = null;
    }
  };

  // Show success indicator
  const showSuccess = () => {
    const indicator = document.getElementById('success-indicator');
    if (indicator) {
      indicator.classList.add('show');
      setTimeout(() => {
        indicator.classList.remove('show');
      }, 1500);
    }
  };

  // Handle back button click
  const handleBackClick = () => {
    alert('Back button clicked! In the full game, this would navigate back.');
  };

  // Handle home button click
  const handleHomeClick = () => {
    alert('Home button clicked! In the full game, this would navigate to the main map.');
  };

  return (
    <div className="game-container" ref={gameContainerRef}>
      <div className="game-screen">
        {/* CSS-only Sidebar */}
        <div className="sidebar">
          <div 
            className="symbol-icon" 
            id="symbol-modak" 
            style={{ backgroundImage: "url('/images/icons/symbol-modak-gray.png')" }}
          ></div>
          <div 
            className="symbol-icon" 
            id="symbol-mooshika" 
            style={{ backgroundImage: "url('/images/icons/symbol-mooshika-gray.png')" }}
          ></div>
          <div 
            className="symbol-icon" 
            id="symbol-belly" 
            style={{ backgroundImage: "url('/images/icons/symbol-belly-gray.png')" }}
          ></div>
          {/* Add other symbol icons as needed */}
        </div>
        
        {/* Game elements */}
        {/* 5 Modaks in different positions */}
        <img 
          src="/images/items/modak.png" 
          alt="Modak 1" 
          className="modak" 
          id="modak1"
          draggable="false" 
          style={{ top: '40%', left: '10%' }}
          ref={el => { modaksRef.current[0] = el; }}
          onMouseDown={(e) => dragStart(e, e.target)}
          onTouchStart={(e) => dragStart(e, e.target)}
        />
        <img 
          src="/images/items/modak.png" 
          alt="Modak 2" 
          className="modak" 
          id="modak2" 
          draggable="false" 
          style={{ top: '50%', left: '20%' }}
          ref={el => { modaksRef.current[1] = el; }}
          onMouseDown={(e) => dragStart(e, e.target)}
          onTouchStart={(e) => dragStart(e, e.target)}
        />
        <img 
          src="/images/items/modak.png" 
          alt="Modak 3" 
          className="modak" 
          id="modak3" 
          draggable="false" 
          style={{ top: '45%', left: '35%' }}
          ref={el => { modaksRef.current[2] = el; }}
          onMouseDown={(e) => dragStart(e, e.target)}
          onTouchStart={(e) => dragStart(e, e.target)}
        />
        <img 
          src="/images/items/modak.png" 
          alt="Modak 4" 
          className="modak" 
          id="modak4" 
          draggable="false" 
          style={{ top: '55%', left: '45%' }}
          ref={el => { modaksRef.current[3] = el; }}
          onMouseDown={(e) => dragStart(e, e.target)}
          onTouchStart={(e) => dragStart(e, e.target)}
        />
        <img 
          src="/images/items/modak.png" 
          alt="Modak 5" 
          className="modak" 
          id="modak5" 
          draggable="false" 
          style={{ top: '40%', left: '60%' }}
          ref={el => { modaksRef.current[4] = el; }}
          onMouseDown={(e) => dragStart(e, e.target)}
          onTouchStart={(e) => dragStart(e, e.target)}
        />
        
        {/* 5 Mud Mounds in different positions */}
        <div 
          className="mud-mound" 
          id="mound1" 
          style={{ top: '60%', left: '15%' }}
          ref={el => { mudMoundsRef.current[0] = el; }}
          onClick={checkForMooshika}
        ></div>
        <div 
          className="mud-mound" 
          id="mound2" 
          style={{ top: '65%', left: '30%' }}
          ref={el => { mudMoundsRef.current[1] = el; }}
          onClick={checkForMooshika}
        ></div>
        <div 
          className="mud-mound" 
          id="mound3" 
          style={{ top: '70%', left: '50%' }}
          ref={el => { mudMoundsRef.current[2] = el; }}
          onClick={checkForMooshika}
        ></div>
        <div 
          className="mud-mound" 
          id="mound4" 
          style={{ top: '65%', left: '65%' }}
          ref={el => { mudMoundsRef.current[3] = el; }}
          onClick={checkForMooshika}
        ></div>
        <div 
          className="mud-mound" 
          id="mound5" 
          style={{ top: '60%', left: '80%' }}
          ref={el => { mudMoundsRef.current[4] = el; }}
          onClick={checkForMooshika}
        ></div>
        
        {/* Mooshika hidden behind one of the mounds */}
        <img 
          src="/images/characters/mooshika.png" 
          alt="Mooshika" 
          className="mooshika" 
          id="mooshika" 
          style={{ top: '55%', left: '65%' }}
          ref={mooshikaRef}
        />
        
        {/* Basket */}
        <div 
          className="basket" 
          id="basket"
          ref={basketRef}
          onClick={checkBasket}
        ></div>
        
        {/* Rock (initially hidden, appears after 5 modaks in basket) */}
        <div 
          className="rock-or-belly" 
          id="rock-or-belly"
          ref={rockOrBellyRef}
        ></div>
        
        {/* UI Elements */}
        <div className="progress-counter" id="modak-counter">
          Modaks: {gameState.modaksInBasket}/5
        </div>
        <div 
          className="back-button" 
          id="back-button"
          onClick={handleBackClick}
        ></div>
        <div 
          className="home-button" 
          id="home-button"
          onClick={handleHomeClick}
        ></div>
        <div className="success-indicator" id="success-indicator"></div>
        
        <div className="game-instructions">
          Game 1: Drag 5 modaks to the basket<br />
          Game 2: Find the hidden mooshika behind a mud mound<br />
          Game 3: Feed the rock with modaks from the basket until it turns into a belly
        </div>
        
        {/* Confetti Container */}
        <div className="confetti-container" id="confetti-container" ref={confettiContainerRef}></div>

        {/* Speech bubble for mooshika */}
        <div 
          className="speech-bubble" 
          id="mooshika-speech" 
          style={{ display: 'none' }}
          ref={mooshikaSpeechRef}
        >Squeak! You found me!</div>

        {/* Speech bubble for rock/belly */}
        <div 
          className="speech-bubble" 
          id="rock-speech" 
          style={{ display: 'none' }}
          ref={rockSpeechRef}
        >Yum! Thank you!</div>

        {/* Celebratory message container */}
        <div 
          className="celebration-message" 
          id="celebration-message" 
          style={{ display: 'none' }}
          ref={celebrationMessageRef}
        >Great job!</div>
        
        {/* Educational Popup */}
        <div 
          className="popup-overlay" 
          id="popup-overlay"
          style={{ display: gameState.popupOpen ? 'flex' : 'none' }}
        >
          <div className="popup-content">
            <div className="popup-title" id="popup-title">
              {gameState.currentPopupSymbol && symbolInfo[gameState.currentPopupSymbol] 
                ? symbolInfo[gameState.currentPopupSymbol].title 
                : "Symbol Discovered!"}
            </div>
            <img 
              src={gameState.currentPopupSymbol && symbolInfo[gameState.currentPopupSymbol] 
                ? symbolInfo[gameState.currentPopupSymbol].image 
                : ""}
              alt="Symbol" 
              className="popup-image" 
              id="popup-image"
            />
            <div className="popup-text" id="popup-text">
              {gameState.currentPopupSymbol && symbolInfo[gameState.currentPopupSymbol] 
                ? symbolInfo[gameState.currentPopupSymbol].text 
                : "Information about the symbol will appear here."}
            </div>
            <button className="close-popup" id="close-popup" onClick={closePopup}>
              Continue Adventure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolMountain;
// lib/components/scenes/MessageManager.jsx
import React, { useState, useEffect } from 'react';
import ScrollUnfurlAnimation from '../animation/ScrollUnfurlAnimation';

export const MessageManager = ({ 
  messages = [],
  sceneState,
  sceneActions,
  children
}) => {
  const [currentMessage, setCurrentMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  
  useEffect(() => {
    // Check for messages that should be shown
    for (const message of messages) {
      const { id, condition, content, type = 'scroll' } = message;
      
      // Check if message should be shown and hasn't been shown yet
      if (condition() && !sceneState.messagesShown?.[id]) {
        console.log(`Showing message: ${id}`);
        setCurrentMessage({ id, content, type });
        setShowMessage(true);
        break; // Only show one message at a time
      }
    }
  }, [messages, sceneState]);
  
  const handleMessageClose = () => {
    if (currentMessage) {
      sceneActions.markMessageShown(currentMessage.id);
      setCurrentMessage(null);
      setShowMessage(false);
    }
  };
  
  return (
    <>
      {children}
      
      {showMessage && currentMessage && currentMessage.type === 'scroll' && (
        <div className="scroll-animation-overlay">
          <ScrollUnfurlAnimation
            scrollContent={currentMessage.content}
            character="both"
            animation="unfurl"
            showSparkle={true}
            onAnimationComplete={() => {}}
            buttonProps={{ 
              text: "I understand!", 
              onClick: handleMessageClose
            }}
          />
        </div>
      )}
      
      {showMessage && currentMessage && currentMessage.type === 'popup' && (
        <div className="popup-overlay">
          <div className="popup-container">
            {currentMessage.content}
            <button className="close-button" onClick={handleMessageClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageManager;
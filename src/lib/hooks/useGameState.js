import { useState, useEffect, useCallback } from 'react';

/**
 * useGameState - Custom hook for managing game state
 * 
 * @param {Object} options - Game state options
 * @param {string} options.gameId - Unique identifier for the game
 * @param {Object} options.initialState - Initial game state
 * @param {boolean} options.saveToLocalStorage - Whether to save state to localStorage
 * @param {function} options.onStateChange - Callback when state changes
 * @param {function} options.validateState - Function to validate state before saving
 * @returns {Object} Game state and methods
 */
const useGameState = ({
  gameId,
  initialState = {},
  saveToLocalStorage = true,
  onStateChange = null,
  validateState = null
} = {}) => {
  // Require gameId if saveToLocalStorage is true
  if (saveToLocalStorage && !gameId) {
    console.error('gameId is required when saveToLocalStorage is true');
  }
  
  // Generate storage key
  const storageKey = `gameState_${gameId || Math.random().toString(36).substring(2, 9)}`;
  
  // Load initial state from localStorage if available
  const loadInitialState = () => {
    if (!saveToLocalStorage) return initialState;
    
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Validate state if validator provided
        if (validateState && !validateState(parsedState)) {
          console.warn('Saved game state failed validation, using initial state');
          return initialState;
        }
        
        return parsedState;
      }
    } catch (error) {
      console.error('Error loading game state from localStorage:', error);
    }
    
    return initialState;
  };
  
  // Game state
  const [gameState, setGameState] = useState(loadInitialState);
  
  // Save state to localStorage when it changes
  useEffect(() => {
    if (!saveToLocalStorage) return;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(gameState));
    } catch (error) {
      console.error('Error saving game state to localStorage:', error);
    }
    
    // Call onStateChange callback if provided
    if (onStateChange) {
      onStateChange(gameState);
    }
  }, [gameState, storageKey, saveToLocalStorage, onStateChange]);
  
  // Update state (merge with existing state)
  const updateState = useCallback((newState) => {
    if (typeof newState === 'function') {
      setGameState(prevState => {
        const updatedState = newState(prevState);
        
        // Validate state if validator provided
        if (validateState && !validateState(updatedState)) {
          console.warn('Updated game state failed validation, state not updated');
          return prevState;
        }
        
        return updatedState;
      });
    } else {
      setGameState(prevState => {
        const updatedState = { ...prevState, ...newState };
        
        // Validate state if validator provided
        if (validateState && !validateState(updatedState)) {
          console.warn('Updated game state failed validation, state not updated');
          return prevState;
        }
        
        return updatedState;
      });
    }
  }, [validateState]);
  
  // Replace entire state
  const replaceState = useCallback((newState) => {
    // Validate state if validator provided
    if (validateState && !validateState(newState)) {
      console.warn('New game state failed validation, state not replaced');
      return;
    }
    
    setGameState(newState);
  }, [validateState]);
  
  // Reset state to initial
  const resetState = useCallback(() => {
    setGameState(initialState);
  }, [initialState]);
  
  // Clear saved state
  const clearSavedState = useCallback(() => {
    if (!saveToLocalStorage) return;
    
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing saved game state:', error);
    }
  }, [storageKey, saveToLocalStorage]);
  
  // Get a specific value from state
  const getValue = useCallback((key, defaultValue = null) => {
    const value = key.split('.').reduce((obj, part) => obj && obj[part], gameState);
    return value !== undefined ? value : defaultValue;
  }, [gameState]);
  
  // Set a specific value in state
  const setValue = useCallback((key, value) => {
    updateState(prevState => {
      const newState = { ...prevState };
      const parts = key.split('.');
      const lastPart = parts.pop();
      const target = parts.reduce((obj, part) => {
        if (!obj[part]) obj[part] = {};
        return obj[part];
      }, newState);
      
      target[lastPart] = value;
      return newState;
    });
  }, [updateState]);
  
  // Increment a numeric value in state
  const incrementValue = useCallback((key, amount = 1) => {
    updateState(prevState => {
      const currentValue = key.split('.').reduce((obj, part) => obj && obj[part], prevState) || 0;
      const newValue = currentValue + amount;
      
      const newState = { ...prevState };
      const parts = key.split('.');
      const lastPart = parts.pop();
      const target = parts.reduce((obj, part) => {
        if (!obj[part]) obj[part] = {};
        return obj[part];
      }, newState);
      
      target[lastPart] = newValue;
      return newState;
    });
  }, [updateState]);
  
  return {
    state: gameState,
    updateState,
    replaceState,
    resetState,
    clearSavedState,
    getValue,
    setValue,
    incrementValue
  };
};

export default useGameState;
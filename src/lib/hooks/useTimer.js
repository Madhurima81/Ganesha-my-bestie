// src/lib/hooks/useTimer.js
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useTimer - Custom hook for creating game timers with various configurations
 * 
 * @param {Object} options - Timer configuration options
 * @param {number} options.initialTime - Starting time in seconds
 * @param {number} options.interval - Update interval in milliseconds
 * @param {boolean} options.autoStart - Whether to start timer automatically
 * @param {boolean} options.countDown - Whether to count down or up
 * @param {number} options.endTime - End time for countdown timers
 * @param {function} options.onTimeUp - Callback when timer reaches endTime (for countdown)
 * @param {function} options.onTick - Callback on each timer tick
 * @returns {Object} Timer control methods and state
 */
const useTimer = ({
  initialTime = 0,
  interval = 1000,
  autoStart = false,
  countDown = false,
  endTime = 0,
  onTimeUp = () => {},
  onTick = () => {},
}) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const pausedTimeRef = useRef(0);
  
  // Clear the interval
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  
  // Start the timer
  const start = useCallback(() => {
    if (isRunning && !isPaused) return;
    
    clearTimer();
    
    if (isPaused) {
      // Resume from pause
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      setIsPaused(false);
    } else {
      // Start fresh
      setIsComplete(false);
      startTimeRef.current = Date.now() - (time * 1000);
    }
    
    setIsRunning(true);
    
    intervalRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      let newTime;
      
      if (countDown) {
        newTime = initialTime - elapsedSeconds;
        if (newTime <= endTime) {
          newTime = endTime;
          clearTimer();
          setIsRunning(false);
          setIsComplete(true);
          onTimeUp();
        }
      } else {
        newTime = initialTime + elapsedSeconds;
        if (endTime > 0 && newTime >= endTime) {
          newTime = endTime;
          clearTimer();
          setIsRunning(false);
          setIsComplete(true);
          onTimeUp();
        }
      }
      
      setTime(newTime);
      onTick(newTime);
    }, interval);
  }, [isRunning, isPaused, time, initialTime, interval, countDown, endTime, onTimeUp, onTick, clearTimer]);
  
  // Pause the timer
  const pause = useCallback(() => {
    if (!isRunning || isPaused) return;
    
    clearTimer();
    pausedTimeRef.current = Date.now() - startTimeRef.current;
    setIsPaused(true);
  }, [isRunning, isPaused, clearTimer]);
  
  // Reset the timer
  const reset = useCallback((newTime = initialTime) => {
    clearTimer();
    setTime(newTime);
    setIsRunning(false);
    setIsPaused(false);
    setIsComplete(false);
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
  }, [initialTime, clearTimer]);
  
  // Toggle between running and paused
  const toggle = useCallback(() => {
    if (isRunning && !isPaused) {
      pause();
    } else {
      start();
    }
  }, [isRunning, isPaused, start, pause]);
  
  // Format time as MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  // Auto-start effect
  useEffect(() => {
    if (autoStart) {
      start();
    }
    
    return clearTimer;
  }, []);
  
  return {
    time,
    isRunning,
    isPaused,
    isComplete,
    start,
    pause,
    reset,
    toggle,
    formatted: formatTime(time),
    percent: countDown 
      ? ((initialTime - time) / (initialTime - endTime)) * 100 
      : ((time - initialTime) / (endTime - initialTime)) * 100,
  };
};

export default useTimer;
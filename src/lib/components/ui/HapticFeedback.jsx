// HapticFeedback.jsx - Mobile vibration feedback
export const HapticFeedback = ({ children }) => {
  const vibrate = (pattern = [10]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };
  
  return (
    <HapticContext.Provider value={{ vibrate }}>
      {children}
    </HapticContext.Provider>
  );
};

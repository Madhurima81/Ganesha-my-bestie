// AnalyticsTracker.jsx - Track user behavior
export const AnalyticsTracker = ({ children }) => {
  const trackEvent = (eventName, data = {}) => {
    // Send to analytics service
    console.log('Analytics:', eventName, data);
    
    // For development
    localStorage.setItem(`analytics_${Date.now()}`, JSON.stringify({
      event: eventName,
      data,
      timestamp: Date.now()
    }));
  };
  
  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

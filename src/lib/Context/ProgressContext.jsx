import React, { createContext, useState, useContext } from 'react';

// Create the context
const ProgressContext = createContext();

// Provider Component
function ProgressProvider({ children, initialValue = 0, totalValue = 100 }) {
  const [value, setValue] = useState(initialValue);
  const [total, setTotal] = useState(totalValue);
  
  return (
    <ProgressContext.Provider value={{
      value,
      total,
      updateProgress: (newValue) => setValue(newValue),
      updateTotal: (newTotal) => setTotal(newTotal),
      resetProgress: () => setValue(initialValue),
      percentage: total > 0 ? (value / total) * 100 : 0
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

// Custom Hook
function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}

export { ProgressProvider, useProgress, ProgressContext };
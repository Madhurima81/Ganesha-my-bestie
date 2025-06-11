import React from 'react';
import '../../styles/components.css';

/**
 * ProgressBar - A component to display progress
 * 
 * @param {Object} props
 * @param {number} props.current - Current progress value
 * @param {number} props.total - Total progress value
 * @param {string} props.label - Label for the progress bar
 * @param {boolean} props.showPercentage - Whether to show percentage
 * @param {string} props.className - Additional CSS classes
 */
const ProgressBar = ({
  current,
  total,
  label,
  showPercentage = true,
  className = '',
  ...rest
}) => {
  // Calculate percentage
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  
  return (
    <div className={`progress-container ${className}`} {...rest}>
      {(label || showPercentage) && (
        <div className="progress-label">
          {label && <span>{label}</span>}
          {showPercentage && <span>{percentage}%</span>}
        </div>
      )}
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar"
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
          role="progressbar"
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
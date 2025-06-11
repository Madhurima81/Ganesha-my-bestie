// InteractiveElementWrapper.jsx
import React from 'react';
import InteractiveElement from './InteractiveElement';
import './InteractiveTooltips.css'; // Import tooltip styles

const InteractiveElementWrapper = ({
  children,
  tooltip,
  onClick,
  className = '',
  style = {},
  preservePosition = true,
  zone = 'pond-zone', // Default zone
  ...rest
}) => {
  // Default tooltip style for child-friendly tooltips
  const tooltipClassName = `child-friendly-tooltip ${zone}-tooltip`;
  
  if (preservePosition) {
    return (
      <div className={className} style={style} {...rest}>
        <InteractiveElement
          tooltip={tooltip}
          onInteract={onClick}
          tooltipClassName={tooltipClassName}
          style={{ width: '100%', height: '100%' }}
        >
          {children}
        </InteractiveElement>
      </div>
    );
  }
  
  return (
    <InteractiveElement
      tooltip={tooltip}
      onInteract={onClick}
      className={className}
      style={style}
      tooltipClassName={tooltipClassName}
      {...rest}
    >
      {children}
    </InteractiveElement>
  );
};

export default InteractiveElementWrapper;
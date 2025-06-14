import React from 'react';

interface IconWrapperProps {
  children: React.ReactNode;
}

const IconWrapper: React.FC<IconWrapperProps> = ({ children }) => {
  return (
    <div className="group hover:bg-white/10 p-2 rounded transition-colors">
      <div className="transform transition-transform group-hover:scale-105">
        {children}
      </div>
    </div>
  );
};

export default IconWrapper;
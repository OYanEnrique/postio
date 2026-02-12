import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  children, 
  className = '', 
  active = false,
  type = 'button',
  ...props 
}) => {
  return (
    <button 
      type={type}
      className={`p-2 rounded-full transition-colors ${active ? 'bg-md-sys-primary/10 text-md-sys-primary' : 'text-md-sys-onSurface hover:bg-black/5'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
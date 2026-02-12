import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'text' | 'outlined';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'filled', 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    filled: "bg-md-sys-primary text-white hover:shadow-md hover:bg-opacity-90 active:bg-opacity-100",
    tonal: "bg-md-sys-secondaryContainer text-md-sys-onPrimaryContainer hover:shadow-sm hover:bg-opacity-80",
    outlined: "border border-md-sys-outline text-md-sys-primary hover:bg-md-sys-primary/10",
    text: "text-md-sys-primary hover:bg-md-sys-primary/10 px-4",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
};
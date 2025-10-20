"use client";

import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  isLoading = false, 
  disabled = false, 
  className = '', 
  icon: Icon = null 
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-md bg-blueColor hover:bg-indigo-600 duration-300 ${className} ${disabled ? 'bg-blue-300 cursor-not-allowed' : ''}`}
      disabled={disabled || isLoading}
    >
      <span className='relative z-10 flex items-center justify-center'>
        {Icon && <Icon className="mr-2" />} 
        {isLoading ? 'Submitting...' : children}
      </span>
    </button>
  );
};

export default Button;

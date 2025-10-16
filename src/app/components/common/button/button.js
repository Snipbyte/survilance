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
      className={`my-1 hover:before:bg-btnColor relative h-[50px] overflow-hidden border border-btnColor px-2 text-btnColor transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:transition-all before:duration-500 hover:text-white hover:before:left-0 hover:before:w-full ${className} ${disabled ? 'bg-blue-300 cursor-not-allowed' : ''}`}
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

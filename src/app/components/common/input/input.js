"use client";
import React, { useState, forwardRef } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Input = forwardRef(
  (
    { type = "text", placeholder, className = "", label, error, ...rest },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prevState) => !prevState);
    };

    const inputType =
      type === "password" ? (showPassword ? "text" : "password") : type;

    return (
      <div className="relative">
        {label && (
          <label className="block text-sm font-medium text-headingColor my-1">
            {label}
          </label>
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          className={`outline-none border p-2 rounded mb-4 ${className} ${
            error ? "border border-red-500" : ""
          }`}
          ref={ref}
          {...rest}
        />

        {type === "password" && (
          <div
            className="outline-none absolute inset-y-0 top-2 right-3 flex items-center cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <AiFillEyeInvisible size={20} />
            ) : (
              <AiFillEye size={20} />
            )}
          </div>
        )}

        {/* Error message */}
        {error && (
          <span className="text-red-500 text-sm my-1">{error.message}</span>
        )}
      </div>
    );
  }
);

export default Input;

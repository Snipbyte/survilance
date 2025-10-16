"use client";
import React, { useEffect, useRef } from "react";

const CustomModal = ({ isOpen, onRequestClose, title, children }) => {
  const modalRef = useRef(null);
  const lastFocusedElement = useRef(null);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && isOpen) {
        onRequestClose();
      }
    };

    if (isOpen) {
      lastFocusedElement.current = document.activeElement; // Save the last focused element
      modalRef.current.focus(); // Focus the modal
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
      if (lastFocusedElement.current) {
        lastFocusedElement.current.focus(); // Restore focus
      }
    };
  }, [isOpen, onRequestClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg max-w-[700px] w-full mx-4 z-10 shadow-xl max-h-[90vh] flex flex-col"
        tabIndex={-1} // Make it focusable
        role="dialog"
        aria-label={title}
      >
        {/* Header */}
        <div className="p-2 border-b border-gray-300 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onRequestClose}
            className="text-gray-500 hover:text-gray-900 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-3 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default CustomModal;
// components/common/Toast.js
import { useState } from "react";

const Toast = ({ message, onClose }) => (
  <div className="bg-blueColor text-white p-3 rounded-md fixed top-4 right-4">
    {message}
    <button onClick={onClose} className="ml-4 text-sm underline">
      Dismiss
    </button>
  </div>
);

export default Toast;

// src/components/Toast.jsx
import { useEffect } from "react";

const Toast = ({ message, isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-5 right-5 z-50">
      <div className="bg-green-600 text-white rounded-lg p-2 sm:p-4 shadow-lg animate-slideIn">
        {message}
      </div>
    </div>
  );
};

export default Toast;

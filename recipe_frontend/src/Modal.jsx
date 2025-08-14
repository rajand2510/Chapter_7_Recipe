import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, children, position = "center" }) => {
  // Close modal with ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={
          position === "center"
            ? "relative m-auto bg-white  shadow-lg p-6 max-w-6xl w-full z-10"
            : "relative ml-auto h-full bg-[#f5f5f5] shadow-lg p-6 w-full max-w-4xl z-10"
        }
      >
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;

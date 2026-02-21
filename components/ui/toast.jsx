"use client";
import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast toast-end toast-top z-[100]">
      <div 
        role="alert" 
        className={`alert ${type === "success" ? "alert-success" : "alert-error"} alert-soft shadow-lg border-l-4 ${type === "success" ? "border-success" : "border-error"}`}
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          {type === "success" ? "✅" : "❌"} {message}
        </span>
      </div>
    </div>
  );
}
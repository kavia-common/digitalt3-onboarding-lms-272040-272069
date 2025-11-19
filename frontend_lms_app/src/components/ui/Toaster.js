import React, { useEffect } from "react";

/**
 * Toast notification component.
 * Props:
 * - toasts: [{ id, type, message }]
 * - onRemove: (id) => void
 */
export default function Toaster({ toasts = [], onRemove }) {
  useEffect(() => {
    if (!toasts.length) return;

    // Auto-dismiss toasts after 3 seconds
    const timers = toasts.map((toast) =>
      setTimeout(() => onRemove(toast.id), toast.type === "error" ? 6000 : 3000)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, onRemove]);

  return (
    <div
      style={{
        position: "fixed",
        top: 18,
        right: 18,
        zIndex: 1200,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "flex-end"
      }}
      aria-live="polite"
      aria-atomic="true"
      role="status"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          tabIndex={0}
          className="lms-toast"
          style={{
            background: toast.type === "error" ? "#fee2e2" : "#e7faef",
            color: toast.type === "error" ? "#b91c1c" : "#15803d",
            border: toast.type === "error" ? "1.4px solid #ef4444" : "1.4px solid #22c55e",
            borderRadius: 9,
            boxShadow: "0 4px 18px #1a202c12",
            padding: "0.83em 1.5em",
            minWidth: 165,
            fontWeight: 600,
            fontSize: ".99em",
          }}
          role={toast.type === "error" ? "alert" : "status"}
          tabIndex={0}
        >
          {toast.message}
          <button
            aria-label="Dismiss notification"
            onClick={() => onRemove(toast.id)}
            style={{
              background: "transparent",
              border: "none",
              color: "inherit",
              float: "right",
              cursor: "pointer",
              fontSize: "1.23em",
              marginLeft: 19,
              outline: "none"
            }}
          >×</button>
        </div>
      ))}
    </div>
  );
}

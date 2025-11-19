import React from "react";

/**
 * Error banner display
 * Props:
 * - error: string or null
 * - onClose: fn (optional)
 */
export default function ErrorBanner({ error, onClose }) {
  if (!error) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      tabIndex={0}
      style={{
        background: "#fee2e2",
        color: "#b91c1c",
        border: "1.7px solid #ef4444",
        borderRadius: 8,
        padding: "0.97em 1.5em",
        margin: "0.8em 0",
        position: "relative",
        fontWeight: 600,
        fontSize: "1.04em"
      }}
      className="lms-error-banner"
    >
      {error}
      {onClose && (
        <button
          aria-label="Dismiss error"
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "inherit",
            position: "absolute",
            right: 18,
            top: 9,
            fontSize: "1.5em",
            cursor: "pointer",
            padding: 0
          }}
        >×</button>
      )}
    </div>
  );
}

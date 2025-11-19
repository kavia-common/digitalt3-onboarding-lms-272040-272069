import React from "react";

/**
 * Loading spinner, visually and ARIA accessible.
 */
export default function LoadingSpinner({ label = "Loading...", inline = false }) {
  return (
    <div
      aria-busy="true"
      role="status"
      style={{
        display: inline ? "inline-flex" : "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 11,
        minHeight: inline ? undefined : 70
      }}
    >
      <svg
        width={28}
        height={28}
        viewBox="0 0 40 40"
        style={{ display: "inline", color: "var(--primary)" }}
        aria-hidden="true"
      >
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="5"
          strokeDasharray="25, 95"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 20 20;360 20 20"
            dur="0.8s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      <span style={{ color: "var(--primary)", fontWeight: 600 }}>
        {label}
      </span>
    </div>
  );
}

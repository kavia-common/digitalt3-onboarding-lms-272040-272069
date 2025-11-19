import React from "react";

/**
 * Linear progress bar (horizontal).
 * Props:
 * - percent: number [0-100]
 */
export function ProgressBar({ percent = 0, label }) {
  const prog = Math.max(0, Math.min(percent, 100));
  return (
    <div style={{ width: "100%", minWidth: 90, marginBottom: 8 }}>
      <div aria-label={label || `Progress: ${prog}%`} style={{ color: "#2563EB", fontWeight: 600, fontSize: "1.01em", marginBottom: 3 }}>
        {label || `${prog}%`}
      </div>
      <div
        role="progressbar"
        aria-valuenow={prog}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        style={{
          background: "#e5eafd",
          height: 11,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 11,
            width: `${prog}%`,
            background: "linear-gradient(90deg, #2563EB 70%, #F59E0B 110%)",
            borderRadius: 8,
            transition: "width 0.5s cubic-bezier(.6,-0.28,.7,1.16)",
          }}
        />
      </div>
    </div>
  );
}

/**
 * Circular progress bar visually for % complete (used for dashboard avatar panel)
 * Props:
 * - percent: number [0,100]
 */
export function ProgressCircle({ percent = 0 }) {
  const size = 62, stroke = 7;
  const radius = (size - stroke) / 2;
  const circum = 2 * Math.PI * radius;
  const prog = Math.max(0, Math.min(percent, 100));
  const offset = circum - (prog / 100) * circum;
  return (
    <span
      role="img"
      aria-label={`Learning progress: ${prog}%`}
      style={{ display: "inline-flex", alignItems: "center", gap: 12 }}
      tabIndex={0}
    >
      <svg
        width={size}
        height={size}
        aria-hidden="true"
        style={{ marginRight: 2 }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e3e8f2"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2563EB"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circum}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.5s cubic-bezier(.6,-0.28,.7,1.16)"
          }}
        />
      </svg>
      <b style={{
        fontSize: "1.2rem",
        color: "#2563EB",
        fontWeight: 700,
        minWidth: 36
      }}>{prog}%</b>
    </span>
  );
}

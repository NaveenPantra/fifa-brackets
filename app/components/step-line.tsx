"use client";

interface StepLineProps {
  edgeId: string;
  strokeWidth?: number;
  strokeColor?: string;
  className?: string;
}

/**
 * Renders a bare SVG shell for an edge.
 * All positioning, viewBox, and path data are managed imperatively
 * via `renderSmoothStep` in useHoverOnMatchCard.ts.
 */
export default function StepLine({
  edgeId,
  strokeWidth = 2,
  strokeColor = "#6b7280",
  className,
}: StepLineProps) {
  return (
    <svg
      className={className}
      id={edgeId}
      style={{
        position: "absolute",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <path
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

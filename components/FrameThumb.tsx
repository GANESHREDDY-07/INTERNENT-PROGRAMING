import {
  type Frame,
  lensOutline,
  pointsToSvgPath,
} from "@/lib/frames";

interface FrameThumbProps {
  frame: Frame;
  className?: string;
  strokeColor?: string;
}

export default function FrameThumb({
  frame,
  className = "",
  strokeColor,
}: FrameThumbProps) {
  const { shape, bridge } = frame;
  const centreX = bridge / 2 + shape.width / 2;

  const outer = lensOutline(shape, 1, 96, shape.rimThickness);
  const inner = lensOutline(shape, 1, 96, 0);

  const spanX = bridge + shape.width * 2 + shape.rimThickness * 2 + 1.4;
  const spanY =
    shape.height * (1 + shape.catLift / 2) + shape.rimThickness * 2 + 1.2;
  const viewBox = `${(-spanX / 2).toFixed(2)} ${(-spanY / 2).toFixed(2)} ${spanX.toFixed(2)} ${spanY.toFixed(2)}`;

  const bridgeY = shape.height * 0.2;
  const bx = bridge / 2 + 0.3;
  const bridgePath = `M ${-bx} ${bridgeY + 0.42} C ${-bx * 0.5} ${bridgeY + 0.05}, ${bx * 0.5} ${bridgeY + 0.05}, ${bx} ${bridgeY + 0.42}`;

  // Double top bar for aviator silhouette
  const isAviator = frame.id === "aviator";
  const aviatorTopBarY = bridgeY + 0.95;
  const aviatorTopBarPath = `M ${-bx * 1.05} ${aviatorTopBarY} L ${bx * 1.05} ${aviatorTopBarY}`;

  const activeColor = strokeColor || "currentColor";
  const gradId = `lens-sheen-${frame.id}`;

  return (
    <svg
      viewBox={viewBox}
      className={`frame-thumb ${className}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={strokeColor ? { color: strokeColor } : undefined}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={activeColor} stopOpacity="0.22" />
          <stop offset="40%" stopColor="#00f0ff" stopOpacity="0.10" />
          <stop offset="100%" stopColor={activeColor} stopOpacity="0.26" />
        </linearGradient>
      </defs>

      {[-1, 1].map((side) => {
        const outerEdgeX = side * (shape.width / 2 + shape.rimThickness);
        const templeX = outerEdgeX + side * 0.45;
        const templeY = shape.height * 0.15;

        return (
          <g key={side} transform={`translate(${side * centreX} 0)`}>
            {/* Tinted Anti-Reflective Lens with Sheen */}
            <path
              d={pointsToSvgPath(inner)}
              fill={`url(#${gradId})`}
              stroke={activeColor}
              strokeWidth="0.9"
              strokeLinejoin="round"
              opacity="0.8"
              vectorEffect="non-scaling-stroke"
            />

            {/* Diagonal Lens Reflection Flare */}
            <line
              x1={-shape.width * 0.22}
              y1={shape.height * 0.35}
              x2={shape.width * 0.18}
              y2={-shape.height * 0.25}
              stroke="#ffffff"
              strokeWidth="0.9"
              strokeLinecap="round"
              opacity="0.25"
              vectorEffect="non-scaling-stroke"
            />

            {/* Solid Physical Frame Rim */}
            <path
              d={pointsToSvgPath(outer)}
              fill={activeColor}
              fillOpacity="0.08"
              stroke={activeColor}
              strokeWidth="1.9"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* Left & Right Outer Temple Hinge Stubs */}
            <line
              x1={outerEdgeX}
              y1={templeY}
              x2={templeX}
              y2={templeY}
              stroke={activeColor}
              strokeWidth="2.2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}

      {/* Primary Bridge */}
      <path
        d={bridgePath}
        stroke={activeColor}
        strokeWidth="2.0"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* Aviator Brow Bar */}
      {isAviator && (
        <path
          d={aviatorTopBarPath}
          stroke={activeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}

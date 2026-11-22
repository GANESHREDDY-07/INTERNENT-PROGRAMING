import {
  type Frame,
  lensOutline,
  pointsToSvgPath,
} from "@/lib/frames";

export default function FrameThumb({
  frame,
  className = "",
}: {
  frame: Frame;
  className?: string;
}) {
  const { shape, bridge } = frame;
  const centreX = bridge / 2 + shape.width / 2;

  const outer = lensOutline(shape, 1, 96, shape.rimThickness);
  const inner = lensOutline(shape, 1, 96, 0);

  const spanX = bridge + shape.width * 2 + shape.rimThickness * 2 + 0.9;
  const spanY =
    shape.height * (1 + shape.catLift / 2) + shape.rimThickness * 2 + 1;
  const viewBox = `${(-spanX / 2).toFixed(2)} ${(-spanY / 2).toFixed(2)} ${spanX.toFixed(2)} ${spanY.toFixed(2)}`;

  const bridgeY = shape.height * 0.2;
  const bx = bridge / 2 + 0.3;
  const bridgePath = `M ${-bx} ${bridgeY + 0.42} C ${-bx * 0.5} ${bridgeY + 0.05}, ${bx * 0.5} ${bridgeY + 0.05}, ${bx} ${bridgeY + 0.42}`;

  return (
    <svg
      viewBox={viewBox}
      className={`frame-thumb ${className}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${side * centreX} 0)`}>
          <path
            d={pointsToSvgPath(outer)}
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={pointsToSvgPath(inner)}
            stroke="currentColor"
            strokeWidth="0.9"
            strokeLinejoin="round"
            opacity="0.4"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ))}
      <path
        d={bridgePath}
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

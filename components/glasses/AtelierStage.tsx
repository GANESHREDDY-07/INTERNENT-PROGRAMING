"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { PresentationControls } from "@react-three/drei";
import { useRef, type ReactNode } from "react";
import GlassesModel from "./GlassesModel";
import Rig from "./Rig";
import useVisible from "./useVisible";
import {
  type FrameConfig,
  getColour,
  getFrame,
  getLensType,
  getTint,
} from "@/lib/frames";

function FitGroup({ children }: { children: ReactNode }) {
  const { viewport } = useThree();
  const scale = Math.min(viewport.width / 18.6, viewport.height / 10.2, 1.05);
  return <group scale={scale}>{children}</group>;
}

export default function AtelierStage({ config }: { config: FrameConfig }) {
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useVisible(wrap);
  const frame = getFrame(config.frameId);
  const colour = getColour(frame, config.colourId);
  const tint = getTint(config.tintId);
  const lensType = getLensType(config.lensTypeId);

  return (
    <div ref={wrap} className="stage-fill">
      <Canvas
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0.45, 23], fov: 30, near: 0.1, far: 120 }}
        frameloop={visible ? "always" : "never"}
        style={{ touchAction: "none" }}
        aria-hidden
      >
        <Rig />
        <PresentationControls
          global
          snap
          speed={1.15}
          rotation={[0.015, -0.36, 0]}
          polar={[-0.32, 0.3]}
          azimuth={[-1.05, 1.05]}
          damping={0.24}
          cursor
        >
          <FitGroup>
            <GlassesModel
              frame={frame}
              colour={colour}
              tint={tint}
              lensType={lensType}
              isExploded={config.isExploded}
              engravedText={config.engravedText}
            />
          </FitGroup>
        </PresentationControls>
      </Canvas>
    </div>
  );
}

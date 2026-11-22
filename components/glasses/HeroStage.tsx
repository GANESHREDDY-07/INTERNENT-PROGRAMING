"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import GlassesModel from "./GlassesModel";
import Rig from "./Rig";
import useVisible from "./useVisible";
import { getColour, getFrame, getTint } from "@/lib/frames";

const signature = getFrame("aurelia");
const signatureColour = getColour(signature, "brass");
const signatureTint = getTint("clear");

function FitGroup({ children }: { children: ReactNode }) {
  const { viewport } = useThree();
  const scale = Math.min(viewport.width / 17.6, viewport.height / 10, 1.08);
  return <group scale={scale}>{children}</group>;
}

function HeroObject() {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const targetY =
      -0.3 + pointer.current.x * 0.16 + Math.sin(t * 0.22) * 0.045;
    const targetX =
      -0.02 - pointer.current.y * 0.09 + Math.sin(t * 0.36) * 0.018;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      targetY,
      2.6,
      delta,
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      targetX,
      2.6,
      delta,
    );
    group.current.rotation.z = -0.015 + Math.sin(t * 0.3) * 0.012;
  });

  return (
    <FitGroup>
      <group ref={group} rotation={[-0.02, -0.3, -0.015]}>
        <GlassesModel
          frame={signature}
          colour={signatureColour}
          tint={signatureTint}
        />
      </group>
    </FitGroup>
  );
}

export default function HeroStage() {
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useVisible(wrap);

  return (
    <div ref={wrap} className="stage-fill">
      <Canvas
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0.55, 23], fov: 30, near: 0.1, far: 120 }}
        frameloop={visible ? "always" : "never"}
        style={{ touchAction: "none" }}
        aria-hidden
      >
        <Rig />
        <HeroObject />
      </Canvas>
    </div>
  );
}

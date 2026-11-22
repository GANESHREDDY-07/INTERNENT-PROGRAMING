"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef, type ReactNode } from "react";
import * as THREE from "three";
import GlassesModel from "./GlassesModel";
import Rig from "./Rig";
import { getColour, getFrame, getTint } from "@/lib/frames";

function FitGroup({ children }: { children: ReactNode }) {
  const { viewport } = useThree();
  const scale = Math.min(viewport.width / 18, viewport.height / 12, 0.95);
  return <group scale={scale}>{children}</group>;
}

function FloatingScene() {
  const group = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const frame = getFrame("solstice");
  const colour = getColour(frame, "gold");
  const tint = getTint("sepia");

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.45;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.12;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.2;
      ringRef.current.rotation.x += delta * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.28;
      ring2Ref.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group>
      {/* Decorative optical halo rings */}
      <mesh ref={ringRef} position={[0, 0, -2]}>
        <torusGeometry args={[5.2, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#c1955a"
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={0.35}
        />
      </mesh>

      <mesh ref={ring2Ref} position={[0, 0, -1]}>
        <torusGeometry args={[6.4, 0.015, 16, 64]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.95}
          roughness={0.15}
          transparent
          opacity={0.25}
        />
      </mesh>

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={group}>
          <GlassesModel frame={frame} colour={colour} tint={tint} />
        </group>
      </Float>
    </group>
  );
}

export default function Login3DStage() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0.2, 22], fov: 32, near: 0.1, far: 100 }}
        style={{ touchAction: "none" }}
        aria-hidden
      >
        <Rig />
        <FitGroup>
          <FloatingScene />
        </FitGroup>
      </Canvas>
    </div>
  );
}

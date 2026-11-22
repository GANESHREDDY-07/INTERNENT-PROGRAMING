"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useMemo } from "react";
import { getBackdropTexture } from "./textures";

export default function Rig() {
  const backdrop = useMemo(() => getBackdropTexture(), []);

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[7, 9, 12]}
        intensity={1.5}
        color="#fff2df"
      />
      <directionalLight
        position={[-9, 4, -2]}
        intensity={0.65}
        color="#dfe9ec"
      />
      <directionalLight
        position={[0, -6, 6]}
        intensity={0.3}
        color="#ffe9d0"
      />

      <mesh position={[0, 0.6, -12]} renderOrder={-10}>
        <planeGeometry args={[80, 50]} />
        <meshBasicMaterial map={backdrop} toneMapped={false} />
      </mesh>

      <Environment resolution={256} frames={1}>
        <group>
          <Lightformer
            form="rect"
            intensity={3}
            position={[0, 7, 3]}
            scale={[14, 7, 1]}
            color="#fff6e6"
          />
          <Lightformer
            form="rect"
            intensity={1.6}
            position={[-9, 1, 5]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[8, 5, 1]}
            color="#e9f1f3"
          />
          <Lightformer
            form="rect"
            intensity={2.2}
            position={[9, -1, 4]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[7, 4, 1]}
            color="#ffe9cf"
          />
          <Lightformer
            form="rect"
            intensity={1.1}
            position={[0, -6, -4]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[10, 5, 1]}
            color="#f6e6d6"
          />
          <Lightformer
            form="rect"
            intensity={7}
            position={[1.5, 5.2, 5]}
            rotation={[0.34, 0, -0.16]}
            scale={[10, 0.5, 1]}
            color="#ffffff"
          />
          <Lightformer
            form="rect"
            intensity={3}
            position={[-5.5, 2.4, 6]}
            rotation={[0.15, Math.PI / 7, 0.5]}
            scale={[5, 0.32, 1]}
            color="#fff1da"
          />
        </group>
      </Environment>

      <ContactShadows
        position={[0, -3.15, 0]}
        opacity={0.24}
        scale={20}
        blur={3}
        far={5}
        resolution={512}
        color="#4c3a2a"
      />
    </>
  );
}

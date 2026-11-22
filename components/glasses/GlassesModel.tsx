"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import {
  type ColourOption,
  type Frame,
  type LensTypeOption,
  type TintOption,
  lensOutline,
} from "@/lib/frames";
import { getTortoiseTexture } from "./textures";

function toVectors(points: [number, number][]) {
  return points.map(([x, y]) => new THREE.Vector2(x, y));
}

function extrudeShape(shape: THREE.Shape, depth: number, bevel: number) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    steps: 1,
    curveSegments: 18,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();
  return geometry;
}

interface BuiltFrame {
  rims: THREE.BufferGeometry[];
  lenses: THREE.BufferGeometry[];
  bridge: THREE.BufferGeometry;
  temples: THREE.BufferGeometry[];
  rivets: { x: number; y: number; z: number }[];
  pads: {
    arm: THREE.BufferGeometry;
    pad: { pos: [number, number, number]; rot: number };
  }[];
  centreX: number;
  ox: number;
  hy: number;
}

function buildFrame(frame: Frame): BuiltFrame {
  const { shape } = frame;
  const bg = frame.bridge / 2;
  const centreX = bg + shape.width / 2;
  const bevel = Math.min(0.022, shape.rimThickness * 0.35);

  const rims: THREE.BufferGeometry[] = [];
  const lenses: THREE.BufferGeometry[] = [];

  for (const side of [-1, 1] as const) {
    const outer = toVectors(lensOutline(shape, side, 160, shape.rimThickness));
    const inner = toVectors(lensOutline(shape, side, 160, 0));
    const rimShape = new THREE.Shape(outer);
    rimShape.holes.push(new THREE.Path([...inner].reverse()));
    rims.push(extrudeShape(rimShape, shape.rimDepth, bevel));

    const lensPoints = toVectors(lensOutline(shape, side, 160, -0.012));
    lenses.push(extrudeShape(new THREE.Shape(lensPoints), 0.05, 0.012));
  }

  const bridgeY = shape.height * 0.2;
  const bx = bg + 0.32;
  const bridgeCurve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-bx, bridgeY + 0.42, 0.01),
      new THREE.Vector3(-bg * 0.55, bridgeY + 0.1, 0.03),
      new THREE.Vector3(0, bridgeY - 0.06, 0.04),
      new THREE.Vector3(bg * 0.55, bridgeY + 0.1, 0.03),
      new THREE.Vector3(bx, bridgeY + 0.42, 0.01),
    ],
    false,
    "centripetal",
  );
  const bridgeRadius = frame.material === "acetate" ? 0.2 : 0.095;
  const bridge = new THREE.TubeGeometry(
    bridgeCurve,
    56,
    bridgeRadius,
    12,
    false,
  );

  const ox = bg + shape.width;
  const hy = shape.height * 0.27;
  const temples: THREE.BufferGeometry[] = [];

  for (const side of [-1, 1] as const) {
    const curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(side * (ox - 0.12), hy, -0.02),
        new THREE.Vector3(side * (ox + 0.14), hy + 0.04, -0.55),
        new THREE.Vector3(side * (ox + 0.2), hy - 0.12, -2.8),
        new THREE.Vector3(side * (ox + 0.1), hy - 0.45, -7.4),
        new THREE.Vector3(side * (ox + 0.0), hy - 0.98, -11.6),
        new THREE.Vector3(side * (ox - 0.12), hy - 1.8, -13.7),
        new THREE.Vector3(side * (ox - 0.28), hy - 2.65, -13.15),
      ],
      false,
      "centripetal",
    );
    temples.push(
      new THREE.TubeGeometry(
        curve,
        72,
        frame.material === "acetate" ? 0.16 : 0.058,
        12,
        false,
      ),
    );
  }

  const rivets =
    frame.material === "acetate"
      ? [
          { x: ox + 0.02, y: hy + 0.16, z: shape.rimDepth / 2 + 0.006 },
          { x: ox + 0.02, y: hy - 0.02, z: shape.rimDepth / 2 + 0.006 },
        ]
      : [];

  const pads =
    frame.material === "titanium"
      ? ([-1, 1] as const).map((side) => {
          const armCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(side * (bg + 0.04), bridgeY - 0.08, 0.02),
            new THREE.Vector3(side * (bg + 0.22), bridgeY - 0.3, -0.12),
            new THREE.Vector3(side * (bg + 0.38), bridgeY - 0.52, -0.3),
          ]);
          const arm = new THREE.TubeGeometry(armCurve, 20, 0.024, 8, false);
          return {
            arm,
            pad: {
              pos: [side * (bg + 0.41), bridgeY - 0.58, -0.36] as [
                number,
                number,
                number,
              ],
              rot: side * 0.32,
            },
          };
        })
      : [];

  return { rims, lenses, bridge, temples, rivets, pads, centreX, ox, hy };
}

interface GlassesModelProps {
  frame: Frame;
  colour: ColourOption;
  tint: TintOption;
  lensType?: LensTypeOption;
  isExploded?: boolean;
  engravedText?: string;
}

export default function GlassesModel({
  frame,
  colour,
  tint,
  lensType,
  isExploded = false,
  engravedText,
}: GlassesModelProps) {
  const geometry = useMemo(() => buildFrame(frame), [frame]);
  const outer = useRef<THREE.Group>(null);
  const bob = useRef<THREE.Group>(null);
  const pop = useRef(1);
  const lastKey = useRef("");

  // Exploded view interpolated factor
  const explodeFactor = useRef(0);

  // Dynamic canvas texture for laser engraving on inner temple
  const engravingTexture = useMemo(() => {
    if (!engravedText || !engravedText.trim()) return null;
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 96;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#0c0c10";
    ctx.fillRect(0, 0, 512, 96);
    ctx.fillStyle = "#ff1e42";
    ctx.font = "bold 26px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`✦ ${engravedText.trim().toUpperCase()} // ATELIER`, 256, 48);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, [engravedText]);

  const rimMaterial = useMemo(() => {
    // Cyber-Luxury Custom Finishes
    if (colour.id === "crimson_titanium") {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#e60026"),
        metalness: 0.92,
        roughness: 0.16,
        envMapIntensity: 1.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        sheen: 1.0,
        sheenRoughness: 0.2,
        sheenColor: new THREE.Color("#ff3355"),
      });
    }
    if (colour.id === "matte_carbon") {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#121215"),
        metalness: 0.15,
        roughness: 0.65,
        envMapIntensity: 0.8,
        clearcoat: 0.25,
        clearcoatRoughness: 0.4,
      });
    }
    if (colour.id === "brushed_obsidian") {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#18181f"),
        metalness: 0.95,
        roughness: 0.24,
        envMapIntensity: 1.6,
        clearcoat: 0.85,
        clearcoatRoughness: 0.15,
      });
    }
    if (colour.id === "damascus_steel") {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#34373e"),
        metalness: 0.88,
        roughness: 0.35,
        envMapIntensity: 1.4,
        clearcoat: 0.5,
      });
    }

    if (colour.metal) {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(colour.hex),
        metalness: 1,
        roughness:
          colour.id === "silver" ? 0.15 : colour.id === "matteblack" ? 0.42 : 0.3,
        envMapIntensity: 1.35,
        clearcoat: 0.35,
        clearcoatRoughness: 0.28,
      });
    }
    if (colour.translucent) {
      return new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.7,
        thickness: 0.6,
        ior: 1.49,
        roughness: 0.2,
        attenuationColor: new THREE.Color(colour.hex),
        attenuationDistance: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        envMapIntensity: 1.2,
      });
    }
    return new THREE.MeshPhysicalMaterial({
      color: colour.pattern ? new THREE.Color("#ffffff") : new THREE.Color(colour.hex),
      map: colour.pattern ? getTortoiseTexture() : null,
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.16,
      envMapIntensity: 1.05,
      sheen: 0.25,
      sheenRoughness: 0.6,
      sheenColor: new THREE.Color("#e8c9a0"),
    });
  }, [colour]);

  const lensMaterial = useMemo(() => {
    let ior = 1.52;
    let thickness = 0.35;
    let sheen = 0.3;
    let sheenColor = new THREE.Color("#ffffff");
    let attenuationColor = new THREE.Color(tint.hex);
    let attenuationDistance = tint.distance;
    let roughness = 0.02;

    if (lensType?.id === "anti-glare") {
      sheen = 0.95;
      sheenColor = new THREE.Color("#4ade80");
      roughness = 0.005;
    } else if (lensType?.id === "blue-cut") {
      sheen = 1.0;
      sheenColor = new THREE.Color("#3b82f6");
      roughness = 0.01;
    } else if (lensType?.id === "photochromic") {
      sheen = 0.6;
      sheenColor = new THREE.Color("#fbbf24");
      attenuationDistance = Math.min(attenuationDistance, 2.5);
    } else if (lensType?.id === "high-index") {
      ior = 1.74;
      thickness = 0.18;
      roughness = 0.002;
      sheen = 0.5;
      sheenColor = new THREE.Color("#c084fc");
    }

    return new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness,
      transmission: 1,
      thickness,
      ior,
      attenuationColor,
      attenuationDistance,
      clearcoat: 0.75,
      clearcoatRoughness: 0.02,
      sheen,
      sheenRoughness: 0.3,
      sheenColor,
      envMapIntensity: 0.9,
      specularIntensity: 1.2,
      transparent: true,
    });
  }, [tint, lensType]);

  const padMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#efe7d8"),
        roughness: 0.35,
        metalness: 0,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        envMapIntensity: 0.8,
      }),
    [],
  );

  const rivetMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#e60026"),
        metalness: 1,
        roughness: 0.25,
        envMapIntensity: 1.4,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      geometry.rims.forEach((g) => g.dispose());
      geometry.lenses.forEach((g) => g.dispose());
      geometry.bridge.dispose();
      geometry.temples.forEach((g) => g.dispose());
      geometry.pads.forEach((p) => p.arm.dispose());
    };
  }, [geometry]);

  useEffect(() => {
    const key = `${frame.id}-${colour.id}-${tint.id}`;
    if (lastKey.current !== key) {
      pop.current = 0.955;
      lastKey.current = key;
    }
  }, [frame.id, colour.id, tint.id]);

  useEffect(
    () => () => {
      rimMaterial.dispose();
      lensMaterial.dispose();
      padMaterial.dispose();
      rivetMaterial.dispose();
      engravingTexture?.dispose();
    },
    [rimMaterial, lensMaterial, padMaterial, rivetMaterial, engravingTexture],
  );

  // Group references for smooth exploded animation
  const lensGroupRef = useRef<THREE.Group>(null);
  const bridgeRef = useRef<THREE.Mesh>(null);
  const templeLeftRef = useRef<THREE.Group>(null);
  const templeRightRef = useRef<THREE.Group>(null);
  const padsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (outer.current) {
      pop.current = THREE.MathUtils.damp(pop.current, 1, 5.5, delta);
      outer.current.scale.setScalar(pop.current);
    }
    if (bob.current && !isExploded) {
      bob.current.position.y = Math.sin(t * 0.85) * 0.075;
      bob.current.rotation.z = Math.sin(t * 0.4) * 0.014;
    }

    // Smooth damp for exploded view
    explodeFactor.current = THREE.MathUtils.damp(
      explodeFactor.current,
      isExploded ? 1 : 0,
      4.2,
      delta,
    );
    const ef = explodeFactor.current;

    if (lensGroupRef.current) {
      lensGroupRef.current.position.z = ef * 2.2;
    }
    if (bridgeRef.current) {
      bridgeRef.current.position.z = ef * 0.9;
      bridgeRef.current.position.y = ef * 0.5;
    }
    if (templeLeftRef.current) {
      templeLeftRef.current.position.x = -ef * 1.6;
      templeLeftRef.current.position.z = -ef * 1.2;
    }
    if (templeRightRef.current) {
      templeRightRef.current.position.x = ef * 1.6;
      templeRightRef.current.position.z = -ef * 1.2;
    }
    if (padsRef.current) {
      padsRef.current.position.z = -ef * 1.1;
      padsRef.current.position.y = -ef * 0.4;
    }
  });

  return (
    <group ref={outer}>
      <group ref={bob}>
        {/* Rims */}
        {[-1, 1].map((side) => (
          <mesh
            key={`rim-${side}`}
            geometry={geometry.rims[side === -1 ? 0 : 1]}
            material={rimMaterial}
            position={[side * geometry.centreX, 0, 0]}
            castShadow
          />
        ))}

        {/* Lenses Group (Animates forward during exploded view) */}
        <group ref={lensGroupRef}>
          {[-1, 1].map((side) => (
            <mesh
              key={`lens-${side}`}
              geometry={geometry.lenses[side === -1 ? 0 : 1]}
              material={lensMaterial}
              position={[side * geometry.centreX, 0, 0]}
            />
          ))}

          {isExploded && (
            <Html position={[0, frame.shape.height / 2 + 1.2, 0]} center>
              <div className="blueprint-tag">
                <span className="bp-line" />
                <span className="bp-label">
                  ✦ 1.74 Glazed Lens ({lensType?.badge || "AR Coating"})
                </span>
              </div>
            </Html>
          )}
        </group>

        {/* Left Temple & Rivets */}
        <group ref={templeLeftRef}>
          <mesh geometry={geometry.temples[0]} material={rimMaterial} castShadow />
          {geometry.rivets.map((r, i) => (
            <mesh
              key={`rivet-left-${i}`}
              position={[-r.x, r.y, r.z]}
              rotation={[Math.PI / 2, 0, 0]}
              material={rivetMaterial}
            >
              <cylinderGeometry args={[0.05, 0.05, 0.016, 20]} />
            </mesh>
          ))}

          {/* Laser-Engraved Plaque on Inner Left Temple */}
          {engravingTexture && (
            <mesh
              position={[-geometry.ox + 0.1, geometry.hy - 0.25, -3.2]}
              rotation={[0, Math.PI / 2, 0]}
            >
              <planeGeometry args={[2.8, 0.52]} />
              <meshBasicMaterial map={engravingTexture} transparent />
            </mesh>
          )}

          {isExploded && (
            <Html position={[-geometry.ox - 1.2, geometry.hy, -2.5]} center>
              <div className="blueprint-tag">
                <span className="bp-line" />
                <span className="bp-label">
                  ✦ {frame.material === "acetate" ? "Cellulose Block Arm" : "Beta-Titanium Flex Wire"}
                </span>
              </div>
            </Html>
          )}
        </group>

        {/* Right Temple & Rivets */}
        <group ref={templeRightRef}>
          <mesh geometry={geometry.temples[1]} material={rimMaterial} castShadow />
          {geometry.rivets.map((r, i) => (
            <mesh
              key={`rivet-right-${i}`}
              position={[r.x, r.y, r.z]}
              rotation={[Math.PI / 2, 0, 0]}
              material={rivetMaterial}
            >
              <cylinderGeometry args={[0.05, 0.05, 0.016, 20]} />
            </mesh>
          ))}
        </group>

        {/* Center Bridge */}
        <mesh ref={bridgeRef} geometry={geometry.bridge} material={rimMaterial} castShadow>
          {isExploded && (
            <Html position={[0, 1.2, 0]} center>
              <div className="blueprint-tag">
                <span className="bp-line" />
                <span className="bp-label">
                  ✦ Diamond Keyhole Bridge ({frame.specs.bridge})
                </span>
              </div>
            </Html>
          )}
        </mesh>

        {/* Nose Pads */}
        <group ref={padsRef}>
          {geometry.pads.map((pad, i) => (
            <group key={`pad-${i}`}>
              <mesh geometry={pad.arm} material={rimMaterial} />
              <mesh
                position={pad.pad.pos}
                rotation={[0, 0, pad.pad.rot]}
                scale={[0.075, 0.2, 0.09]}
                material={padMaterial}
              >
                <sphereGeometry args={[1, 20, 16]} />
              </mesh>
            </group>
          ))}
          {isExploded && geometry.pads.length > 0 && (
            <Html position={[0, -1.2, -0.4]} center>
              <div className="blueprint-tag">
                <span className="bp-line" />
                <span className="bp-label">✦ Medical Silicone Anatomical Pads</span>
              </div>
            </Html>
          )}
        </group>
      </group>
    </group>
  );
}

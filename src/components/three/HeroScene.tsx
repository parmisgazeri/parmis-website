import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { prefersReducedMotion } from "../../cms/ContentContext";

function Orbiters({ reduced }: { reduced: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!g.current || reduced) return;
    g.current.rotation.y += delta * 0.32;
    g.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.12;
  });
  return (
    <group ref={g}>
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        const r = 2.55 + (i % 2) * 0.45;
        const pos: [number, number, number] = [Math.cos(angle) * r, Math.sin(angle * 1.6) * 0.65, Math.sin(angle) * r];
        return (
          <mesh key={i} position={pos}>
            {i % 3 === 0 ? <octahedronGeometry args={[0.16, 0]} /> : i % 3 === 1 ? <boxGeometry args={[0.2, 0.2, 0.2]} /> : <tetrahedronGeometry args={[0.18, 0]} />}
            <meshStandardMaterial
              color={i % 2 ? "#ff6ad5" : i % 4 === 0 ? "#e8b45a" : "#9d6bff"}
              emissive={i % 2 ? "#ff6ad5" : "#9d6bff"}
              emissiveIntensity={0.55}
              roughness={0.25}
              metalness={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Core({ reduced }: { reduced: boolean }) {
  const inner = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (reduced) return;
    if (inner.current) {
      inner.current.rotation.y += delta * 0.25;
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.035;
      inner.current.scale.setScalar(s);
    }
    if (wire.current) {
      wire.current.rotation.y -= delta * 0.14;
      wire.current.rotation.z += delta * 0.05;
    }
  });
  return (
    <group>
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.18, 1]} />
        <meshStandardMaterial color="#5b2bd6" roughness={0.18} metalness={0.75} flatShading />
      </mesh>
      <mesh ref={wire}>
        <icosahedronGeometry args={[1.72, 1]} />
        <meshBasicMaterial color="#9d6bff" wireframe transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function Rig({ reduced }: { reduced: boolean }) {
  const rig = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!rig.current || reduced) return;
    rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, state.pointer.x * 0.45, 2.2, delta);
    rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, -state.pointer.y * 0.3, 2.2, delta);
  });
  return (
    <group ref={rig}>
      {!reduced && (
        <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.9}>
          <Core reduced={reduced} />
        </Float>
      )}
      {reduced && <Core reduced={reduced} />}
      <Orbiters reduced={reduced} />
      <mesh rotation={[Math.PI / 2.4, 0.35, 0]}>
        <torusGeometry args={[2.55, 0.012, 8, 120]} />
        <meshBasicMaterial color="#9d6bff" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 1.9, -0.5, 0.4]}>
        <torusGeometry args={[3.05, 0.008, 8, 120]} />
        <meshBasicMaterial color="#ff6ad5" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  return (
    <Canvas dpr={[1, 1.8]} camera={{ position: [0, 0.2, 6.4], fov: 42 }} gl={{ antialias: true, alpha: true }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.55} />
        <pointLight position={[5, 5, 5]} intensity={40} color="#9d6bff" />
        <pointLight position={[-6, -4, -3]} intensity={26} color="#ff6ad5" />
        <pointLight position={[0, 6, -5]} intensity={18} color="#e8b45a" />
        <Rig reduced={reduced} />
        {!reduced && <Stars radius={42} depth={35} count={1100} factor={2.6} saturation={0.4} fade speed={0.55} />}
        {reduced && <Stars radius={42} depth={35} count={700} factor={2.6} saturation={0.4} fade speed={0} />}
      </Suspense>
    </Canvas>
  );
}

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function TechEnvironment() {
  const gridRef = useRef();
  const particlesRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Subtle grid animation
    if (gridRef.current) {
      gridRef.current.position.z = (time * 0.2) % 1;
    }

    // Gentle particle drift
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.05;
      particlesRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    }
  });

  // Create particles
  const particlesCount = 100;
  const positions = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = Math.random() * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }

  return (
    <group>
      {/* 1. Deep Background Sphere (Gradient effect) */}
      <mesh scale={[100, 100, 100]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#050505" side={THREE.BackSide} />
      </mesh>

      {/* 2. Abstract Floor Grid */}
      <group position={[0, -0.01, 0]}>
        <gridHelper
          ref={gridRef}
          args={[100, 50, "#003333", "#001a1a"]}
          rotation={[0, 0, 0]}
        />
      </group>

      {/* 3. Subtle Cyan Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#00ffff"
          transparent
          opacity={0.4}
          sizeAttenuation
        />
      </points>

      {/* 4. Atmosphere Fog (handled in scene renderer but added props here for context) */}
    </group>
  );
}

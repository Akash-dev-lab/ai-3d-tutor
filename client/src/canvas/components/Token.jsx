import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Token({ step }) {
  const meshRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation state
  const [currentZ, setCurrentZ] = useState(-14); // Midpoint of User(-8) and Gate(-20)
  const [targetZ, setTargetZ] = useState(-14);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (step === 2) {
      setIsVisible(true);
      setTargetZ(-14); // Reset to visually between Server and Gate
      setProgress(0);
    } else if (step === 3) {
      setIsVisible(true);
      // User moves to -18, Gate is -20. Midpoint is -19.
      setTargetZ(-19);
      setProgress(0);
    } else {
      setIsVisible(false);
    }
  }, [step]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Floating Animation
    meshRef.current.position.y = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    // Rotate slightly
    meshRef.current.rotation.y += delta * 0.5;

    // Movement Logic
    if (progress < 1) {
      setProgress((prev) => {
        const newProgress = Math.min(prev + delta * 0.5, 1); // Match User speed
        const newZ = currentZ + (targetZ - currentZ) * newProgress;
        meshRef.current.position.z = newZ;
        
        if (newProgress >= 1) {
          setCurrentZ(targetZ);
        }
        return newProgress;
      });
    } else {
        // Ensure position is exact when not moving
        meshRef.current.position.z = currentZ;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 2, currentZ]} visible={isVisible}>
      <boxGeometry args={[0.6, 0.4, 0.05]} />
      <meshStandardMaterial 
        color="#a78bfa" 
        emissive="#a78bfa" 
        emissiveIntensity={2} 
        toneMapped={false}
      />
    </mesh>
  );
}

export default Token;

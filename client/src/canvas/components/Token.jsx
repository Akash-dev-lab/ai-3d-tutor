import React, { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import GameObject from "./GameObject";

function Token({ step }) {
  const meshRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  const isDenied = step === 5 || step === 6;

  // Animation state
  const [currentZ, setCurrentZ] = useState(-14); // Midpoint of User(-8) and Gate(-20)
  const [targetZ, setTargetZ] = useState(-14);
  const [progress, setProgress] = useState(1);

  // Story-driven triggers
  const issueToken = () => {
    setIsVisible(true);
    setTargetZ(-14); // Appears at Server
    setProgress(0);
  };

  const presentTokenToGate = () => {
    setIsVisible(true);
    setTargetZ(-19); // Moves to Gate
    setProgress(0);
  };

  const hideToken = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (step === 2) {
      issueToken();
    } else if (step === 3 || isDenied) {
      presentTokenToGate();
    } else {
      hideToken();
    }
  }, [step, isDenied]);

  // Animation Loops
  const animateFloating = (state, delta) => {
    meshRef.current.position.y =
      2 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    meshRef.current.rotation.y += delta * 0.5;
  };

  const animateMovement = (delta) => {
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
      meshRef.current.position.z = currentZ;
    }
  };

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    animateFloating(state, delta);
    animateMovement(delta);

    if (isDenied) {
      // STRONG horizontal shake animation
      const time = state.clock.getElapsedTime();
      meshRef.current.position.x = Math.sin(time * 40) * 0.3; // Increased amplitude and frequency
    } else {
      // Reset position when not denied
      meshRef.current.position.x = 0;
    }
  });

  const tokenColor = isDenied ? "#ef4444" : "#a78bfa";

  return (
    <GameObject
      ref={meshRef}
      position={[0, 2, currentZ]}
      visible={isVisible}
      useModel={false}
    >
      <mesh>
        <boxGeometry args={[0.6, 0.4, 0.05]} />
        <meshStandardMaterial
          color={tokenColor}
          emissive={tokenColor}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </GameObject>
  );
}

export default Token;

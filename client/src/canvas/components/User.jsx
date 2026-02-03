import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

function User({ step }) {
  const meshRef = useRef();
  const [currentPosition, setCurrentPosition] = useState([0, 0.25, 0]);
  const [targetPosition, setTargetPosition] = useState([0, 0.25, 0]);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (step === 1) {
      // Move to auth server (new position at -7, stop early at -5.25)
      setTargetPosition([0, 0.25, -5.25]);
      setProgress(0);
    } else if (step === 3) {
      // Move to gate (new position at -14)
      setTargetPosition([0, 0.25, -13]);
      setProgress(0);
    } else if (step === 0) {
      // Reset position on idle
      setTargetPosition([0, 0.25, 0]);
      setProgress(0);
    }
  }, [step]);

  useFrame((state, delta) => {
    if (meshRef.current && progress < 1) {
      setProgress((prev) => {
        const newProgress = Math.min(prev + delta * 0.5, 1);
        
        // Interpolate position
        const newPos = [
          currentPosition[0] + (targetPosition[0] - currentPosition[0]) * newProgress,
          currentPosition[1] + (targetPosition[1] - currentPosition[1]) * newProgress,
          currentPosition[2] + (targetPosition[2] - currentPosition[2]) * newProgress,
        ];
        
        meshRef.current.position.set(...newPos);

        if (newProgress >= 1) {
          setCurrentPosition(targetPosition);
        }

        return newProgress;
      });
    }
  });

  return (
    <mesh ref={meshRef} position={currentPosition}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#4a9eff" />
    </mesh>
  );
}

export default User;

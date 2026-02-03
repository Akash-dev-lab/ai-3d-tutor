import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import GameObject from './GameObject';

function User({ step }) {
  const meshRef = useRef();
  const [currentPosition, setCurrentPosition] = useState([0, 0.25, 0]);
  const [targetPosition, setTargetPosition] = useState([0, 0.25, 0]);
  const [progress, setProgress] = useState(1);

  // Story-driven animation triggers
  const moveUserToServer = () => {
    setTargetPosition([0, 0.25, -8]);
    setProgress(0);
  };

  const moveUserToGate = () => {
    setTargetPosition([0, 0.25, -18]);
    setProgress(0);
  };

  const resetUser = () => {
    setTargetPosition([0, 0.25, 0]);
    setProgress(0);
  };

  useEffect(() => {
    if (step === 1) {
      moveUserToServer();
    } else if (step === 3) {
      moveUserToGate();
    } else if (step === 0) {
      resetUser();
    }
  }, [step]);

  // Animation Loop
  const animateMovement = (delta) => {
    if (progress < 1) {
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
  };

  useFrame((state, delta) => {
    if (meshRef.current) {
      animateMovement(delta);
    }
  });



  return (
    <GameObject ref={meshRef} position={currentPosition} useModel={false}>
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#4a9eff" />
      </mesh>
    </GameObject>
  );
}

export default User;

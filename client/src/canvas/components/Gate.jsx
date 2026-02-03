import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

function Gate({ step }) {
  const barRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [rotationProgress, setRotationProgress] = useState(0);

  const closedRotation = 0;
  const openRotation = Math.PI / 2; // 90 degrees

  useEffect(() => {
    if (step === 4) {
      setIsOpen(true);
    } else if (step === 0) {
      setIsOpen(false);
    }
  }, [step]);

  useFrame((state, delta) => {
    if (barRef.current) {
      const targetRotation = isOpen ? 1 : 0;
      
      setRotationProgress((prev) => {
        const newProgress = prev + (targetRotation - prev) * delta * 3;
        
        // Apply rotation to the bar
        barRef.current.rotation.z = closedRotation + (openRotation - closedRotation) * newProgress;
        
        return newProgress;
      });
    }
  });

  return (
    <>
      {/* Left Post */}
      <mesh position={[-2, 1, -5]}>
        <boxGeometry args={[0.3, 2, 0.3]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      {/* Right Post */}
      <mesh position={[2, 1, -5]}>
        <boxGeometry args={[0.3, 2, 0.3]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      {/* Horizontal Bar */}
      <mesh ref={barRef} position={[0, 1.5, -5]}>
        <boxGeometry args={[4.6, 0.2, 0.2]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
    </>
  );
}

export default Gate;

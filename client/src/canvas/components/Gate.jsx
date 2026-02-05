import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import GameObject from "./GameObject";
function Gate({ step }) {
  const barRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [rotationProgress, setRotationProgress] = useState(0);

  const isDenied = step === 5 || step === 6;

  const closedRotation = 0;
  const openRotation = Math.PI / 2; // 90 degrees

  // Story-driven triggers
  const openGate = () => setIsOpen(true);
  const closeGate = () => setIsOpen(false);

  useEffect(() => {
    if (step === 4) {
      openGate();
    } else {
      closeGate();
      // FORCE reset rotation state so gate visually snaps shut
      setRotationProgress(0);
      if (barRef.current) {
        barRef.current.rotation.z = closedRotation;
      }
    }
  }, [step]);

  // Animation Loop
  const animateGate = (delta) => {
    if (barRef.current) {
      const targetRotation = isOpen ? 1 : 0;

      setRotationProgress((prev) => {
        const newProgress = prev + (targetRotation - prev) * delta * 3;

        // Apply rotation to the bar
        barRef.current.rotation.z =
          closedRotation + (openRotation - closedRotation) * newProgress;

        return newProgress;
      });
    }
  };

  useFrame((state, delta) => {
    animateGate(delta);

    if (barRef.current) {
      if (isDenied) {
        // STRONG horizontal shake animation
        const time = state.clock.getElapsedTime();
        barRef.current.position.x = Math.sin(time * 40) * 0.3; // Increased amplitude and frequency
      } else {
        // Reset position when not denied
        barRef.current.position.x = 0;
      }
    }
  });

  return (
    <GameObject useModel={false}>
      {/* Left Post */}
      <mesh position={[-3, 1.5, -20]}>
        <boxGeometry args={[0.2, 3, 0.2]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      {/* Right Post */}
      <mesh position={[3, 1.5, -20]}>
        <boxGeometry args={[0.2, 3, 0.2]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      {/* Horizontal Bar - Wrapped in Group for Animation */}
      <group ref={barRef} position={[0, 2.5, -20]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[6.4, 0.1, 0.1]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>
    </GameObject>
  );
}

export default Gate;

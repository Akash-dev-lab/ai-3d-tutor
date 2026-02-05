import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Gate({ step }) {
  const { scene } = useGLTF("/models/gate.glb");
  // Clone the scene so multiple gates don't share state
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  const barRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [rotationProgress, setRotationProgress] = useState(0);

  const isDenied = step === 5 || step === 6;

  const closedRotation = 0;
  const openRotation = Math.PI / 2; // 90 degrees

  // Find the named part in the model
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.name === "SecurityBar") {
        barRef.current = child;
      }
    });
  }, [clonedScene]);

  useEffect(() => {
    if (step === 4) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setRotationProgress(0);
      if (barRef.current) {
        barRef.current.rotation.z = closedRotation;
      }
    }
  }, [step]);

  useFrame((state, delta) => {
    if (barRef.current) {
      // 1. Rotation animation (Open/Close)
      const targetProgress = isOpen ? 1 : 0;
      const newProgress = THREE.MathUtils.lerp(
        rotationProgress,
        targetProgress,
        delta * 3,
      );
      setRotationProgress(newProgress);

      barRef.current.rotation.z =
        closedRotation + (openRotation - closedRotation) * newProgress;

      // 2. Shake animation (Denied)
      if (isDenied) {
        const time = state.clock.getElapsedTime();
        barRef.current.position.x = Math.sin(time * 40) * 0.15;
      } else {
        barRef.current.position.x = 0;
      }
    }
  });

  return <primitive object={clonedScene} position={[0, 0, -20]} />;
}

export default Gate;

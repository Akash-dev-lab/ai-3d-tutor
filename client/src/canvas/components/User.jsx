import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import GameObject from "./GameObject";

const BASE_Y = 0; // Ground level for character mesh

function UserModel() {
  const groupRef = useRef();
  const { animations, scene } = useGLTF("models/Standing-idle.glb");
  const { actions, names } = useAnimations(animations, groupRef);

  useEffect(() => {
    const idle = actions[names[0]];
    idle?.reset().fadeIn(0.3).play();
    return () => idle?.fadeOut(0.2);
  }, [actions, names]);

  return <primitive ref={groupRef} object={scene} />;
}

function User({ step }) {
  const meshRef = useRef();
  const [currentPosition, setCurrentPosition] = useState([0, BASE_Y, 0]);
  const [targetPosition, setTargetPosition] = useState([0, BASE_Y, 0]);
  const [progress, setProgress] = useState(1);

  // Story-driven animation triggers
  const moveUserToServer = () => {
    setTargetPosition([0, BASE_Y, -8]);
    setProgress(0);
  };

  const moveUserToGate = () => {
    setTargetPosition([0, BASE_Y, -18]);
    setProgress(0);
  };

  const resetUser = () => {
    setTargetPosition([0, BASE_Y, 0]);
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

  // Animation Loop - Position Interpolation
  const animateMovement = (delta) => {
    if (progress < 1) {
      setProgress((prev) => {
        const newProgress = Math.min(prev + delta * 0.5, 1);

        const newPos = [
          currentPosition[0] +
            (targetPosition[0] - currentPosition[0]) * newProgress,
          currentPosition[1] +
            (targetPosition[1] - currentPosition[1]) * newProgress,
          currentPosition[2] +
            (targetPosition[2] - currentPosition[2]) * newProgress,
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
    <GameObject ref={meshRef} position={currentPosition} useModel={true}>
      <group scale={0.9} rotation={[0, Math.PI, 0]}>
        <UserModel />
      </group>
    </GameObject>
  );
}

// Preload the model
useGLTF.preload("models/Standing-idle.glb");

export default User;

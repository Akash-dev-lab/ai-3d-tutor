import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

function CameraController({ step, controlsRef }) {
  // Target positions for each step
  const targets = {
    0: [0, 0, 0], // Idle: Look at start
    1: [0, 1, -5], // User moving to Server (-10)
    2: [0, 2, -10], // Token Generation - Focus on Server area
    3: [0, 2, -15], // Token Moving to Gate - Follow the flow
    4: [0, 1, -25], // Gate Opening/End - Focus on Protected Area
    5: [0, 1.5, -20], // Denial: Expired Token - Focus on Gate
    6: [0, 1.5, -20], // Denial: Invalid Token - Focus on Gate
  };

  const currentTarget = useRef([0, 0, 0]);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    // Use current step target if available, otherwise stay at current target (no fallback to 0,0,0)
    const desiredTarget = targets[step] || currentTarget.current;

    // Smoothly interpolate current target towards desired target
    const speed = 2 * delta;

    currentTarget.current[0] +=
      (desiredTarget[0] - currentTarget.current[0]) * speed;
    currentTarget.current[1] +=
      (desiredTarget[1] - currentTarget.current[1]) * speed;
    currentTarget.current[2] +=
      (desiredTarget[2] - currentTarget.current[2]) * speed;

    // Update controls target
    controlsRef.current.target.set(
      currentTarget.current[0],
      currentTarget.current[1],
      currentTarget.current[2],
    );

    // Optional: Auto-reset camera position on step 0
    if (step === 0) {
      state.camera.position.lerp({ x: 5, y: 5, z: 5 }, speed);
    }

    controlsRef.current.update();
  });

  return null;
}

export default CameraController;

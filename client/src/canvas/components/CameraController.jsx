import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

function CameraController({ step, controlsRef }) {
  // Target positions for each step
  const targets = {
    0: [0, 0, 0],       // Idle: Look at start
    1: [0, 1, -5],      // User moving to Server (-10)
    2: [0, 2, -10],     // Token Generation (Token at -8) - Focus on Server area
    3: [0, 2, -15],     // Token Moving to Gate (-20) - Follow the flow
    4: [0, 1, -25],     // Gate Opening/End - Focus on Protected Area (-30)
  };

  const currentTarget = useRef([0, 0, 0]);

  useEffect(() => {
    // Optional: Snap to start if reset
    if (step === 0) {
      // We can snap or let it slide back. Sliding is nicer.
    }
  }, [step]);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    const desiredTarget = targets[step] || [0, 0, 0];
    
    // Smoothly interpolate current target towards desired target
    // Lerp factor (speed)
    const speed = 2 * delta; 

    currentTarget.current[0] += (desiredTarget[0] - currentTarget.current[0]) * speed;
    currentTarget.current[1] += (desiredTarget[1] - currentTarget.current[1]) * speed;
    currentTarget.current[2] += (desiredTarget[2] - currentTarget.current[2]) * speed;

    // Update controls target
    controlsRef.current.target.set(
      currentTarget.current[0],
      currentTarget.current[1],
      currentTarget.current[2]
    );
    
    // Required for Damping to work correctly if enabled, but we are manually updating target
    controlsRef.current.update();
  });

  return null;
}

export default CameraController;

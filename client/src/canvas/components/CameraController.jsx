import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function CameraController({ step, controlsRef }) {
  // Camera shots: { position, target }
  const shots = {
    0: { position: [10, 8, 10], target: [0, 1, -10] }, // Intro: Wide
    1: { position: [6, 4, -2], target: [0, 1, -8] }, // Login: Following User
    2: { position: [2.5, 2.5, -6], target: [0, 2, -11] }, // Token Issued: Close-up Server
    3: { position: [5, 3.5, -13], target: [0, 2, -19] }, // Access Request: Tracking to Gate
    4: { position: [8, 5, -22], target: [0, 1, -28] }, // Success: Wide entry
    5: { position: [2.5, 2.2, -16], target: [0, 2, -20] }, // Expired: Tight shot on Gate
    6: { position: [-2.5, 2.2, -16], target: [0, 2, -20] }, // Invalid: Tight alternative
  };

  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
  const currentPosition = useRef(new THREE.Vector3(10, 8, 10));

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    const shot = shots[step] || shots[0];
    const desiredTarget = new THREE.Vector3(...shot.target);
    const desiredPosition = new THREE.Vector3(...shot.position);

    // Smoothly interpolate both target and position
    const speed = 2.5 * delta;

    currentTarget.current.lerp(desiredTarget, speed);
    currentPosition.current.lerp(desiredPosition, speed);

    // Update camera position
    state.camera.position.copy(currentPosition.current);

    // Update controls target
    controlsRef.current.target.copy(currentTarget.current);
    controlsRef.current.update();
  });

  return null;
}

export default CameraController;

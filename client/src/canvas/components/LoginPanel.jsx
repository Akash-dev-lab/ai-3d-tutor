import React, { useState, useRef, useMemo } from "react";
import { Html, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function DataParticles({ active, onComplete }) {
  const count = 20;
  const [positions, setPositions] = useState(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.5; // x spread
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.5; // y spread
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.2; // z spread
    }
    return arr;
  });

  const progressRef = useRef(0);

  useFrame((state, delta) => {
    if (!active) return;

    progressRef.current += delta * 0.8; // Duration approx 1.25s

    if (progressRef.current >= 1.2) {
      if (onComplete) onComplete();
      return;
    }

    // Target: AuthServer at [0, 2, -10]
    // Start: LoginPanel at [-1.2, 1.5, 0]
    // Relative Vector: [1.2, 0.5, -10]

    // We update the mesh position or individual particles?
    // Let's just move the whole group for simplicity + jitter
  });

  // Using a group for the whole particle system movement is easier for "flow"
  // We'll interpolate the group position from [0,0,0] (local) to [1.2, 0.5, -10] (relative)
  const startPos = new THREE.Vector3(0, 0, 0);
  const endPos = new THREE.Vector3(1.2, 0.5, -10);

  const currentPos = new THREE.Vector3()
    .copy(startPos)
    .lerp(endPos, Math.min(progressRef.current, 1));

  if (!active) return null;

  return (
    <points position={currentPos}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#00f2ff"
        transparent
        opacity={1 - Math.pow(Math.max(0, progressRef.current - 0.8), 2)} // Fade out at end
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const FloatingPanel = ({ children }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });
  return <group ref={ref}>{children}</group>;
};

export default function LoginPanel({ onLogin, onSubmitStart }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (onSubmitStart) onSubmitStart();
  };

  const handleAnimationComplete = () => {
    onLogin();
  };

  return (
    <group position={[-1.2, 1.5, 0]} rotation={[0, 0.2, 0]}>
      <FloatingPanel>
        {/* Glassmorphism UI */}
        <Html transform distanceFactor={1.5} center>
          <div
            style={{
              width: "320px",
              padding: "24px",
              background: "rgba(16, 24, 39, 0.7)",
              border: "1px solid rgba(0, 242, 255, 0.3)",
              borderRadius: "16px",
              backdropFilter: "blur(12px)",
              boxShadow:
                "0 4px 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 242, 255, 0.05)",
              fontFamily: "'Inter', sans-serif",
              color: "white",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              opacity: isSubmitting ? 0 : 1, // Fade out on submit
              transition: "opacity 0.5s ease",
              pointerEvents: isSubmitting ? "none" : "auto",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "#00f2ff",
                  boxShadow: "0 0 10px #00f2ff",
                }}
              />
              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                }}
              >
                Secure Login
              </h2>
            </div>

            {/* Username Field */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "#94a3b8",
                  marginBottom: "6px",
                }}
              >
                USERNAME
              </label>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontSize: "14px",
                  color: "#e2e8f0",
                  fontFamily: "monospace",
                }}
              >
                dev_user_01
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "#94a3b8",
                  marginBottom: "6px",
                }}
              >
                PASSWORD
              </label>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontSize: "14px",
                  color: "#e2e8f0",
                  letterSpacing: "3px",
                }}
              >
                •••••••••••
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              style={{
                marginTop: "8px",
                background: "linear-gradient(90deg, #00f2ff 0%, #0088ff 100%)",
                border: "none",
                borderRadius: "8px",
                padding: "12px",
                color: "#0f172a",
                fontWeight: "bold",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 0 15px rgba(0, 242, 255, 0.4)",
                transition: "transform 0.2s, box-shadow 0.2s",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(0, 242, 255, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 0 15px rgba(0, 242, 255, 0.4)";
              }}
            >
              Authenticate
            </button>
          </div>
        </Html>
      </FloatingPanel>

      {/* Particle Effect on Submit */}
      <DataParticles
        active={isSubmitting}
        onComplete={handleAnimationComplete}
      />
    </group>
  );
}

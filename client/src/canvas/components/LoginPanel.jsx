import React, { useState, useRef, useMemo } from "react";
import { Html, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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

    // Trigger transition after delay (simulating data travel time)
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <group position={[-1.2, 1.5, 0]} rotation={[0, 0.2, 0]}>
      <FloatingPanel>
        {/* Glassmorphism UI */}
        <Html transform distanceFactor={1.5} center>
          <div
            style={{
              width: "380px", // Increased size
              padding: "32px",
              background: "rgba(10, 15, 30, 0.85)", // Slightly darker for contrast
              border: "2px solid rgba(0, 242, 255, 0.5)", // Brighter border
              borderRadius: "16px",
              backdropFilter: "blur(16px)",
              boxShadow:
                "0 0 40px rgba(0, 242, 255, 0.15), inset 0 0 20px rgba(0, 242, 255, 0.1)", // Enhanced glow
              fontFamily: "'Inter', sans-serif",
              color: "white",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              opacity: isSubmitting ? 0 : 1,
              transition: "opacity 0.5s ease",
              pointerEvents: isSubmitting ? "none" : "auto",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#00f2ff",
                  boxShadow: "0 0 15px #00f2ff",
                }}
              />
              <h2
                style={{
                  margin: 0,
                  fontSize: "22px",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  textShadow: "0 0 10px rgba(0, 242, 255, 0.5)",
                }}
              >
                SECURE ACCESS
              </h2>
            </div>

            {/* Username Field */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "#00f2ff", // Neon accent text
                  marginBottom: "8px",
                  letterSpacing: "1px",
                  fontWeight: "bold",
                }}
              >
                // USERNAME_ID
              </label>
              <div
                style={{
                  background: "rgba(0, 242, 255, 0.05)",
                  border: "1px solid rgba(0, 242, 255, 0.4)", // Glowing border
                  borderRadius: "8px",
                  padding: "14px 16px",
                  fontSize: "15px",
                  color: "#e2e8f0",
                  fontFamily: "monospace",
                  boxShadow: "0 0 10px rgba(0, 242, 255, 0.1)", // Input glow
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
                  fontSize: "11px",
                  color: "#00f2ff",
                  marginBottom: "8px",
                  letterSpacing: "1px",
                  fontWeight: "bold",
                }}
              >
                // PASS_KEY
              </label>
              <div
                style={{
                  background: "rgba(0, 242, 255, 0.05)",
                  border: "1px solid rgba(0, 242, 255, 0.4)",
                  borderRadius: "8px",
                  padding: "14px 16px",
                  fontSize: "15px",
                  color: "#e2e8f0",
                  letterSpacing: "4px",
                  boxShadow: "0 0 10px rgba(0, 242, 255, 0.1)",
                }}
              >
                •••••••••••
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              style={{
                marginTop: "12px",
                background: "rgba(0, 242, 255, 0.9)",
                border: "1px solid #ffffff",
                borderRadius: "8px",
                padding: "16px",
                color: "#000",
                fontWeight: "900",
                fontSize: "15px",
                cursor: "pointer",
                boxShadow: "0 0 25px rgba(0, 242, 255, 0.4)",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "scale(1.02) translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 0 40px rgba(0, 242, 255, 0.7)";
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "#00f2ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(0, 242, 255, 0.4)";
                e.currentTarget.style.background = "rgba(0, 242, 255, 0.9)";
                e.currentTarget.style.color = "#000";
              }}
            >
              Authenticate
            </button>
          </div>
        </Html>
      </FloatingPanel>
    </group>
  );
}

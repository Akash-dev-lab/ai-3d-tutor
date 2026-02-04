import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import CameraController from "./components/CameraController";
import GameObject from "./components/GameObject";
import ProtectedArea from "./components/ProtectedArea";
import User from "./components/User";
import AuthServer from "./components/AuthServer";
import Gate from "./components/Gate";
import Token from "./components/Token";
import { Suspense } from "react";
const JWT_STEP_CONFIG = {
  0: { title: "Introduction", next: 1 },
  1: { title: "Login Request", next: 2 },
  2: { title: "Token Issued", next: 3 },
  3: { title: "Access Request", next: 4 },
  4: { title: "Verification & Entry", next: 5 }, // restart
  5: { title: "Token Expired", next: 6 },
  6: { title: "Invalid Token", next: 0 },
};

/* =========================
   3D COMPONENTS (UNCHANGED)
   ========================= */

// Local component definitions removed in favor of external imports

/* =========================
   CONTROLLER (UNCHANGED)
   ========================= */

const useJWTController = () => {
  const [step, setStep] = useState(0);
  const [visualStep, setVisualStep] = useState(0);
  const [narration, setNarration] = useState("Loading...");

  // 🔒 Guard: ensure step is always valid
  const safeStep = JWT_STEP_CONFIG[step] ? step : 0;
  const isExpiredToken = safeStep === 5;
  const isInvalidToken = safeStep === 6;
  const isAccessDenied = isExpiredToken || isInvalidToken;

  useEffect(() => {
    // 1️⃣ Visuals must respond immediately
    setVisualStep(safeStep);

    // 2️⃣ Narration async (non-blocking)
    setNarration("Loading...");

    fetch(`http://localhost:5000/api/narration/${safeStep}`)
      .then((res) => res.json())
      .then((data) => {
        setNarration(data?.narration || "Explanation unavailable.");
      })
      .catch(() => {
        setNarration("Explanation unavailable (offline).");
      });
  }, [safeStep]);

  const nextStep = () => {
    const next = JWT_STEP_CONFIG[safeStep]?.next ?? 0;
    setStep(next);
  };

  return {
    currentStep: safeStep,
    visualStep,
    narration,
    stepTitle: JWT_STEP_CONFIG[safeStep].title,
    isFirstStep: safeStep === 0,
    isLastStep: safeStep === 6,
    isExpiredToken,
    isInvalidToken,
    isAccessDenied,
    nextStep,
  };
};

/* =========================
   SCENE WORLD (CANVAS CHILD)
   ========================= */

function SceneWorld({ visualStep }) {
  const controlsRef = useRef();

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      <User step={visualStep} />
      <AuthServer />
      <Gate step={visualStep} />
      <Token step={visualStep} />
      <ProtectedArea />

      <OrbitControls ref={controlsRef} enablePan={false} />
      <CameraController step={visualStep} controlsRef={controlsRef} />
    </Suspense>
  );
}

/* =========================
   MAIN SCENE (SAFE)
   ========================= */

export default function Scene() {
  const {
    currentStep,
    visualStep,
    narration,
    stepTitle,
    isFirstStep,
    isLastStep,
    nextStep,
  } = useJWTController();

  return (
    <>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ width: "100%", height: "100vh" }}
      >
        <SceneWorld visualStep={visualStep} />
      </Canvas>

      {/* UI */}
      <div
        style={{
          position: "fixed",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0, 0, 0, 0.85)",
          padding: "22px 30px",
          borderRadius: "14px",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          maxWidth: "600px",
          textAlign: "center",
          zIndex: 1000,
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          alignItems: "center",
        }}
      >
        {/* 🔹 STEP TITLE */}
        <h3
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: "600",
            color: "#4a9eff",
          }}
        >
          {isFirstStep ? stepTitle : `Step ${currentStep}: ${stepTitle}`}
        </h3>

        {/* 🔹 STEP DESCRIPTION */}
        <p
          style={{
            margin: 0,
            fontSize: "16px",
            lineHeight: "1.5",
            color: "#e5e7eb",
          }}
        >
          {narration || "Loading..."}
        </p>

        {/* 🔹 ACTION BUTTON */}
        <button
          style={{
            padding: "8px 26px",
            background: "#4ade80",
            border: "none",
            borderRadius: "20px",
            color: "black",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "14px",
            marginTop: "6px",
            transition: "transform 0.1s",
          }}
          onClick={nextStep}
        >
          {isLastStep ? "Restart" : "Next Step"}
        </button>
      </div>
    </>
  );
}

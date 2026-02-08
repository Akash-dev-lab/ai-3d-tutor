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
import TechEnvironment from "./components/TechEnvironment";
import { Suspense } from "react";
import { useSpeech } from "./hooks/useSpeech";
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
  const { speak, stop } = useSpeech();

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
        const text = data?.narration || "Explanation unavailable.";
        setNarration(text);
        speak(text);
      })
      .catch(() => {
        setNarration("Explanation unavailable (offline).");
      });
  }, [safeStep, speak]);

  const nextStep = () => {
    const next = JWT_STEP_CONFIG[safeStep]?.next ?? 0;
    setStep(next);
  };

  const playFullStory = () => {
    setStep(0);
    setNarration("Loading full story...");

    // Switch to step 100 for continuous narration
    setTimeout(() => {
      setStep(100); // Trigger full narration text
      setVisualStep(0); // Start visuals at 0
    }, 500);

    const timeline = [
      { step: 1, delay: 10000 }, // Intro ends at 10s
      { step: 2, delay: 15000 }, // Login ends at 15s
      { step: 3, delay: 25000 }, // Token issued ends at 25s
      { step: 4, delay: 35000 }, // Access request ends at 35s
      { step: 0, delay: 50000 }, // Verification & Entry ends at 50s, back to intro/conclusion
    ];

    timeline.forEach(({ step, delay }) => {
      setTimeout(() => setVisualStep(step), delay);
    });

    // Reset back to normal mode after 62 seconds
    setTimeout(() => {
      setStep(0);
      setVisualStep(0);
    }, 62000);
  };

  return {
    currentStep: safeStep,
    visualStep,
    narration,
    stepTitle:
      safeStep === 100 ? "Full Story" : JWT_STEP_CONFIG[safeStep].title,
    isFirstStep: safeStep === 0,
    isLastStep: safeStep === 6,
    isFullStory: safeStep === 100,
    isExpiredToken,
    isInvalidToken,
    isAccessDenied,
    nextStep,
    playFullStory,
  };
};

// 🔹 CSS for the Glowing Animation
const GLOW_STYLE = `
  @keyframes glow {
    0% { box-shadow: 0 0 4px #4ade80, 0 0 8px #4ade80; }
    50% { box-shadow: 0 0 16px #4ade80, 0 0 26px #4ade80; }
    100% { box-shadow: 0 0 5px #4ade80, 0 0 10px #4ade80; }
  }
`;

/* =========================
   SCENE WORLD (CANVAS CHILD)
   ========================= */

function SceneWorld({ visualStep }) {
  const controlsRef = useRef();

  return (
    <Suspense fallback={null}>
      <color attach="background" args={["#06080a"]} />
      <fog attach="fog" args={["#06080a", 15, 60]} />

      {/* 1. Ambient Light (Low base visibility) */}
      <ambientLight intensity={0.15} />

      {/* 2. Key Light (Hero highlighting) */}
      <directionalLight
        position={[15, 15, 15]}
        intensity={0.8}
        color="#ffffff"
      />

      {/* 3. Fill Light (Cool shadows) */}
      <pointLight position={[-15, 5, 10]} intensity={0.6} color="#aaccff" />

      {/* 4. Rim Light (Edge separation - Cyan) */}
      <directionalLight
        position={[0, 5, -30]}
        intensity={2.0}
        color="#00ffff"
      />

      {/* 5. Character Support Light (Follows action) */}
      <pointLight
        position={[0, 5, -10]}
        intensity={1.2}
        color="#ffffff"
        distance={25}
      />

      <TechEnvironment />

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
      <style>{GLOW_STYLE}</style>
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
        {/* 🔹 AUDIO INDICATOR */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "15px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            opacity: 0.6,
          }}
        >
          <span
            style={{ fontSize: "12px", color: "#4ade80", fontWeight: "bold" }}
          >
            AUDIO ON
          </span>
          <div
            style={{
              width: "8px",
              height: "8px",
              background: "#4ade80",
              borderRadius: "50%",
              boxShadow: "0 0 8px #4ade80",
            }}
          ></div>
        </div>

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

        {/* 🔹 ACTION BUTTONS */}
        <div style={{ display: "flex", gap: "10px" }}>
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
              animation: "glow 4s infinite ease-in-out",
            }}
            onClick={nextStep}
          >
            {isLastStep ? "Restart" : "Next Step"}
          </button>
        </div>
      </div>
    </>
  );
}

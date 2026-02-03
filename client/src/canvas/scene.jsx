import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import CameraController from "./components/CameraController";
import GameObject from "./components/GameObject";
import ProtectedArea from "./components/ProtectedArea";
const JWT_STEP_CONFIG = {
  0: { title: "Introduction", next: 1 },
  1: { title: "Login Request", next: 2 },
  2: { title: "Token Issued", next: 3 },
  3: { title: "Access Request", next: 4 },
  4: { title: "Verification & Entry", next: 0 }, // restart
};

/* =========================
   3D COMPONENTS (UNCHANGED)
   ========================= */

function User({ step }) {
  const meshRef = useRef();
  const [currentPosition, setCurrentPosition] = useState([0, 0.25, 0]);
  const [targetPosition, setTargetPosition] = useState([0, 0.25, 0]);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (step === 1) {
      setTargetPosition([0, 0.25, -8]);
      setProgress(0);
    } else if (step === 3) {
      setTargetPosition([0, 0.25, -18]);
      setProgress(0);
    } else if (step === 0) {
      setTargetPosition([0, 0.25, 0]);
      setProgress(0);
    }
  }, [step]);

  useFrame((_, delta) => {
    if (!meshRef.current || progress >= 1) return;

    setProgress((prev) => {
      const p = Math.min(prev + delta * 0.5, 1);
      const pos = [
        currentPosition[0] + (targetPosition[0] - currentPosition[0]) * p,
        currentPosition[1] + (targetPosition[1] - currentPosition[1]) * p,
        currentPosition[2] + (targetPosition[2] - currentPosition[2]) * p,
      ];
      meshRef.current.position.set(...pos);
      if (p === 1) setCurrentPosition(targetPosition);
      return p;
    });
  });

  return (
    <GameObject ref={meshRef} position={currentPosition} useModel={false}>
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#4a9eff" />
      </mesh>
    </GameObject>
  );
}

function AuthServer() {
  return (
    <GameObject position={[0, 2, -10]} useModel={false}>
      <mesh>
        <boxGeometry args={[2, 4, 2]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>
    </GameObject>
  );
}

function Gate({ step }) {
  const barRef = useRef();
  const [open, setOpen] = useState(false);
  const [rot, setRot] = useState(0);

  useEffect(() => {
    if (step === 4) setOpen(true);
    if (step === 0) setOpen(false);
  }, [step]);

  useFrame((_, delta) => {
    if (!barRef.current) return;
    setRot((r) => {
      const target = open ? 1 : 0;
      const next = r + (target - r) * delta * 3;
      barRef.current.rotation.z = (Math.PI / 2) * next;
      return next;
    });
  });

  return (
    <GameObject useModel={false}>
      <mesh position={[-3, 1.5, -20]}>
        <boxGeometry args={[0.2, 3, 0.2]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[3, 1.5, -20]}>
        <boxGeometry args={[0.2, 3, 0.2]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <group ref={barRef} position={[0, 2.5, -20]}>
        <mesh>
          <boxGeometry args={[6.4, 0.1, 0.1]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>
    </GameObject>
  );
}

function Token({ step }) {
  const meshRef = useRef();
  const [visible, setVisible] = useState(false);
  const [z, setZ] = useState(-14);
  const [targetZ, setTargetZ] = useState(-14);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (step === 2) {
      setVisible(true);
      setTargetZ(-14);
      setProgress(0);
    } else if (step === 3) {
      setTargetZ(-19);
      setProgress(0);
    } else if (step === 0) {
      setVisible(false);
    }
  }, [step]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    meshRef.current.position.y =
      2 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    meshRef.current.rotation.y += delta * 0.5;

    if (progress < 1) {
      setProgress((p) => {
        const np = Math.min(p + delta * 0.5, 1);
        const nz = z + (targetZ - z) * np;
        meshRef.current.position.z = nz;
        if (np === 1) setZ(targetZ);
        return np;
      });
    }
  });

  if (!visible) return null;

  return (
    <GameObject ref={meshRef} position={[0, 2, z]} useModel={false}>
      <mesh>
        <boxGeometry args={[0.6, 0.4, 0.05]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#a78bfa"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </GameObject>
  );
}

/* =========================
   CONTROLLER (UNCHANGED)
   ========================= */

const useJWTController = () => {
  const [step, setStep] = useState(0);
  const [visualStep, setVisualStep] = useState(0);
  const [narration, setNarration] = useState("Loading...");

  // 🔒 Guard: ensure step is always valid
  const safeStep = JWT_STEP_CONFIG[step] ? step : 0;

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
    isLastStep: safeStep === 4,
    nextStep,
  };
};

/* =========================
   SCENE WORLD (CANVAS CHILD)
   ========================= */

function SceneWorld({ visualStep }) {
  const controlsRef = useRef();

  return (
    <>
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
    </>
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

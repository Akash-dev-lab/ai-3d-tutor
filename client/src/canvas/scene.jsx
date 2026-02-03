import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useEffect, useRef } from 'react';
import CameraController from './components/CameraController';
import User from './components/User';
import AuthServer from './components/AuthServer';
import Gate from './components/Gate';
import Token from './components/Token';
import ProtectedArea from './components/ProtectedArea';

// --- Configuration: JWT Authentication Step Mapping ---
// Represents the single source of truth for the authentication flow.
const JWT_STEPS = {
  0: {
    id: 0,
    title: "Introduction",
    concept: "Initial State",
    action: "Reset Scene",
    description: "The stage is set. Our User (Client) is ready to authenticate."
  },
  1: {
    id: 1,
    title: "Login Request",
    concept: "Authentication",
    action: "User moves to Server",
    description: "User sends credentials (username/password) to the Auth Server."
  },
  2: {
    id: 2,
    title: "Token Issued",
    concept: "Token Generation",
    action: "Server creates JWT",
    description: "Server validates credentials and signs a new JSON Web Token."
  },
  3: {
    id: 3,
    title: "Access Request",
    concept: "Authorization",
    action: "User+Token move to Gate",
    description: "User presents the JWT to the Protected Resource Gate."
  },
  4: {
    id: 4,
    title: "Verification & Entry",
    concept: "Validation",
    action: "Gate opens",
    description: "Gate verifies the JWT signature and grants access."
  }
};

/**
 * Controller: encapsulated logic for JWT flow state
 * Responsibility: Manages logical steps (0-4), fetches narration, and syncs visuals.
 */
const useJWTController = () => {
  const [step, setStep] = useState(0); 
  const [visualStep, setVisualStep] = useState(0);
  const [narration, setNarration] = useState('');

  // Effect: Sync Narration & Visuals when Step changes
  useEffect(() => {
    // 1. Fetch explanation for the current step
    fetch(`http://localhost:5000/api/narration/${step}`)
      .then(res => res.json())
      .then(data => {
        setNarration(data.narration);
        // 2. Trigger visual animation only after data validates
        setVisualStep(step);
      })
      .catch(err => {
        console.error('Failed to fetch narration:', err);
        // Fallback: update visual anyway so app doesn't freeze
        setVisualStep(step);
      });
  }, [step]);

  const nextStep = () => {
    setStep(prev => (prev < 4 ? prev + 1 : 0));
  };

  return {
    currentStep: step,
    visualStep,
    narration,
    currentMetadata: JWT_STEPS[step],
    nextStep
  };
};

function Scene() {
  const { currentStep, visualStep, narration, currentMetadata, nextStep } = useJWTController();
  const controlsRef = useRef();

  // No separate handles needed; Controller manages logic.

  return (
    <>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ width: '100%', height: '100vh' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <directionalLight position={[-5, 5, -5]} intensity={0.6} />

        {/* Ground Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>

        {/* --- Component Orchestration --- */}

        {/* 1. User: The Client requesting access */}
        <User step={visualStep} />

        {/* 2. Auth Server: Validates Credentials & Issues Token */}
        <AuthServer />

        {/* 3. Gate: Enforces security check */}
        <Gate step={visualStep} />

        {/* 5. Protected Area: The Destination / Resource */}
        <ProtectedArea />

        {/* 4. Token: Proof of Identity (Hero Object) */}
        <Token step={visualStep} />

        {/* Camera Controls */}
        <OrbitControls ref={controlsRef} enablePan={false} />
        <CameraController step={visualStep} controlsRef={controlsRef} />
      </Canvas>

      {/* Narration Display with Next Button */}
      <div style={{
        position: 'fixed',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.85)',
        padding: '20px 30px',
        borderRadius: '12px',
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '600px',
        textAlign: 'center',
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: '0', color: '#4a9eff', fontSize: '18px' }}>
          {currentStep === 0 ? currentMetadata.title : `Step ${currentStep}: ${currentMetadata.title}`}
        </h3>
        <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.5', color: '#e5e7eb' }}>
          {narration || 'Loading explanation...'}
        </p>
        
        <button 
          onClick={nextStep}
          style={{
            padding: '8px 24px',
            background: '#4ade80',
            border: 'none',
            borderRadius: '20px',
            color: 'black',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop: '5px',
            transition: 'transform 0.1s'
          }}
        >
          {currentStep < 4 ? 'Next Step' : 'Restart'}
        </button>
      </div>
    </>
  );
}

export default Scene;
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useEffect, useRef } from 'react';
import CameraController from './components/CameraController';
import User from './components/User';
import Gate from './components/Gate';
import Token from './components/Token';

function Scene() {
  const [step, setStep] = useState(0); // Logical step (for fetching)
  const [visualStep, setVisualStep] = useState(0); // Visual step (for animation)
  const [narration, setNarration] = useState('');
  const controlsRef = useRef();

  // Fetch narration when step changes
  useEffect(() => {
    fetch(`http://localhost:5000/api/narration/${step}`)
      .then(res => res.json())
      .then(data => {
        setNarration(data.narration);
        // Only update visual step after narration is received
        setVisualStep(step);
      })
      .catch(err => console.error('Failed to fetch narration:', err));
  }, [step]);
  
  const stepTitles = {
    0: "Introduction",
    1: "Login Request",
    2: "Token Issued",
    3: "Access Request",
    4: "Verification & Entry"
  };

  const handleNext = () => {
    setStep(prev => prev < 4 ? prev + 1 : 0);
  };

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

        {/* Components */}
        <User step={visualStep} />

        {/* Auth Server - Building */}
        {/* Auth Server - Building (Tallest) - Role: Validates Credentials & Issues Token */}
        <mesh position={[0, 2, -10]}>
          <boxGeometry args={[2, 4, 2]} />
          <meshStandardMaterial color="#4ade80" />
        </mesh>

        <Gate step={visualStep} />

        {/* Protected Area - Behind Gate (Wide) - Role: Restricted Resource */}
        <mesh position={[0, 1, -30]}>
          <boxGeometry args={[4, 2, 4]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>

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
          {step === 0 ? stepTitles[0] : `Step ${step}: ${stepTitles[step]}`}
        </h3>
        <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.5', color: '#e5e7eb' }}>
          {narration || 'Loading explanation...'}
        </p>
        
        <button 
          onClick={handleNext}
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
          {step < 4 ? 'Next Step' : 'Restart'}
        </button>
      </div>
    </>
  );
}

export default Scene;
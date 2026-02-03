import React, { useState, useEffect } from 'react';

function Token({ step }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (step === 2 || step === 3) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [step]);

  return (
    <mesh position={[0, 2, -5]} visible={isVisible}>
      <boxGeometry args={[0.6, 0.4, 0.05]} />
      <meshStandardMaterial 
        color="#a78bfa" 
        emissive="#a78bfa" 
        emissiveIntensity={0.5} 
      />
    </mesh>
  );
}

export default Token;

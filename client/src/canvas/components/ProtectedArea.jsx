import GameObject from './GameObject';

/**
 * ProtectedArea Component
 * Responsibility: Represents the Restricted Resource / VIP Section.
 * Visual: Yellow area positioned at Z=-30.
 * Role: The destination the user wants to reach. Accessible only after Gate verification (Step 4).
 */
function ProtectedArea() {
  return (
    <GameObject position={[0, 1, -30]} useModel={false}>
      <mesh>
        <boxGeometry args={[4, 2, 4]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
    </GameObject>
  );
}

export default ProtectedArea;

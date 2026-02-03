import GameObject from './GameObject';

/**
 * AuthServer Component
 * Responsibility: Represents the Authentication Server.
 * Visual: Green building positioned at Z=-10.
 * Role: Validates user credentials (Step 1) and issues the JWT token (Step 2).
 */
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

export default AuthServer;

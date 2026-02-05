import GameObject from "./GameObject";

/**
 * AuthServer Component
 * Responsibility: Represents the Authentication Server.
 * Visual: Green building positioned at Z=-10.
 * Role: Validates user credentials (Step 1) and issues the JWT token (Step 2).
 */
function AuthServer() {
  return (
    <GameObject
      position={[0, 2, -10]}
      useModel={true}
      modelPath="/models/auth-server.glb"
    />
  );
}

export default AuthServer;

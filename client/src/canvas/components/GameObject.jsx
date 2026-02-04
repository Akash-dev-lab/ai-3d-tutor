import React, { forwardRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

/**
 * Internal Model Loader Component
 * Encapsulates the hook calls to ensure they are only invoked when this component is mounted.
 */
function Model({ path }) {
  const { scene } = useGLTF(path);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return <primitive object={clonedScene} />;
}

/**
 * GameObject Component
 * Supports both GLB models and primitive geometries.
 * Falls back to a default cube if no model or children are provided.
 */
const GameObject = forwardRef(({ modelPath, children, ...props }, ref) => {
  return (
    <group ref={ref} {...props}>
      {modelPath ? (
        <Model path={modelPath} />
      ) : (
        children || (
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#6366f1" />
          </mesh>
        )
      )}
    </group>
  );
});

export default GameObject;

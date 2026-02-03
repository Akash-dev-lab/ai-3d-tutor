import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * Internal Model Loader Component
 * Encapsulates the hook calls to ensure they are only invoked when this component is mounted.
 */
function Model({ path, scale = 1, ...props }) {
  // NOTES FOR FUTURE SWAPPING:
  // 1. Place .glb files in public/models/
  // 2. Pass the path prop like "models/user.glb"
  // 3. Adjust scale per model to match scene units
  const { scene } = useGLTF(path);
  
  // Clone the scene to allow multiple instances of the same model with different animations
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  return <primitive object={clonedScene} scale={scale} {...props} />;
}

/**
 * GameObject Abstraction
 * Wraps visual elements to allow easy switching between Primitives and 3D Models.
 * 
 * @param {boolean} useModel - Validation flag. If true, tries to load GLTF.
 * @param {string} modelPath - Path to the GLTF file (e.g. '/user.glb').
 * @param {number} modelScale - Scale multiplier for the model.
 * @param {React.ReactNode} children - The primitive geometry to render by default.
 */
const GameObject = forwardRef(({ useModel = false, modelPath, modelScale = 1, children, ...props }, ref) => {
  if (useModel && modelPath) {
    return (
      <group ref={ref} {...props}>
          <Model path={modelPath} scale={modelScale} />
      </group>
    );
  }

  // Render Primitive (Default)
  return (
    <group ref={ref} {...props}>
      {children}
    </group>
  );
});

export default GameObject;

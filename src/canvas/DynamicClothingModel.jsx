import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Decal } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import state from '../store';

const DynamicClothingModel = ({ clothingType = 'shirt' }) => {
  const snap = useSnapshot(state);
  
  const modelMap = {
    shirt: { path: '/shirt.glb', scale: [1, 1, 1] },
    dress: { path: '/dress.glb', scale: [0.8, 0.8, 0.8] },
    pants: { path: '/pants_1.glb', scale: [0.9, 0.9, 0.9] },
    jacket: { path: '/jacket.glb', scale: [0.85, 0.85, 0.85] },
    skirt: { path: '/pleated_skirt.glb', scale: [0.75, 0.75, 0.75] },
  };

  const modelConfig = modelMap[clothingType] || modelMap.shirt;
  const gltf = useGLTF(modelConfig.path, true);
  const groupRef = useRef(null);
  const [fullTexture, setFullTexture] = useState(null);

  // Load full decal texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    if (snap.fullDecal) {
      try {
        loader.load(snap.fullDecal, (tex) => setFullTexture(tex), undefined, () => setFullTexture(null));
      } catch (e) {
        setFullTexture(null);
      }
    } else {
      setFullTexture(null);
    }
  }, [snap.fullDecal]);

  // Traverse all meshes and update materials
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          const target = new THREE.Color(snap.color);
          if (snap.isFullTexture && snap.fullDecal) {
            child.material.color.lerp(target, 0.1);
          } else {
            child.material.color.copy(target);
          }
        }
      });
    }
  });

  // Clear textures in solid mode
  useEffect(() => {
    if (groupRef.current && !snap.isFullTexture) {
      groupRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.map = null;
          child.material.color.setStyle(snap.color);
          child.material.needsUpdate = true;
        }
      });
    }
  }, [snap.isFullTexture, snap.color]);

  if (!gltf.nodes || !gltf.materials) {
    return (
      <mesh>
        <boxGeometry args={[1, 1.2, 0.4]} />
        <meshStandardMaterial color={snap.color} />
      </mesh>
    );
  }

  return (
    <group ref={groupRef} scale={modelConfig.scale}>
      <primitive object={gltf.scene} />
      {snap.isFullTexture && fullTexture && (
        <Decal
          position={[0, 0, 0.15]}
          rotation={[0, 0, 0]}
          scale={1.5}
          map={fullTexture}
          depthTest={false}
          depthWrite={true}
        />
      )}
    </group>
  );
};

export default DynamicClothingModel;

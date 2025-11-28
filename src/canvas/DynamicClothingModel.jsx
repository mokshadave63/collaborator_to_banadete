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
  const [decalMesh, setDecalMesh] = useState(null);
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
          // If a full texture is applied, avoid overriding the material color
          // because the texture already contains the desired colors.
          if (!snap.isFullTexture) {
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

  // Find a mesh inside the loaded model to attach the Decal to
  useEffect(() => {
    if (groupRef.current) {
      // getObjectByProperty returns the first matching object
      const m = groupRef.current.getObjectByProperty('isMesh', true);
      if (m) setDecalMesh(m);
    }
  }, [gltf, groupRef.current, snap.clothingType]);

  // Apply full texture as material.map to all meshes when available
  useEffect(() => {
    if (!groupRef.current) return;

    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        if (snap.isFullTexture && fullTexture) {
          fullTexture.encoding = THREE.sRGBEncoding;
          fullTexture.wrapS = THREE.RepeatWrapping;
          fullTexture.wrapT = THREE.RepeatWrapping;
          // Assign the texture to the material so it covers the whole mesh
          child.material.map = fullTexture;
          // Ensure material color doesn't darken the texture
          child.material.color.setRGB(1, 1, 1);
          child.material.needsUpdate = true;
        } else if (!snap.isFullTexture) {
          // clear any applied maps when switching back to solid color
          child.material.map = null;
          child.material.color.setStyle(snap.color);
          child.material.needsUpdate = true;
        }
      }
    });
  }, [fullTexture, snap.isFullTexture, snap.color]);

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
    </group>
  );
};

export default DynamicClothingModel;

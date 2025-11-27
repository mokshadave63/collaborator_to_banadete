import React from 'react'
import { useSnapshot } from 'valtio';
import { OrbitControls } from '@react-three/drei';

import state from '../store';
import DynamicClothingModel from './DynamicClothingModel';

const Shirt = () => {
  const snap = useSnapshot(state);
  const stateString = JSON.stringify(snap);

  return (
    <>
      <OrbitControls />
      <group key={stateString}>
        <DynamicClothingModel clothingType={snap.clothingType} />
      </group>
    </>
  );
}

export default Shirt

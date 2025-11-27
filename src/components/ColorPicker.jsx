import React, { useState } from 'react'
import { SketchPicker } from 'react-color'
import { useSnapshot } from 'valtio'

import state from '../store';

const presetColors = ['#ffffff', '#000000', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#EC4899', '#F97316'];

const ColorPicker = ({ selectedColor, onColorChange }) => {
  const snap = useSnapshot(state);
  const [localColor, setLocalColor] = useState(selectedColor || snap.color);

  const applyColor = (color) => {
    setLocalColor(color);
    if (onColorChange) onColorChange(color);
    state.color = color;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {presetColors.map((c) => (
          <button
            key={c}
            onClick={() => applyColor(c)}
            style={{ backgroundColor: c }}
            className={`w-8 h-8 rounded-full border ${localColor === c ? 'ring-2 ring-offset-1 ring-primary-400' : 'border-gray-200'}`}
          />
        ))}
      </div>

      <div className="mt-2">
        <SketchPicker
          color={localColor}
          disableAlpha
          onChangeComplete={(col) => setLocalColor(col.hex)}
        />
        <div className="flex gap-2 mt-2">
          <button onClick={() => applyColor(localColor)} className="px-3 py-1 rounded bg-primary-600 text-white">Apply</button>
          <button onClick={() => { setLocalColor(snap.color); if (onColorChange) onColorChange(snap.color); }} className="px-3 py-1 rounded border">Reset</button>
        </div>
      </div>
    </div>
  )
}

export default ColorPicker

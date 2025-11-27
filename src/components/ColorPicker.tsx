import React from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const colors = [
  '#6A0DAD', '#9D50BB', '#C471ED', // Purple theme colors
  '#FF69B4', '#FF1493', '#DC143C', // Pink/Red
  '#4169E1', '#1E90FF', '#00BFFF', // Blue
  '#32CD32', '#00FA9A', '#98FB98', // Green
  '#FFD700', '#FFA500', '#FF8C00', // Yellow/Orange
  '#8B4513', '#A0522D', '#CD853F', // Brown
  '#000000', '#696969', '#FFFFFF', // Neutrals
];

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Color Selection</h3>
      
      <div className="grid grid-cols-6 gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 ${
              selectedColor === color
                ? 'border-gray-800 ring-2 ring-primary-200'
                : 'border-gray-200 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          >
            {selectedColor === color && (
              <div className="w-full h-full flex items-center justify-center">
                <div className={`w-3 h-3 rounded-full ${color === '#FFFFFF' ? 'bg-gray-800' : 'bg-white'}`} />
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Custom color input */}
      <div className="flex items-center space-x-2">
        <label htmlFor="custom-color" className="text-sm text-gray-600">Custom:</label>
        <input
          id="custom-color"
          type="color"
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
        />
        <span className="text-sm text-gray-500">{selectedColor}</span>
      </div>
    </div>
  );
};

export default ColorPicker;
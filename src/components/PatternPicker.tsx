import React from 'react';

interface PatternPickerProps {
  selectedPattern: string;
  onPatternChange: (pattern: string) => void;
}

const patterns = [
  { name: 'Solid', preview: 'linear-gradient(45deg, #6366f1 0%, #6366f1 100%)' },
  { name: 'Plain', preview: 'linear-gradient(45deg, #6366f1 0%, #6366f1 100%)' },
  { name: 'Stripes', preview: 'repeating-linear-gradient(45deg, #6366f1 0px, #6366f1 10px, #ffffff 10px, #ffffff 20px)' },
  { name: 'Polka Dots', preview: 'radial-gradient(circle at 25% 25%, #6366f1 2px, transparent 2px), radial-gradient(circle at 75% 75%, #6366f1 2px, transparent 2px)' },
  { name: 'Floral', preview: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%236366f1" fill-opacity="0.3"%3E%3Cpath d="M10 10c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm4-4c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4z"/%3E%3C/g%3E%3C/svg%3E")' },
  { name: 'Checkered', preview: 'repeating-conic-gradient(from 0deg at 50% 50%, #6366f1 0deg 90deg, #ffffff 90deg 180deg)' },
  { name: 'Geometric', preview: 'linear-gradient(45deg, #6366f1 25%, transparent 25%, transparent 75%, #6366f1 75%), linear-gradient(-45deg, #6366f1 25%, transparent 25%, transparent 75%, #6366f1 75%)' },
];

const PatternPicker: React.FC<PatternPickerProps> = ({ selectedPattern, onPatternChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Pattern Selection</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {patterns.map((pattern) => (
          <button
            key={pattern.name}
            onClick={() => onPatternChange(pattern.name)}
            className={`group relative overflow-hidden rounded-lg border-2 transition-all hover:scale-105 ${
              selectedPattern === pattern.name
                ? 'border-primary-500 ring-2 ring-primary-200'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            <div 
              className="aspect-square w-full"
              style={{ 
                background: pattern.preview,
                backgroundSize: '20px 20px'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
              <div className="text-sm font-medium">{pattern.name}</div>
            </div>
            {selectedPattern === pattern.name && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PatternPicker;
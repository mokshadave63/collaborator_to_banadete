import React, { useState } from 'react';

interface FabricPickerProps {
  selectedFabric: string;
  onFabricChange: (fabric: string) => void;
}

const fabrics = [
  { 
    name: 'Cotton', 
    preview: 'https://images.pexels.com/photos/631564/pexels-photo-631564.jpeg?w=100&h=100&fit=crop',
    description: 'Soft, breathable natural fiber'
  },
  { 
    name: 'Silk', 
    preview: 'https://images.pexels.com/photos/2505693/pexels-photo-2505693.jpeg?w=100&h=100&fit=crop',
    description: 'Luxurious, smooth texture'
  },
  { 
    name: 'Denim', 
    preview: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?w=100&h=100&fit=crop',
    description: 'Durable cotton twill weave'
  },
  { 
    name: 'Linen', 
    preview: 'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?w=100&h=100&fit=crop',
    description: 'Cool, lightweight fabric'
  },
  { 
    name: 'Wool', 
    preview: 'https://images.pexels.com/photos/6069108/pexels-photo-6069108.jpeg?w=100&h=100&fit=crop',
    description: 'Warm, natural insulation'
  },
  { 
    name: 'Leather', 
    preview: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?w=100&h=100&fit=crop',
    description: 'Durable, premium material'
  },
];

const FabricPicker: React.FC<FabricPickerProps> = ({ selectedFabric, onFabricChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Fabric Selection</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {fabrics.map((fabric) => (
          <button
            key={fabric.name}
            onClick={() => onFabricChange(fabric.name)}
            className={`group relative overflow-hidden rounded-lg border-2 transition-all hover:scale-105 ${
              selectedFabric === fabric.name
                ? 'border-primary-500 ring-2 ring-primary-200'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            <div className="aspect-square">
              <img
                src={fabric.preview}
                alt={fabric.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
              <div className="text-sm font-medium">{fabric.name}</div>
              <div className="text-xs opacity-90">{fabric.description}</div>
            </div>
            {selectedFabric === fabric.name && (
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

export default FabricPicker;
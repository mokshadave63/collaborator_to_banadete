import React from 'react';
import { Heart, Edit, Trash2, Share, Clock } from 'lucide-react';
import { Design } from '../context/DesignContext';

interface DesignCardProps {
  design: Design;
  onEdit?: (design: Design) => void;
  onDelete?: (id: string) => void;
  onLike?: (id: string) => void;
  showActions?: boolean;
  isPublic?: boolean;
}

const DesignCard: React.FC<DesignCardProps> = ({
  design,
  onEdit,
  onDelete,
  onLike,
  showActions = false,
  isPublic = false,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getClothingTypeImage = (type: string) => {
    const images = {
      shirt: 'https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?w=300&h=400&fit=crop',
      dress: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?w=300&h=400&fit=crop',
      pants: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?w=300&h=400&fit=crop',
      jacket: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?w=300&h=400&fit=crop',
      skirt: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?w=300&h=400&fit=crop',
    };
    return images[type as keyof typeof images] || images.shirt;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={design.imageUrl || getClothingTypeImage(design.clothingType)}
          alt={design.name}
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0 opacity-20"
          style={{ backgroundColor: design.color }}
        />
        <div className="absolute top-2 right-2">
          <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            {design.clothingType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{design.name}</h3>
        
        {/* Design Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Color:</span>
            <div className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: design.color }}
              />
              <span>{design.color}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Fabric:</span>
            <span className="font-medium">{design.fabric}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Pattern:</span>
            <span className="font-medium">{design.pattern}</span>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <Clock className="w-3 h-3 mr-1" />
          {isPublic ? 'Created' : 'Updated'} {formatDate(isPublic ? design.createdAt : design.updatedAt)}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          {isPublic ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onLike?.(design.id)}
                className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
              >
                <Heart className="w-4 h-4" />
                <span className="text-sm">{design.likes}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors">
                <Share className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          ) : showActions ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit?.(design)}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                title="Edit Design"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete?.(design.id)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Delete Design"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : null}
          
          {design.isPublic && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Public
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignCard;
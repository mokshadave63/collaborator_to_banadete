import React, { useState } from 'react';
import { Search, Heart, Download, Eye } from 'lucide-react';

interface LibraryItem {
  id: string;
  name: string;
  type: 'fabric' | 'pattern' | 'color';
  preview: string;
  description: string;
  tags: string[];
  likes: number;
  downloads: number;
}

const libraryItems: LibraryItem[] = [
  {
    id: '1',
    name: 'Premium Cotton',
    type: 'fabric',
    preview: 'https://images.pexels.com/photos/631564/pexels-photo-631564.jpeg?w=200&h=200&fit=crop',
    description: 'High-quality cotton fabric with natural texture',
    tags: ['cotton', 'natural', 'breathable'],
    likes: 156,
    downloads: 89,
  },
  {
    id: '2',
    name: 'Luxury Silk',
    type: 'fabric',
    preview: 'https://images.pexels.com/photos/2505693/pexels-photo-2505693.jpeg?w=200&h=200&fit=crop',
    description: 'Smooth silk fabric with lustrous finish',
    tags: ['silk', 'luxury', 'smooth'],
    likes: 234,
    downloads: 145,
  },
  {
    id: '3',
    name: 'Vintage Denim',
    type: 'fabric',
    preview: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?w=200&h=200&fit=crop',
    description: 'Classic denim with authentic vintage look',
    tags: ['denim', 'vintage', 'durable'],
    likes: 198,
    downloads: 112,
  },
  {
    id: '4',
    name: 'Floral Pattern',
    type: 'pattern',
    preview: 'linear-gradient(45deg, #ff6b9d 25%, transparent 25%), linear-gradient(-45deg, #ff6b9d 25%, transparent 25%)',
    description: 'Beautiful floral pattern for spring collections',
    tags: ['floral', 'spring', 'feminine'],
    likes: 89,
    downloads: 67,
  },
  {
    id: '5',
    name: 'Geometric Lines',
    type: 'pattern',
    preview: 'repeating-linear-gradient(45deg, #667eea 0px, #667eea 10px, #764ba2 10px, #764ba2 20px)',
    description: 'Modern geometric pattern with clean lines',
    tags: ['geometric', 'modern', 'lines'],
    likes: 145,
    downloads: 98,
  },
  {
    id: '6',
    name: 'Royal Purple',
    type: 'color',
    preview: '#6A0DAD',
    description: 'Rich royal purple color',
    tags: ['purple', 'royal', 'rich'],
    likes: 203,
    downloads: 156,
  },
];

const Library: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'fabric' | 'pattern' | 'color'>('all');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const renderPreview = (item: LibraryItem) => {
    if (item.type === 'color') {
      return (
        <div
          className="w-full h-full rounded-lg"
          style={{ backgroundColor: item.preview }}
        />
      );
    } else if (item.type === 'pattern') {
      return (
        <div
          className="w-full h-full rounded-lg"
          style={{ 
            background: item.preview,
            backgroundSize: '20px 20px'
          }}
        />
      );
    } else {
      return (
        <img
          src={item.preview}
          alt={item.name}
          className="w-full h-full object-cover rounded-lg"
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Design Library</h1>
          <p className="text-xl text-gray-600">Explore our curated collection of fabrics, patterns, and colors</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {libraryItems.filter(item => item.type === 'fabric').length}
            </div>
            <div className="text-gray-600">Premium Fabrics</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {libraryItems.filter(item => item.type === 'pattern').length}
            </div>
            <div className="text-gray-600">Unique Patterns</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {libraryItems.filter(item => item.type === 'color').length}
            </div>
            <div className="text-gray-600">Color Palettes</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search fabrics, patterns, colors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              {['all', 'fabric', 'pattern', 'color'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Library Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="aspect-square p-4">
                  {renderPreview(item)}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.type === 'fabric' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'pattern' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{item.downloads}</span>
                      </div>
                    </div>
                    <button className="flex items-center space-x-1 text-primary-600 hover:text-primary-700">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Item Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedItem.name}</h2>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="aspect-video mb-4">
                  {renderPreview(selectedItem)}
                </div>
                
                <p className="text-gray-600 mb-4">{selectedItem.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-5 h-5" />
                      <span>{selectedItem.likes} likes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-5 h-5" />
                      <span>{selectedItem.downloads} downloads</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>Like</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Use in Design</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
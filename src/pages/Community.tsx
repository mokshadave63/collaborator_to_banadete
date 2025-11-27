import React, { useEffect, useState } from 'react';
import { Heart, Search, Filter, TrendingUp } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import DesignCard from '../components/DesignCard';

const Community: React.FC = () => {
  const { state: designState, loadPublicDesigns, likeDesign } = useDesign();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');

  useEffect(() => {
    loadPublicDesigns();
  }, []);

  const filteredAndSortedDesigns = designState.publicDesigns
    .filter(design => {
      const matchesSearch = design.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || design.clothingType === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.likes - a.likes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Gallery</h1>
          <p className="text-xl text-gray-600">Discover amazing designs from talented creators</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {designState.publicDesigns.reduce((sum, design) => sum + design.likes, 0)}
            </div>
            <div className="text-gray-600">Total Likes</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{designState.publicDesigns.length}</div>
            <div className="text-gray-600">Public Designs</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <div className="text-primary-600 text-xl">🎨</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">∞</div>
            <div className="text-gray-600">Creativity</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search community designs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Types</option>
                  <option value="shirt">Shirts</option>
                  <option value="dress">Dresses</option>
                  <option value="pants">Pants</option>
                  <option value="jacket">Jackets</option>
                  <option value="skirt">Skirts</option>
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Design */}
        {filteredAndSortedDesigns.length > 0 && sortBy === 'popular' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🏆 Featured Design</h2>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
              <div className="max-w-sm mx-auto">
                <DesignCard
                  design={filteredAndSortedDesigns[0]}
                  onLike={likeDesign}
                  isPublic={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Designs Grid */}
        {filteredAndSortedDesigns.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {sortBy === 'newest' ? 'Latest Designs' : 'Popular Designs'}
              </h2>
              <span className="text-gray-500">{filteredAndSortedDesigns.length} designs</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedDesigns.map((design) => (
                <DesignCard
                  key={design.id}
                  design={design}
                  onLike={likeDesign}
                  isPublic={true}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No designs found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
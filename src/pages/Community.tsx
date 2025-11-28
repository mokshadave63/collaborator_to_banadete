import React, { useEffect, useState } from 'react';
import { Heart, Eye, Download, Share2 } from 'lucide-react';
import { designAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Design {
  _id: string;
  name: string;
  description?: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  designData: any;
  thumbnail?: string;
  isPublic: boolean;
  likes: string[];
  downloads: number;
  views?: number;
  tags: string[];
  shareId?: string;
  createdAt: string;
}

const Community: React.FC = () => {
  const { state: authState } = useAuth();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likedDesigns, setLikedDesigns] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDesigns();
  }, [page]);

  const loadDesigns = async () => {
    try {
      setLoading(true);
      const response = await designAPI.getPublic(page, 12);
      setDesigns(response.designs);
      setTotalPages(response.pages);

      // Check which designs user has liked
      if (authState.user) {
        const liked = new Set<string>();
        response.designs.forEach((design: Design) => {
          if (design.likes && design.likes.some((id) => id.toString() === (authState.user?._id || '').toString())) {
            liked.add(design._id);
          }
        });
        setLikedDesigns(liked);
      }
    } catch (error) {
      console.error('Failed to load designs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (e: React.MouseEvent, designId: string) => {
    e.preventDefault();
    if (!authState.isAuthenticated) {
      alert('Please log in to like designs');
      return;
    }

    try {
      if (likedDesigns.has(designId)) {
        const res = await designAPI.unlike(designId);
        // Update local designs state with returned likes
        setDesigns((prev) => prev.map((d) => d._id === designId ? { ...d, likes: res.likes } : d));
        setLikedDesigns((prev) => {
          const newSet = new Set(prev);
          newSet.delete(designId);
          return newSet;
        });
      } else {
        const res = await designAPI.like(designId);
        setDesigns((prev) => prev.map((d) => d._id === designId ? { ...d, likes: res.likes } : d));
        setLikedDesigns((prev) => new Set(prev).add(designId));
      }
    } catch (error: any) {
      console.error('Failed to like design', error);
      const msg = error?.message || (error?.response && error.response.data && error.response.data.message) || 'Failed to update like';
      alert(msg);
    }
  };

  const handleDownload = async (e: React.MouseEvent, design: Design) => {
    e.preventDefault();
    try {
      if (authState.token) {
        await designAPI.downloadDesign(design._id);
      }
      // Create JSON download
      const dataStr = JSON.stringify(design.designData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${design.name}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download design', error);
    }
  };

  if (loading && designs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading community designs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Gallery</h1>
          <p className="text-xl text-gray-600">
            Explore designs from the StyleCraft community and discover amazing creations
          </p>
        </div>

        {/* Designs Grid */}
        {designs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {designs.map((design) => (
                <Link
                  key={design._id}
                  to={`/share/${design.shareId}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                >
                  {/* Design Card */}
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center overflow-hidden">
                    {design.thumbnail ? (
                      <img
                        src={design.thumbnail}
                        alt={design.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="text-center">
                        <div
                          className="w-24 h-24 rounded-lg mx-auto mb-2"
                          style={{ backgroundColor: design.designData?.color || '#EFBD48' }}
                        />
                        <p className="text-sm text-gray-600">{design.designData?.pattern || 'Design'}</p>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                      {design.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {design.description || 'No description provided'}
                    </p>

                    {/* Designer Info */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {design.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{design.user?.name}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3 border-t pt-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{design.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{design.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{design.downloads || 0}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {design.tags && design.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {design.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t">
                      <button
                        onClick={(e) => handleLike(e, design._id)}
                        className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded transition-colors ${likedDesigns.has(design._id)
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                          }`}
                      >
                        <Heart className={`w-4 h-4 ${likedDesigns.has(design._id) ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">Like</span>
                      </button>

                      <button
                        onClick={(e) => handleDownload(e, design)}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 bg-gray-100 text-gray-600 rounded hover:bg-blue-100 hover:text-blue-600 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Download</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          navigator.clipboard.writeText(`${window.location.origin}/share/${design.shareId}`);
                          alert('Share link copied!');
                        }}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 bg-gray-100 text-gray-600 rounded hover:bg-green-100 hover:text-green-600 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Share</span>
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = page > 2 ? page - 2 + i : i + 1;
                  return pageNum <= totalPages ? (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 rounded-lg ${pageNum === page
                        ? 'bg-primary-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  ) : null;
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No designs found yet. Be the first to create one!</p>
            <Link
              to="/studio"
              className="mt-4 inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Start Designing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
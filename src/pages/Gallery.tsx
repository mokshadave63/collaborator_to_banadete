import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Trash2, Edit, Share2, Download, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { designAPI } from '../services/api';

interface Design {
  _id: string;
  name: string;
  description: string;
  designData: any;
  shareId: string;
  likes: string[];
  views: number;
  downloads: number;
  tags: string[];
  createdAt: string;
}

const Gallery: React.FC = () => {
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);

  useEffect(() => {
    if (authState.isAuthenticated) {
      loadUserDesigns();
    } else {
      setLoading(false);
    }
  }, [authState.isAuthenticated]);

  const loadUserDesigns = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await designAPI.getUserDesigns();
      // Response is the designs array directly or wrapped in object
      const designsData = Array.isArray(response) ? response : (response.designs || []);
      setDesigns(designsData);
    } catch (err: any) {
      console.error('Error loading designs:', err);
      setError('Failed to load designs');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (design: Design) => {
    // Store design in sessionStorage for editing
    sessionStorage.setItem('editingDesign', JSON.stringify(design));
    navigate('/studio');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this design?')) {
      try {
        setDeleting(id);
        await designAPI.delete(id);
        setDesigns(designs.filter(d => d._id !== id));
      } catch (err) {
        console.error('Error deleting design:', err);
        setError('Failed to delete design');
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleRename = async (id: string) => {
    const design = designs.find(d => d._id === id);
    if (!design) return;
    const newName = window.prompt('Enter new name for the design', design.name);
    if (!newName || newName.trim() === '' || newName === design.name) return;

    try {
      setRenamingId(id);
      const payload = {
        name: newName,
        description: design.description || newName,
        designData: design.designData,
        isPublic: (design as any).isPublic !== undefined ? (design as any).isPublic : true,
        tags: design.tags || [],
        thumbnail: (design as any).thumbnail || '',
      };
      const res = await designAPI.update(id, payload);
      setDesigns((prev) => prev.map(d => d._id === id ? { ...d, name: newName } : d));
    } catch (err) {
      console.error('Error renaming design:', err);
      setError('Failed to rename design');
    } finally {
      setRenamingId(null);
    }
  };

  const handleDownload = async (design: Design) => {
    try {
      await designAPI.downloadDesign(design._id);
      // Create JSON file with design data
      const dataStr = JSON.stringify(design.designData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${design.name}-${design._id}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading design:', err);
      setError('Failed to download design');
    }
  };

  const handleShare = (design: Design) => {
    const shareUrl = `${window.location.origin}/share/${design.shareId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const filteredDesigns = designs.filter(design => {
    const matchesSearch = design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || design.designData?.clothingType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Designs</h1>
            <p className="text-gray-600">Manage and organize your fashion designs</p>
          </div>

          {authState.isAuthenticated && (
            <Link
              to="/studio"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>New Design</span>
            </Link>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Search and Filter */}
        {authState.isAuthenticated && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search your designs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

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
            </div>
          </div>
        )}

        {/* Designs Grid */}
        {authState.isAuthenticated ? (
          loading ? (
            <div className="text-center py-16">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 mt-4">Loading designs...</p>
            </div>
          ) : filteredDesigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDesigns.map((design) => (
                <div key={design._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Design Preview */}
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {design.designData?.fullDecal ? (
                      <img src={design.designData.fullDecal} alt={design.name} className="w-32 h-32 object-cover" />
                    ) : (
                      <div
                        className="w-24 h-24 rounded"
                        style={{ backgroundColor: design.designData?.color || '#999' }}
                      />
                    )}
                  </div>

                  {/* Design Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{design.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{design.description}</p>

                    {/* Stats */}
                    <div className="flex gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {design.likes?.length || 0}
                      </span>
                      <span>{design.views || 0} views</span>
                      <span>{design.downloads || 0} downloads</span>
                    </div>

                    {/* Tags */}
                    {design.tags && design.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {design.tags.map((tag, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(design)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Open
                      </button>
                      <button
                        onClick={() => handleRename(design._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Rename
                      </button>
                      <button
                        onClick={() => handleDownload(design)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={() => handleShare(design)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      <button
                        onClick={() => handleDelete(design._id)}
                        disabled={deleting === design._id}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                <Plus className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No designs yet</h3>
              <p className="text-gray-600 mb-6">Create your first design to get started</p>
              <Link
                to="/studio"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Create Design</span>
              </Link>
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <Plus className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign in to view your designs</h3>
            <p className="text-gray-600 mb-6">Create an account to save and manage your fashion designs</p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/login"
                className="px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
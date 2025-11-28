import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Download } from 'lucide-react';
import { designAPI } from '../services/api';
import CanvasModel from '../canvas';
import state from '../store';

const SharedDesign: React.FC = () => {
    const { shareId } = useParams<{ shareId: string }>();
    const [design, setDesign] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (shareId) {
            setLoading(true);
            designAPI
                .getByShareId(shareId)
                .then((response) => {
                    setDesign(response);
                    // Apply design to state for display
                    if (response.designData) {
                        state.color = response.designData.color || '#EFBD48';
                        state.isFullTexture = response.designData.isFullTexture || false;
                        state.fullDecal = response.designData.fullDecal || '';
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setError('Design not found');
                    setLoading(false);
                });
        }
    }, [shareId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4" />
                    <p className="text-gray-600">Loading design...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Link to="/" className="text-primary-600 hover:text-primary-700">
                        Go back home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/"
                        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to home</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Design Display */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border p-8 h-96">
                            <div className="text-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{design.name}</h3>
                                <p className="text-gray-500">By {design.user?.name}</p>
                            </div>
                            <div className="w-full h-80">
                                <CanvasModel />
                            </div>
                        </div>

                        {/* Design Details */}
                        <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Details</h3>
                            <p className="text-gray-700 mb-4">{design.description || 'No description provided'}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-1">Views</div>
                                    <div className="font-medium">{design.views || 0}</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-1">Likes</div>
                                    <div className="font-medium">{design.likes?.length || 0}</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-1">Downloads</div>
                                    <div className="font-medium">{design.downloads || 0}</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-1">Created</div>
                                    <div className="font-medium">{new Date(design.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Designer Info */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Designer</h3>
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full" />
                                <div>
                                    <p className="font-semibold text-gray-900">{design.user?.name}</p>
                                    <p className="text-sm text-gray-500">{design.user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                                <Heart className="w-4 h-4" />
                                <span>Like ({design.likes?.length || 0})</span>
                            </button>
                            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                <Download className="w-4 h-4" />
                                <span>Download</span>
                            </button>
                        </div>

                        {/* Tags */}
                        {design.tags && design.tags.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {design.tags.map((tag: string) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SharedDesign;

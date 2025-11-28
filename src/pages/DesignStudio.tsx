import React, { useState, useEffect, useRef } from 'react';
import { Save, Download, Share2, Shirt, Plus, Palette, Loader2, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDesign, Design } from '../context/DesignContext';
import { designAPI } from '../services/api';
import ColorPicker from '../components/ColorPicker';
import FabricPicker from '../components/FabricPicker';
import PatternPicker from '../components/PatternPicker';
import CanvasModel from '../canvas';
import state from '../store';

const clothingTypes = [
  { id: 'shirt', name: 'Shirt', icon: '👔' },
  { id: 'dress', name: 'Dress', icon: '👗' },
  { id: 'pants', name: 'Pants', icon: '👖' },
  { id: 'jacket', name: 'Jacket', icon: '🧥' },
  { id: 'skirt', name: 'Skirt', icon: '👘' },
] as const;

const DesignStudio: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: designState, createDesign, updateDesign, setCurrentDesign } = useDesign();

  const [currentDesign, setLocalCurrentDesign] = useState({
    name: 'Untitled Design',
    clothingType: 'shirt' as const,
    color: '#6A0DAD',
    fabric: 'Cotton',
    pattern: 'Solid',
    isPublic: true,
  });

  const [activeTab, setActiveTab] = useState<'type' | 'color' | 'fabric' | 'pattern'>('type');
  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (designState.currentDesign) {
      setLocalCurrentDesign({
        name: designState.currentDesign.name,
        clothingType: designState.currentDesign.clothingType,
        color: designState.currentDesign.color,
        fabric: designState.currentDesign.fabric,
        pattern: designState.currentDesign.pattern,
        isPublic: designState.currentDesign.isPublic,
      });
    }
  }, [designState.currentDesign]);

  const handleSave = async () => {
    if (!authState.user) {
      alert('Please log in to save designs');
      return;
    }

    setIsSaving(true);

    try {
      let thumbnail = '';
      // Capture canvas as thumbnail
      if (canvasRef.current) {
        const html2canvas = (await import('html2canvas')).default;
        try {
          const canvas = await html2canvas(canvasRef.current, {
            scale: 0.5,
            useCORS: true,
            allowTaint: true,
          });
          thumbnail = canvas.toDataURL('image/jpeg', 0.7); // Data URL as thumbnail
        } catch (e) {
          console.error('Failed to capture thumbnail:', e);
          thumbnail = ''; // Continue with empty thumbnail if capture fails
        }
      }

      const designData = {
        name: currentDesign.name,
        description: currentDesign.name,
        designData: {
          color: currentDesign.color,
          isFullTexture: state.isFullTexture,
          fullDecal: state.fullDecal,
          pattern: currentDesign.pattern,
          fabric: currentDesign.fabric,
        },
        isPublic: currentDesign.isPublic,
        tags: [currentDesign.clothingType, currentDesign.pattern, currentDesign.fabric],
        thumbnail,
      };

      const response = await designAPI.create(designData);
      alert('Design saved successfully!');
      setShareUrl(`${window.location.origin}/share/${response.shareId}`);
    } catch (error: any) {
      alert(`Save failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewDesign = () => {
    setCurrentDesign({
      name: 'Untitled Design',
      clothingType: 'shirt',
      color: '#6A0DAD',
      fabric: 'Cotton',
      pattern: 'Solid',
      isPublic: true,
    });
    setCurrentDesign(null);
    state.clothingType = 'shirt';
    state.color = '#6A0DAD';
    state.isFullTexture = false;
    state.fullDecal = '';
  };

  const handleExport = async () => {
    if (!canvasRef.current) return;

    try {
      // Use html2canvas to capture the canvas
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(canvasRef.current);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg');
      link.download = `${currentDesign.name || 'design'}.jpeg`;
      link.click();
    } catch (error) {
      alert('Export failed. Please try again.');
    }
  };

  const handleShare = () => {
    if (!shareUrl) {
      handleSave(); // Save first if not saved
      return;
    }
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const getClothingPreview = () => {
    return (
      <div className="w-full h-80">
        <CanvasModel />
      </div>
    );
  };

  // Helpers to generate pattern textures as data URLs
  const generatePatternTexture = (patternName: string, color: string) => {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // base color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';

    switch (patternName) {
      case 'Plain':
        // Plain: just solid color (no overlay pattern)
        break;
      case 'Stripes':
        for (let i = 0; i < size; i += 40) {
          ctx.fillRect(i, 0, 20, size);
        }
        break;
      case 'Polka Dots':
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        for (let x = 20; x < size; x += 40) {
          for (let y = 20; y < size; y += 40) {
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
      case 'Floral':
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        for (let i = 0; i < 1500; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case 'Checkered':
        for (let x = 0; x < size; x += 40) {
          for (let y = 0; y < size; y += 40) {
            if (((x + y) / 40) % 2 === 0) ctx.fillRect(x, y, 40, 40);
          }
        }
        break;
      case 'Geometric':
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        for (let i = 0; i < 2000; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          ctx.fillRect(x, y, 6, 6);
        }
        break;
      default:
        // Solid -> no pattern overlay
        break;
    }

    return canvas.toDataURL('image/png');
  };

  const handlePatternChange = (pattern: string) => {
    setLocalCurrentDesign((prev) => {
      const updated = { ...prev, pattern };
      if (pattern === 'Solid') {
        // For solid: disable any texture decal and use base color
        state.isFullTexture = false;
        state.fullDecal = '';
        state.color = updated.color; // ensure color is applied
      } else if (pattern === 'Plain') {
        // For plain: generate solid-color texture and apply as decal (workaround for color display)
        const colorToUse = state.color || prev.color;
        const url = generatePatternTexture('Plain', colorToUse);
        state.fullDecal = url;
        state.isFullTexture = true;
      } else {
        // For patterns: generate texture and apply as decal
        const colorToUse = state.color || prev.color;
        const url = generatePatternTexture(pattern, colorToUse);
        state.fullDecal = url;
        state.isFullTexture = true;
      }
      return updated;
    });
  };

  const handleFabricChangeAndApply = (fabric: string) => {
    setLocalCurrentDesign((prev) => {
      const updated = { ...prev, fabric };
      // simple mapping: use texture image for some fabrics, or generated pattern for others
      if (fabric === 'Denim' || fabric === 'Leather') {
        state.fullDecal = '/texture.jpeg';
        state.isFullTexture = true;
      } else if (fabric === 'Silk') {
        // silk: no heavy texture, slight sheen via color only
        state.isFullTexture = false;
        state.fullDecal = '';
      } else {
        // cotton/linen/wool: subtle woven pattern generated
        const colorToUse = state.color || prev.color;
        const url = generatePatternTexture('Geometric', colorToUse);
        state.fullDecal = url;
        state.isFullTexture = true;
      }
      return updated;
    });
  };

  const handleColorChangeAndApply = (color: string) => {
    // apply color and regenerate any active pattern using the up-to-date design pattern
    setLocalCurrentDesign((prev) => {
      const updated = { ...prev, color };
      state.color = color;
      const activePattern = updated.pattern;
      if (activePattern && activePattern !== 'Solid') {
        const url = generatePatternTexture(activePattern, color);
        state.fullDecal = url;
        state.isFullTexture = true;
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Palette className="w-8 h-8 text-primary-600" />
              <div>
                <input
                  type="text"
                  value={currentDesign.name}
                  onChange={(e) => setLocalCurrentDesign(prev => ({ ...prev, name: e.target.value }))}
                  className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none focus:bg-gray-50 rounded px-2 py-1"
                />
                <p className="text-gray-500">Design Studio</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleNewDesign}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New</span>
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </>
                )}
              </button>

              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Design Canvas */}
          <div className="lg:col-span-2">
            <div ref={canvasRef} className="bg-white rounded-xl shadow-sm border p-8 h-96">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Design Preview</h3>
                <p className="text-gray-500">Real-time visualization of your design</p>
              </div>
              {getClothingPreview()}
            </div>

            {/* Design Details */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Type</div>
                  <div className="font-medium capitalize">{currentDesign.clothingType}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Color</div>
                  <div className="flex items-center justify-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: currentDesign.color }}
                    />
                    <span className="font-medium">{currentDesign.color}</span>
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Fabric</div>
                  <div className="font-medium">{currentDesign.fabric}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Pattern</div>
                  <div className="font-medium">{currentDesign.pattern}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Design Controls */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'type', name: 'Type', icon: <Shirt className="w-4 h-4" /> },
                  { id: 'color', name: 'Color', icon: <div className="w-4 h-4 rounded-full bg-primary-500" /> },
                  { id: 'fabric', name: 'Fabric', icon: <div className="w-4 h-4 bg-gray-400 rounded" /> },
                  { id: 'pattern', name: 'Pattern', icon: <div className="w-4 h-4 bg-gradient-to-r from-primary-400 to-primary-600 rounded" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'type' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Clothing Type</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {clothingTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => {
                            const updated = { ...currentDesign, clothingType: type.id };
                            setLocalCurrentDesign(updated);
                            state.clothingType = type.id;
                          }}
                          className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all hover:scale-105 ${currentDesign.clothingType === type.id
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-primary-300'
                            }`}
                        >
                          <span className="text-2xl">{type.icon}</span>
                          <span className="font-medium">{type.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'color' && (
                  <ColorPicker
                    selectedColor={currentDesign.color}
                    onColorChange={(color) => handleColorChangeAndApply(color)}
                  />
                )}

                {activeTab === 'fabric' && (
                  <FabricPicker
                    selectedFabric={currentDesign.fabric}
                    onFabricChange={(fabric) => handleFabricChangeAndApply(fabric)}
                  />
                )}

                {activeTab === 'pattern' && (
                  <PatternPicker
                    selectedPattern={currentDesign.pattern}
                    onPatternChange={(pattern) => handlePatternChange(pattern)}
                  />
                )}
              </div>
            </div>

            {/* Publishing Options */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h3>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={currentDesign.isPublic}
                  onChange={(e) => setLocalCurrentDesign(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  Make this design public in the community gallery
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && shareUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Share Design</h2>
              <p className="text-gray-600 mb-4">Share this link with others to show your design:</p>

              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                  onClick={copyShareLink}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                  {shareCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {shareCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignStudio;
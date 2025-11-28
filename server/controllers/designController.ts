import { Request, Response } from 'express';
import Design from '../models/designModel';
import { IGetUserAuthInfoRequest } from '../middleware/auth';
import path from 'path';
import fs from 'fs';
import { randomBytes } from 'crypto';

// Generate a unique share ID
const generateShareId = () => {
  return randomBytes(8).toString('hex');
};

// @desc    Create a new design
// @route   POST /api/designs
// @access  Private
export const createDesign = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const { name, description, designData, isPublic, tags, thumbnail } = req.body;

    const design = await Design.create({
      user: req.user._id,
      name,
      description,
      designData: {
        color: designData.color || '#EFBD48',
        isLogoTexture: designData.isLogoTexture || false,
        isFullTexture: designData.isFullTexture || false,
        logoDecal: designData.logoDecal || '',
        fullDecal: designData.fullDecal || '',
      },
      thumbnail: thumbnail || '',
      isPublic: isPublic !== undefined ? isPublic : true,
      tags: tags || [],
      shareId: generateShareId(),
    });

    res.status(201).json(design);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error creating design' });
  }
};

// @desc    Get all public designs
// @route   GET /api/designs
// @access  Public
export const getPublicDesigns = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query: any = { isPublic: true };

    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search as string };
    }

    // Filter by tags
    if (req.query.tags) {
      const tags = (req.query.tags as string).split(',');
      query.tags = { $in: tags };
    }

    const designs = await Design.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email');

    const total = await Design.countDocuments(query);

    res.json({
      designs,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get user's designs
// @route   GET /api/designs/my-designs
// @access  Private
export const getUserDesigns = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const designs = await Design.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(designs);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get design by ID
// @route   GET /api/designs/:id
// @access  Public
export const getDesignById = async (req: Request, res: Response) => {
  try {
    const design = await Design.findById(req.params.id).populate('user', 'name email');

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Increment view count
    design.views = (design.views || 0) + 1;
    await design.save();

    res.json(design);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get design by share ID
// @route   GET /api/designs/share/:shareId
// @access  Public
export const getDesignByShareId = async (req: Request, res: Response) => {
  try {
    const design = await Design.findOne({ shareId: req.params.shareId }).populate('user', 'name email');

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Increment view count
    design.views = (design.views || 0) + 1;
    await design.save();

    res.json(design);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};// @desc    Update a design
// @route   PUT /api/designs/:id
// @access  Private
export const updateDesign = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const { name, description, designData, isPublic, tags } = req.body;
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Check if user is the owner or admin
    if (design.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this design' });
    }

    // Handle thumbnail update if new file is uploaded
    let thumbnail = design.thumbnail;
    if (req.file) {
      // Delete old thumbnail if it exists
      if (thumbnail) {
        const oldThumbnailPath = path.join(__dirname, '..', '..', 'public', thumbnail);
        if (fs.existsSync(oldThumbnailPath)) {
          fs.unlinkSync(oldThumbnailPath);
        }
      }
      thumbnail = `/uploads/${req.file.filename}`;
    }

    // Update design
    design.name = name || design.name;
    design.description = description !== undefined ? description : design.description;
    design.designData = {
      color: designData?.color || design.designData.color,
      isLogoTexture: designData?.isLogoTexture !== undefined
        ? designData.isLogoTexture
        : design.designData.isLogoTexture,
      isFullTexture: designData?.isFullTexture !== undefined
        ? designData.isFullTexture
        : design.designData.isFullTexture,
      logoDecal: designData?.logoDecal !== undefined
        ? designData.logoDecal
        : design.designData.logoDecal,
      fullDecal: designData?.fullDecal !== undefined
        ? designData.fullDecal
        : design.designData.fullDecal,
    };
    design.thumbnail = thumbnail;
    design.isPublic = isPublic !== undefined ? isPublic : design.isPublic;
    design.tags = tags || design.tags;

    const updatedDesign = await design.save();
    res.json(updatedDesign);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete a design
// @route   DELETE /api/designs/:id
// @access  Private
export const deleteDesign = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Check if user is the owner or admin
    if (design.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this design' });
    }

    // Delete thumbnail if it exists
    if (design.thumbnail) {
      const thumbnailPath = path.join(__dirname, '..', '..', 'public', design.thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    await design.deleteOne();
    res.json({ message: 'Design removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Like a design
// @route   POST /api/designs/:id/like
// @access  Private
export const likeDesign = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Ensure we compare ObjectId values reliably
    const userId = req.user._id.toString();
    const alreadyLiked = design.likes.some((id: any) => id.toString() === userId);

    if (alreadyLiked) {
      return res.status(400).json({ message: 'Design already liked' });
    }

    design.likes.push(req.user._id);
    await design.save();

    // Return updated likes info
    res.json({ message: 'Design liked', likes: design.likes.length, likes: design.likes });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Unlike a design
// @route   DELETE /api/designs/:id/like
// @access  Private
export const unlikeDesign = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Ensure we compare ObjectId values reliably
    const userId = req.user._id.toString();
    const liked = design.likes.some((id: any) => id.toString() === userId);

    if (!liked) {
      return res.status(400).json({ message: 'Design has not been liked yet' });
    }

    design.likes = design.likes.filter((id: any) => id.toString() !== userId);
    await design.save();

    // Return updated likes info
    res.json({ message: 'Design unliked', likes: design.likes.length, likes: design.likes });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Download a design
// @route   POST /api/designs/:id/download
// @access  Private
export const downloadDesign = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Increment download count
    design.downloads = (design.downloads || 0) + 1;
    await design.save();

    // Return design data for frontend to use for export
    res.json({
      message: 'Design ready for download',
      design: {
        id: design._id,
        name: design.name,
        designData: design.designData,
        downloads: design.downloads,
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
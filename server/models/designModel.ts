import mongoose, { Document } from 'mongoose';

export interface IDesign extends Document {
  user: mongoose.Schema.Types.ObjectId;
  name: string;
  description?: string;
  designData: {
    color: string;
    isLogoTexture: boolean;
    isFullTexture: boolean;
    logoDecal?: string;
    fullDecal?: string;
  };
  thumbnail: string;
  isPublic: boolean;
  likes: mongoose.Schema.Types.ObjectId[];
  downloads: number;
  views?: number;
  tags: string[];
  shareId?: string;
}

const designSchema = new mongoose.Schema<IDesign>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a name for your design'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    designData: {
      color: {
        type: String,
        default: '#EFBD48',
      },
      isLogoTexture: {
        type: Boolean,
        default: false,
      },
      isFullTexture: {
        type: Boolean,
        default: false,
      },
      logoDecal: {
        type: String,
        default: '',
      },
      fullDecal: {
        type: String,
        default: '',
      },
    },
    thumbnail: {
      type: String,
      default: '',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    shareId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
designSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text'
});

const Design = mongoose.model<IDesign>('Design', designSchema);

export default Design;

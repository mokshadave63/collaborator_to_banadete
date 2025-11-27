import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Define custom file type
interface FileWithMimetype extends Express.Multer.File {
  mimetype: string;
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for images only
const fileFilter = (
  _req: Request,
  file: FileWithMimetype,
  cb: FileFilterCallback
) => {
  const filetypes = /\.(jpg|jpeg|png|webp)$/i;
  const mimetypes = /^image\/(jpe?g|png|webp)$/i;

  const isExtValid = filetypes.test(file.originalname);
  const isMimeValid = mimetypes.test(file.mimetype);

  if (isExtValid && isMimeValid) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'));
  }
};

// Initialize multer with configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Middleware for single file upload
export const uploadSingle = (fieldName: string) => upload.single(fieldName);

// Middleware for multiple files upload
export const uploadMultiple = (fieldName: string, maxCount: number = 5) =>
  upload.array(fieldName, maxCount);

// Error handling middleware for file uploads
export const handleUploadError = (err: any, _req: Request, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  } else if (err) {
    // An unknown error occurred
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed',
    });
  }
  next();
};

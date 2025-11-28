import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { protect } from './middleware/auth';
import { registerUser, authUser, getUserProfile, updateUserProfile } from './controllers/authController';
import {
    createDesign,
    getPublicDesigns,
    getUserDesigns,
    getDesignById,
    getDesignByShareId,
    updateDesign,
    deleteDesign,
    likeDesign,
    unlikeDesign,
    downloadDesign,
} from './controllers/designController'; dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files
app.use(express.static('public'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Auth Routes
app.post('/api/auth/signup', registerUser);
app.post('/api/auth/login', authUser);
app.get('/api/auth/profile', protect, getUserProfile);
app.put('/api/auth/profile', protect, updateUserProfile);

// Design Routes
app.post('/api/designs', protect, createDesign);
app.get('/api/designs', getPublicDesigns);
app.get('/api/designs/share/:shareId', getDesignByShareId);
app.get('/api/designs/my-designs', protect, getUserDesigns);
app.get('/api/designs/:id', getDesignById);
app.put('/api/designs/:id', protect, updateDesign);
app.delete('/api/designs/:id', protect, deleteDesign);
app.post('/api/designs/:id/like', protect, likeDesign);
app.delete('/api/designs/:id/like', protect, unlikeDesign);
app.post('/api/designs/:id/download', protect, downloadDesign);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

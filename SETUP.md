# StyleCraft Setup Guide

## Prerequisites
- Node.js 16+ 
- MongoDB Atlas account (for cloud database)
- npm or yarn

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure MongoDB Atlas

1. **Create a MongoDB Atlas cluster:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up or log in
   - Create a new project and cluster
   - Choose a cloud provider and region
   - Wait for the cluster to initialize

2. **Get your connection string:**
   - In Atlas, go to "Connect" > "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)

3. **Update `.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stylecraft?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRE=30d
   PORT=5000
   NODE_ENV=development
   ```

### 3. Start the Application

#### Development Mode (Frontend + Backend)

**Terminal 1 - Start Backend:**
```bash
npm run server
```
This starts the Node.js backend on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```
This starts the Vite dev server on `http://localhost:5173`

#### Production Build
```bash
npm run build
npm run preview
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires JWT)
- `PUT /api/auth/profile` - Update user profile (requires JWT)

### Designs
- `POST /api/designs` - Create new design (requires JWT)
- `GET /api/designs` - Get all public designs
- `GET /api/designs/my-designs` - Get user's designs (requires JWT)
- `GET /api/designs/:id` - Get design by ID
- `GET /api/designs/share/:shareId` - Get shared design (public)
- `PUT /api/designs/:id` - Update design (requires JWT)
- `DELETE /api/designs/:id` - Delete design (requires JWT)
- `POST /api/designs/:id/like` - Like design (requires JWT)
- `DELETE /api/designs/:id/like` - Unlike design (requires JWT)

## Features

### Design Studio
- **New Button**: Creates a blank canvas and resets all design state
- **Save Button**: Saves design to MongoDB, generates share link, and displays in Library/Community
- **Export Button**: Exports the 3D garment design as a JPEG image
- **Share Button**: Generates a shareable URL that can be sent to others

### Authentication
- Users must sign up and log in to access the design studio
- JWT tokens are stored in localStorage and sent with each authenticated request
- Passwords are hashed using bcryptjs

### Color & Pattern System
- Select colors from a predefined palette or use custom color picker
- Apply patterns: Solid, Plain, Stripes, Polka Dots, Floral, Checkered, Geometric
- Patterns are generated as textures and applied to the 3D model
- All changes are reflected in real-time in the 3D viewer

## Database Schema

### Users Collection
```json
{
  "_id": ObjectId,
  "name": String,
  "email": String (unique),
  "password": String (hashed),
  "avatar": String,
  "role": String ("user" | "admin"),
  "createdAt": Date,
  "updatedAt": Date
}
```

### Designs Collection
```json
{
  "_id": ObjectId,
  "user": ObjectId (ref: User),
  "name": String,
  "description": String,
  "designData": {
    "color": String,
    "isLogoTexture": Boolean,
    "isFullTexture": Boolean,
    "logoDecal": String,
    "fullDecal": String
  },
  "thumbnail": String,
  "isPublic": Boolean,
  "likes": [ObjectId],
  "downloads": Number,
  "views": Number,
  "tags": [String],
  "shareId": String (unique),
  "createdAt": Date,
  "updatedAt": Date
}
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key` |
| `JWT_EXPIRE` | JWT expiration time | `30d` |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` / `production` |

## Troubleshooting

### MongoDB Connection Fails
- Check MONGODB_URI in .env
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify database name matches in connection string

### Authentication Fails
- Clear localStorage: `localStorage.clear()`
- Check JWT_SECRET in .env
- Verify user credentials are correct

### Export Not Working
- Ensure html2canvas is installed: `npm install html2canvas`
- Browser must have canvas API support

### Share Link Not Working
- Design must be saved first
- Check that shareId is generated in MongoDB
- Verify `/share/:shareId` route exists in React Router

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy the dist folder to Vercel
```

### Backend (Heroku/Railway)
```bash
npm run server:prod
# Set environment variables in deployment platform
```

## Support

For issues or questions, please check the documentation or create an issue in the repository.

# Next Steps for Deployment

## Prerequisites

Before deploying, you need to:

1. **Install FFmpeg** (Required for video processing)
   ```powershell
   # Windows - Using Chocolatey
   choco install ffmpeg
   
   # Or using winget
   winget install ffmpeg
   ```

2. **Test Locally**
   - Both servers are running:
     - Backend: http://localhost:5000
     - Frontend: http://localhost:5173
   - Test the complete workflow:
     - Register a user
     - Upload a video (requires FFmpeg)
     - Watch real-time processing
     - Stream the video

## Deployment Steps

### 1. MongoDB Atlas (Free Tier - 512MB)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster (M0 Free tier)
4. Create database user
5. Network Access → Add IP: `0.0.0.0/0` (allow all)
6. Get connection string
7. Save for backend deployment

### 2. Backend Deployment - Render (Free Tier - 750 hours/month)

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Video Streaming App"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. Go to [Render](https://render.com)
3. Create new Web Service
4. Connect GitHub repository
5. Configure:
   - **Name**: video-streaming-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-strong-random-string>
   MAX_FILE_SIZE=524288000
   CORS_ORIGIN=<your-vercel-frontend-url>
   UPLOAD_PATH=./uploads
   ```
7. Deploy
8. Copy the deployed URL (e.g., `https://video-streaming-backend.onrender.com`)

### 3. Frontend Deployment - Vercel (Free Unlimited)

1. Go to [Vercel](https://vercel.com)
2. Import GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=<your-render-backend-url>
   ```
5. Deploy
6. Copy the deployed URL
7. Update backend `CORS_ORIGIN` on Render with this URL

### 4. Update Frontend API Configuration

In `frontend/src/api.js`, update the API URL to use environment variable:
```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api';
```

### 5. Update Socket.io Connection

In `frontend/src/pages/Dashboard.jsx`, update Socket.io connection:
```javascript
const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
```

In `frontend/src/components/VideoPlayer.jsx`, update video stream URL:
```javascript
src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${video.id}/stream`}
```

## Testing Deployment

1. Visit your Vercel URL
2. Register a new user
3. Upload a video
4. Watch real-time processing
5. Stream the video

## Important Notes

### Free Tier Limitations

**Render:**
- Spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free (enough for demos)

**Vercel:**
- Unlimited deployments
- No spin-down
- Perfect for frontend

**MongoDB Atlas:**
- 512MB storage (sufficient for metadata)
- Video files stored on Render's disk (limited)

### Production Recommendations

For production use, consider:
1. **Video Storage**: Migrate to Cloudinary (10GB free) or AWS S3
2. **Backend**: Upgrade to paid Render plan or use AWS/Google Cloud
3. **Database**: Upgrade MongoDB Atlas for more storage
4. **CDN**: Use Cloudinary or AWS CloudFront for video delivery

## Demo Video Creation

Create a screen recording showing:
1. User registration
2. Login
3. Video upload with progress
4. Real-time processing updates
5. Video list with filtering
6. Video playback
7. Role-based access (create multiple users)
8. Admin panel (if admin user)

Tools for recording:
- OBS Studio (Free)
- Loom (Free tier)
- Windows Game Bar (Win + G)

## GitHub Repository Preparation

1. Create `.gitignore` (already created)
2. Write comprehensive README (already created)
3. Add LICENSE file (MIT recommended)
4. Create repository on GitHub
5. Push code
6. Add repository description and topics
7. Enable GitHub Pages for documentation (optional)

## Submission Checklist

- [ ] Application deployed and accessible
- [ ] MongoDB Atlas configured
- [ ] Backend running on Render
- [ ] Frontend running on Vercel
- [ ] Demo video recorded
- [ ] GitHub repository public
- [ ] README.md complete
- [ ] All features working
- [ ] Documentation complete

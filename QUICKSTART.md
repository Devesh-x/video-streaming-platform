# Video Streaming Application - Quick Start Guide

## Prerequisites Check

Before running the application, ensure you have:

1. **Node.js** (v16+) - Check with: `node --version`
2. **MongoDB** - Check with: `mongod --version`
3. **FFmpeg** (Optional for full functionality) - Check with: `ffmpeg -version`

## FFmpeg Installation (Required for video processing)

### Windows
```powershell
# Using Chocolatey (recommended)
choco install ffmpeg

# Or using winget
winget install ffmpeg

# Manual: Download from https://ffmpeg.org/download.html
# Extract and add to PATH
```

### macOS
```bash
brew install ffmpeg
```

### Linux
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

## Quick Start

### 1. Start MongoDB

**Windows:**
```powershell
# Start MongoDB service
net start MongoDB

# Or run manually
mongod
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
# Or
mongod
```

### 2. Start Backend

```powershell
cd backend
npm install  # First time only
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Start Frontend

Open a new terminal:

```powershell
cd frontend
npm install  # First time only
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 4. Access Application

Open your browser and go to: `http://localhost:5173`

## First Time Setup

1. **Register an account**
   - Click "Sign up"
   - Enter username, email, password
   - Select role (Editor recommended for testing)

2. **Upload a test video**
   - Drag and drop a video file
   - Or click to browse
   - Watch real-time processing

3. **View and stream**
   - Browse your videos
   - Filter by status
   - Click "Play" to stream

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service

### FFmpeg Not Found
```
Error: Cannot find ffmpeg
```
**Solution:** Install FFmpeg (see above) or video processing will fail

### Port Already in Use
```
Error: EADDRINUSE :::5000
```
**Solution:** Kill the process using the port or change PORT in `.env`

### CORS Errors
**Solution:** Ensure backend is running on port 5000 and frontend on 5173

## Environment Variables

Backend `.env` file (already created):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/video_streaming
JWT_SECRET=video_streaming_super_secret_key_2024_change_in_production
MAX_FILE_SIZE=524288000
CORS_ORIGIN=http://localhost:5173
UPLOAD_PATH=./uploads
```

## Testing Checklist

- [ ] MongoDB is running
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can register a new user
- [ ] Can login
- [ ] Can upload a video (if FFmpeg installed)
- [ ] Can see real-time progress
- [ ] Can view video list
- [ ] Can stream/play video
- [ ] Can filter videos
- [ ] Can delete video

## Production Deployment

See `README.md` for detailed deployment instructions for:
- Render (Backend)
- Vercel (Frontend)
- MongoDB Atlas (Database)

# Video Upload, Sensitivity Processing & Streaming Application

A comprehensive full-stack application for uploading videos, processing them for content sensitivity analysis, and streaming with real-time progress tracking.

## Features

- **User Authentication**: Secure JWT-based authentication with role-based access control
- **Video Upload**: Drag-and-drop interface with progress tracking
- **Real-Time Processing**: Live updates via Socket.io during video processing
- **Sensitivity Analysis**: Automated content screening (simulated for demo)
- **Video Streaming**: HTTP range request support for efficient playback
- **Multi-Tenant**: User-based isolation - each user sees only their videos
- **Role-Based Access**: Viewer (read-only), Editor (upload/manage), Admin (full access)
- **Filtering & Search**: Filter by sensitivity status, search by title

## Technology Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- Socket.io for real-time updates
- JWT authentication
- Multer for file uploads
- FFmpeg for video processing

### Frontend
- React 18
- Vite
- React Router
- Axios
- Socket.io client
- Modern CSS with design system

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- FFmpeg installed on your system

### Installing FFmpeg

**Windows:**
```bash
# Using Chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Video_strm
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/video_streaming
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
MAX_FILE_SIZE=524288000
CORS_ORIGIN=http://localhost:5173
UPLOAD_PATH=./uploads
```

For MongoDB Atlas, replace `MONGODB_URI` with your connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/video_streaming
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the Application

### Start MongoDB (if running locally)

```bash
mongod
```

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## Usage

### 1. Register an Account
- Navigate to `http://localhost:5173`
- Click "Sign up" and create an account
- Choose your role:
  - **Viewer**: Can only view videos
  - **Editor**: Can upload, view, and delete videos
  - **Admin**: Full system access including user management

### 2. Upload a Video
- Click the upload area or drag and drop a video file
- Enter a title (optional)
- Click "Upload Video"
- Watch real-time processing progress

### 3. View Videos
- Browse your uploaded videos in the dashboard
- Filter by sensitivity status (All/Safe/Flagged/Pending)
- Search by title or filename
- Click "Play" to stream the video

### 4. Video Processing
Videos go through these stages:
1. Upload validation
2. Metadata extraction
3. Sensitivity analysis
4. Completion

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "editor"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Video Endpoints

#### Upload Video
```http
POST /api/videos/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

video: <file>
title: "My Video"
```

#### Get All Videos
```http
GET /api/videos?sensitivity=safe&search=keyword
Authorization: Bearer <token>
```

#### Get Video Details
```http
GET /api/videos/:id
Authorization: Bearer <token>
```

#### Stream Video
```http
GET /api/videos/:id/stream
Authorization: Bearer <token>
Range: bytes=0-1024
```

#### Delete Video
```http
DELETE /api/videos/:id
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin-token>
```

#### Get System Statistics
```http
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

#### Update User Role
```http
PATCH /api/admin/users/:id/role
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "role": "admin"
}
```

## Deployment

### Backend Deployment (Render)

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. Add environment variables from `.env`
6. Deploy

### Frontend Deployment (Vercel)

1. Create account on [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your backend URL
5. Deploy

### Database (MongoDB Atlas)

1. Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (512MB)
3. Create database user
4. Whitelist IP addresses (or use 0.0.0.0/0 for all)
5. Get connection string
6. Update `MONGODB_URI` in backend environment variables

## Project Structure

```
Video_strm/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Video.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── video.routes.js
│   │   └── admin.routes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── utils/
│   │   └── videoProcessor.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VideoUpload.jsx
│   │   │   ├── VideoList.jsx
│   │   │   └── VideoPlayer.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Architecture Overview

### Multi-Tenant Architecture
- Each user has isolated access to their own videos
- User ID is used to filter all video queries
- Admins can access all videos across the platform

### Role-Based Access Control (RBAC)
- **Viewer**: Read-only access to assigned videos
- **Editor**: Can upload, view, edit, and delete own videos
- **Admin**: Full system access including user management

### Video Processing Pipeline
1. **Upload**: File validation and storage
2. **Metadata Extraction**: FFmpeg extracts duration, resolution
3. **Sensitivity Analysis**: Simulated content screening
4. **Real-Time Updates**: Socket.io broadcasts progress
5. **Streaming**: HTTP range requests for efficient playback

### Sensitivity Analysis
The current implementation uses a simulated analysis for demonstration. In production, integrate with:
- Google Cloud Video Intelligence API
- AWS Rekognition
- Azure Video Indexer
- Custom ML models

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running locally or check Atlas connection string

### FFmpeg Not Found
```
Error: Cannot find ffmpeg
```
**Solution**: Install FFmpeg and ensure it's in your system PATH

### CORS Errors
**Solution**: Ensure `CORS_ORIGIN` in backend `.env` matches your frontend URL

### Socket.io Connection Failed
**Solution**: Check that both frontend and backend are running and ports are correct

## Future Enhancements

- Video compression and quality optimization
- Thumbnail generation
- CDN integration for faster streaming
- Advanced filtering (date, size, duration)
- User-defined categories
- Batch upload support
- Video transcoding for multiple formats
- Real AI-based content moderation

## License

MIT

## Author

Created for internship assignment - Video Upload, Sensitivity Processing & Streaming Application

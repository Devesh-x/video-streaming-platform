# Video Streaming Platform

A full-stack video upload, processing, and streaming application with role-based access control and real-time updates.

## Features

- 🔐 JWT Authentication with role-based access (Viewer, Editor, Admin)
- 📤 Video upload with drag-and-drop interface
- ⚡ Real-time processing updates via Socket.io
- 🎬 Video streaming with HTTP range requests
- 🔍 Sensitivity analysis (simulated)
- 👑 Admin panel with user management and statistics
- 🔎 Search and filter videos
- 📱 Responsive design

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Socket.io, JWT, Multer, FFmpeg  
**Frontend:** React 18, Vite, React Router, Axios, Socket.io Client

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- FFmpeg (optional, app works without it)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Devesh-x/video-streaming-platform.git
cd video-streaming-platform
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/video_streaming
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
MAX_FILE_SIZE=524288000
CORS_ORIGIN=http://localhost:5173
UPLOAD_PATH=./uploads
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/video_streaming
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

### Run Locally

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Runs on: http://localhost:5173

## Usage

1. **Register** - Create account with role (Viewer/Editor/Admin)
2. **Upload** - Drag & drop videos (Editor/Admin only)
3. **Watch** - Stream videos with real-time processing updates
4. **Admin Panel** - Manage users and view all videos (Admin only)

## Deployment

### MongoDB Atlas (Database)
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in backend environment

### Render (Backend)
1. Create Web Service at [Render](https://render.com)
2. Connect GitHub repo
3. Settings:
   - Root: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. Add environment variables from `.env`

### Vercel (Frontend)
1. Import repo at [Vercel](https://vercel.com)
2. Settings:
   - Framework: Vite
   - Root: `frontend`
   - Build: `npm run build`
   - Output: `dist`
3. Add env: `VITE_API_URL=<your-render-backend-url>`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Videos
- `POST /api/videos/upload` - Upload video
- `GET /api/videos` - List videos (with filters)
- `GET /api/videos/:id/stream` - Stream video
- `DELETE /api/videos/:id` - Delete video

### Admin
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/videos` - All videos
- `PATCH /api/admin/users/:id/role` - Update user role

## Project Structure

```
video-streaming-platform/
├── backend/
│   ├── models/          # User & Video schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & upload
│   ├── utils/           # Video processor
│   └── server.js        # Express + Socket.io
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Login & Dashboard
│   │   ├── context/     # Auth context
│   │   └── api.js       # Axios config
│   └── vite.config.js
└── README.md
```

## Security

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control
- ✅ Input validation
- ✅ File upload limits
- ✅ CORS configuration

## License

MIT

## Author

Created for internship assignment - Full-Stack Video Streaming Platform

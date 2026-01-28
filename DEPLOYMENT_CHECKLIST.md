# Deployment Checklist

## Pre-Deployment

### Code Quality
- [x] All features implemented and tested
- [x] Error handling in place
- [x] Input validation on all endpoints
- [x] Authentication and authorization working
- [x] Real-time updates functioning
- [x] Video streaming with range requests

### Security
- [x] JWT secret is strong (min 32 characters)
- [x] Passwords hashed with bcrypt
- [x] CORS configured properly
- [x] Input validation with express-validator
- [x] File upload size limits set
- [x] SQL injection prevention (using Mongoose)
- [ ] Rate limiting (optional for production)
- [ ] Helmet.js for security headers (optional)

### Environment Variables
- [x] `.env.example` file created
- [x] `.env` in `.gitignore`
- [x] All sensitive data in environment variables
- [x] Production environment variables documented

### Database
- [x] MongoDB connection string ready
- [x] Database indexes optimized
- [x] Connection error handling
- [x] Graceful shutdown implemented

### Files & Dependencies
- [x] `.gitignore` properly configured
- [x] `package.json` has correct scripts
- [x] Node version specified in `package.json`
- [x] All dependencies in `package.json`
- [x] No unnecessary dependencies

## Deployment Steps

### 1. MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create free M0 cluster
- [ ] Create database user
- [ ] Whitelist IP: 0.0.0.0/0
- [ ] Get connection string
- [ ] Test connection locally

### 2. Backend Deployment (Render)
- [ ] Push code to GitHub
- [ ] Create Render account
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set root directory: `backend`
- [ ] Set build command: `npm install`
- [ ] Set start command: `npm start`
- [ ] Add environment variables:
  - [ ] PORT=5000
  - [ ] NODE_ENV=production
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] MAX_FILE_SIZE
  - [ ] CORS_ORIGIN (will update after frontend)
  - [ ] UPLOAD_PATH=./uploads
- [ ] Deploy and test
- [ ] Copy deployed URL

### 3. Frontend Deployment (Vercel)
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set framework: Vite
- [ ] Set root directory: `frontend`
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`
- [ ] Add environment variable:
  - [ ] VITE_API_URL=<backend-url>
- [ ] Deploy
- [ ] Copy deployed URL

### 4. Update Backend CORS
- [ ] Go to Render dashboard
- [ ] Update CORS_ORIGIN with Vercel URL
- [ ] Redeploy backend

### 5. Testing
- [ ] Test user registration
- [ ] Test user login
- [ ] Test video upload
- [ ] Test video processing
- [ ] Test video streaming
- [ ] Test admin panel
- [ ] Test role management
- [ ] Test on mobile device
- [ ] Test on different browsers

## Post-Deployment

### Monitoring
- [ ] Check Render logs for errors
- [ ] Monitor MongoDB Atlas metrics
- [ ] Test all features in production
- [ ] Check Socket.io connections

### Documentation
- [ ] Update README with live URLs
- [ ] Document any deployment issues
- [ ] Create demo video
- [ ] Prepare presentation

### Optional Enhancements
- [ ] Set up custom domain
- [ ] Configure CDN for video delivery
- [ ] Add monitoring (e.g., Sentry)
- [ ] Set up automated backups
- [ ] Configure email notifications

## Troubleshooting

### Backend won't start on Render
- Check build logs
- Verify all environment variables are set
- Ensure MongoDB connection string is correct
- Check Node version compatibility

### Frontend build fails on Vercel
- Check build logs
- Verify all dependencies are in package.json
- Ensure VITE_API_URL is set
- Check for TypeScript errors

### Videos won't upload in production
- Check file size limits on hosting platform
- Verify CORS settings
- Check upload directory permissions
- Monitor Render logs during upload

### Socket.io not connecting
- Ensure WebSocket support on hosting platform
- Check CORS configuration
- Verify frontend is using correct backend URL

## Production URLs

After deployment, update these:

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.onrender.com
- **Database**: MongoDB Atlas cluster

## Notes

- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Vercel has unlimited deployments on free tier
- MongoDB Atlas free tier: 512MB storage
- Consider upgrading for production use

## Deployment Complete! 🎉

Your video streaming application is now live and ready for demo!

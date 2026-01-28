# Deploy Frontend to Vercel

## Prerequisites

✅ Backend deployed on Render  
✅ Backend URL copied (e.g., `https://video-streaming-backend.onrender.com`)

---

## Step 1: Sign Up for Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

---

## Step 2: Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find your repository: `video-streaming-platform`
3. Click **"Import"**

---

## Step 3: Configure Project Settings

### Framework Preset
- Vercel should auto-detect: **Vite**
- If not, select **"Vite"** from dropdown

### Root Directory
- Click **"Edit"** next to Root Directory
- Enter: `frontend`
- Click **"Continue"**

### Build Settings
These should be auto-filled, but verify:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

---

## Step 4: Add Environment Variable

Click **"Environment Variables"** section

Add this variable:

**Key:** `VITE_API_URL`  
**Value:** `https://your-backend-url.onrender.com`

**Example:**
```
VITE_API_URL=https://video-streaming-backend.onrender.com
```

⚠️ **Important:** 
- Use YOUR actual Render backend URL
- Do NOT include `/api` at the end
- Do NOT add trailing slash

---

## Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll see: **"Congratulations! 🎉"**

---

## Step 6: Get Your Frontend URL

1. You'll see your deployed URL: `https://your-app.vercel.app`
2. **Copy this URL**
3. Click **"Visit"** to test your app

---

## Step 7: Update Backend CORS

Now go back to Render and update CORS:

1. Go to https://dashboard.render.com
2. Click your backend service
3. Click **"Environment"** (left sidebar)
4. Find `CORS_ORIGIN`
5. Click **"Edit"**
6. Change from `*` to: `https://your-app.vercel.app`
7. Click **"Save Changes"**
8. Wait for backend to redeploy (~2 minutes)

---

## Step 8: Test Your App

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. You should see the login page
3. Click **"Sign up"**
4. Create an account (choose Editor or Admin role)
5. Upload a test video
6. Verify it processes and plays

---

## Troubleshooting

### Build Failed
**Error:** `Command "npm run build" exited with 1`

**Solution:**
- Check build logs
- Verify `package.json` has all dependencies
- Make sure `vite.config.js` is correct

### Blank Page After Deploy
**Error:** White screen, nothing loads

**Solution:**
- Check browser console (F12)
- Verify `VITE_API_URL` is set correctly
- Make sure backend URL doesn't have trailing slash

### Can't Login / API Errors
**Error:** Network errors, CORS errors

**Solution:**
- Verify backend CORS_ORIGIN matches Vercel URL exactly
- Check backend is running on Render
- Test backend URL directly: `https://your-backend.onrender.com/api/auth/me`

### Socket.io Not Connecting
**Error:** Real-time updates not working

**Solution:**
- Update `frontend/src/pages/Dashboard.jsx`
- Change Socket.io URL from `http://localhost:5000` to your Render URL
- Redeploy frontend

---

## Fix Socket.io for Production

Before deploying, update the Socket.io connection:

**File:** `frontend/src/pages/Dashboard.jsx`

**Change line 14 from:**
```javascript
const newSocket = io('http://localhost:5000');
```

**To:**
```javascript
const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
```

Then commit and push:
```bash
git add frontend/src/pages/Dashboard.jsx
git commit -m "fix: Use environment variable for Socket.io connection"
git push origin main
```

Vercel will auto-redeploy!

---

## ✅ Deployment Complete!

Your app is now live:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.onrender.com
- **Database:** MongoDB Atlas

**Test everything:**
- ✅ User registration
- ✅ Login
- ✅ Video upload
- ✅ Video playback
- ✅ Admin panel (if admin)
- ✅ Real-time updates

---

## Important Notes

### Vercel Free Tier
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Auto-deploy on git push
- ✅ 100GB bandwidth/month

### First Load After Inactivity
- Backend (Render) spins down after 15 min
- First request takes ~30 seconds
- This is normal for free tier

### Future Updates
- Just push to GitHub
- Vercel auto-deploys frontend
- Render auto-deploys backend

---

**Need help?** Check the troubleshooting section above!

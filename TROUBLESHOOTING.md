# Video Playback Troubleshooting

## Issue: Video Won't Play

If you're experiencing issues with video playback, here are the solutions:

### Solution 1: Check Video Processing Status

Videos must be **fully processed** before they can be played. Look for:
- ✅ Green "completed" badge
- ✅ Green "safe" or red "flagged" sensitivity badge

If the video shows "processing", wait for it to complete.

### Solution 2: Browser Compatibility

The video player uses HTML5 video. Ensure:
- Modern browser (Chrome, Firefox, Edge, Safari)
- JavaScript enabled
- No ad blockers interfering with requests

### Solution 3: File Format

Supported video formats:
- ✅ MP4 (H.264)
- ✅ WebM
- ✅ OGG
- ⚠️ AVI (may need conversion)
- ⚠️ MKV (may need conversion)

### Solution 4: Check Browser Console

1. Press `F12` to open Developer Tools
2. Go to "Console" tab
3. Look for errors related to video loading
4. Common errors:
   - **401 Unauthorized**: Token expired, try logging out and back in
   - **404 Not Found**: Video file missing
   - **CORS Error**: Backend/frontend URL mismatch

### Solution 5: Authentication Token

The video streaming requires authentication. If videos won't play:

1. **Logout and Login Again**
   - Click "Logout"
   - Login with your credentials
   - Try playing the video again

2. **Check Token**
   - Open Developer Tools (F12)
   - Go to "Application" tab
   - Check "Local Storage"
   - Look for "token" - it should exist

### Solution 6: Network Issues

Check the Network tab in Developer Tools:
1. Press `F12`
2. Go to "Network" tab
3. Click "Play" on a video
4. Look for the stream request
5. Check the status code:
   - **200 or 206**: Success (video should play)
   - **401**: Authentication issue
   - **404**: Video file not found
   - **500**: Server error

### Solution 7: Restart Servers

Sometimes a simple restart helps:

```powershell
# Stop both servers (Ctrl+C in each terminal)

# Restart Backend
cd backend
npm run dev

# Restart Frontend (new terminal)
cd frontend
npm run dev
```

### Solution 8: Check Video File Exists

The video file should be in `backend/uploads/` directory. If it's missing:
- The upload may have failed
- Try uploading the video again

### Solution 9: Clear Browser Cache

1. Press `Ctrl+Shift+Delete`
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh the page

### Solution 10: Test with Different Video

Try uploading a small test video (< 10MB) in MP4 format to rule out file-specific issues.

## Still Not Working?

If none of the above solutions work:

1. **Check Backend Logs**
   - Look at the terminal running the backend
   - Check for error messages when clicking "Play"

2. **Check Frontend Logs**
   - Open browser console (F12)
   - Look for JavaScript errors

3. **Verify Vite Proxy**
   - Ensure `vite.config.js` has correct proxy settings
   - Backend should be on `http://localhost:5000`
   - Frontend should be on `http://localhost:5173`

## Quick Test

To verify everything is working:

1. Upload a small MP4 video
2. Wait for processing to complete (green badges)
3. Click "Play"
4. Video should start playing immediately

If it works with a small MP4 but not with other formats, the issue is likely the video codec/format.

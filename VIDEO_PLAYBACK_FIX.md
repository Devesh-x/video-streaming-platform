# Video Playback Issue - Quick Fix

## Problem: Editor Can't Play Video

If you're logged in as an **Editor** and can't play videos, here are the most common causes and solutions:

### Solution 1: Wait for Processing to Complete ⏳

**Check the video status badges:**
- ✅ **Green "completed"** badge = Ready to play
- 🔵 **Blue "processing"** badge = Still processing, wait a moment
- ⚠️ **Yellow "uploading"** badge = Upload in progress
- ❌ **Red "failed"** badge = Processing failed

**The Play button only appears when:**
- Processing status = "completed" (green badge)
- Sensitivity status = "safe" or "flagged" (not "pending")

### Solution 2: Refresh the Page 🔄

Sometimes the real-time updates don't trigger properly:

1. Press `F5` or `Ctrl+R` to refresh
2. Check if the badges updated to show "completed"
3. The Play button should now appear

### Solution 3: Check Browser Console 🔍

1. Press `F12` to open Developer Tools
2. Go to "Console" tab
3. Click the Play button
4. Look for error messages

**Common errors:**
- **401 Unauthorized**: Your session expired
  - **Fix**: Logout and login again
- **404 Not Found**: Video file missing
  - **Fix**: Re-upload the video
- **403 Forbidden**: Permission issue
  - **Fix**: Check your role (should be Editor or Admin)

### Solution 4: Logout and Login Again 🔐

Your authentication token might have expired:

1. Click "Logout" button
2. Login again with your credentials
3. Try playing the video

### Solution 5: Check Video Format 📹

Some video formats may not play in browsers:

**Supported formats:**
- ✅ MP4 (H.264) - **Best compatibility**
- ✅ WebM
- ⚠️ AVI - May not work
- ⚠️ MKV - May not work

**Solution**: Re-upload as MP4 format

### Solution 6: Test with Small Video 🎬

Upload a small test video (< 10MB) in MP4 format:

1. Find a small MP4 video
2. Upload it
3. Wait for green "completed" badge
4. Click Play

If this works, the issue was with the original video file.

### Solution 7: Check Network Tab 🌐

1. Press `F12` → "Network" tab
2. Click Play button
3. Look for `/api/videos/{id}/stream` request
4. Check the response:
   - **200 or 206**: Success (should play)
   - **401**: Authentication issue → Logout/Login
   - **404**: File not found → Re-upload
   - **500**: Server error → Check backend logs

### Solution 8: Verify Role Permissions 👤

Make sure you're logged in as **Editor** or **Admin**:

1. Look at the top right of the dashboard
2. You should see a badge showing your role
3. **Viewer** role = Read-only (can play but not upload)
4. **Editor** role = Can upload and play
5. **Admin** role = Full access

### Quick Test Checklist ✅

- [ ] Video shows green "completed" badge
- [ ] Video shows "safe" or "flagged" sensitivity badge
- [ ] Play button is visible
- [ ] Logged in as Editor or Admin
- [ ] Browser console shows no errors
- [ ] Tried refreshing the page
- [ ] Tried logout/login

## Still Not Working?

If none of the above works, the issue might be:

1. **Backend not running**: Check if `http://localhost:5000` is accessible
2. **Frontend not running**: Check if `http://localhost:5173` is accessible
3. **MongoDB not running**: Backend needs MongoDB connection
4. **File permissions**: Video files in `backend/uploads/` need read permissions

### Check Backend Logs

Look at the terminal running the backend server for errors when you click Play.

### Manual Test

Try accessing the stream URL directly:
```
http://localhost:5000/api/videos/{VIDEO_ID}/stream
```

Replace `{VIDEO_ID}` with your actual video ID. You should be prompted to login or see the video.

## Expected Behavior

When everything works correctly:

1. Upload video → Shows "processing" badge
2. Wait 5-10 seconds → Shows "completed" + "safe"/"flagged" badges
3. Click "Play" button → Video player modal opens
4. Video starts playing automatically

If this doesn't happen, use the solutions above!

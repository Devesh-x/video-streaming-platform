# FFmpeg Installation Guide

## The Issue

If you see "processing failed" when uploading videos, it's because **FFmpeg is not installed**. The application now has a fallback mode that works without FFmpeg, but for full functionality (accurate video duration and resolution), you should install FFmpeg.

## Quick Fix (No FFmpeg)

The application will now work WITHOUT FFmpeg! It will:
- ✅ Upload videos successfully
- ✅ Process and analyze content
- ✅ Stream videos
- ⚠️ Show estimated duration (based on file size)
- ⚠️ Show "unknown" resolution

## Full Fix (Install FFmpeg)

### Windows

**Option 1: Using Chocolatey (Recommended)**
```powershell
# Install Chocolatey if not installed
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install FFmpeg
choco install ffmpeg -y
```

**Option 2: Using winget**
```powershell
winget install ffmpeg
```

**Option 3: Manual Installation**
1. Download from: https://www.gyan.dev/ffmpeg/builds/
2. Extract to `C:\ffmpeg`
3. Add to PATH:
   - Open "Environment Variables"
   - Edit "Path" under System Variables
   - Add `C:\ffmpeg\bin`
   - Restart terminal

### macOS
```bash
brew install ffmpeg
```

### Linux
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

## Verify Installation

```powershell
ffmpeg -version
```

If this shows version info, FFmpeg is installed correctly!

## After Installing FFmpeg

1. Restart the backend server:
   - Press `Ctrl+C` in the backend terminal
   - Run `npm run dev` again

2. Try uploading a video again - you'll now get accurate metadata!

## Current Status

✅ **Application works without FFmpeg** (with limited metadata)
🎯 **Install FFmpeg for full functionality** (accurate duration and resolution)

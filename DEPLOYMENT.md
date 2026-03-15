# Deployment Guide

## Overview

This guide covers deploying both backend and frontend to popular hosting platforms.

## 🎯 Recommended Platforms

- **Backend**: Render
- **Frontend**: Vercel

---

## Backend Deployment

### Render

1. Go to https://render.com/
2. Sign up/Login
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: highlevel-calendar-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
6. Add environment variables:
   - `PORT=5000`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
7. Click "Create Web Service"

---

## Frontend Deployment

### Vercel

Vercel is optimized for React applications.

#### Steps:

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Deploy**:

   ```bash
   cd frontend
   vercel
   ```

3. **Configure Environment**:

   - When prompted, set root directory to `frontend`
   - Add environment variable:
     ```
     REACT_APP_API_URL=https://your-backend-url.com/api
     ```

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

#### Alternative: Using Vercel Dashboard

1. Go to https://vercel.com/
2. Sign up/Login
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://your-backend-url.com/api`
7. Click "Deploy"

---

## Post-Deployment Checklist

### 1. Update README.md

Add your deployment URLs:

```markdown
## 🎥 Demo

- **Live Application**: https://your-frontend-url.vercel.app
- **Backend API**: https://your-backend-url.railway.app
- **Loom Video Demo**: https://loom.com/share/your-video-id
```

## Environment Variables Reference

### Backend

| Variable                | Example                                                    | Description                            |
| ----------------------- | ---------------------------------------------------------- | -------------------------------------- |
| `PORT`                  | `5000`                                                     | Server port                            |
| `FIREBASE_PROJECT_ID`   | `my-calendar-app`                                          | Firebase project ID                    |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-xxx@my-project.iam.gserviceaccount.com` | Service account email                  |
| `FIREBASE_PRIVATE_KEY`  | `-----BEGIN PRIVATE KEY-----\n...`                         | Private key (include newlines as `\n`) |

### Frontend

| Variable            | Example                       | Description          |
| ------------------- | ----------------------------- | -------------------- |
| `REACT_APP_API_URL` | `https://api.example.com/api` | Backend API base URL |

---

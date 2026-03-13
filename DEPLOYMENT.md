# Deployment Guide

## Overview

This guide covers deploying both backend and frontend to popular hosting platforms.

## 🎯 Recommended Platforms

- **Backend**: Railway, Render, or Heroku
- **Frontend**: Vercel or Netlify

---

## Backend Deployment

### Option 1: Railway (Recommended)

Railway offers easy deployment with a free tier.

#### Steps:

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**:
   ```bash
   railway login
   ```

3. **Initialize Project**:
   ```bash
   cd backend
   railway init
   ```

4. **Set Environment Variables**:
   ```bash
   railway variables set PORT=5000
   railway variables set FIREBASE_PROJECT_ID=your-project-id
   railway variables set FIREBASE_CLIENT_EMAIL=your-email
   railway variables set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
   ```

5. **Deploy**:
   ```bash
   railway up
   ```

6. **Get URL**:
   ```bash
   railway status
   ```

   Your backend will be available at something like `https://your-app.up.railway.app`

#### Alternative: Using Railway Dashboard

1. Go to https://railway.app/
2. Sign up/Login
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
6. Add environment variables in Settings → Variables
7. Deploy

---

### Option 2: Render

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

### Option 3: Heroku

1. Install Heroku CLI:
   ```bash
   brew install heroku/brew/heroku
   ```

2. Login:
   ```bash
   heroku login
   ```

3. Create app:
   ```bash
   cd backend
   heroku create highlevel-calendar-api
   ```

4. Set environment variables:
   ```bash
   heroku config:set FIREBASE_PROJECT_ID=your-project-id
   heroku config:set FIREBASE_CLIENT_EMAIL=your-email
   heroku config:set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
   ```

5. Deploy:
   ```bash
   git push heroku main
   ```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

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

### Option 2: Netlify

1. Go to https://www.netlify.com/
2. Sign up/Login
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
6. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://your-backend-url.com/api`
7. Click "Deploy site"

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

### 2. Test Deployed Application

```bash
# Test backend health
curl https://your-backend-url.railway.app/health

# Test free slots API
curl "https://your-backend-url.railway.app/api/slots/free?date=2026-03-15&timezone=America/New_York"
```

### 3. Share Access

1. **GitHub**:
   ```bash
   # Make repo private
   # Add dev-highlevel as collaborator
   # Settings → Collaborators → Add people → dev-highlevel
   ```

2. **Email Deployment URLs** to:
   - dev@gohighlevel.com
   - Cc'd interviewers

---

## Environment Variables Reference

### Backend

| Variable | Example | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `FIREBASE_PROJECT_ID` | `my-calendar-app` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-xxx@my-project.iam.gserviceaccount.com` | Service account email |
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...` | Private key (include newlines as `\n`) |

### Frontend

| Variable | Example | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `https://api.example.com/api` | Backend API base URL |

---

## Troubleshooting

### Backend Issues

**Problem**: `Firebase credentials not found`

**Solution**: Ensure environment variables are set correctly. For `FIREBASE_PRIVATE_KEY`, make sure newlines are escaped as `\n`.

**Problem**: `Port already in use`

**Solution**: Railway/Render automatically assign ports. Don't hardcode port 5000 in production - use `process.env.PORT`.

### Frontend Issues

**Problem**: `API calls failing with CORS error`

**Solution**: Ensure CORS is enabled in backend (already configured in our Express app).

**Problem**: `404 on refresh`

**Solution**: Configure SPA redirect rules:
- **Vercel**: Create `vercel.json`:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- **Netlify**: Create `public/_redirects`:
  ```
  /*    /index.html   200
  ```

---

## Cost Estimates

| Platform | Free Tier | Pricing |
|----------|-----------|---------|
| Railway | 500 hours/month | $5/month after |
| Render | 750 hours/month | $7/month after |
| Vercel | 100 GB bandwidth | $20/month Pro |
| Netlify | 100 GB bandwidth | $19/month Pro |

All platforms offer generous free tiers suitable for this demo.

---

## Next Steps

1. ✅ Deploy backend
2. ✅ Deploy frontend
3. ✅ Test deployed application
4. ✅ Update README with URLs
5. ✅ Create Loom demo video
6. ✅ Create private GitHub repo
7. ✅ Add collaborators
8. ✅ Submit to interviewers

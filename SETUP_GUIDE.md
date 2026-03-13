# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# From the root directory
npm run install:all
```

Or install separately:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### Step 2: Configure Firebase

1. **Get Firebase Credentials**:
   - Go to https://console.firebase.google.com/
   - Select/Create a project
   - Enable Firestore Database
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file

2. **Create `.env` file** in `backend/` directory:

```env
PORT=5000

# Copy values from downloaded JSON file
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
```

### Step 3: Start Development Servers

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend runs on http://localhost:5000

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

Frontend runs on http://localhost:3000

### Step 4: Test the Application

1. Open http://localhost:3000
2. Book an appointment:
   - Select a date
   - Choose timezone
   - Click "Get Free Slots"
   - Click on a slot to book
3. View appointments:
   - Switch to "View Appointments" tab
   - Select date range
   - Click "Get Events"

## 🔧 Common Issues

### Issue: "Firebase credentials not found"

**Solution**: Make sure you created `.env` file in the `backend/` folder with correct values.

### Issue: "Cannot connect to backend"

**Solution**: Ensure backend server is running on port 5000. Check if any other service is using that port.

### Issue: Frontend shows blank page

**Solution**:
1. Check browser console for errors
2. Make sure both servers are running
3. Clear browser cache and refresh

## 📝 API Testing with curl

### Get Free Slots

```bash
curl "http://localhost:5000/api/slots/free?date=2026-03-15&timezone=America/New_York"
```

### Create Event

```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "dateTime": "2026-03-15T10:00:00-07:00",
    "duration": 30
  }'
```

### Get Events

```bash
curl "http://localhost:5000/api/events?startDate=2026-03-01&endDate=2026-03-31"
```

## 🎬 Next Steps

1. Test all features thoroughly
2. Create a Loom video demo
3. Deploy to hosting services (see README.md)
4. Add deployment URLs to README.md
5. Create private GitHub repo
6. Add `dev-highlevel` as collaborator

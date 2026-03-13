# Calendar Appointment Booking System

A full-stack web application for booking appointments with Dr. John, featuring timezone-aware slot management and real-time availability checking.

## 🎥 Demo

- **Live Application**: [Add your deployment URL here]
- **Loom Video Demo**: [Add your Loom video URL here]

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Database Design](#database-design)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

## ✨ Features

- **Timezone-Aware Booking**: View and book appointments in any timezone
- **Real-Time Slot Calculation**: Dynamic availability based on existing appointments
- **Conflict Prevention**: Automatic detection and prevention of double-booking
- **Date Range Filtering**: View all appointments within a specified date range
- **Responsive Design**: Mobile-friendly interface
- **RESTful API**: Clean API design with proper error handling

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Google Cloud Firestore
- **Date/Time**: Luxon (timezone support)

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **UI Components**: React DatePicker
- **HTTP Client**: Axios
- **Date Utilities**: date-fns, date-fns-tz

## 🏗 Architecture

### System Design

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │ ◄──────► │  Express    │ ◄──────► │  Firestore  │
│   Frontend  │   HTTP   │  Backend    │   SDK    │   Database  │
└─────────────┘          └─────────────┘          └─────────────┘
```

### Slot Calculation Algorithm

1. Parse requested date in Dr. John's default timezone (America/New_York)
2. Generate all possible slots between START_HOUR and END_HOUR
3. Query Firestore for existing events on that date
4. Filter out slots that conflict with booked events
5. Convert remaining slots to requested timezone
6. Return as ISO 8601 strings

### Availability Configuration

```typescript
START_HOUR: 8            // 8:00 AM
END_HOUR: 17             // 5:00 PM
SLOT_DURATION: 30        // 30 minutes
DEFAULT_TIMEZONE: 'America/New_York'  // US/Eastern
```

## 📦 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase/Firestore project with credentials

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd HighLevel
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Configure Firebase

Create a `.env` file in the `backend` directory:

```env
PORT=5000

# Option 1: Using individual credentials
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"

# Option 2: Using service account JSON file
# GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

**To get Firebase credentials:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file
6. Either:
   - Place it as `serviceAccountKey.json` in backend folder, OR
   - Copy the values into `.env` as shown above

### 4. Start Backend Server

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

Backend will run on `http://localhost:5000`

### 5. Frontend Setup

```bash
cd ../frontend
npm install
```

### 6. Configure Frontend API URL (Optional)

Create `.env` file in `frontend` directory if deploying to production:

```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

For local development, the proxy is already configured to `http://localhost:5000`

### 7. Start Frontend Application

```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📚 API Documentation

### Base URL

```
Local: http://localhost:5000/api
Production: https://your-backend-url.com/api
```

### Endpoints

#### 1. Get Free Slots

**GET** `/slots/free`

Retrieves available appointment slots for a given date in the specified timezone.

**Query Parameters:**

| Parameter | Type   | Required | Description                       | Example            |
|-----------|--------|----------|-----------------------------------|--------------------|
| date      | string | Yes      | Date in YYYY-MM-DD format         | 2026-03-15         |
| timezone  | string | Yes      | IANA timezone identifier          | America/New_York   |

**Example Request:**

```bash
curl "http://localhost:5000/api/slots/free?date=2026-03-15&timezone=America/New_York"
```

**Example Response:**

```json
{
  "date": "2026-03-15",
  "timezone": "America/New_York",
  "freeSlots": [
    "2026-03-15T13:00:00-04:00",
    "2026-03-15T13:30:00-04:00",
    "2026-03-15T14:00:00-04:00",
    "2026-03-15T14:30:00-04:00"
  ],
  "totalSlots": 4
}
```

**Status Codes:**

- `200`: Success
- `400`: Invalid parameters
- `500`: Server error

---

#### 2. Create Event

**POST** `/events`

Creates a new appointment event.

**Request Body:**

| Field    | Type   | Required | Description                              | Example                      |
|----------|--------|----------|------------------------------------------|------------------------------|
| dateTime | string | Yes      | ISO 8601 datetime or Unix timestamp      | 2026-03-15T10:00:00-07:00    |
| duration | number | Yes      | Duration in minutes                      | 30                           |

**Example Request:**

```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "dateTime": "2026-03-15T10:00:00-07:00",
    "duration": 30
  }'
```

**Example Response (Success):**

```json
{
  "message": "Event created successfully",
  "event": {
    "id": "abc123xyz",
    "startDateTime": "2026-03-15T10:00:00.000Z",
    "endDateTime": "2026-03-15T10:30:00.000Z",
    "durationMinutes": 30,
    "createdAt": "2026-03-13T15:30:00.000Z"
  }
}
```

**Example Response (Conflict):**

```json
{
  "error": "Event conflict: This time slot is already booked"
}
```

**Status Codes:**

- `200`: Success
- `400`: Invalid parameters
- `422`: Conflict - slot already booked
- `500`: Server error

---

#### 3. Get Events

**GET** `/events`

Retrieves all events within a specified date range.

**Query Parameters:**

| Parameter | Type   | Required | Description                       | Example    |
|-----------|--------|----------|-----------------------------------|------------|
| startDate | string | Yes      | Start date in YYYY-MM-DD format   | 2026-03-01 |
| endDate   | string | Yes      | End date in YYYY-MM-DD format     | 2026-03-31 |

**Example Request:**

```bash
curl "http://localhost:5000/api/events?startDate=2026-03-01&endDate=2026-03-31"
```

**Example Response:**

```json
{
  "startDate": "2026-03-01",
  "endDate": "2026-03-31",
  "events": [
    {
      "id": "abc123xyz",
      "startDateTime": "2026-03-15T10:00:00.000Z",
      "endDateTime": "2026-03-15T10:30:00.000Z",
      "durationMinutes": 30,
      "createdAt": "2026-03-13T15:30:00.000Z"
    },
    {
      "id": "def456uvw",
      "startDateTime": "2026-03-16T14:00:00.000Z",
      "endDateTime": "2026-03-16T14:30:00.000Z",
      "durationMinutes": 30,
      "createdAt": "2026-03-13T16:00:00.000Z"
    }
  ],
  "totalEvents": 2
}
```

**Status Codes:**

- `200`: Success
- `400`: Invalid parameters
- `500`: Server error

---

#### 4. Health Check

**GET** `/health`

Check API server status and configuration.

**Example Request:**

```bash
curl http://localhost:5000/health
```

**Example Response:**

```json
{
  "status": "OK",
  "timestamp": "2026-03-13T15:30:00.000Z",
  "config": {
    "startHour": 10,
    "endHour": 17,
    "slotDuration": 30,
    "timezone": "America/Los_Angeles"
  }
}
```

## 🗄 Database Design

### Firestore Collection: `events`

```typescript
{
  id: string;                    // Auto-generated by Firestore
  startDateTime: Timestamp;      // Event start time
  endDateTime: Timestamp;        // Event end time (startDateTime + duration)
  durationMinutes: number;       // Duration in minutes
  createdAt: Timestamp;          // Timestamp when event was created
}
```

### Indexes

For optimal query performance, create the following composite index in Firestore:

```
Collection: events
Fields:
  - startDateTime (Ascending)
  - endDateTime (Ascending)
```

### Query Design

**Free Slots Query:**
```typescript
events
  .where('startDateTime', '>=', startOfDay)
  .where('startDateTime', '<', endOfDay)
```

**Conflict Check Query:**
```typescript
events
  .where('startDateTime', '<', newEventEnd)
  .where('endDateTime', '>', newEventStart)
```

**Date Range Query:**
```typescript
events
  .where('startDateTime', '>=', startDate)
  .where('startDateTime', '<=', endDate)
  .orderBy('startDateTime', 'asc')
```

## 🚀 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Create account on hosting platform
2. Connect GitHub repository
3. Set environment variables:
   - `PORT`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
4. Deploy from main branch

**Railway Example:**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Frontend Deployment (Vercel/Netlify)

1. Create account on hosting platform
2. Connect GitHub repository
3. Set build settings:
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/build`
4. Set environment variable:
   - `REACT_APP_API_URL=https://your-backend-url.com/api`
5. Deploy

**Vercel Example:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

## 📁 Project Structure

```
HighLevel/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── constants.ts       # Availability configuration
│   │   │   └── firebase.ts        # Firebase initialization
│   │   ├── controllers/
│   │   │   ├── eventController.ts # Event CRUD operations
│   │   │   └── slotController.ts  # Slot generation logic
│   │   ├── services/
│   │   │   ├── eventService.ts    # Business logic for events
│   │   │   └── slotService.ts     # Slot calculation algorithm
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript interfaces
│   │   ├── routes/
│   │   │   └── index.ts           # API routes
│   │   └── index.ts               # Express server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── BookEvent.tsx      # Appointment booking page
│   │   │   └── ShowEvents.tsx     # Events listing page
│   │   ├── services/
│   │   │   └── api.ts             # Axios API client
│   │   ├── utils/
│   │   │   └── dateUtils.ts       # Date formatting utilities
│   │   ├── App.tsx                # Main app component
│   │   └── App.css                # Global styles
│   ├── package.json
│   └── public/
└── README.md

```

## 🧪 Testing the Application

### Manual Testing Workflow

1. **Start both servers** (backend on :5000, frontend on :3000)

2. **Test Free Slots**:
   - Navigate to "Book Appointment" tab
   - Select today's date
   - Choose timezone (e.g., "Eastern Time")
   - Click "Get Free Slots"
   - Verify slots appear in the selected timezone

3. **Test Booking**:
   - Click on any available slot
   - Verify success message appears
   - Refresh slots to see the booked slot removed

4. **Test Conflict**:
   - Try booking the same slot again
   - Verify 422 error is returned

5. **Test View Events**:
   - Navigate to "View Appointments" tab
   - Select date range
   - Click "Get Events"
   - Verify booked appointments appear

6. **Test Timezone Conversion**:
   - Book a slot in "Pacific Time (PT)"
   - View events in "India Standard Time (IST)"
   - Verify times are correctly converted

### Using the Test Spreadsheet

Reference: [Google Sheets Test Cases](https://docs.google.com/spreadsheets/d/1t7g3VRN-glGiNbz4dMz4FS_IU2uS_rGtb6otxUvjXVs/edit#gid=0)

## 🔒 Security Considerations

- **No Authentication**: This is a demo app without authentication. In production, add user auth.
- **Rate Limiting**: Consider adding rate limiting to prevent abuse
- **Input Validation**: All inputs are validated on the backend
- **Firebase Rules**: Set up proper Firestore security rules in production

## 🐛 Known Limitations

- No user authentication system
- No email notifications
- No recurring appointments support
- No cancellation/rescheduling functionality
- Concurrent booking race condition possible (add transactions for production)

## 📞 Contact

**Developer**: Krishna Chivte

For any questions or issues, please open an issue on GitHub.

---

Built with ❤️ for HighLevel Technical Interview

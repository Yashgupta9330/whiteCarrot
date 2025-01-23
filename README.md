# Google Calendar Integration App

A web application that allows users to log in with Google, view their calendar events, and analyze event data through various visualizations.

## Live Demo

- Frontend: https://white-carrot-gamma.vercel.app/
- Backend:  https://whitecarrot-owjf.onrender.com/

## Features

- Google Single Sign-On (SSO) authentication
- Google Calendar integration
-  Event display with search-based filtering
-  Event display with date-based filtering
-  Event display with today filtering
- Analytics Dashboard featuring:
  - Most Common Event
  - Busiest Day
  - Average Working hours
  - EventType distribution pie chart
- Event list export functionality

## Tech Stack

### Backend
- Node.js
- Express.js
- Postgresql

### Frontend
- React.js
- Recharts for data visualization
- Tailwind CSS for styling

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- docker
- Google Cloud Console account

### Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Calendar API
   - Google OAuth2 API
4. Configure OAuth Consent Screen:
   - Set user type as "External"
   - Add required scopes:
     - `openid`
     - `profile`
     - `email`
     - `https://www.googleapis.com/auth/calendar.readonly`
5. Create OAuth 2.0 Client ID:
   - Go to Credentials
   - Click "Create Credentials" → "OAuth Client ID"
   - Application Type: "Web Application"
   - Add authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://white-carrot-gamma.vercel.app` (production)
   - Add authorized redirect URIs:
     - `http://localhost:4000/api/auth/google/callback` (development)
     - `https://whitecarrot-owjf.onrender.com/api/auth/google/callback` (production)
6. Note down the Client ID and Client Secret

### Environment Variables Setup

1. Backend (.env file in server directory):
```
NODE_ENV=development
DATABASE_URL=postgresql://user:password@db:5432/calendar
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=4000
FRONTEND_URL=http://localhost:3000
GOOGLE_REDIRECT_URL=http://localhost:4000/api/auth/google/callback
JWT_SECRET=your_secure_random_string_here
```

2. Frontend (.env file in client directory):
```
API_BASE_URL=http://localhost:4000/api
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Yashgupta9330/whiteCarrot
cd Whitecarrot
```

2. Install backend dependencies:
```bash
 docker-compose build
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
docker-compose up
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`

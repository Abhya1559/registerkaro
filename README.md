# RegisterKaro – ITR Credentials Generation Automation

## Overview

This project is a full-stack automation platform that automates the Income Tax portal workflow using Playwright, tracks every automation step, stores execution history in MongoDB, and provides a real-time monitoring dashboard.

The application consists of three major components:

- Automation Service (Playwright)
- Backend API (Express + MongoDB)
- Frontend Dashboard (React + TailwindCSS)

---

## Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose

### Automation

- Playwright
- Chromium

### Frontend

- React
- TypeScript
- TailwindCSS
- Axios
- Server Sent Events (SSE)

---

# Features

## Automation

- Launch browser
- Open Income Tax Portal
- Login workflow
- State machine driven automation
- Automatic error handling
- Structured event generation

## Backend

- Job Management
- Event Storage
- Event Replay
- SSE Streaming
- REST APIs

## Dashboard

- Create Automation Job
- Live Job Status
- Job History
- Job Details
- Live Event Console
- Metrics Dashboard

---

# Folder Structure

```
.
├── client
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── hooks
│   │   └── pages
│
├── server
│   ├── src
│   │   ├── controllers
│   │   ├── db
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│
└── README.md
```

---

# Installation

## Backend

```bash
cd server

npm install

npm run dev
```

## Frontend

```bash
cd client

npm install

npm run dev
```

---

# Environment Variables

Create `.env`

```env
PORT=3000

MONGODB_URI=

WEBHOOK_SECRET=

JWT_SECRET=
```

---

# API Endpoints

## Jobs

### Create Job

```
POST /api/jobs
```

### Get All Jobs

```
GET /api/jobs
```

### Get Job

```
GET /api/jobs/:jobId
```

---

## Events

### Save Event

```
POST /api/events
```

### Get Events

```
GET /api/events/:jobId
```

---

## Streaming

```
GET /api/stream/:jobId
```

---

# Workflow

```
User
   │
   ▼
Create Job
   │
   ▼
Launch Browser
   │
   ▼
Open Portal
   │
   ▼
Login
   │
   ▼
Emit Events
   │
   ▼
Store Events
   │
   ▼
SSE
   │
   ▼
Dashboard
```

---

# Current Status

### Completed

- Browser Automation
- Job Tracking
- MongoDB Persistence
- SSE Streaming
- React Dashboard
- Event Replay
- Job Details
- Live Console

### Pending

- OTP Flow
- Metrics API
- Cancel Job API
- Webhook Authentication

---

# Notes

The automation framework successfully launches the browser, tracks job execution, persists events, and streams them to the dashboard.

During testing, the target Income Tax portal rejected automated browser sessions after the login button was clicked with a **"Permission Denied"** response. The application detects this condition, marks the job as failed, stores the error, and displays it on the dashboard.

---

# Future Improvements

- Retry Mechanism
- Queue Support
- Multiple Browser Workers
- Authentication
- Docker Deployment
- Unit Testing
- CI/CD Pipeline

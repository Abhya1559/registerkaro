# Architecture

## High Level Architecture

```
                    React Dashboard
                           │
                           │
                       SSE Stream
                           │
                           ▼
                    Express Backend
                           │
          ┌────────────────┴────────────────┐
          │                                 │
          ▼                                 ▼
      MongoDB                      Playwright Bot
          ▲                                 │
          └────────────Webhook──────────────┘
```

The backend acts as the single source of truth.

The automation never communicates directly with the frontend.

All automation events first reach the backend, are persisted into MongoDB, and are then streamed to connected clients using Server Sent Events (SSE).

---

# System Components

## 1. Automation Service

Responsibilities

- Launch browser
- Execute automation
- Generate structured events
- Report failures
- Update Job State

---

## 2. Backend

Responsibilities

- Manage Jobs
- Persist Events
- Stream Events
- Replay History
- Expose REST APIs

---

## 3. Dashboard

Responsibilities

- Create Jobs
- View Job History
- Monitor Live Automation
- Display Metrics
- View Job Details

---

# State Machine

```
CREATED
    │
    ▼
OPEN_BROWSER
    │
    ▼
OPEN_PORTAL
    │
    ▼
LOGIN
    │
    ▼
WAITING_OTP
    │
    ▼
VERIFY_OTP
    │
    ▼
GENERATE_CREDENTIALS
    │
    ▼
COMPLETED

OR

FAILED
```

Each state transition emits a structured event.

---

# Job Lifecycle

```
Client

   │

POST /jobs

   │

Create Job

   │

MongoDB

   │

Start Playwright

   │

Emit Event

   │

POST /events

   │

MongoDB

   │

SSE Broadcast

   │

Dashboard
```

---

# Event Flow

```
Playwright

      │

emitEvent()

      │

POST /events

      │

MongoDB

      │

Broadcast

      │

Server Sent Events

      │

React Dashboard
```

The event pipeline ensures

- Event Durability
- Event Replay
- Real-time Updates

---

# Replay Flow

Whenever an operator opens a completed job

```
GET /events/:jobId

        │

Historical Events

        │

Connect SSE

        │

Receive Live Events
```

No events are lost.

---

# Database Design

## Jobs Collection

Stores

- Job Id
- PAN
- Phase
- Status
- Started Time
- Completed Time
- Error

---

## Events Collection

Stores

- Job Id
- Sequence
- Level
- Phase
- Step
- Message
- Timestamp

---

# Database Indexes

Jobs

```
createdAt
status
phase
```

Events

```
jobId
sequence
```

These indexes optimize

- Job Listing
- Event Replay
- Dashboard Performance

---

# Failure Handling

Every automation executes independently.

If any step fails

- Browser closes
- Job marked FAILED
- Error persisted
- Failure event generated
- Dashboard updated instantly

Failures do not affect other running jobs.

---

# Design Decisions

### Express

Lightweight REST API layer.

### MongoDB

Efficient append-only event storage.

### Playwright

Reliable browser automation.

### Server Sent Events

One-way real-time streaming from backend to dashboard.

### React

Interactive operator dashboard.

---

# Scalability

The architecture is designed to support

- Multiple automation workers
- Background queues
- Horizontal scaling
- Distributed event processing
- Authentication
- Docker deployment

---

# Future Improvements

- Redis Queue
- BullMQ Workers
- Retry Policies
- Metrics API
- Docker Compose
- Kubernetes Deployment
- Prometheus Monitoring
- Grafana Dashboards

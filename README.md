# Pastebin Lite

Pastebin Lite is a minimal web application that allows users to create text pastes, generate shareable URLs, and view pastes via those links.  
Pastes can optionally expire based on time (TTL) or number of views.

This project was built as a take-home exercise to demonstrate backend logic, persistence, and API design.

---

## Features

- Create a paste containing arbitrary text
- Generate a shareable URL for each paste
- View a paste via `/p/:id`
- Optional constraints:
  - Time-based expiry (TTL)
  - View-count limit
- Deterministic expiry testing using request headers
- Backend-first design with a simple UI

---

## Tech Stack

- **Next.js (App Router)**
- **Node.js**
- **PostgreSQL**
- **Neon (serverless Postgres)**
- **Vercel (deployment)**

---

## Running the Project Locally

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database (local or Neon)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/<your-username>/pastebin-lite.git
cd pastebin-lite
npm install
DATABASE_URL=your_postgres_connection_string
CREATE TABLE IF NOT EXISTS pastes (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  expires_at TIMESTAMP NULL,
  remaining_views INTEGER NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
npm run dev
http://localhost:3000
```

### Health Check
```bash
GET /api/healthz
```

### Create Paste
```bash
POST /api/pastes

Request body:

{
  "content": "example text",
  "ttl_seconds": 60,
  "max_views": 2
}
```
### Fetch Paste
```bash
GET /api/pastes/:id
```
Returns paste content if available, otherwise 404.

---

### Persistence Layer

This application uses PostgreSQL as its persistence layer.
A serverless PostgreSQL database is provided via Neon, ensuring data persists across requests and deployments, including when deployed on serverless platforms like Vercel.

All paste data (content, expiry time, remaining views) is stored in the database, and availability constraints are enforced at request time.

---

### Notes

- UI styling is intentionally minimal; focus is on backend correctness.
- Automated tests are expected to interact directly with the API.
- In-memory storage is not used.
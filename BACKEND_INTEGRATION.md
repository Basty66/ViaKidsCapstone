# ViaKids — Backend Integration Guide

## 📋 Overview
This document explains the current frontend architecture, expected API endpoints, database schema, WebSocket events, and authentication flow so the backend team can build a compatible API.

---

## 🔐 Authentication

### Flow
1. User enters credentials on `/` (Login page)
2. Frontend calls `POST /api/auth/login`
3. Backend returns `{ token, role, name }`
4. Frontend stores in localStorage and redirects to role-specific dashboard

### Role Values
| Role Value | Dashboard Path | Label |
|---|---|---|
| `admin` | `/admin` | Administrador |
| `driver` | `/driver` | Conductor |
| `parent` | `/parent` | Apoderado |

### Endpoints

#### `POST /api/auth/login`
```json
// Request
{ "email": "admin@viakids.cl", "password": "123456" }

// Response 200
{
  "token": "jwt_string_here",
  "role": "admin",
  "name": "Admin Principal"
}

// Response 401
{ "message": "Credenciales inválidas" }
```

#### Auth Header (all protected requests)
```
Authorization: Bearer <token>
```

#### `POST /api/auth/logout`
```json
// Response 200
{ "message": "Sesión cerrada" }
```

---

## 🗄️ Database Schema (Recommended)

### Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'driver', 'parent')),
    telefono VARCHAR(20),
    estado VARCHAR(20) DEFAULT 'Activo',
    extra TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Buses
```sql
CREATE TABLE buses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patente VARCHAR(10) UNIQUE NOT NULL,
    conductor_id UUID REFERENCES users(id),
    capacidad INT NOT NULL,
    estado VARCHAR(30) DEFAULT 'Activo',
    lat DECIMAL(10, 8),
    lng DECIMAL(10, 8),
    velocidad DECIMAL(5, 2),
    ultimo_reporte TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Students
```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    curso VARCHAR(50),
    rut VARCHAR(12) UNIQUE,
    apoderado_id UUID REFERENCES users(id),
    telefono VARCHAR(20),
    bus_id UUID REFERENCES buses(id),
    ruta_id UUID REFERENCES routes(id),
    colegio VARCHAR(100),
    estado VARCHAR(20) DEFAULT 'En espera',
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Routes
```sql
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    colegio VARCHAR(100),
    horario TIME,
    bus_id UUID REFERENCES buses(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Attendance
```sql
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id),
    action VARCHAR(20) NOT NULL CHECK (action IN ('boarded', 'disembarked', 'absent')),
    bus_patente VARCHAR(10),
    ruta VARCHAR(100),
    timestamp TIMESTAMP DEFAULT NOW(),
    driver_id UUID REFERENCES users(id)
);
```

### Incidents
```sql
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES users(id),
    fecha DATE DEFAULT CURRENT_DATE,
    tipo VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    bus VARCHAR(10),
    resuelto BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ruta VARCHAR(100),
    tipo VARCHAR(20) DEFAULT 'Info',
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🌐 REST API Endpoints

### Auth
| Method | Path | Body | Response | Auth |
|---|---|---|---|---|
| POST | `/api/auth/login` | `{ email, password }` | `{ token, role, name }` | No |
| POST | `/api/auth/logout` | — | `{ message }` | Yes |

### Users
| Method | Path | Body | Response | Auth |
|---|---|---|---|---|
| GET | `/api/users` | — | `User[]` | Admin |
| GET | `/api/users/:id` | — | `User` | Admin |
| POST | `/api/users` | `User` | `User` | Admin |
| PUT | `/api/users/:id` | `User` | `User` | Admin |
| DELETE | `/api/users/:id` | — | `{ message }` | Admin |
| PATCH | `/api/users/:id/status` | `{ estado }` | `User` | Admin |

### Buses
| Method | Path | Body | Response | Auth |
|---|---|---|---|---|
| GET | `/api/buses` | — | `Bus[]` | Yes |
| GET | `/api/buses/:id` | — | `Bus` | Yes |
| POST | `/api/buses` | `Bus` | `Bus` | Admin |
| PUT | `/api/buses/:id` | `Bus` | `Bus` | Admin |
| DELETE | `/api/buses/:id` | — | `{ message }` | Admin |

### Students
| Method | Path | Body | Response | Auth |
|---|---|---|---|---|
| GET | `/api/students` | — | `Student[]` | Yes |
| GET | `/api/students/:id` | — | `Student` | Yes |
| POST | `/api/students` | `Student` | `Student` | Admin |
| PUT | `/api/students/:id` | `Student` | `Student` | Admin |
| DELETE | `/api/students/:id` | — | `{ message }` | Admin |

### Routes
| Method | Path | Body | Response | Auth |
|---|---|---|---|---|
| GET | `/api/routes` | — | `Route[]` | Yes |
| POST | `/api/routes` | `Route` | `Route` | Admin |
| PUT | `/api/routes/:id` | `Route` | `Route` | Admin |
| DELETE | `/api/routes/:id` | — | `{ message }` | Admin |

### Attendance
| Method | Path | Body | Response | Auth |
|---|---|---|---|---|
| POST | `/api/attendance/scan` | `{ studentId, action, busPatente, ruta }` | `{ success, record }` | Driver |
| GET | `/api/attendance/today` | — | `Attendance[]` | Yes |
| GET | `/api/attendance/student/:id` | — | `Attendance[]` | Parent |
| GET | `/api/attendance/student/:id/status` | — | `{ status, lastAction, lastTime }` | Parent |

### Notifications
| Method | Path | Body | Response | Auth |
|---|---|---|---|---|
| GET | `/api/notifications` | — | `Notification[]` | Yes |
| POST | `/api/notifications` | `{ ruta, tipo, mensaje }` | `Notification` | Admin |
| PATCH | `/api/notifications/:id/read` | — | `{ message }` | Yes |

### Incidents
| Method | Path | Body | Response | Auth |
|---|---|---|---|---|
| GET | `/api/incidents` | — | `Incident[]` | Yes |
| POST | `/api/incidents` | `{ tipo, descripcion }` | `Incident` | Driver |

### Geolocation (Bus Tracking)
| Method | Path | Body | Response | Auth |
|---|---|---|---|---|
| POST | `/api/buses/:id/location` | `{ lat, lng, velocidad }` | `{ message }` | Driver |
| GET | `/api/buses/:id/location` | — | `{ lat, lng, velocidad, timestamp }` | Yes |

---

## 📡 WebSocket (Real-time Tracking)

### Connection
```javascript
const ws = new WebSocket('wss://api.viakids.cl/ws');
```

### Events — Driver → Server (publish)
```json
// Location update (every 5 seconds while route is active)
{
  "type": "location",
  "busId": "uuid",
  "lat": -33.4489,
  "lng": -70.6693,
  "velocidad": 45.2,
  "timestamp": "2026-05-06T07:30:00Z"
}

// Attendance scan
{
  "type": "scan",
  "studentId": "uuid",
  "action": "boarded",
  "busPatente": "AB-1234",
  "timestamp": "2026-05-06T07:15:00Z"
}
```

### Events — Server → Parent/Admin (subscribe)
```json
// Bus location update
{
  "type": "bus_location",
  "busId": "uuid",
  "patente": "AB-1234",
  "lat": -33.4489,
  "lng": -70.6693,
  "velocidad": 45.2,
  "timestamp": "2026-05-06T07:30:00Z"
}

// Attendance notification
{
  "type": "attendance",
  "studentId": "uuid",
  "studentName": "Martina Rojas",
  "action": "boarded",
  "busPatente": "AB-1234",
  "timestamp": "2026-05-06T07:15:00Z"
}

// Admin notification broadcast
{
  "type": "notification",
  "tipo": "Alerta",
  "mensaje": "Bus AB-1234 retrasado 10 min",
  "ruta": "Ruta Norte",
  "timestamp": "2026-05-06T07:45:00Z"
}
```

### WebSocket Topics/Subscriptions
| Role | Subscribes To |
|---|---|
| Parent | `bus_location` (their child's bus), `attendance` (their child) |
| Admin | All `bus_location`, all `attendance`, `notification` |
| Driver | `notification` (for their route) |

---

## 🔧 Frontend Integration Points

### Files to Modify for Backend Connection

| File | What to Change |
|---|---|
| `src/services/api.js` | Replace mock responses with `fetch()` calls to real API |
| `src/hooks/useBuses.js` | Replace mock data with `GET /api/buses` |
| `src/hooks/useStudents.js` | Replace mock data with `GET /api/students` |
| `src/hooks/useUsers.js` | Replace mock data with `GET /api/users` |
| `src/hooks/useRoutes.js` | Replace mock data with `GET /api/routes` |
| `src/services/attendanceService.js` | Replace mock with `POST /api/attendance/scan` |
| `src/hooks/useWebSocket.js` | Point to real WebSocket URL, handle auth token |
| `src/context/AuthContext.jsx` | Add `POST /api/auth/login` and `POST /api/auth/logout` |
| `src/hooks/useGeolocation.js` | Call `POST /api/buses/:id/location` with GPS data |

### Current API Service Pattern
```javascript
// src/services/api.js — already structured for easy swap
const BASE_URL = 'http://localhost:3000/api'; // Change to real backend URL

const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('viakids_token_v2');
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
        ...options,
    };
    // ... rest of implementation
};
```

### Auth Context Integration Example
```javascript
// In AuthContext.jsx — replace demo login with real API
const login = async (credentials) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(ROLE_KEY, data.role);
    localStorage.setItem(NAME_KEY, data.name);
    setUser({ token: data.token, role: data.role, name: data.name });
};
```

---

## 📱 Camera / QR Scanner Requirements

### QR Scanner (Driver)
- Uses `html5-qrcode` library
- Requires **HTTPS** (or localhost for dev)
- Requests camera permission via `navigator.mediaDevices.getUserMedia`
- Automatically selects rear camera on mobile
- Sends decoded data to `POST /api/attendance/scan`

### QR Display (Parent)
- Uses `react-qr-code` to generate QR from student data
- QR payload is JSON:
```json
{
  "id": "student_uuid",
  "nombre": "Martina Rojas",
  "rut": "12.345.678-9",
  "curso": "1° Básico A",
  "colegio": "Colegio Los Andes",
  "busPatente": "AB-1234",
  "ruta": "Ruta Norte",
  "apoderado": "María Rojas",
  "telefono": "+56 9 1234 5678"
}
```

---

## 🗺️ Map / GPS

### Driver App
- Uses `navigator.geolocation.watchPosition()` for real-time GPS
- Sends location updates to backend every 5-10 seconds
- Backend broadcasts via WebSocket to subscribed parents/admin

### Parent/Admin View
- Uses Leaflet + CartoDB Dark Matter tiles (free, no API key)
- Receives bus positions via WebSocket
- Falls back to polling `GET /api/buses/:id/location` if WebSocket unavailable

---

## 🚀 Deployment Notes

### Frontend Build
```bash
npm run build
# Output: dist/ directory
# Deploy as static files (nginx, Vercel, Netlify, etc.)
```

### Environment Variables
Create `.env` in frontend root:
```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/ws
```

### HTTPS Required For
- Camera access (QR scanner on mobile)
- Geolocation API
- Service workers (if added later)

### CORS Configuration
Backend must allow:
```
Access-Control-Allow-Origin: <frontend-url>
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Expose-Headers: Content-Length
```

---

## 📊 Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| Charts | Recharts 3 |
| Maps | Leaflet + react-leaflet + CartoDB Dark tiles |
| QR Scanner | html5-qrcode |
| QR Generator | react-qr-code |
| Icons | Lucide React |
| Auth | JWT (localStorage) |
| Real-time | WebSocket (to be connected) |
| State | React Context + Hooks |

---

## 📝 Priority Order for Backend Development

1. **Auth API** — login, logout, JWT tokens
2. **Users CRUD** — admin user management
3. **Buses CRUD** — fleet management + location endpoints
4. **Students CRUD** — student management
5. **Routes CRUD** — route management
6. **Attendance API** — QR scan endpoint
7. **WebSocket** — real-time bus tracking + notifications
8. **Notifications API** — admin broadcast system
9. **Incidents API** — driver reporting

---

## 🤝 Quick Start for Backend Colleague

1. Clone this repo
2. Review `src/services/api.js` — see current data shapes
3. Review `src/services/attendanceService.js` — see QR scan flow
4. Review `src/hooks/useWebSocket.js` — see WebSocket event structure
5. Build API matching the endpoint spec above
6. Return same JSON shapes as current mock data
7. Set CORS to allow frontend origin
8. Test with `npm run dev` on frontend pointing to backend URL

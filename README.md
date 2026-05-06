# ViaKids — Transporte Escolar Seguro 🚌

Plataforma web para el monitoreo en tiempo real del transporte escolar. Permite a administradores gestionar la flota, conductores registrar asistencia con QR, y apoderados seguir la ubicación del bus de sus hijos.

## 👥 Roles

| Rol | Funciones |
|---|---|
| **Administrador** | Gestión de usuarios, flota, estudiantes, rutas, monitoreo en vivo, reportes |
| **Conductor** | Panel de ruta, escaneo QR de asistencia, reporte de incidencias |
| **Apoderado** | Estado del hijo en tiempo real, QR del estudiante, seguimiento del bus en mapa |

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Abre `http://localhost:5173/`

### Demo Login
- **Admin:** `admin@viakids.cl` / `123456`
- **Conductor:** `driver@viakids.cl` / `123456`
- **Apoderado:** `parent@viakids.cl` / `123456`

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── organisms/       # LoginForm
│   ├── templates/       # DashboardLayout (sidebar + header)
│   └── ui/              # Reusable: Modal, QRScanner, BusMap, StatCard, etc.
├── context/
│   ├── AuthContext.jsx  # Auth state + localStorage
│   └── ToastContext.jsx # Notification toasts
├── hooks/
│   ├── useBuses.js      # Fleet data
│   ├── useStudents.js   # Students data
│   ├── useUsers.js      # Users data
│   ├── useRoutes.js     # Routes data
│   ├── useGeolocation.js# GPS tracking (driver)
│   └── useWebSocket.js  # Real-time events
├── pages/
│   ├── LoginPage.jsx
│   ├── AdminDashboard.jsx
│   ├── DriverDashboard.jsx
│   ├── ParentDashboard.jsx
│   ├── LiveTracking.jsx
│   ├── UserManagement.jsx
│   ├── BusManagement.jsx
│   ├── StudentManagement.jsx
│   ├── RouteManagement.jsx
│   ├── Notifications.jsx
│   └── AttendanceReports.jsx
├── services/
│   ├── api.js           # API client (currently mock)
│   └── attendanceService.js # QR scan logic
└── App.jsx              # Routes + ProtectedRoute guards
```

## 🛠️ Tech Stack

- **React 19** + **Vite 8**
- **Tailwind CSS 4** — glassmorphism design
- **React Router DOM 7** — protected routes
- **Recharts 3** — charts and graphs
- **Leaflet** + **CartoDB Dark** — maps (free, no API key)
- **html5-qrcode** — camera QR scanning
- **react-qr-code** — QR generation
- **Lucide React** — icons
- **JWT** — authentication

## 📱 Responsive

Diseñado para funcionar en:
- 🖥️ Desktop (1920px+)
- 💻 Laptop (1024px - 1920px)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile (320px - 768px)

## 🔌 Backend Integration

Ver `BACKEND_INTEGRATION.md` para:
- Esquema de base de datos (PostgreSQL recomendado)
- Endpoints REST API esperados
- Eventos WebSocket para tracking en tiempo real
- Flujo de autenticación JWT
- Puntos de integración en el frontend

## 📦 Build

```bash
npm run build
# Output: dist/ (deploy como static files)
```

## 📄 Licencia

Proyecto interno ViaKids.

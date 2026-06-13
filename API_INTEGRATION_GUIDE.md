# API Integration Guide - Medical Platform

## Overview
This document outlines all API endpoints and their integration with the React frontend. The platform follows a RESTful architecture with JWT-based authentication.

## Base Configuration
- **Frontend Base URL**: Set via `VITE_API_URL` environment variable
- **Axios Client**: [frontend/src/api/apiClient.js](frontend/src/api/apiClient.js)
- **Auth Tokens**: Stored in localStorage, passed via `Authorization: Bearer <token>` header
- **Default Headers**: JSON content-type

## Authentication Flow

### 1. User Registration
**Endpoint**: `POST /api/auth/register`
```json
Request:
{
  "email": "user@example.com",
  "password": "secure_password",
  "role": "patient" | "doctor"
}

Response (201):
{
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "user": { ... user object ... }
}
```
**Frontend Implementation**: [frontend/src/pages/Register.jsx](frontend/src/pages/Register.jsx)

### 2. User Login
**Endpoint**: `POST /api/auth/login`
```json
Request:
{
  "email": "user@example.com",
  "password": "password"
}

Response (200):
{
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "user": { ... user object ... }
}
```
**Frontend Implementation**: [frontend/src/pages/Login.jsx](frontend/src/pages/Login.jsx)

### 3. Get Current User (Protected)
**Endpoint**: `GET /api/auth/me`
**Auth Required**: Yes (Bearer token)
```json
Response (200):
{
  "_id": "user_id",
  "email": "user@example.com",
  "role": "patient" | "doctor",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+213...",
  "avatar": "url",
  ... additional fields ...
}
```
**Frontend Implementation**: [frontend/src/contexts/AuthContext.jsx](frontend/src/contexts/AuthContext.jsx)
- Called on app mount to restore user session
- Updates Axios default headers with token

## Doctor Management

### 1. List All Doctors (Public)
**Endpoint**: `GET /api/doctors`
**Auth Required**: No
```json
Response (200):
[
  {
    "_id": "doctor_id",
    "user": { "firstName": "...", "lastName": "...", ... },
    "specialty": { "_id": "...", "name": "Cardiologie" },
    "wilaya": { "_id": "...", "name": "Alger" },
    "consultationPrice": 4500,
    "experience": "12 ans",
    "rating": 4.9,
    "reviews": 127,
    "status": "verified",
    "gender": "male" | "female"
  },
  ...
]
```
**Frontend Implementation**: [frontend/src/pages/SearchDoctors.jsx](frontend/src/pages/SearchDoctors.jsx)
- Filters by wilaya, specialty, gender (client-side)
- Displays in grid with rating and consultation fee

### 2. Get Doctor Details (Public)
**Endpoint**: `GET /api/doctors/:id`
**Auth Required**: No
```json
Response (200):
{
  "_id": "doctor_id",
  "user": {
    "firstName": "Yasmine",
    "lastName": "Ben Fatima",
    "bio": "About text",
    "languages": ["Français", "Arabe"],
    "degrees": ["Médecine Générale - Université d'Alger"]
  },
  "specialty": { "_id": "...", "name": "Cardiologie" },
  "wilaya": { "_id": "...", "name": "Alger" },
  "consultationPrice": 4500,
  "experience": "12 ans",
  "rating": 4.9,
  "reviews": 127,
  "availability": { "days": ["Lundi", ...], "hours": "09:00 - 17:00" },
  "consultationType": ["Consultation pressentielle", "Téléconsultation"],
  "insurance": "CNAS, CASNOS, Privé"
}
```
**Frontend Implementation**: [frontend/src/pages/DoctorProfile.jsx](frontend/src/pages/DoctorProfile.jsx)
- Displays full profile with qualifications
- Provides booking link to appointment booking page

### 3. Get Top Doctors (Public)
**Endpoint**: `GET /api/doctors/top`
**Auth Required**: No
**Query Parameters**: `?limit=6`
```json
Response (200): [... doctors sorted by rating ...]
```

## Appointment Management

### 1. Book Appointment (Protected - Patient)
**Endpoint**: `POST /api/appointments`
**Auth Required**: Yes (Patient role required)
```json
Request:
{
  "doctorId": "doctor_id",
  "scheduledAt": "2026-06-14T11:00:00.000Z",
  "reason": "Consultation reason",
  "price": 4500
}

Response (201):
{
  "_id": "appointment_id",
  "patient": { ... patient object ... },
  "doctor": { ... doctor object ... },
  "scheduledAt": "2026-06-14T11:00:00.000Z",
  "reason": "Consultation reason",
  "price": 4500,
  "status": "pending",
  "createdAt": "2026-01-15T10:30:00.000Z"
}
```
**Frontend Implementation**: [frontend/src/pages/Booking.jsx](frontend/src/pages/Booking.jsx)
- User selects date, time, and reason
- Automatically uses authenticated patient profile
- Includes consultation price from doctor profile

### 2. Get User's Appointments (Protected)
**Endpoint**: `GET /api/appointments`
**Auth Required**: Yes
**Query Parameters**: `?patient=patient_id` (optional for filtering)
```json
Response (200):
[
  {
    "_id": "appointment_id",
    "patient": { ... patient details ... },
    "doctor": {
      "_id": "doctor_id",
      "user": { "firstName": "...", "lastName": "..." },
      "specialty": { "name": "..." },
      "consultationPrice": 4500
    },
    "scheduledAt": "2026-06-14T11:00:00.000Z",
    "reason": "Consultation reason",
    "price": 4500,
    "status": "pending" | "confirmed" | "cancelled",
    "createdAt": "2026-01-15T10:30:00.000Z"
  },
  ...
]
```
**Frontend Implementation**: [frontend/src/pages/PatientDashboard.jsx](frontend/src/pages/PatientDashboard.jsx)
- Displays user's upcoming appointments
- Shows appointment statistics (total, confirmed, pending)
- Normalizes doctor information from populated reference

### 3. Change Appointment Status (Protected - Doctor/Admin)
**Endpoint**: `PUT /api/appointments/:id/status`
**Auth Required**: Yes (Doctor or Admin)
```json
Request:
{
  "status": "confirmed" | "cancelled"
}

Response (200):
{ ... updated appointment ... }
```

### 4. Reschedule Appointment (Protected - Patient/Doctor)
**Endpoint**: `PUT /api/appointments/:id/reschedule`
**Auth Required**: Yes (Patient or Doctor)
```json
Request:
{
  "scheduledAt": "2026-06-15T14:00:00.000Z"
}

Response (200):
{ ... updated appointment with new time ... }
```

## Admin Endpoints

### 1. Get Specialties (Public)
**Endpoint**: `GET /api/admin/specialties`
**Auth Required**: No
```json
Response (200):
[
  { "_id": "specialty_id", "name": "Cardiologie" },
  { "_id": "specialty_id", "name": "Pédiatrie" },
  ...
]
```
**Frontend Implementation**: [frontend/src/pages/SearchDoctors.jsx](frontend/src/pages/SearchDoctors.jsx)
- Used for search filter dropdown

### 2. Get Wilayas (Public)
**Endpoint**: `GET /api/admin/wilayas`
**Auth Required**: No
```json
Response (200):
[
  { "_id": "wilaya_id", "name": "Alger" },
  { "_id": "wilaya_id", "name": "Oran" },
  ...
]
```
**Frontend Implementation**: [frontend/src/pages/SearchDoctors.jsx](frontend/src/pages/SearchDoctors.jsx)
- Used for search filter dropdown (currently hardcoded in component)

### 3. Admin Dashboard (Protected - Admin)
**Endpoint**: `GET /api/admin/dashboard`
**Auth Required**: Yes (Admin role)
```json
Response (200):
{
  "stats": {
    "totalDoctors": 50,
    "totalPatients": 200,
    "totalAppointments": 1500,
    "pendingAppointments": 45
  },
  "recentAppointments": [ ... ],
  "doctorRequests": [ ... ]
}
```

## Error Handling

### Standard Error Response
```json
{
  "message": "Error description",
  "status": 400 | 401 | 403 | 404 | 500
}
```

### Common HTTP Status Codes
- **200**: Success
- **201**: Created (POST requests)
- **400**: Bad Request (validation error)
- **401**: Unauthorized (missing or invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Server Error

### Frontend Error Handling
All components implement try-catch with:
- User-friendly error messages
- Console logging for debugging
- Fallback data for non-critical features

## Field Normalization

The frontend normalizes API responses to handle different data structures:

### Doctor Fields
```javascript
// API returns objects or strings
specialty = doctor.specialty?.name || doctor.specialty
wilaya = doctor.wilaya?.name || doctor.wilaya
firstName = doctor.user?.firstName || doctor.firstName
lastName = doctor.user?.lastName || doctor.lastName
price = doctor.consultationPrice || doctor.consultationFee || doctor.price
```

### Appointment Fields
```javascript
doctorName = appointment.doctor?.user ? 
  `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}` : 
  appointment.doctor?.name
scheduledDate = new Date(appointment.scheduledAt).toLocaleDateString('fr-FR')
scheduledTime = new Date(appointment.scheduledAt).toLocaleTimeString('fr-FR')
statusLabel = appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'
```

## Authentication Persistence

### Token Management
1. **On Login**: Token stored in localStorage
2. **On App Mount**: AuthContext retrieves token, calls `/auth/me`
3. **On Request**: Axios adds `Authorization: Bearer <token>` header
4. **On Logout**: Token cleared from localStorage

### Protected Routes
Frontend routes are protected with `ProtectedRoute` component:
```javascript
<ProtectedRoute requiredRole="patient">
  <PatientDashboard />
</ProtectedRoute>
```

## Testing Checklist

- [ ] User can register and login
- [ ] Auth token persists across page reloads
- [ ] Doctor list displays all available doctors
- [ ] Doctor filtering works by specialty/wilaya/gender
- [ ] Doctor profile page loads full details
- [ ] User can book an appointment
- [ ] Appointment appears in patient dashboard
- [ ] Appointment status updates are reflected
- [ ] Error messages display appropriately
- [ ] Logout clears authentication state

## Environment Configuration

Create `.env` file in frontend root:
```
VITE_API_URL=http://localhost:5000/api
```

## File Structure

```
frontend/src/
├── api/
│   └── apiClient.js           # Axios configuration
├── contexts/
│   └── AuthContext.jsx        # Authentication state
├── pages/
│   ├── Register.jsx           # User registration
│   ├── Login.jsx              # User login
│   ├── SearchDoctors.jsx      # Doctor search and list
│   ├── DoctorProfile.jsx      # Doctor details
│   ├── Booking.jsx            # Appointment booking
│   └── PatientDashboard.jsx   # User's appointments

backend/
├── routes/
│   ├── authRoutes.js          # Auth endpoints
│   ├── doctorRoutes.js        # Doctor endpoints
│   ├── appointmentRoutes.js   # Appointment endpoints
│   └── adminRoutes.js         # Admin endpoints
├── controllers/
│   ├── authController.js
│   ├── doctorController.js
│   ├── appointmentController.js
│   └── adminController.js
└── services/
    ├── authService.js
    ├── doctorService.js
    ├── appointmentService.js
    └── adminService.js
```

## Key Implementation Details

### Appointment Booking Flow
1. Frontend sends `POST /appointments` with `doctorId`, `scheduledAt`, `reason`, `price`
2. Backend resolves patient from `req.user._id`
3. Backend validates doctor availability
4. Appointment created with `status: 'pending'`
5. Notification sent to patient
6. Frontend redirects to dashboard

### Doctor Search Flow
1. Frontend fetches all doctors from `GET /doctors`
2. Frontend fetches specialties from `GET /admin/specialties`
3. User applies filters (client-side)
4. Filtered list displayed
5. User clicks doctor to view profile or book

### Auth Flow
1. User logs in, receives token
2. Token stored in localStorage
3. AuthContext calls `GET /auth/me` to load user
4. User data stored in context
5. Axios defaults updated with token
6. Protected routes become accessible

## Notes
- All dates are stored as ISO 8601 strings (UTC)
- Prices are in Algerian Dinars (DA)
- Frontend handles timezone conversion for display
- Fallback data ensures UI works even if API is temporarily unavailable
- All API responses follow the same structure for consistency

# TABIB DZ - Production-Ready Medical Platform Architecture

## Platform Overview
**Tabib DZ** is an advanced medical appointment and clinic management platform designed for the Algerian healthcare ecosystem, supporting 4 user roles with intelligent queue management, automated waiting list system, and multi-channel notifications.

---

## ✅ COMPLETED FEATURES

### 1. **Internationalization (i18n) System**
- ✅ Full Arabic (RTL), French, English support
- ✅ Dynamic language switching
- ✅ RTL/LTR layout support
- ✅ localStorage language persistence
- 📁 Location: `frontend/src/i18n/i18n.js`, `useRTL.js`

### 2. **Queue Management System**
**Models**: Enhanced Queue with real-time tracking
- Queue number assignment (1-based)
- Priority levels (normal, urgent, VIP)
- Position tracking with estimated wait times
- Patient call history and service metrics
- Daily queue status (open, paused, closed)

**Services** (`queueService.js`):
- `joinQueue()` - Patient joins queue
- `getQueueStatus()` - Real-time position and wait time
- `callNextPatient()` - Doctor calls next patient
- `markAsServed()` - Track actual service time
- `getQueueAnalytics()` - Performance metrics

**Controllers & Routes** (`/api/queues`):
- `POST /join` - Patient joins queue
- `GET /status/:doctorId` - Get queue position
- `GET /clinic/:clinicId` - View full queue (doctor/admin)
- `POST /call-next` - Call next patient
- `POST /mark-served` - Mark patient served
- `GET /analytics/:doctorId` - Queue performance

### 3. **Intelligent Waiting List System**
**Models**: Advanced WaitingList with auto-offer logic
- Patient waiting list management
- Preferred date/time preferences
- Automatic slot offer when available
- 30-day expiry with TTL index
- Multi-channel notification tracking
- Priority (normal/urgent)
- Status: active, offered, booked, expired, cancelled

**Services** (`waitingListService.js`):
- `addToWaitingList()` - Register for waiting list
- `getWaitingListByDoctor()` - View waiting patients
- `checkAndOfferSlots()` - Auto-match slots
- `acceptOffer()` - Patient accepts offered slot
- `declineOffer()` - Patient declines offer
- `getPatientWaitingList()` - Patient's waiting lists
- `getStatistics()` - Waiting list metrics

**Controllers & Routes** (`/api/waiting-list`):
- `POST /` - Add to waiting list
- `GET /my-list` - Patient's waiting lists
- `GET /doctor/:doctorId` - Doctor's waiting patients
- `POST /check-and-offer` - Trigger auto-offer
- `POST /:waitingListId/accept` - Accept offer
- `POST /:waitingListId/decline` - Decline offer
- `GET /stats/:doctorId` - Waiting list statistics

### 4. **Multi-Channel Notification System**
**Service** (`notificationService.js`):
- Email notifications (Gmail SMTP)
- SMS notifications (Twilio)
- WhatsApp notifications (Twilio)

**Pre-built Notification Types**:
- Appointment confirmation
- Appointment reminders (24h, 2h, 30min)
- Queue position updates
- Appointment cancellation
- Waiting list offers

### 5. **Frontend Components**
- ✅ `LanguageSwitcher.jsx` - Multi-language support UI
- ✅ `QueueTracker.jsx` - Real-time queue status display
- ✅ Multi-language support for Home, Search, Dashboard pages
- ✅ RTL CSS support throughout

### 6. **Enhanced Data Models**
- Queue model with real-time methods
- WaitingList model with intelligent scheduling
- Enhanced relationships and indexing

---

## 🚧 IN-PROGRESS / PLANNED FEATURES

### 1. **Prescription & Medical Records System**
**Planned Models**:
- Prescription (doctor creates, patient downloads)
- MedicalRecord (visit history, diagnoses)
- MedicalDocument (lab results, scans)
- PrescriptionTemplate (doctor templates)

**Planned Features**:
- Electronic prescriptions with QR verification
- PDF export/print
- Medical history by patient
- Doctor access to patient records
- Document management

### 2. **Teleconsultation System**
**Planned Features**:
- Built-in video/audio call
- Chat during consultation
- File sharing
- Screen recording
- Post-call prescription generation
- Integration with Jitsi or Daily.co

### 3. **Clinic Management**
**Planned Features**:
- Multiple doctors per clinic
- Shared calendar
- Shared reception queue
- Clinic analytics
- Staff management
- Clinic availability settings

### 4. **Advanced Reviews & Ratings**
**Planned Features**:
- Patient reviews and ratings
- Photo uploads in reviews
- Verified purchase badge
- Helpful votes
- Doctor response to reviews
- Review moderation

### 5. **Real-time Updates (Socket.io)**
**Planned Integrations**:
- Queue position updates (live)
- Waiting list offers (instant)
- Doctor/patient chat
- Notification delivery confirmation
- Live doctor availability

### 6. **Enhanced Admin Dashboard**
**Planned Analytics**:
- Platform statistics
- User growth metrics
- Revenue analytics
- Doctor performance
- Appointment trends
- Geographic heatmaps

### 7. **Deployment Ready**
**Planned**:
- Docker containerization
- Docker Compose (backend, frontend, mongo, redis)
- Nginx reverse proxy
- SSL/TLS configuration
- Environment variable management
- Production deployment guide

---

## ARCHITECTURE OVERVIEW

### Backend Stack
```
Express.js Server
├── Auth Routes (/api/auth)
├── Doctors (/api/doctors)
├── Appointments (/api/appointments)
├── Queues (/api/queues) ✅
├── Waiting List (/api/waiting-list) ✅
├── Prescriptions (/api/prescriptions)
├── Medical Records (/api/medical-records)
├── Notifications (/api/notifications) ✅
├── Reviews (/api/reviews)
├── Admin (/api/admin)
└── Socket.io (Real-time)

Services Layer
├── AuthService
├── DoctorService
├── AppointmentService
├── QueueService ✅
├── WaitingListService ✅
├── NotificationService ✅
├── PrescriptionService
├── MedicalRecordService
├── ReviewService
└── ClinicService

MongoDB Collections
├── users
├── doctors
├── patients
├── clinics
├── appointments
├── queues ✅
├── waiting_lists ✅
├── prescriptions
├── medical_records
├── reviews
├── specialties
├── wilayas
└── notifications
```

### Frontend Stack
```
React + Vite
├── Pages
│   ├── Home ✅
│   ├── Login ✅
│   ├── Register ✅
│   ├── SearchDoctors ✅
│   ├── DoctorProfile ✅
│   ├── Booking ✅
│   ├── PatientDashboard ✅
│   ├── DoctorDashboard ✅
│   ├── AdminDashboard ✅
│   ├── QueueDisplay
│   └── Teleconsultation
│
├── Components
│   ├── LanguageSwitcher ✅
│   ├── QueueTracker ✅
│   ├── NotificationCenter
│   ├── PrescriptionViewer
│   └── TeleconsultationWidget
│
├── Contexts
│   ├── AuthContext ✅
│   └── NotificationContext
│
├── i18n ✅
│   ├── i18n.js
│   └── useRTL.js
│
└── API
    └── apiClient.js ✅
```

---

## USER ROLES & PERMISSIONS

### 1. **Patient**
✅ Implemented:
- Register/Login
- Profile management
- Search doctors
- Book appointments
- Cancel/reschedule appointments
- View appointment history

Planned:
- Join waiting list
- Receive queue updates
- Access medical records
- Download prescriptions
- Teleconsultation
- Rate doctors
- WhatsApp doctor contact

### 2. **Doctor**
✅ Implemented:
- Manage profile
- View appointments
- Accept/reject appointments

Planned:
- Manage queue
- Create prescriptions
- Access patient medical history
- Schedule availability
- View analytics
- Manage clinic

### 3. **Clinic Manager**
Planned:
- Manage multiple doctors
- Shared calendar
- Shared queue
- Revenue reports
- Staff management

### 4. **Admin**
✅ Implemented:
- View dashboard
- Manage doctors (verify/reject)
- View statistics

Planned:
- Manage specialties
- Manage wilayas
- Platform analytics
- Revenue management
- User moderation

---

## KEY FEATURES IMPLEMENTED

### ✅ Authentication
- JWT-based authentication
- Role-based access control (RBAC)
- Refresh tokens
- Middleware protection

### ✅ Data Models
- Comprehensive MongoDB schemas
- Proper relationships and references
- Indexing for performance
- Validation rules

### ✅ API Design
- RESTful endpoints
- Error handling
- Request validation
- Pagination support

### ✅ Frontend
- Responsive design
- Multi-language support
- RTL support
- Component-based architecture

### ✅ Real-time Features
- Queue position tracking
- Live updates (planned: Socket.io)
- Instant notifications

---

## TECHNOLOGY STACK

**Backend**:
- Node.js + Express.js
- MongoDB + Mongoose
- JWT + bcrypt
- Nodemailer (Email)
- Twilio (SMS/WhatsApp)
- Helmet, XSS-clean, Mongo-sanitize
- Rate Limiter, Morgan

**Frontend**:
- React 18+ + Vite
- React Router
- React Query
- Axios
- Tailwind CSS
- i18next (i18n)

**Infrastructure** (Planned):
- Docker + Docker Compose
- Nginx
- MongoDB Atlas/Self-hosted
- Redis (Sessions/Cache)

---

## API ENDPOINTS

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/forgot-password
```

### Doctors
```
GET /api/doctors
GET /api/doctors/:id
GET /api/doctors/top
POST /api/doctors/request
PUT /api/doctors/:id
```

### Appointments
```
GET /api/appointments
POST /api/appointments
PUT /api/appointments/:id/status
PUT /api/appointments/:id/reschedule
```

### Queues ✅
```
POST /api/queues/join
GET /api/queues/status/:doctorId
GET /api/queues/clinic/:clinicId
POST /api/queues/call-next
POST /api/queues/mark-served
GET /api/queues/analytics/:doctorId
```

### Waiting List ✅
```
POST /api/waiting-list
GET /api/waiting-list/my-list
GET /api/waiting-list/doctor/:doctorId
POST /api/waiting-list/check-and-offer
POST /api/waiting-list/:waitingListId/accept
POST /api/waiting-list/:waitingListId/decline
GET /api/waiting-list/stats/:doctorId
```

### Specialties & Wilayas
```
GET /api/specialties
GET /api/wilayas
```

### Admin
```
GET /api/admin/dashboard
GET /api/admin/statistics
GET /api/admin/doctors/pending
```

---

## NEXT STEPS TO PRODUCTIONIZE

1. **Complete Prescription System**
   - Create Prescription controller/routes
   - PDF generation (pdfkit)
   - QR code generation

2. **Complete Teleconsultation**
   - Integrate Jitsi or Daily.co
   - Video call component
   - Call recording

3. **Add Socket.io**
   - Real-time queue updates
   - Instant notifications
   - Live chat

4. **Docker Setup**
   - Create Dockerfile for backend/frontend
   - Docker Compose file
   - Environment configuration

5. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Cypress)

6. **Documentation**
   - API documentation (Swagger)
   - Deployment guide
   - User manual

7. **Optimization**
   - Database indexing audit
   - Caching strategy
   - Image optimization
   - Code splitting

8. **Security**
   - Penetration testing
   - Dependency audit
   - Rate limiting review
   - GDPR compliance

---

## DEPLOYMENT CHECKLIST

- [ ] Environment variables configured
- [ ] Database migrations complete
- [ ] Backup strategy implemented
- [ ] SSL/TLS certificates installed
- [ ] CDN configured (for images)
- [ ] Error logging (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Security headers configured
- [ ] CORS policies reviewed
- [ ] Rate limiting tested
- [ ] Backup and restore tested

---

## PERFORMANCE TARGETS

- Page load time: < 2s
- API response time: < 200ms
- Database query time: < 100ms
- Queue update frequency: < 5s
- Mobile optimization: Lighthouse > 90
- Accessibility: WCAG AA compliant

---

**Last Updated**: 2026-06-15
**Status**: MVP with Queue & Waiting List Systems Complete
**Next Phase**: Teleconsultation + Prescriptions + Socket.io

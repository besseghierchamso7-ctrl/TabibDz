# 🏗️ System Architecture & Data Flow

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    MEDICAL PLATFORM                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐            ┌──────────────────────┐   │
│  │   FRONTEND       │            │   BACKEND            │   │
│  │   (React/Vite)   │◄──────────►│   (Express/Node)     │   │
│  ├──────────────────┤            ├──────────────────────┤   │
│  │ • Register       │   HTTPS    │ • Auth Service       │   │
│  │ • Login          │   REST API │ • Doctor Service     │   │
│  │ • Search         │            │ • Appointment Svc    │   │
│  │ • Booking        │            │ • Admin Service      │   │
│  │ • Dashboard      │            └──────────────────────┘   │
│  └──────────────────┘            ┌──────────────────────┐   │
│                                  │   MongoDB            │   │
│                                  │   Database           │   │
│                                  ├──────────────────────┤   │
│                                  │ • Users              │   │
│                                  │ • Doctors            │   │
│                                  │ • Patients           │   │
│                                  │ • Appointments       │   │
│                                  │ • Specialties        │   │
│                                  │ • Wilayas            │   │
│                                  └──────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
┌──────────────┐
│   User       │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│   Login Page         │
│  (email/password)    │
└──────┬───────────────┘
       │
       ▼
   POST /auth/login
       │
       ▼
┌──────────────────────────────┐
│   Backend Auth Service       │
│  • Verify credentials        │
│  • Generate JWT              │
│  • Generate Refresh Token    │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Response with Token        │
│  • token (JWT)               │
│  • user (User Object)        │
│  • refreshToken              │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   AuthContext                │
│  • Store token in localStorage
│  • Store user in state       │
│  • Update axios headers      │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Protected Routes Active    │
│  • Booking                   │
│  • Dashboard                 │
└──────────────────────────────┘
```

---

## Doctor Search Flow

```
┌──────────────────────┐
│   User               │
│  (Authenticated)     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│   Search Page        │
│  (Load Doctors)      │
└──────┬───────────────┘
       │
       ├────────────────────────────┐
       │                            │
       ▼                            ▼
   GET /doctors              GET /admin/specialties
       │                            │
       ▼                            ▼
┌──────────────────┐      ┌──────────────────┐
│ Doctor List      │      │ Specialty List   │
│ • All Doctors    │      │ • Cardiologie    │
│ • Full Details   │      │ • Pédiatrie      │
└──────┬───────────┘      │ • etc            │
       │                  └──────────────────┘
       ▼
┌──────────────────────────┐
│   Apply Filters          │
│  • Filter by Wilaya      │
│  • Filter by Specialty   │
│  • Filter by Gender      │
│  (Client-side filtering) │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────┐
│   Display Results    │
│  • Doctor Cards      │
│  • Name              │
│  • Specialty         │
│  • Rating            │
│  • Price             │
└──────────────────────┘
```

---

## Doctor Profile Flow

```
┌──────────────────┐
│   Doctor Card    │
│  (Search Page)   │
└──────┬───────────┘
       │
       ▼ (Click "View Profile")
┌──────────────────────────┐
│   Profile Page           │
│   (Load Details)         │
└──────┬───────────────────┘
       │
       ▼
   GET /doctors/:id
       │
       ▼
┌──────────────────────────────┐
│   Backend Doctor Controller  │
│  • Fetch Doctor with refs    │
│  • Populate relationships    │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Response                   │
│  • user (Name, Bio, etc)     │
│  • specialty (Name)          │
│  • wilaya (Name)             │
│  • consultationPrice         │
│  • availability              │
│  • degrees                   │
│  • languages                 │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Display Full Profile       │
│  • Header                    │
│  • About Section             │
│  • Qualifications            │
│  • Availability              │
│  • Pricing Card              │
│  • Book Button               │
└──────────────────────────────┘
```

---

## Appointment Booking Flow

```
┌──────────────────┐
│   User           │
│  (On Profile)    │
└──────┬───────────┘
       │
       ▼ (Click "Book")
┌──────────────────────┐
│   Booking Page       │
│  • Show Doctor Info  │
│  • Form              │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────┐
│   Fill Form              │
│  • Select Date           │
│  • Select Time           │
│  • Enter Reason          │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│   Validate              │
│  • User Authenticated?   │
│  • All Fields Filled?    │
└──────┬───────────────────┘
       │
       ▼ (Submit)
   POST /appointments
       │
       ▼
┌──────────────────────────────────┐
│   Backend Appointment Service    │
│  • Get Patient from req.user     │
│  • Validate Doctor Available     │
│  • Check Slot Not Booked         │
│  • Create Appointment            │
│  • Send Notification             │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────┐
│   Response (201)         │
│  • appointmentId         │
│  • status: 'pending'     │
│  • scheduledAt           │
│  • price                 │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│   Success Alert          │
│  • Show Confirmation     │
│  • Redirect to Dashboard │
└──────────────────────────┘
```

---

## Patient Dashboard Flow

```
┌──────────────────┐
│   User           │
│  (Authenticated) │
└──────┬───────────┘
       │
       ▼ (Navigate to /dashboard/patient)
┌──────────────────────────┐
│   Dashboard Page         │
│  (Load Appointments)     │
└──────┬───────────────────┘
       │
       ▼
   GET /appointments (with Bearer token)
       │
       ▼
┌──────────────────────────────┐
│   Backend Appointment Service│
│  • Filter by Patient ID      │
│  • Populate Doctor Refs      │
│  • Sort by Date              │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Response                   │
│  • Array of Appointments     │
│  • Each with:                │
│    - doctor (populated)      │
│    - patient (populated)     │
│    - scheduledAt             │
│    - status                  │
│    - reason                  │
│    - price                   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Display Dashboard          │
│  • Statistics Cards          │
│    - Total Appointments      │
│    - Confirmed               │
│    - Pending                 │
│    - Doctor Count            │
│  • Appointments List         │
│    - Doctor Name             │
│    - Specialty               │
│    - Date/Time               │
│    - Status Badge            │
└──────────────────────────────┘
```

---

## Data Model Relationships

```
┌──────────────┐
│    User      │
├──────────────┤
│ _id          │
│ email        │◄──┐
│ password     │   │
│ role         │   │
│ firstName    │   │
│ lastName     │   │
└──────────────┘   │
     △   △         │
     │   │         │
     │   └─────┐   │
     │         │   │
     │   ┌──────────────┐
     │   │   Doctor     │
     │   ├──────────────┤
     │   │ _id          │
     │   │ user ────────┼───┐
     │   │ specialty ──┐│   │
     │   │ wilaya ────┐││   │
     │   │ price      │││   │
     │   │ rating     │││   │
     │   └──────────┬───────┘
     │              │││
     └──────────┬───┘││
                    ││
     ┌──────────────────┐    ┌──────────────┐
     │   Specialty      │    │   Wilaya     │
     ├──────────────────┤    ├──────────────┤
     │ _id              │    │ _id          │
     │ name             │    │ name         │
     │                  │    │              │
     └──────────────────┘    └──────────────┘


     ┌──────────────┐
     │   Patient    │
     ├──────────────┤
     │ _id          │
     │ user ────────┼───┐
     │ dateOfBirth  │   │
     │ gender       │   │
     │ bloodType    │   │
     └──────────────┘   │
           △            │
           │            │
     ┌─────────────────────────┐
     │   Appointment           │
     ├─────────────────────────┤
     │ _id                     │
     │ patient ────────────────┼─┘
     │ doctor ─────────────┐   │
     │ scheduledAt         │   │
     │ reason              │   │
     │ price               │   │
     │ status              │   │
     └─────────────────────┼───┘
                           │
                           └─── Doctor._id
```

---

## Request/Response Cycle

```
┌─────────────────────────────────────────────────────────────┐
│  REQUEST                                   RESPONSE           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐           ┌──────────────────┐   │
│  │ Frontend Component   │           │  Response Data   │   │
│  │  (Booking.jsx)       │           │  (JSON)          │   │
│  └──────┬───────────────┘           └──────────────────┘   │
│         │                                   △               │
│         │                                   │               │
│         ▼                                   │               │
│  ┌──────────────────────────┐              │               │
│  │  Axios HTTP Request      │              │               │
│  │  • Method: POST          │              │               │
│  │  • URL: /api/appointments               │               │
│  │  • Headers:              │              │               │
│  │    - Authorization       │              │               │
│  │    - Content-Type: JSON  │              │               │
│  │  • Body: JSON            │              │               │
│  └──────┬───────────────────┘              │               │
│         │                                   │               │
│         ├─────────────────────────────────►│               │
│         │      HTTP Transmission            │               │
│         │                                   │               │
│         │     ┌────────────────────────┐   │               │
│         │     │   Backend Receives     │   │               │
│         │     │  • Parse Headers       │   │               │
│         │     │  • Verify Token        │   │               │
│         │     │  • Parse JSON Body     │   │               │
│         │     └──────┬─────────────────┘   │               │
│         │            │                      │               │
│         │            ▼                      │               │
│         │     ┌────────────────────────┐   │               │
│         │     │  Route Handler         │   │               │
│         │     │  (appointmentRoutes)   │   │               │
│         │     └──────┬─────────────────┘   │               │
│         │            │                      │               │
│         │            ▼                      │               │
│         │     ┌────────────────────────┐   │               │
│         │     │  Controller            │   │               │
│         │     │  (createAppointment)   │   │               │
│         │     └──────┬─────────────────┘   │               │
│         │            │                      │               │
│         │            ▼                      │               │
│         │     ┌────────────────────────┐   │               │
│         │     │  Service Layer         │   │               │
│         │     │  (bookAppointment)     │   │               │
│         │     │  • Validation          │   │               │
│         │     │  • Database Query      │   │               │
│         │     └──────┬─────────────────┘   │               │
│         │            │                      │               │
│         │            ▼                      │               │
│         │     ┌────────────────────────┐   │               │
│         │     │  MongoDB               │   │               │
│         │     │  • Insert Document     │   │               │
│         │     └──────┬─────────────────┘   │               │
│         │            │                      │               │
│         │            └──────────────────────┤──►            │
│         │                                   │               │
│         │                            Appointment Created    │
│         │                                   │               │
│         └◄──────────────────────────────────┤               │
│         │   HTTP 201 with Appointment Data  │               │
│         │                                   │               │
│         ▼                                   │               │
│  ┌──────────────────────────┐              │               │
│  │  Frontend Receives       │              │               │
│  │  • Status: 201           │              │               │
│  │  • Data: Appointment     │              │               │
│  └──────┬───────────────────┘              │               │
│         │                                   │               │
│         ▼                                   │               │
│  ┌──────────────────────────┐              │               │
│  │  Update Component State  │              │               │
│  │  • Show Success Message  │              │               │
│  │  • Redirect to Dashboard │              │               │
│  └──────────────────────────┘              │               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema Structure

```
USERS COLLECTION
├── _id: ObjectId
├── email: String (unique)
├── password: String (hashed)
├── role: Enum ['patient', 'doctor', 'admin']
├── firstName: String
├── lastName: String
├── phone: String
├── avatar: String (URL)
├── createdAt: Date
└── updatedAt: Date

DOCTORS COLLECTION
├── _id: ObjectId
├── user: ObjectId (ref: Users)
├── specialty: ObjectId (ref: Specialties)
├── wilaya: ObjectId (ref: Wilayas)
├── consultationPrice: Number
├── experience: String
├── rating: Number (default: 0)
├── reviews: Number (default: 0)
├── status: Enum ['pending', 'verified', 'rejected']
├── availability: Object
│   ├── days: Array
│   └── hours: String
├── languages: Array
├── degrees: Array
├── consultationType: Array
├── insurance: String
├── createdAt: Date
└── updatedAt: Date

PATIENTS COLLECTION
├── _id: ObjectId
├── user: ObjectId (ref: Users)
├── dateOfBirth: Date
├── gender: Enum ['male', 'female']
├── bloodType: String
├── medicalHistory: Array
├── createdAt: Date
└── updatedAt: Date

APPOINTMENTS COLLECTION
├── _id: ObjectId
├── patient: ObjectId (ref: Patients)
├── doctor: ObjectId (ref: Doctors)
├── scheduledAt: Date
├── reason: String
├── price: Number
├── status: Enum ['pending', 'confirmed', 'cancelled']
├── notes: String
├── createdAt: Date
├── createdBy: ObjectId (ref: Users)
└── updatedAt: Date

SPECIALTIES COLLECTION
├── _id: ObjectId
├── name: String (unique)
└── createdAt: Date

WILAYAS COLLECTION
├── _id: ObjectId
├── name: String (unique)
└── createdAt: Date
```

---

## Component Hierarchy

```
App.jsx
├── AuthProvider
│   ├── Routes
│   │   ├── PublicRoute
│   │   │   ├── HomePage
│   │   │   ├── RegisterPage
│   │   │   ├── LoginPage
│   │   │   ├── SearchDoctorsPage
│   │   │   └── DoctorProfilePage
│   │   │       └── BookingLink
│   │   │
│   │   ├── ProtectedRoute
│   │   │   ├── BookingPage
│   │   │   │   └── Form
│   │   │   │       ├── DateInput
│   │   │   │       ├── TimeSelect
│   │   │   │       └── ReasonTextarea
│   │   │   │
│   │   │   └── PatientDashboardPage
│   │   │       ├── StatisticsCards
│   │   │       └── AppointmentsList
│   │   │           └── AppointmentItem
│   │   │
│   │   └── AdminRoute
│   │       └── AdminDashboardPage
│   │
│   └── AuthContext
│       ├── State
│       │   ├── user
│       │   ├── token
│       │   ├── loading
│       │   └── error
│       │
│       └── Methods
│           ├── register()
│           ├── login()
│           ├── logout()
│           └── refreshToken()
```

---

## API Authentication Flow

```
┌─────────────────────────────────────────┐
│   Frontend (Axios)                      │
└────────────────┬────────────────────────┘
                 │
                 ├─ Check localStorage for token
                 │
                 ├─ If exists, set header:
                 │  Authorization: Bearer <token>
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Backend (Express Middleware)          │
├─────────────────────────────────────────┤
│  app.use(cors())                        │
│  app.use(express.json())                │
│  app.use('/api/auth', authRoutes)       │
│  app.use('/api/doctors', doctorRoutes)  │
│  app.use('/api/appointments',           │
│          appointmentRoutes)             │
│  app.use(errorHandler)                  │
└────────────────┬────────────────────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │ Route Handler        │
      │ (Specific Endpoint)  │
      └──────────┬───────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
   ┌──────────────┐  ┌──────────────┐
   │ Public Route │  │ Protected    │
   │              │  │ Route        │
   │ No Auth      │  │              │
   │ Required     │  │ apply:       │
   │              │  │ protect()    │
   │              │  │ authorize()  │
   └──────────────┘  └──────┬───────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │ Verify JWT Token │
                  │ Extract User ID  │
                  │ Attach to req    │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Check Permissions│
                  │ (Role/Authorize) │
                  └────────┬─────────┘
                           │
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
              ┌─────────┐    ┌──────────┐
              │ Granted │    │ Denied   │
              │         │    │ (403)    │
              │ next()  │    │          │
              └─────────┘    └──────────┘
```

---

**This comprehensive architecture ensures:**
✅ Secure authentication and authorization
✅ Clean separation of concerns
✅ Scalable component structure
✅ Efficient data flow
✅ Proper error handling
✅ Responsive UI/UX

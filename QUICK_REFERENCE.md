# ⚡ Quick Reference - Medical Platform

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
npm start
```
Backend runs on: `http://localhost:5000`

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 🔗 API Quick Reference

### Authentication
```
POST   /api/auth/register    - Create account
POST   /api/auth/login       - Login with email/password
GET    /api/auth/me          - Get current user (protected)
```

### Doctors
```
GET    /api/doctors          - List all doctors
GET    /api/doctors/:id      - Get doctor details
GET    /api/doctors/top      - Get top-rated doctors
```

### Appointments
```
POST   /api/appointments     - Book appointment (protected)
GET    /api/appointments     - Get user's appointments (protected)
PUT    /api/appointments/:id/status     - Change status (doctor/admin)
PUT    /api/appointments/:id/reschedule - Reschedule (patient/doctor)
```

### Reference Data
```
GET    /api/admin/specialties  - Get medical specialties
GET    /api/admin/wilayas      - Get regions
```

---

## 📋 Frontend Routes

| Route | Purpose | Auth Required |
|-------|---------|---|
| `/` | Home page | No |
| `/register` | Create account | No |
| `/login` | Login | No |
| `/doctors/search` | Search doctors | No |
| `/doctors/:id` | Doctor profile | No |
| `/booking/:doctorId` | Book appointment | Yes |
| `/dashboard/patient` | View appointments | Yes |
| `/logout` | Logout | Yes |

---

## 📝 Key File Locations

### Frontend
- **Auth**: `frontend/src/contexts/AuthContext.jsx`
- **API Client**: `frontend/src/api/apiClient.js`
- **Doctor Search**: `frontend/src/pages/SearchDoctors.jsx`
- **Doctor Profile**: `frontend/src/pages/DoctorProfile.jsx`
- **Booking**: `frontend/src/pages/Booking.jsx`
- **Dashboard**: `frontend/src/pages/PatientDashboard.jsx`

### Backend
- **Auth Routes**: `backend/routes/authRoutes.js`
- **Doctor Routes**: `backend/routes/doctorRoutes.js`
- **Appointment Routes**: `backend/routes/appointmentRoutes.js`
- **Auth Middleware**: `backend/middleware/authMiddleware.js`

---

## 🔑 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/medical-platform
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 🎯 Core User Flow

```
1. Register/Login
   ↓
2. View Doctor List
   ↓
3. Apply Filters
   ↓
4. View Doctor Profile
   ↓
5. Book Appointment
   ↓
6. View Dashboard
```

---

## 📊 Data Models

### User
- email, password, role (patient/doctor)
- firstName, lastName, phone
- avatar, createdAt

### Doctor
- user (reference), specialty, wilaya
- consultationPrice, experience
- rating, reviews, status

### Patient
- user (reference), dateOfBirth
- gender, bloodType, medicalHistory

### Appointment
- patient, doctor, scheduledAt
- reason, price, status
- createdAt, createdBy

---

## 🧪 Quick Test

### Test Login Flow
1. Go to `http://localhost:5173/login`
2. Enter: `patient@example.com` / `password123`
3. Should redirect to dashboard

### Test Doctor Search
1. Go to `http://localhost:5173/doctors/search`
2. Filter by specialty or region
3. Click doctor to view profile

### Test Booking
1. Go to doctor profile
2. Click "Book Appointment"
3. Fill date, time, reason
4. Submit
5. Check dashboard

---

## 🐛 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Invalid token | Login again |
| Cannot GET /api/doctors | Backend not running | Start backend server |
| CORS error | Wrong API URL | Check VITE_API_URL |
| Doctor data missing | Field name mismatch | Check response structure |
| Appointment not saving | Patient profile missing | Create patient profile |

---

## 📱 Browser DevTools Checks

### Network Tab
- Check API requests are successful (200, 201 status)
- Verify request includes Authorization header
- Check response data structure

### Application Tab
- Check localStorage has `token` key
- Token should be valid JWT

### Console
- Should be no errors (some warnings OK)
- Check API errors logged

---

## ✅ Pre-Deployment Checklist

- [ ] All files have no syntax errors
- [ ] Backend and frontend running
- [ ] Login/Register working
- [ ] Doctor search displays data
- [ ] Booking creates appointments
- [ ] Dashboard shows appointments
- [ ] No console errors
- [ ] Responsive on mobile/tablet
- [ ] All buttons functional
- [ ] Error messages display

---

## 🎯 Features Status

| Feature | Status |
|---------|--------|
| User Authentication | ✅ Complete |
| Doctor Search | ✅ Complete |
| Doctor Filtering | ✅ Complete |
| Doctor Profile | ✅ Complete |
| Appointment Booking | ✅ Complete |
| Patient Dashboard | ✅ Complete |
| API Integration | ✅ Complete |
| Error Handling | ✅ Complete |
| Responsive Design | ✅ Complete |

---

## 📚 Documentation Files

- `API_INTEGRATION_GUIDE.md` - Full API documentation
- `TESTING_GUIDE.md` - Step-by-step testing procedures
- `FEATURES_COMPLETED.md` - Complete feature summary
- `QUICK_REFERENCE.md` - This file

---

## 🔄 Authentication Flow

```
User Enters Credentials
    ↓
POST /api/auth/login
    ↓
Backend Returns: token, refreshToken, user
    ↓
Frontend Stores token in localStorage
    ↓
Frontend Updates Axios headers with token
    ↓
Axios includes "Authorization: Bearer <token>" on all requests
    ↓
Protected Routes Accessible
```

---

## 💾 Database Seeding

For testing, you need sample data:

```javascript
// Sample Doctor
{
  user: userId,
  specialty: specialtyId,
  wilaya: wilayaId,
  consultationPrice: 4500,
  experience: "12 ans",
  rating: 4.9,
  reviews: 127,
  status: "verified"
}

// Sample Patient
{
  user: userId,
  dateOfBirth: "1990-01-15",
  gender: "male",
  bloodType: "O+"
}
```

---

## 🎨 Frontend Architecture

```
App.jsx
├── AuthProvider
│   ├── Routes
│   │   ├── PublicRoutes
│   │   │   ├── Register
│   │   │   ├── Login
│   │   │   ├── SearchDoctors
│   │   │   └── DoctorProfile
│   │   └── ProtectedRoutes
│   │       ├── Booking
│   │       └── PatientDashboard
│   └── AuthContext
│       └── User State, Token, Login/Logout
```

---

## 🔌 API Response Examples

### Get Doctors
```json
[
  {
    "_id": "123",
    "user": {
      "firstName": "Yasmine",
      "lastName": "Ben Fatima"
    },
    "specialty": { "name": "Cardiologie" },
    "wilaya": { "name": "Alger" },
    "consultationPrice": 4500,
    "rating": 4.9,
    "experience": "12 ans"
  }
]
```

### Book Appointment
```json
{
  "_id": "apt-123",
  "patient": { ... },
  "doctor": { ... },
  "scheduledAt": "2026-06-14T11:00:00Z",
  "status": "pending",
  "price": 4500
}
```

---

## ⚙️ Configuration

### Axios Client
```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});
```

### Auth Middleware (Backend)
```javascript
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;
  next();
};
```

---

## 📞 Support

For detailed information:
1. Check `API_INTEGRATION_GUIDE.md` for endpoint details
2. Check `TESTING_GUIDE.md` for testing procedures
3. Check browser console for error messages
4. Check backend server logs for API errors

---

**Everything is ready to go! Start both servers and begin testing.** 🚀

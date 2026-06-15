# TABIB DZ API - Testing Guide

## Queue Management API Tests

### 1. Patient Joins Queue
```bash
curl -X POST http://localhost:5000/api/queues/join \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <PATIENT_TOKEN>" \
  -d '{
    "doctorId": "doctor_id_here",
    "appointmentId": "appointment_id_here"
  }'

# Expected Response:
{
  "success": true,
  "queueNumber": 1,
  "position": 5,
  "estimatedWaitTime": 60,
  "queue": { ... }
}
```

### 2. Get Queue Status
```bash
curl -X GET http://localhost:5000/api/queues/status/doctor_id_here \
  -H "Authorization: Bearer <PATIENT_TOKEN>"

# Expected Response:
{
  "position": 5,
  "queueNumber": 1,
  "estimatedWaitTime": 60,
  "totalInQueue": 8,
  "patientsAhead": 4,
  "status": "waiting"
}
```

### 3. Doctor Calls Next Patient
```bash
curl -X POST http://localhost:5000/api/queues/call-next \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <DOCTOR_TOKEN>" \
  -d '{
    "doctorId": "doctor_id_here",
    "clinicId": "clinic_id_here"
  }'

# Expected Response:
{
  "success": true,
  "calledPatient": {
    "patientId": "...",
    "queueNumber": 1,
    "status": "called"
  },
  "nextInQueue": { ... }
}
```

### 4. Mark Patient as Served
```bash
curl -X POST http://localhost:5000/api/queues/mark-served \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <DOCTOR_TOKEN>" \
  -d '{
    "doctorId": "doctor_id_here",
    "clinicId": "clinic_id_here",
    "queueEntryId": "entry_id_here",
    "actualWaitTime": 45
  }'

# Expected Response:
{
  "success": true,
  "message": "Patient marked as served",
  "actualWaitTime": 45,
  "totalServed": 25
}
```

### 5. Get Queue Analytics
```bash
curl -X GET "http://localhost:5000/api/queues/analytics/doctor_id_here?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer <DOCTOR_TOKEN>"

# Expected Response:
{
  "totalServed": 150,
  "totalNoShow": 12,
  "totalSkipped": 5,
  "averageWaitTime": 38.5,
  "peakHours": ["10:00", "14:30"],
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-12-31"
  }
}
```

---

## Waiting List API Tests

### 1. Patient Joins Waiting List
```bash
curl -X POST http://localhost:5000/api/waiting-list \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <PATIENT_TOKEN>" \
  -d '{
    "doctorId": "doctor_id_here",
    "reason": "Follow-up consultation",
    "preferredDates": ["2024-02-10", "2024-02-11"],
    "preferredTimes": ["09:00", "14:00"],
    "priority": "normal",
    "notificationChannels": ["email", "sms", "whatsapp"]
  }'

# Expected Response:
{
  "success": true,
  "waitingListEntry": {
    "id": "entry_id",
    "patientId": "...",
    "doctorId": "...",
    "position": 3,
    "status": "active",
    "expiresAt": "2024-03-10T10:30:00Z"
  }
}
```

### 2. Get Patient's Waiting Lists
```bash
curl -X GET http://localhost:5000/api/waiting-list/my-list \
  -H "Authorization: Bearer <PATIENT_TOKEN>"

# Expected Response:
[
  {
    "id": "entry_id",
    "doctor": { "firstName": "أحمد", "lastName": "خليل" },
    "specialty": "Cardiology",
    "status": "active",
    "requestedAt": "2024-02-01T10:30:00Z",
    "expiresAt": "2024-03-01T10:30:00Z"
  }
]
```

### 3. Doctor Triggers Auto-Offer
```bash
curl -X POST http://localhost:5000/api/waiting-list/check-and-offer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <DOCTOR_TOKEN>" \
  -d '{
    "doctorId": "doctor_id_here",
    "clinicId": "clinic_id_here"
  }'

# Expected Response:
{
  "success": true,
  "offersCreated": 3,
  "matches": [
    {
      "waitingListId": "entry_id",
      "patientId": "patient_id",
      "appointmentId": "appointment_id",
      "offeredSlot": "2024-02-15T10:00:00Z",
      "expiresIn": "24 hours"
    }
  ]
}
```

### 4. Patient Accepts Offer
```bash
curl -X POST http://localhost:5000/api/waiting-list/entry_id_here/accept \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <PATIENT_TOKEN>" \
  -d '{
    "patientId": "patient_id_here"
  }'

# Expected Response:
{
  "success": true,
  "message": "Offer accepted",
  "appointment": {
    "id": "appointment_id",
    "scheduledAt": "2024-02-15T10:00:00Z",
    "doctor": "Dr. Ahmed",
    "status": "confirmed"
  }
}
```

### 5. Get Waiting List Statistics
```bash
curl -X GET http://localhost:5000/api/waiting-list/stats/doctor_id_here \
  -H "Authorization: Bearer <DOCTOR_TOKEN>"

# Expected Response:
{
  "active": 12,
  "offered": 3,
  "booked": 45,
  "expired": 8,
  "cancelled": 2,
  "total": 70,
  "acceptanceRate": 94.7,
  "averageWaitTime": 3.2
}
```

---

## Notification System Tests

### Send Test Email
```javascript
// backend/tests/testNotifications.js
const NotificationService = require('../services/notificationService');

async function testEmail() {
  const result = await NotificationService.sendEmail({
    to: 'patient@example.com',
    subject: 'Test Notification',
    html: '<h1>Hello!</h1>',
    text: 'Hello World'
  });
  console.log('Email result:', result);
}

testEmail().catch(console.error);
```

### Send Appointment Confirmation
```javascript
const NotificationService = require('../services/notificationService');

async function testAppointmentConfirmation() {
  const patient = {
    user: {
      firstName: 'محمد',
      email: 'patient@example.com',
      phone: '+213912345678'
    }
  };

  const doctor = {
    user: {
      firstName: 'أحمد',
      lastName: 'خليل'
    },
    specialty: { name: 'قلب' },
    clinic: { name: 'عيادة الحياة' }
  };

  const appointment = {
    scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  };

  const results = await NotificationService.sendAppointmentConfirmation({
    patient,
    doctor,
    appointment,
    channels: ['email', 'sms', 'whatsapp']
  });

  console.log('Notification results:', results);
}

testAppointmentConfirmation().catch(console.error);
```

---

## Frontend Integration Tests

### Using QueueTracker Component
```jsx
import QueueTracker from './components/QueueTracker';

export default function PatientDashboard() {
  return (
    <div>
      <h1>My Appointment Queue</h1>
      <QueueTracker 
        doctorId="doctor123"
        appointmentId="appointment456"
      />
    </div>
  );
}
```

### Using LanguageSwitcher Component
```jsx
import LanguageSwitcher from './components/LanguageSwitcher';

export default function Header() {
  return (
    <header>
      <h1>TABIB DZ</h1>
      <LanguageSwitcher />
    </header>
  );
}
```

---

## Load Testing

### Queue System Load Test
```bash
# Using Apache Bench - test queue join endpoint
ab -n 1000 -c 100 \
  -H "Authorization: Bearer <TOKEN>" \
  -p queue-data.json \
  -T application/json \
  http://localhost:5000/api/queues/join

# Results should show:
# Requests per second: > 100
# Average time: < 200ms
```

### Waiting List Load Test
```bash
# Test waiting list offer matching with 500 concurrent patients
wrk -t4 -c500 -d30s \
  -s waiting-list-load.lua \
  http://localhost:5000/api/waiting-list/check-and-offer
```

---

## Error Handling Tests

### Test Missing Token
```bash
curl http://localhost:5000/api/queues/status/doctor_id
# Expected: 401 Unauthorized
```

### Test Invalid Role
```bash
# Patient trying to call next (doctor-only endpoint)
curl -X POST http://localhost:5000/api/queues/call-next \
  -H "Authorization: Bearer <PATIENT_TOKEN>"
# Expected: 403 Forbidden
```

### Test Invalid Data
```bash
curl -X POST http://localhost:5000/api/waiting-list \
  -H "Authorization: Bearer <PATIENT_TOKEN>" \
  -d '{}' # Missing required fields
# Expected: 400 Bad Request
```

---

## Performance Monitoring

### Monitor Queue Response Times
```javascript
// Add to backend/middleware/timing.js
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path}: ${duration}ms`);
  });
  next();
});
```

### Monitor Database Queries
```javascript
// Enable Mongoose query logging
mongoose.set('debug', true);
```

---

## Continuous Integration

### Run All Tests
```bash
npm test -- --coverage
```

Expected output:
```
PASS  tests/queue.test.js
  Queue API
    ✓ Patient joins queue
    ✓ Get queue status
    ✓ Call next patient
    ✓ Mark as served

PASS  tests/waitingList.test.js
  Waiting List API
    ✓ Add to waiting list
    ✓ Auto-offer slots
    ✓ Accept offer
    ✓ Decline offer

Coverage: 92% statements, 88% branches
```

---

## Deployment Testing

### Health Check Endpoint
```bash
curl http://localhost:5000/api/health

# Expected Response:
{
  "status": "ok",
  "timestamp": "2024-02-10T10:30:00Z",
  "uptime": 3600,
  "database": "connected"
}
```

### Database Connection Test
```bash
curl http://localhost:5000/api/health/database

# Expected Response:
{
  "database": "connected",
  "latency": 45,
  "collections": 12
}
```

---

**Created**: 2026-06-15
**Last Updated**: Session Complete

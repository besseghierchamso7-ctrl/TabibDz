# Complete Feature Testing Guide

## Pre-Testing Checklist
- [ ] Backend server running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173 (or configured VITE_API_URL)
- [ ] `.env` file configured with `VITE_API_URL`
- [ ] MongoDB database populated with test data
- [ ] Browser DevTools open to check console for errors

## End-to-End Testing Flow

### 1. Authentication Testing

#### 1.1 User Registration
**Steps:**
1. Navigate to `/register`
2. Fill in form:
   - Email: `patient@example.com`
   - Password: `password123`
   - Role: Select "Patient"
3. Submit form
4. Verify redirect to dashboard
5. Check localStorage contains token

**Expected Outcome:**
- User registered successfully
- Token stored in localStorage
- User redirected to PatientDashboard
- Console shows no errors

**Debugging:**
- Check Network tab for POST /auth/register request
- Verify response includes token
- Check browser console for registration errors

#### 1.2 User Login
**Steps:**
1. Navigate to `/login`
2. Enter credentials: `patient@example.com` / `password123`
3. Submit form
4. Verify redirect to dashboard

**Expected Outcome:**
- User logged in successfully
- Token stored in localStorage
- Axios Authorization header set
- User object loaded in AuthContext

**Debugging:**
- Network tab: verify POST /auth/login and GET /auth/me requests
- Check Application tab for localStorage token
- Console should show successful auth

---

### 2. Doctor Search & Listing Testing

#### 2.1 View All Doctors
**Steps:**
1. Navigate to `/doctors/search`
2. Verify page loads without errors
3. Check doctor list displays

**Expected Outcome:**
- Doctor list displays all doctors
- Each doctor shows:
  - Name (firstName + lastName)
  - Specialty
  - Wilaya (location)
  - Rating
  - Consultation price
  - "View Profile" and "Book" buttons

**Debugging:**
- Network: Check GET /doctors response
- Console: Check for doctor fetch errors
- Inspect element: Verify data binding

#### 2.2 Filter by Specialty
**Steps:**
1. On search page, select "Cardiologie" from Specialty dropdown
2. Verify list filters in real-time
3. Only cardiologists should display

**Expected Outcome:**
- Filter works instantly
- List shows only selected specialty
- Count updates

**Debugging:**
- Check filter logic in SearchDoctors.jsx
- Verify specialty data matches doctor specialty field

#### 2.3 Filter by Wilaya
**Steps:**
1. Select "Alger" from Wilaya dropdown
2. Verify list filters by location
3. Select "Oran" - list updates

**Expected Outcome:**
- Filter works instantly
- Only doctors in selected wilaya display

#### 2.4 Multiple Filters
**Steps:**
1. Select Specialty: "Cardiologie"
2. Select Wilaya: "Alger"
3. Verify both filters applied

**Expected Outcome:**
- Shows only cardiologists in Alger
- Count reflects both filters

#### 2.5 Reset Filters
**Steps:**
1. Apply any filters
2. Click "Réinitialiser" button
3. Verify all doctors display again

**Expected Outcome:**
- All filters cleared
- Full doctor list restored

---

### 3. Doctor Profile Testing

#### 3.1 View Doctor Profile
**Steps:**
1. From search page, click doctor card or "View Profile"
2. Verify full profile loads
3. Check all sections display correctly

**Expected Outcome:**
- Profile header shows:
  - Doctor name
  - Specialty
  - Rating
  - Experience
  - Location
  - Consultation price
- About section displays bio
- Qualifications section shows degrees
- Availability section shows days and hours
- Consultation types displayed
- Reviews preview shown
- "Book Now" buttons visible

**Debugging:**
- Network: Check GET /doctors/:id response
- Console: Check for missing fields
- Verify field normalization working

#### 3.2 Fallback Data
**Steps:**
1. Disconnect API (or use invalid doctor ID)
2. Profile page should still render with fallback data

**Expected Outcome:**
- Profile displays with default "Dr. Yasmine Ben Fatima"
- No console errors
- UI remains functional

---

### 4. Appointment Booking Testing

#### 4.1 Book Appointment (Authenticated)
**Steps:**
1. While logged in, navigate to `/booking/:doctorId`
2. Verify doctor info displays
3. Fill in form:
   - Date: Select a future date
   - Time: Select 10:00
   - Reason: "Check-up"
4. Submit form

**Expected Outcome:**
- Success alert appears
- Redirects to PatientDashboard
- New appointment appears in list

**Debugging:**
- Network: Check POST /appointments request
- Verify request includes: doctorId, scheduledAt, reason, price
- Response should include appointment ID

#### 4.2 Book Appointment (Not Authenticated)
**Steps:**
1. Logout
2. Try to access `/booking/:doctorId`
3. Verify login prompt appears

**Expected Outcome:**
- Warning message: "Vous devez vous connecter"
- Login link provided
- Cannot submit form without authentication

**Debugging:**
- Check ProtectedRoute component
- Verify redirect logic

#### 4.3 Appointment Details
**Steps:**
1. After booking, go to PatientDashboard
2. Find newly created appointment

**Expected Outcome:**
- Appointment shows:
  - Doctor name
  - Specialty
  - Scheduled date and time
  - Status (pending)

---

### 5. Patient Dashboard Testing

#### 5.1 View Appointments
**Steps:**
1. Navigate to `/dashboard/patient`
2. Verify appointments load

**Expected Outcome:**
- Statistics display:
  - Total appointments count
  - Confirmed count
  - Pending count
  - Doctor count
- Appointments list shows all user appointments
- Each appointment displays:
  - Doctor name
  - Specialty
  - Date and time (formatted in French)
  - Status badge (green for confirmed, yellow for pending)

**Debugging:**
- Network: Check GET /appointments response
- Verify doctor reference is populated
- Check date/time formatting

#### 5.2 Appointment Status Display
**Steps:**
1. Check appointment with status "pending"
2. Check appointment with status "confirmed"

**Expected Outcome:**
- Pending: Yellow "En attente" badge
- Confirmed: Green "Confirmé" badge
- Labels in French

---

### 6. API Endpoints Verification

#### 6.1 Public Endpoints
Test these without authentication:

**GET /api/doctors**
```bash
curl http://localhost:5000/api/doctors
```
Expected: Array of doctor objects

**GET /api/doctors/:id**
```bash
curl http://localhost:5000/api/doctors/[doctor_id]
```
Expected: Single doctor object with details

**GET /api/admin/specialties**
```bash
curl http://localhost:5000/api/admin/specialties
```
Expected: Array of specialty objects

**GET /api/admin/wilayas**
```bash
curl http://localhost:5000/api/admin/wilayas
```
Expected: Array of wilaya objects

#### 6.2 Protected Endpoints
Test with authorization header:

**GET /api/auth/me**
```bash
curl -H "Authorization: Bearer [token]" http://localhost:5000/api/auth/me
```
Expected: Current user object

**GET /api/appointments**
```bash
curl -H "Authorization: Bearer [token]" http://localhost:5000/api/appointments
```
Expected: Array of user's appointments

**POST /api/appointments**
```bash
curl -X POST \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "[doctor_id]",
    "scheduledAt": "2026-06-14T10:00:00Z",
    "reason": "Check-up",
    "price": 4500
  }' \
  http://localhost:5000/api/appointments
```
Expected: Created appointment object

---

### 7. Error Handling Testing

#### 7.1 Invalid Credentials
**Steps:**
1. Go to login
2. Enter wrong password
3. Submit

**Expected Outcome:**
- Error message displays
- No redirect
- User not logged in

#### 7.2 Network Error
**Steps:**
1. Disconnect API (stop backend)
2. Try to perform any action

**Expected Outcome:**
- User-friendly error message appears
- Fallback data displays (if applicable)
- No crash, UI remains responsive

#### 7.3 Missing Required Fields
**Steps:**
1. Go to booking page
2. Try to submit without filling date
3. Browser validation should prevent submission

**Expected Outcome:**
- HTML validation error appears
- Form not submitted

---

### 8. Data Persistence Testing

#### 8.1 Token Persistence
**Steps:**
1. Login to application
2. Reload page (F5)
3. Verify still logged in
4. Check token in localStorage

**Expected Outcome:**
- User remains logged in after reload
- Token still in localStorage
- User data restored

#### 8.2 Appointment List Persistence
**Steps:**
1. View appointments
2. Reload page
3. Appointments still visible

**Expected Outcome:**
- Data fetches again on reload
- Same appointments appear
- No data loss

---

### 9. UI/UX Testing

#### 9.1 Responsive Design
**Steps:**
1. View on desktop (1920x1080)
2. View on tablet (768px)
3. View on mobile (375px)

**Expected Outcome:**
- All elements visible on all screen sizes
- Text readable
- Buttons clickable
- No horizontal scroll

#### 9.2 Loading States
**Steps:**
1. Open network tab and set to slow 3G
2. Trigger any API call
3. Verify loading indicator shows

**Expected Outcome:**
- "Chargement..." or spinner appears
- Data loads and displays
- Smooth transition

#### 9.3 Empty States
**Steps:**
1. As new user with no appointments
2. Go to PatientDashboard

**Expected Outcome:**
- Empty state message displays appropriately
- UI doesn't break
- Clear message: "Aucun rendez-vous"

---

## Common Issues & Solutions

### Issue: Token Not Persisting
**Solution:**
- Check localStorage in DevTools
- Verify token saved during login
- Check AuthContext useEffect setup
- Verify VITE_API_URL configuration

### Issue: API Requests Failing with 401
**Solution:**
- Verify token in Authorization header
- Check token not expired
- Verify backend protect middleware
- Check CORS configuration

### Issue: Doctor Data Not Displaying
**Solution:**
- Network tab: Check GET /doctors response structure
- Verify field names match (specialty, wilaya, consultationPrice)
- Check normalization logic in component
- Verify fallback data as backup

### Issue: Appointment Not Saving
**Solution:**
- Check POST /appointments request body
- Verify doctorId format
- Check scheduledAt format (ISO 8601)
- Verify patient profile exists on backend

### Issue: CORS Errors
**Solution:**
- Backend should have CORS middleware configured
- Check allowed origins include frontend URL
- Verify Content-Type header correct

---

## Performance Testing

### Load Times
- Doctor list load: < 2 seconds
- Profile page load: < 1 second
- Dashboard load: < 2 seconds
- Booking submission: < 2 seconds

### Network Requests
Expected API calls per page:
- Search page: 2 (doctors + specialties)
- Profile page: 1 (doctor details)
- Dashboard: 1 (appointments)
- Booking: 2 (doctor details + POST appointment)

### Check with Network Tab
- Verify no duplicate requests
- Check request sizes reasonable
- Verify response sizes reasonable
- No missing resources (404s)

---

## Accessibility Testing

- [ ] Tab navigation works
- [ ] Form labels associated
- [ ] Color contrast adequate
- [ ] Focus indicators visible
- [ ] Error messages clear
- [ ] French text displays correctly

---

## Final Verification Checklist

- [ ] All pages load without console errors
- [ ] Authentication flow complete
- [ ] Doctor search and filtering works
- [ ] Profile page displays all information
- [ ] Appointment booking creates appointments
- [ ] Dashboard shows appointments
- [ ] Responsive design works
- [ ] Error handling appropriate
- [ ] Data persists across reloads
- [ ] Loading states display
- [ ] French localization correct
- [ ] All buttons functional
- [ ] All links navigate correctly

## Success Criteria

✅ **All Features Working** when:
1. User can complete full registration → login → search → book → view flow
2. All API endpoints respond correctly
3. No console errors in any page
4. Data displays correctly formatted
5. Error messages clear and helpful
6. UI responsive on all screen sizes
7. Token persists across sessions

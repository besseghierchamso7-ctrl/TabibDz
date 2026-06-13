import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SearchDoctors from './pages/SearchDoctors';
import DoctorProfile from './pages/DoctorProfile';
import Booking from './pages/Booking';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Contact from './pages/Contact';
import Layout from './components/Layout';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Routes>
        {/* Public Pages with Layout */}
        <Route element={<Layout><Home /></Layout>} path="/" />
        <Route element={<Layout><SearchDoctors /></Layout>} path="/search" />
        <Route element={<Layout><DoctorProfile /></Layout>} path="/doctor/:id" />
        <Route element={<Layout><Contact /></Layout>} path="/contact" />

        {/* Auth Pages without Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Booking Page with Layout */}
        <Route element={<Layout><Booking /></Layout>} path="/booking/:id" />

        {/* Dashboard Pages with Layout */}
        <Route element={<Layout><PatientDashboard /></Layout>} path="/dashboard/patient" />
        <Route element={<Layout><DoctorDashboard /></Layout>} path="/dashboard/doctor" />
        <Route element={<Layout><AdminDashboard /></Layout>} path="/dashboard/admin" />
      </Routes>
    </div>
  );
}

export default App;

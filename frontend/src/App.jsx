import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import SearchDoctors from './pages/SearchDoctors';
import DoctorProfile from './pages/DoctorProfile';
import Booking from './pages/Booking';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Contact from './pages/Contact';
import Layout from './components/Layout';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;

  return children;
};

function AppRoutes() {
  const HomeRedirect = () => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
    if (user) {
      if (user.role === 'doctor') return <Navigate to="/dashboard/doctor" />;
      if (user.role === 'patient') return <Navigate to="/dashboard/patient" />;
      if (user.role === 'admin') return <Navigate to="/dashboard/admin" />;
    }
    return <Layout><Home /></Layout>;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Routes>
        {/* Public Pages with Layout */}
        <Route element={<HomeRedirect />} path="/" />
        <Route element={<Layout><SearchDoctors /></Layout>} path="/search" />
        <Route element={<Layout><DoctorProfile /></Layout>} path="/doctor/:id" />
        <Route element={<Layout><Contact /></Layout>} path="/contact" />

        {/* Auth Pages without Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Booking Page with Layout */}
        <Route element={<Layout><Booking /></Layout>} path="/booking/:id" />

        {/* Dashboard Pages with Layout - Protected */}
        <Route element={<ProtectedRoute requiredRole="patient"><Layout><PatientDashboard /></Layout></ProtectedRoute>} path="/dashboard/patient" />
        <Route element={<ProtectedRoute requiredRole="doctor"><Layout><DoctorDashboard /></Layout></ProtectedRoute>} path="/dashboard/doctor" />
        <Route element={<ProtectedRoute requiredRole="admin"><Layout><AdminDashboard /></Layout></ProtectedRoute>} path="/dashboard/admin" />
        <Route element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} path="/profile" />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;

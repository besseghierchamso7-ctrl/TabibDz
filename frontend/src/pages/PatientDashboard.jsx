import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { io } from 'socket.io-client';
import { AuthContext } from '../contexts/AuthContext';

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);


  const handleCancelAppointment = async (appointmentId) => {
    try {
      await apiClient.post(`/appointments/${appointmentId}/cancel`);
      setAppointments((prev) => prev.map((apt) => apt._id === appointmentId ? { ...apt, status: 'cancelled' } : apt));
    } catch (err) {
      console.error('Error cancelling appointment:', err);
    }
  }; 

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await apiClient.get('/appointments');
        const data = response.data || [];
        setAppointments(data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
    // setup socket for live updates
    const token = localStorage.getItem('token');
    const baseApi = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/,'') : 'http://localhost:10000';
    const socket = io(baseApi, { path: '/socket.io', auth: { token } });
    socket.on('appointment:created', fetchAppointments);
    socket.on('appointment:updated', fetchAppointments);

    return () => socket.disconnect();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white shadow-sm border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">Tableau de bord patient</h1>
          <p className="mt-2 text-slate-600">Gérez vos rendez-vous et consultez vos informations</p>
          {(!user?.firstName || !user?.lastName || !user?.phone || !user?.gender) && (
            <div className="mt-4">
              <Link to="/profile" className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
                👤 Mon profil
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Appointments */}
        <div className="rounded-2xl bg-white p-8 shadow-md border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Mes rendez-vous</h2>
          <div className="mt-6 space-y-4">
            {appointments.map((apt) => {
              const doctorName = apt.doctor?.user?.firstName || apt.doctor?.firstName || apt.doctor?.name || apt.doctorId || 'Médecin';
              const doctorLastName = apt.doctor?.user?.lastName || apt.doctor?.lastName || '';
              const fullDoctorName = `${doctorName}${doctorLastName ? ` ${doctorLastName}` : ''}`.trim() || 'Médecin';
              const specialty = apt.doctor?.specialty?.name || apt.specialty || 'N/A';
              const scheduledDate = apt.scheduledAt ? new Date(apt.scheduledAt).toLocaleDateString('fr-FR') : apt.date;
              const scheduledTime = apt.scheduledAt ? new Date(apt.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : apt.time;
              const statusLabel = apt.status === 'confirmed' ? 'Confirmé' : apt.status === 'pending' ? 'En attente' : apt.status || 'N/A';
              return (
                <div key={apt._id || apt.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-900">{doctorName}</p>
                    <p className="text-sm text-slate-600">{specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{scheduledDate} à {scheduledTime}</p>
                    <span className={`inline-flex mt-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      statusLabel === 'Confirmé' ? 'bg-emerald-100 text-emerald-700' : statusLabel === 'Annulé' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {statusLabel}
                    </span>
                    {apt.status !== 'cancelled' && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => handleCancelAppointment(apt._id)}
                          className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                        >
                          Annuler
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PatientDashboard;

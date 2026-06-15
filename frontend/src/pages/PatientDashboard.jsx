import { useEffect, useState, useContext } from 'react';
import apiClient from '../api/apiClient';
import { io } from 'socket.io-client';
import { AuthContext } from '../contexts/AuthContext';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, doctors: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await apiClient.get('/appointments');
        const data = response.data || [];
        setAppointments(data);

        const confirmed = data.filter(a => a.status === 'confirmed').length;
        const pending = data.filter(a => a.status === 'pending').length;
        const doctorCount = new Set(data.map(a => a.doctor?._id || a.doctorId)).size;
        
        setStats({
          total: data.length,
          confirmed,
          pending,
          doctors: doctorCount
        });
      } catch (err) {
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
    // setup socket for live updates
    const token = localStorage.getItem('token');
    const baseApi = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/,'') : window.location.origin.replace(':5173',':5000');
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
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
            <p className="text-sm font-semibold text-slate-600 uppercase">Rendez-vous</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
            <p className="text-sm font-semibold text-slate-600 uppercase">Confirmés</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">{stats.confirmed}</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
            <p className="text-sm font-semibold text-slate-600 uppercase">En attente</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
            <p className="text-sm font-semibold text-slate-600 uppercase">Médecins</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">{stats.doctors}</p>
          </div>
        </div>

        {/* Appointments */}
        <div className="rounded-2xl bg-white p-8 shadow-md border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Mes rendez-vous</h2>
          <div className="mt-6 space-y-4">
            {appointments.map((apt) => {
              const doctorName = apt.doctor?.user ? `${apt.doctor.user.firstName} ${apt.doctor.user.lastName}` : apt.doctor?.name || apt.doctorId || 'Médecin';
              const specialty = apt.doctor?.specialty?.name || apt.specialty || 'N/A';
              const scheduledDate = apt.scheduledAt ? new Date(apt.scheduledAt).toLocaleDateString('fr-FR') : apt.date;
              const scheduledTime = apt.scheduledAt ? new Date(apt.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : apt.time;
              const statusLabel = apt.status === 'confirmed' ? 'Confirmé' : apt.status === 'pending' ? 'En attente' : apt.status;
              return (
                <div key={apt._id || apt.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-900">{doctorName}</p>
                    <p className="text-sm text-slate-600">{specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{scheduledDate} à {scheduledTime}</p>
                    <span className={`inline-flex mt-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      statusLabel === 'Confirmé' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {statusLabel}
                    </span>
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

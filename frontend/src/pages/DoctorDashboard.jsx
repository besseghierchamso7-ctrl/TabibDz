import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { io } from 'socket.io-client';
import apiClient from '../api/apiClient';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ appointments: 0, confirmed: 0, pending: 0, patients: 0 });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsRes = await apiClient.get('/appointments?status=pending,confirmed');
        const appts = appointmentsRes.data || [];
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayAppts = appts.filter(a => {
          const apptDate = new Date(a.scheduledAt);
          apptDate.setHours(0, 0, 0, 0);
          return apptDate.getTime() === today.getTime();
        });

        const patientIds = new Set(appts.map(a => a.patient?._id || a.patient));
        const confirmed = appts.filter(a => a.status === 'confirmed').length;
        const pending = appts.filter(a => a.status === 'pending').length;
        
        setStats({
          appointments: appts.length,
          confirmed,
          pending,
          patients: patientIds.size
        });
        setAppointments(appts.slice(0, 10));
      } catch (err) {
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'doctor') {
      fetchData();
    }
    // setup socket to refresh data on relevant events
    let socket;
    const token = localStorage.getItem('token');
    if (user?.role === 'doctor') {
      const baseApi = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/,'') : window.location.origin.replace(':5173',':5000');
      socket = io(baseApi, { path: '/socket.io', auth: { token } });
      const room = `doctor_${user._id}`;
      socket.on('connect', () => socket.emit('joinRoom', room));
      const refresh = () => fetchData();
      socket.on('appointment:created', refresh);
      socket.on('appointment:updated', refresh);
      socket.on('waitingList:offersCreated', refresh);
    }

    return () => {
      try { socket?.disconnect(); } catch (e) {}
    };
  }, [user]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await apiClient.put(`/appointments/${appointmentId}/status`, { status: newStatus });
      setAppointments(prev =>
        prev.map(a => a._id === appointmentId ? { ...a, status: newStatus } : a)
      );
    } catch (err) {
      console.error('Error updating appointment:', err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white shadow-sm border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">Tableau de bord médecin</h1>
          <p className="mt-2 text-slate-600">Gérez vos rendez-vous et votre planning</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
            <p className="text-sm font-semibold text-slate-600 uppercase">Rendez-vous</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.appointments}</p>
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
            <p className="text-sm font-semibold text-slate-600 uppercase">Patients</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">{stats.patients}</p>
          </div>
        </div>

        {/* Requests */}
        <div className="rounded-2xl bg-white p-8 shadow-md border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Demandes de rendez-vous</h2>
          <div className="mt-6 space-y-4">
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <div key={appt._id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">{appt.patient?.user?.firstName} {appt.patient?.user?.lastName}</p>
                    <p className="text-sm text-slate-600">{new Date(appt.scheduledAt).toLocaleDateString('fr-FR')} à {new Date(appt.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                    {appt.reason && <p className="text-sm text-slate-500 mt-1">{appt.reason}</p>}
                  </div>
                  <div className="flex gap-2">
                    {appt.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(appt._id, 'confirmed')}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          Accepter
                        </button>
                        <button
                          onClick={() => handleStatusChange(appt._id, 'cancelled')}
                          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                        >
                          Refuser
                        </button>
                      </>
                    )}
                    {appt.status === 'confirmed' && (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                        ✓ Confirmé
                      </span>
                    )}
                    {appt.status === 'cancelled' && (
                      <span className="inline-flex items-center rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700">
                        ✗ Annulé
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-600">Aucune demande de rendez-vous</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorDashboard;

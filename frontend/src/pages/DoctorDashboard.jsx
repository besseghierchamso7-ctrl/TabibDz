import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { io } from 'socket.io-client';
import apiClient from '../api/apiClient';
import DoctorQueuePanel from '../components/DoctorQueuePanel';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ appointments: 0, confirmed: 0, pending: 0 });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedNewDate, setSelectedNewDate] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingDate, setEditingDate] = useState('');
  const [editingTime, setEditingTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

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

        const confirmed = appts.filter(a => a.status === 'confirmed').length;
        const pending = appts.filter(a => a.status === 'pending').length;
        
        setStats({
          appointments: appts.length,
          confirmed,
          pending
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
      const baseApi = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/,'') : 'http://localhost:10000';
      socket = io(baseApi, { path: '/socket.io', auth: { token } });
      const doctorRoomId = user?.doctorProfileId || user?._id;
      const room = `doctor_${doctorRoomId}_clinic_default`;
      socket.on('connect', () => socket.emit('joinRoom', room));
      const refresh = () => fetchData();
      socket.on('appointment:created', refresh);
      socket.on('appointment:updated', refresh);
      socket.on('waitingList:offersCreated', refresh);
      socket.on('queue:joined', refresh);
      socket.on('queue:called', refresh);
      socket.on('queue:served', refresh);
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

  const openRescheduleModal = async (appointment) => {
    try {
      const availability = await apiClient.get(`/doctors/${appointment.doctor._id}/availability`);
      setAvailableDates(availability.data.dateRanges || []);
      setRescheduleModal(appointment);
      setSelectedNewDate(null);
    } catch (err) {
      console.error('Error loading available dates:', err);
    }
  };

  const handleReschedule = async () => {
    if (!selectedNewDate) {
      alert('Please select a new date and time');
      return;
    }
    try {
      const response = await apiClient.put(`/appointments/${rescheduleModal._id}/reschedule`, { 
        scheduledAt: selectedNewDate 
      });
      setAppointments(prev =>
        prev.map(a => a._id === rescheduleModal._id ? response.data : a)
      );
      setRescheduleModal(null);
      alert('Appointment rescheduled successfully');
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      alert(err.response?.data?.message || 'Error rescheduling appointment');
    }
  };

  const handleRescheduleClick = async (appointment) => {
    setEditingId(appointment._id);
    // Fetch available slots for this doctor
    try {
      const response = await apiClient.get(`/doctors/${appointment.doctor._id || appointment.doctor}/availability`);
      setAvailableSlots(response.data.dateRanges || []);
    } catch (err) {
      console.error('Error fetching availability:', err);
      setAvailableSlots([]);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!editingDate || !editingTime) {
      alert('Veuillez sélectionner une date et une heure');
      return;
    }
    
    try {
      const scheduledAt = `${editingDate}T${editingTime}:00.000`;
      await apiClient.put(`/appointments/${editingId}/reschedule`, { scheduledAt });
      
      setAppointments(prev =>
        prev.map(a => a._id === editingId ? { ...a, scheduledAt } : a)
      );
      
      setEditingId(null);
      setEditingDate('');
      setEditingTime('');
      setAvailableSlots([]);
      
      alert('Rendez-vous reporté avec succès');
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      alert('Erreur lors du report du rendez-vous');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white shadow-sm border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Tableau de bord médecin</h1>
            <p className="mt-2 text-slate-600">Gérez vos rendez-vous et votre planning</p>
          </div>
          <Link to="/profile/doctor/edit" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition">
            ✏️ Modifier mon profil
          </Link>
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
          </div>

        <div className="mb-8">
          <DoctorQueuePanel doctorId={user?.doctorProfileId || user?._id} />
        </div>

        {/* Requests */}
        <div className="rounded-2xl bg-white p-8 shadow-md border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Demandes de rendez-vous</h2>
          <div className="mt-6 space-y-4">
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <div key={appt._id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {appt.patient?.user?.firstName || appt.patient?.name ? `${appt.patient?.user?.firstName || ''} ${appt.patient?.user?.lastName || appt.patient?.name}`.trim() : 'Patient inconnu'}
                    </p>
                    {editingId === appt._id ? (
                      <div className="mt-3 space-y-3 bg-slate-50 p-4 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-slate-700">Date</label>
                          <input
                            type="date"
                            value={editingDate}
                            onChange={(e) => setEditingDate(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700">Heure</label>
                          <select
                            value={editingTime}
                            onChange={(e) => setEditingTime(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                          >
                            <option value="">Sélectionner une heure</option>
                            {availableSlots
                              .find(range => range.date === editingDate)
                              ?.times.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleRescheduleSubmit}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditingDate('');
                              setEditingTime('');
                            }}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-slate-600">{new Date(appt.scheduledAt).toLocaleDateString('fr-FR')} à {new Date(appt.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                        {appt.reason ? <p className="text-sm text-slate-500 mt-1">{appt.reason}</p> : null}
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editingId !== appt._id && appt.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(appt._id, 'confirmed')}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          Accepter
                        </button>
                        <button
                          onClick={() => openRescheduleModal(appt)}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleStatusChange(appt._id, 'cancelled')}
                          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                        >
                          Refuser
                        </button>
                      </>
                    )}
                    {editingId !== appt._id && appt.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => handleRescheduleClick(appt)}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Changer date
                        </button>
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                          ✓ Confirmé
                        </span>                      </>
                    )}
                    {appt.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => openRescheduleModal(appt)}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Modifier
                        </button>
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                          ✓ Confirmé
                        </span>
                                            </>
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

      {rescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 sticky top-0 bg-white pb-4">Modifier le rendez-vous</h3>
            <p className="text-sm text-slate-600 mb-6">
              Sélectionnez une nouvelle date et heure pour le rendez-vous de {rescheduleModal.patient?.user?.firstName || 'Patient'}
            </p>
            
            <div className="space-y-6">
              {availableDates && availableDates.length > 0 ? (
                availableDates.map((dateRange) => (
                  <div key={dateRange.date} className="border-b border-slate-200 pb-6 last:border-b-0">
                    <p className="mb-3 font-semibold text-slate-700">
                      {new Date(dateRange.date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {dateRange.times && dateRange.times.length > 0 ? (
                        dateRange.times.map((time) => {
                          const dateTimeStr = `${dateRange.date}T${time}:00.000`;
                          const isSelected = selectedNewDate === dateTimeStr;
                          return (
                            <button
                              key={time}
                              onClick={() => setSelectedNewDate(dateTimeStr)}
                              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                                isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })
                      ) : (
                        <p className="col-span-4 text-sm text-slate-500">Aucun créneau disponible</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-8">Aucune date disponible</p>
              )}
            </div>

            <div className="mt-8 flex gap-4 sticky bottom-0 bg-white pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setRescheduleModal(null);
                  setSelectedNewDate(null);
                }}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 font-semibold text-slate-900 hover:bg-slate-100"
              >
                Annuler
              </button>
              <button
                onClick={handleReschedule}
                disabled={!selectedNewDate}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;

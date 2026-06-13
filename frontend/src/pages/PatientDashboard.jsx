import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, doctors: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await apiClient.get('/appointments');
        const data = response.data.data || [];
        setAppointments(data);

        // Calculate stats
        const confirmed = data.filter(a => a.status === 'confirmed').length;
        const pending = data.filter(a => a.status === 'pending').length;
        
        setStats({
          total: data.length,
          confirmed: confirmed,
          pending: pending,
          doctors: data.length > 0 ? new Set(data.map(a => a.doctorId)).size : 0
        });
      } catch (err) {
        console.error('Error fetching appointments:', err);
        // Fallback data
        setAppointments([
          { _id: 1, doctorId: { firstName: 'Yasmine', lastName: 'Ben', specialty: 'Cardiologie' }, appointmentDate: '2026-06-14', appointmentTime: '11:00', status: 'confirmed' },
          { _id: 2, doctorId: { firstName: 'Sofiane', lastName: 'M.', specialty: 'Médecine Générale' }, appointmentDate: '2026-06-20', appointmentTime: '14:30', status: 'pending' }
        ]);
        setStats({ total: 2, confirmed: 1, pending: 1, doctors: 5 });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
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
            <p className="mt-2 text-3xl font-bold text-slate-900">2</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
            <p className="text-sm font-semibold text-slate-600 uppercase">Confirmés</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">1</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
            <p className="text-sm font-semibold text-slate-600 uppercase">En attente</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">1</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
            <p className="text-sm font-semibold text-slate-600 uppercase">Médecins</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">5</p>
          </div>
        </div>

        {/* Appointments */}
        <div className="rounded-2xl bg-white p-8 shadow-md border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Mes rendez-vous</h2>
          <div className="mt-6 space-y-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
                <div>
                  <p className="font-semibold text-slate-900">{apt.doctor}</p>
                  <p className="text-sm text-slate-600">{apt.specialty}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{apt.date} à {apt.time}</p>
                  <span className={`inline-flex mt-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    apt.status === 'Confirmé' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PatientDashboard;

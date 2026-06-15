import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { io } from 'socket.io-client';
import { AuthContext } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [showSpecialtyForm, setShowSpecialtyForm] = useState(false);
  const [specialtyName, setSpecialtyName] = useState('');
  const [specialtyDescription, setSpecialtyDescription] = useState('');
  const [createStatus, setCreateStatus] = useState('');
  const [profileStatus, setProfileStatus] = useState('');
  const [profileFields, setProfileFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    avatar: ''
  });
  const [stats, setStats] = useState({
    patientsCount: 0,
    doctorsCount: 0,
    appointmentsCount: 0,
    revenue: 0,
    reviewsCount: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    if (user) {
      setProfileFields({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setStatsLoading(true);
      try {
        const [dashboardRes, doctorsRes, appointmentsRes] = await Promise.all([
          apiClient.get('/admin/dashboard'),
          apiClient.get('/admin/doctors'),
          apiClient.get('/admin/appointments')
        ]);

        const dashboardData = dashboardRes.data;
        setStats({
          patientsCount: dashboardData.patientsCount || 0,
          doctorsCount: dashboardData.doctorsCount || 0,
          appointmentsCount: dashboardData.appointmentsCount || 0,
          revenue: dashboardData.revenue || 0,
          reviewsCount: dashboardData.reviewsCount || 0
        });

        const pendingRequests = (doctorsRes.data || []).filter((doctor) => doctor.status === 'pending');
        setRequests(pendingRequests.slice(0, 3).map((doctor) => ({
          name: `Dr. ${doctor.user?.firstName || ''} ${doctor.user?.lastName || ''}`.trim(),
          specialty: doctor.specialty?.name || 'N/A',
          status: 'Nouveau'
        })));

        const recent = (appointmentsRes.data || [])
          .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt))
          .slice(0, 3)
          .map((appointment) => ({
            patient: appointment.patient?.user ? `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}` : appointment.patient?.name || 'Patient',
            doctor: appointment.doctor?.user ? `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}` : appointment.doctor?.name || 'Médecin',
            date: appointment.scheduledAt ? new Date(appointment.scheduledAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : 'N/A',
            time: appointment.scheduledAt ? new Date(appointment.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
            status: appointment.status === 'confirmed' ? 'Confirmé' : appointment.status === 'pending' ? 'En attente' : appointment.status === 'cancelled' ? 'Annulé' : appointment.status === 'completed' ? 'Terminé' : appointment.status
          }));

        setRecentAppointments(recent);
      } catch (error) {
        console.error('Erreur lors de la récupération des données admin :', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const { token } = useContext(AuthContext);
  useEffect(() => {
    const baseApi = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/,'') : window.location.origin.replace(':5173',':5000');
    const socket = io(baseApi, { path: '/socket.io', auth: { token } });

    socket.on('appointment:created', (appointment) => {
      setStats((s) => ({ ...s, appointmentsCount: (s.appointmentsCount || 0) + 1, pendingCount: (s.pendingCount || 0) + (appointment.status === 'pending' ? 1 : 0), confirmedCount: (s.confirmedCount || 0) + (appointment.status === 'confirmed' ? 1 : 0) }));
      setRecentAppointments((r) => [{
        patient: appointment.patient?.user ? `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}` : appointment.patient?.name || 'Patient',
        doctor: appointment.doctor?.user ? `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}` : appointment.doctor?.name || 'Médecin',
        date: appointment.scheduledAt ? new Date(appointment.scheduledAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : 'N/A',
        time: appointment.scheduledAt ? new Date(appointment.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        status: appointment.status
      }, ...r].slice(0,3));
    });

    socket.on('appointment:updated', (appointment) => {
      // adjust counts based on status change
      // best-effort: refetch stats for accuracy when complex
      setStats((s) => {
        const updated = { ...s };
        // naive adjustments — safer to refetch but we'll try to adjust
        if (appointment.status === 'confirmed') {
          updated.confirmedCount = (s.confirmedCount || 0) + 1;
          updated.pendingCount = Math.max(0, (s.pendingCount || 0) - 1);
        }
        if (appointment.status === 'cancelled') {
          updated.pendingCount = Math.max(0, (s.pendingCount || 0) - 1);
          updated.appointmentsCount = Math.max(0, (s.appointmentsCount || 0) - 1);
        }
        return updated;
      });
      // update recent appointments list
      setRecentAppointments((r) => {
        const mapped = r.map((it) => it);
        // prepend updated appointment
        const newEntry = {
          patient: appointment.patient?.user ? `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}` : appointment.patient?.name || 'Patient',
          doctor: appointment.doctor?.user ? `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}` : appointment.doctor?.name || 'Médecin',
          date: appointment.scheduledAt ? new Date(appointment.scheduledAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : 'N/A',
          time: appointment.scheduledAt ? new Date(appointment.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
          status: appointment.status === 'confirmed' ? 'Confirmé' : appointment.status === 'pending' ? 'En attente' : appointment.status
        };
        return [newEntry, ...mapped].slice(0,3);
      });
    });

    return () => socket.disconnect();
  }, [token]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileStatus('Mise à jour en cours...');

    try {
      const updated = await updateProfile({
        firstName: profileFields.firstName,
        lastName: profileFields.lastName,
        email: profileFields.email,
        phone: profileFields.phone,
        gender: profileFields.gender,
        avatar: profileFields.avatar
      });
      setProfileFields((prev) => ({ ...prev, ...updated }));
      setProfileStatus('Profil mis à jour avec succès');
    } catch (error) {
      setProfileStatus(error.message || 'Échec de la mise à jour du profil');
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecialtySubmit = async (event) => {
    event.preventDefault();
    setCreateStatus('Envoi en cours...');

    try {
      await apiClient.post('/admin/specialties', {
        name: specialtyName,
        description: specialtyDescription
      });
      setCreateStatus('Spécialité ajoutée avec succès');
      setSpecialtyName('');
      setSpecialtyDescription('');
      setTimeout(() => setShowSpecialtyForm(false), 1200);
    } catch (error) {
      setCreateStatus('Erreur lors de la création de la spécialité');
      console.error(error);
    }
  };

  const metrics = [
    { label: 'Rendez-vous', value: statsLoading ? '...' : (stats.appointmentsCount || 0).toLocaleString('fr-FR'), note: 'Total des rendez-vous', color: 'bg-amber-100 text-amber-700' },
    { label: 'Confirmés', value: statsLoading ? '...' : (stats.confirmedCount || 0).toLocaleString('fr-FR'), note: 'Rendez-vous confirmés', color: 'bg-emerald-100 text-emerald-700' },
    { label: 'En attente', value: statsLoading ? '...' : (stats.pendingCount || 0).toLocaleString('fr-FR'), note: 'Rendez-vous en attente', color: 'bg-rose-100 text-rose-700' },
    { label: 'Médecins', value: statsLoading ? '...' : (stats.doctorsCount || 0).toLocaleString('fr-FR'), note: 'Médecins enregistrés', color: 'bg-sky-100 text-sky-700' }
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-900 to-blue-600 p-8 text-white shadow-xl shadow-slate-200/40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-sky-200">Espace Admin</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">Tableau de bord Tabib DZ</h1>
            <p className="mt-3 max-w-2xl text-slate-200">Analysez les performances, approuvez les médecins et suivez les rendez-vous en temps réel.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/profile" className="inline-flex items-center rounded-full bg-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/25">
              👤 Mon profil
            </Link>
            <button onClick={() => setShowSpecialtyForm(true)} className="rounded-full bg-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/25">Nouvelle spécialité</button>
            <button className="rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-slate-200">Rapport PDF</button>
          </div>
        </div>
      </div>

      <section className="mb-8 rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/40">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Mon profil</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Modifier mon profil administrateur</h2>
            <p className="mt-2 text-sm text-slate-600">Mettez à jour vos informations personnelles et de contact.</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Prénom</label>
            <input
              value={profileFields.firstName}
              onChange={(e) => handleProfileChange('firstName', e.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Nom</label>
            <input
              value={profileFields.lastName}
              onChange={(e) => handleProfileChange('lastName', e.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={profileFields.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Téléphone</label>
            <input
              value={profileFields.phone}
              onChange={(e) => handleProfileChange('phone', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Genre</label>
            <select
              value={profileFields.gender}
              onChange={(e) => handleProfileChange('gender', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Sélectionner</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Avatar (URL)</label>
            <input
              value={profileFields.avatar}
              onChange={(e) => handleProfileChange('avatar', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
              placeholder="https://..."
            />
          </div>
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">{profileStatus}</p>
              <button type="submit" className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </form>
      </section>

      {showSpecialtyForm && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Ajouter une nouvelle spécialité</h2>
                <p className="mt-2 text-sm text-slate-500">Créez une spécialité médicale disponible dans le système.</p>
              </div>
              <button onClick={() => { setShowSpecialtyForm(false); setCreateStatus(''); }} className="text-slate-500 transition hover:text-slate-900">Fermer</button>
            </div>
            <form onSubmit={handleSpecialtySubmit} className="mt-8 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Nom de la spécialité</label>
                <input
                  value={specialtyName}
                  onChange={(e) => setSpecialtyName(e.target.value)}
                  required
                  className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                  placeholder="Ex : Cardiologie"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={specialtyDescription}
                  onChange={(e) => setSpecialtyDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                  placeholder="Faire une courte description"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">{createStatus}</p>
                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">Créer</button>
                  <button type="button" onClick={() => { setShowSpecialtyForm(false); setCreateStatus(''); }} className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm text-slate-900 hover:bg-slate-100">Annuler</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-4">
        {metrics.map((item) => (
          <div key={item.label} className="rounded-3xl bg-white p-6 shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{item.value}</p>
            <p className="mt-2 text-sm text-slate-500">{item.note}</p>
            <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.color}`}>{item.label.split(' ')[0]}</div>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Rendez-vous récents</h2>
              <p className="mt-2 text-sm text-slate-500">Dernières demandes reçues et actions administratives.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">Filtrer</button>
              <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Voir tout</button>
            </div>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Patient</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Médecin</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Date</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Statut</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentAppointments.map((item) => (
                  <tr key={`${item.patient}-${item.date}`}>
                    <td className="px-4 py-4 text-slate-700">{item.patient}</td>
                    <td className="px-4 py-4 text-slate-700">{item.doctor}</td>
                    <td className="px-4 py-4 text-slate-700">{item.date}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'Confirmé' ? 'bg-emerald-100 text-emerald-700' : item.status === 'En attente' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-700">Gérer</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Demandes de vérification</h2>
                <p className="mt-2 text-sm text-slate-500">Actionnez les nouvelles demandes de médecins.</p>
              </div>
              <button className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">Voir tous</button>
            </div>
            <div className="mt-6 space-y-4">
              {requests.map((item) => (
                <div key={item.name} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.specialty}</p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{item.status}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700">Approuver</button>
                    <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-700 hover:bg-slate-100">Voir dossier</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">Activité récente</h2>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <p>• 12 nouveaux patients inscrits aujourd'hui.</p>
              <p>• 4 rendez-vous confirmés en attente de paiement.</p>
              <p>• 2 avis publiés pour les médecins.</p>
              <p>• 1 médecin vérifié dans la matinée.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;

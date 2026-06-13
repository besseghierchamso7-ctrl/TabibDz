import { useState } from 'react';
import apiClient from '../api/apiClient';

const AdminDashboard = () => {
  const [showSpecialtyForm, setShowSpecialtyForm] = useState(false);
  const [specialtyName, setSpecialtyName] = useState('');
  const [specialtyDescription, setSpecialtyDescription] = useState('');
  const [createStatus, setCreateStatus] = useState('');

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
    { label: 'Patients actifs', value: '1 248', note: 'Enregistrés ce mois', color: 'bg-sky-100 text-sky-700' },
    { label: 'Médecins vérifiés', value: '342', note: 'Profils approuvés', color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Rendez-vous', value: '5 980', note: 'Confirmés cette semaine', color: 'bg-amber-100 text-amber-700' },
    { label: 'Revenu mensuel', value: '3 450 000 DA', note: 'Estimation des revenus', color: 'bg-violet-100 text-violet-700' }
  ];

  const requests = [
    { name: 'Dr. Leila R.', specialty: 'Pédiatrie', status: 'Nouveau' },
    { name: 'Dr. Samir B.', specialty: 'Cardiologie', status: 'Nouveau' },
    { name: 'Dr. Hakim C.', specialty: 'Dermatologie', status: 'En cours' }
  ];

  const recentAppointments = [
    { patient: 'Nadia Brahimi', doctor: 'Dr. Yasmine Ben', date: '14 Juin, 11:00', status: 'Confirmé' },
    { patient: 'Karim L.', doctor: 'Dr. Sofiane M.', date: '14 Juin, 12:30', status: 'En attente' },
    { patient: 'Lina S.', doctor: 'Dr. Amine D.', date: '15 Juin, 09:00', status: 'Annulé' }
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
            <button onClick={() => setShowSpecialtyForm(true)} className="rounded-full bg-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/25">Nouvelle spécialité</button>
            <button className="rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-slate-200">Rapport PDF</button>
          </div>
        </div>
      </div>

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

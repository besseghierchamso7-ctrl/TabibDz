const AdminDashboard = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-blue-600">Espace Admin</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900">Tableau de bord</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Surveillez les patients, les médecins, les rendez-vous et les statistiques de revenus.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-blue-600 px-6 py-3 text-white shadow-lg hover:bg-blue-700">Ajouter une spécialité</button>
            <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-slate-900 hover:bg-slate-100">Vérifier médecins</button>
          </div>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Patients</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">1,248</p>
          <p className="mt-2 text-sm text-slate-500">Nouveaux ce mois</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Médecins</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">342</p>
          <p className="mt-2 text-sm text-slate-500">Vérifiés</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Rendez-vous</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">5,980</p>
          <p className="mt-2 text-sm text-slate-500">Confirmés cette semaine</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Revenu</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">3,450,000 DA</p>
          <p className="mt-2 text-sm text-slate-500">Revenu estimé</p>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Rendez-vous récents</h2>
              <p className="mt-2 text-sm text-slate-500">Dernières demandes et statuts en temps réel.</p>
            </div>
            <button className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">Voir tous</button>
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
                {[
                  { patient: 'Nadia Brahimi', doctor: 'Dr. Yasmine Ben', date: '14 Juin, 11:00', status: 'Confirmé' },
                  { patient: 'Karim L.', doctor: 'Dr. Sofiane M.', date: '14 Juin, 12:30', status: 'En attente' },
                  { patient: 'Lina S.', doctor: 'Dr. Amine D.', date: '15 Juin, 09:00', status: 'Annulé' }
                ].map((item) => (
                  <tr key={`${item.patient}-${item.date}`}>
                    <td className="px-4 py-4 text-slate-700">{item.patient}</td>
                    <td className="px-4 py-4 text-slate-700">{item.doctor}</td>
                    <td className="px-4 py-4 text-slate-700">{item.date}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'Confirmé' ? 'bg-emerald-100 text-emerald-700' : item.status === 'En attente' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{item.status}</span>
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
            <h2 className="text-xl font-semibold text-slate-900">Demandes de vérification</h2>
            <p className="mt-2 text-sm text-slate-500">Examiner les nouveaux dossiers de médecins.</p>
            <div className="mt-6 space-y-4">
              {[
                { name: 'Dr. Leila R.', specialty: 'Pédiatrie', status: 'Nouveau' },
                { name: 'Dr. Samir B.', specialty: 'Cardiologie', status: 'Nouveau' }
              ].map((item) => (
                <div key={item.name} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.specialty}</p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{item.status}</span>
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
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;

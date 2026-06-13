const DoctorDashboard = () => {
  const requests = [
    { id: 1, patient: 'Nadia B.', date: '14 Juin 2026', time: '11:00', status: 'Confirmé' },
    { id: 2, patient: 'Karim L.', date: '15 Juin 2026', time: '14:30', status: 'En attente' }
  ];

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
            <p className="mt-2 text-3xl font-bold text-slate-900">12</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
            <p className="text-sm font-semibold text-slate-600 uppercase">Aujourd'hui</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">3</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
            <p className="text-sm font-semibold text-slate-600 uppercase">Patients</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">28</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
            <p className="text-sm font-semibold text-slate-600 uppercase">Note</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">4.9</p>
          </div>
        </div>

        {/* Requests */}
        <div className="rounded-2xl bg-white p-8 shadow-md border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Demandes de rendez-vous</h2>
          <div className="mt-6 space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{req.patient}</p>
                  <p className="text-sm text-slate-600">{req.date} à {req.time}</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Accepter</button>
                  <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100">Refuser</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorDashboard;

const PatientDashboard = () => {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">Tableau de bord patient</h1>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-6">Mes rendez-vous</div>
          <div className="rounded-3xl bg-slate-50 p-6">Mes médecins favoris</div>
          <div className="rounded-3xl bg-slate-50 p-6">Notifications</div>
        </div>
      </div>
    </main>
  );
};

export default PatientDashboard;

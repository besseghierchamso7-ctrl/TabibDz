const PatientCard = ({ count = 0, loading = false }) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Patients</p>
      <p className="mt-4 text-4xl font-semibold text-slate-900">{loading ? '...' : count.toLocaleString('fr-FR')}</p>
      <p className="mt-2 text-sm text-slate-500">Patients enregistrés</p>
      <div className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Patients</div>
    </div>
  );
};

export default PatientCard;

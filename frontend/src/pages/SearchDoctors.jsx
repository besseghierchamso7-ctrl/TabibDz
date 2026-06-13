import { useState } from 'react';

const SearchDoctors = () => {
  const [filters, setFilters] = useState({ wilaya: '', specialty: '', gender: '' });
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">Rechercher un médecin</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <select className="rounded-2xl border border-slate-200 px-4 py-3" value={filters.wilaya} onChange={(e) => setFilters({ ...filters, wilaya: e.target.value })}>
            <option value="">Wilaya</option>
            <option value="Alger">Alger</option>
            <option value="Oran">Oran</option>
          </select>
          <select className="rounded-2xl border border-slate-200 px-4 py-3" value={filters.specialty} onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}>
            <option value="">Spécialité</option>
            <option value="Médecine Générale">Médecine Générale</option>
          </select>
          <select className="rounded-2xl border border-slate-200 px-4 py-3" value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
            <option value="">Genre</option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
          </select>
        </div>
      </div>
      <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <article key={item} className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-100" />
              <div>
                <h2 className="text-xl font-semibold">Dr. Yasmine Ben</h2>
                <p className="text-slate-500">Cardiologie • Alger</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1">4.8</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Prix 4000 DA</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default SearchDoctors;

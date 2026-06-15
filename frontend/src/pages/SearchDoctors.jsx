import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

const SearchDoctors = () => {
  const [filters, setFilters] = useState({ wilaya: '', specialty: '', gender: '' });
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [wilayas, setWilayas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch doctors, specialties, and wilayas from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [doctorsRes, specialtiesRes, wilayasRes] = await Promise.all([
          apiClient.get('/doctors'),
          apiClient.get('/specialties'),
          apiClient.get('/wilayas')
        ]);
        setDoctors(doctorsRes.data || []);
        setSpecialties(specialtiesRes.data || []);
        setWilayas(wilayasRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDoctors = doctors.filter(doc => {
    const specialtyId = doc.specialty?._id || doc.specialty;
    const wilayaId = doc.wilaya?._id || doc.wilaya;
    const gender = doc.user?.gender || doc.gender || '';
    return (
      (!filters.wilaya || wilayaId === filters.wilaya) &&
      (!filters.specialty || specialtyId === filters.specialty) &&
      (!filters.gender || gender === filters.gender)
    );
  });

  return (
    <>
      {/* Search Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Chercher un médecin</h1>
          <p className="mt-3 max-w-2xl text-blue-100">
            Trouvez un médecin vérifié par spécialité, région et disponibilités.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white shadow-sm border-b border-slate-200 sticky top-16 z-20">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700">Wilaya</label>
              <select
                value={filters.wilaya}
                onChange={(e) => setFilters({ ...filters, wilaya: e.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Tous les régions</option>
                {wilayas.map(w => (
                  <option key={w._id} value={w._id}>{w.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700">Spécialité</label>
              <select
                value={filters.specialty}
                onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Toutes les spécialités</option>
                {specialties.map(s => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700">Genre</label>
              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Tous genres</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ wilaya: '', specialty: '', gender: '' })}
                className="w-full rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Chargement des médecins...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
            <p className="text-rose-700">{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                {filteredDoctors.length} médecin{filteredDoctors.length !== 1 ? 's' : ''} trouvé{filteredDoctors.length !== 1 ? 's' : ''}
              </p>
            </div>

            {filteredDoctors.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDoctors.map((doctor) => {
                  const firstName = doctor.user?.firstName || doctor.firstName || '';
                  const lastName = doctor.user?.lastName || doctor.lastName || '';
                  const specialtyName = doctor.specialty?.name || 'N/A';
                  const wilayaName = doctor.wilaya?.name || 'N/A';
                  const consultationFee = doctor.consultationPrice || doctor.price || 0;
                  const rating = doctor.rating || 4.5;
                  return (
                    <Link key={doctor._id} to={`/doctor/${doctor._id}`}>
                      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition hover:shadow-xl hover:border-blue-300">
                        <div className="flex items-start gap-4">
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-2xl font-bold text-blue-600">
                            {(firstName || 'D')[0].toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900">Dr. {firstName} {lastName}</h3>
                            <p className="mt-1 text-sm text-slate-600">{specialtyName}</p>
                            <p className="mt-1 text-xs text-slate-500">{doctor.experience || 0} ans d'expérience</p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                            ⭐ {rating.toFixed(1)}
                          </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-600">À partir de</p>
                            <p className="text-lg font-bold text-blue-600">{consultationFee} DA</p>
                          </div>
                          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                            Réserver
                          </button>
                        </div>
                        <div className="mt-3 flex items-center gap-2 border-t border-slate-200 pt-3 text-xs text-slate-600">
                          <span>📍 {wilayaName}</span>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
                <p className="text-slate-600">Aucun médecin trouvé avec ces critères.</p>
                <button
                  onClick={() => setFilters({ wilaya: '', specialty: '', gender: '' })}
                  className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default SearchDoctors;

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await apiClient.get(`/doctors/${id}`);
        setDoctor(response.data);
      } catch (err) {
        console.error('Error fetching doctor details:', err);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDoctor();
  }, [id]);

  const doctorData = doctor || {
    id,
    firstName: 'Yasmine',
    lastName: 'Ben Fatima',
    specialty: 'Cardiologie',
    wilaya: 'Alger',
    rating: 4.9,
    reviews: 127,
    consultationPrice: 4500,
    experience: '12 ans',
    about: 'Spécialisée en cardiologie générale et interventionnelle, avec une expertise particulière dans le traitement des maladies cardiovasculaires chroniques. Formation continue en France et Belgique.',
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement du profil du médecin...</div>;
  }

  const firstName = doctorData.user?.firstName || doctorData.firstName || '';
  const lastName = doctorData.user?.lastName || doctorData.lastName || '';
  const specialty = doctorData.specialty?.name || doctorData.specialty || 'Cardiologie';
  const wilaya = doctorData.wilaya?.name || doctorData.wilaya || 'Alger';
  const rating = doctorData.rating || 4.9;
  const reviews = doctorData.reviews || 127;
  const price = doctorData.consultationPrice || doctorData.price || 4500;
  const experience = doctorData.experience || '12 ans';
  const about = doctorData.user?.bio || doctorData.about || 'Spécialisée en cardiologie générale et interventionnelle, avec une expertise particulière dans le traitement des maladies cardiovasculaires chroniques. Formation continue en France et Belgique.';

  const fullName = `${firstName} ${lastName}`.trim();
  return (
    <>
      {/* Profile Header */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-8">
            <div className="flex-shrink-0">
              <div className="h-28 w-28 rounded-full overflow-hidden shadow-lg bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center">
                {doctorData.photo ? (
                  <img src={doctorData.photo} alt={fullName} className="h-full w-full object-cover" />
                ) : (
                  <div className="text-5xl font-bold text-white">{fullName.charAt(0)}</div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-blue-200 text-sm font-semibold uppercase tracking-wide">Médecin vérifié</p>
              <h1 className="mt-2 text-4xl font-bold">{fullName || 'Dr. Yasmine Ben Fatima'}</h1>
              <p className="mt-2 text-lg text-blue-100">{specialty}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <span className="rounded-full bg-white/20 px-4 py-2">📍 {wilaya}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={() => navigate(`/booking/${id}`)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-8 py-3 font-semibold text-white transition hover:bg-blue-600 text-lg"
              >
                🗓️ Réserver maintenant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Main Info */}
          <div className="space-y-8">

            {/* About */}
            <div className="rounded-3xl bg-white p-8 shadow-md border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Présentation</h2>
              <p className="mt-4 leading-relaxed text-slate-600">{about}</p>
            </div>

            {/* Qualifications removed by request */}

            {/* Public reçu removed by request */}

            {/* Tarifs et remboursement removed by request */}

            {/* Moyens de paiement removed by request */}

            {/* Disponibilités removed by request */}

            {/* Types de consultations removed by request */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Addresses moved here per request */}
            <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200">
              <div className="flex items-start justify-between">
                <h2 className="text-base font-semibold text-slate-900">Adresses</h2>
                <a href="#addresses" className="text-sm text-blue-600">Voir plus</a>
              </div>
              <div className="mt-4 text-sm text-slate-700">
                {doctorData.addresses && doctorData.addresses.length > 0 ? (
                  doctorData.addresses.map((addr, idx) => (
                    <div key={idx} className="mb-3">
                      <div className="font-medium">{addr.name || addr.location || 'KAP CARE ESPACE SANTE'}</div>
                      <div className="text-xs text-slate-500">{addr.street || addr.address || '385 Avenue de l\'Argonne'}</div>
                      <div className="text-xs text-slate-500">{addr.city || addr.wilaya || '33700 Mérignac'}</div>
                    </div>
                  ))
                ) : (
                  <div>Adresse du cabinet non renseignée.</div>
                )}
              </div>
            </div>
            {/* Summary / Pricing Card removed by request */}

            {/* Quick Info */}
            {/* Langues, Assurances acceptées, Localisation removed by request */}

            {/* Horaires d'ouverture */}
            <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200">
              <h3 className="font-semibold text-slate-900">Horaires d'ouverture</h3>
              <ol className="mt-3 text-sm text-slate-600 list-decimal list-inside space-y-1">
                <li>lundi: 08h15 - 17h30</li>
                <li>mardi: 08h15 - 17h30</li>
                <li>mercredi: 08h15 - 13h00</li>
                <li>jeudi: 08h15 - 17h30</li>
                <li>vendredi: Fermé</li>
                <li>samedi: Fermé</li>
                <li>dimanche: Fermé</li>
              </ol>
            </div>

            {/* Horaires et coordonnées removed by request */}

            {/* Reviews Preview */}
            {/* Avis patients removed by request */}
          </div>
        </div>
      </section>
    </>
  );
};

export default DoctorProfile;

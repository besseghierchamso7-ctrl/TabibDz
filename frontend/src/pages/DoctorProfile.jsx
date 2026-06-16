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
    address: '385 Avenue de l\'Argonne, 33700 Mérignac',
    availability: {
      monday: { enabled: true, startTime: '08:00', endTime: '17:00' },
      tuesday: { enabled: true, startTime: '08:00', endTime: '17:00' },
      wednesday: { enabled: true, startTime: '08:00', endTime: '17:00' },
      thursday: { enabled: true, startTime: '08:00', endTime: '17:00' },
      friday: { enabled: true, startTime: '08:00', endTime: '17:00' },
      saturday: { enabled: false, startTime: '08:00', endTime: '17:00' },
      sunday: { enabled: false, startTime: '08:00', endTime: '17:00' }
    },
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
  const address = doctorData.address || doctorData.user?.address || 'Adresse du cabinet non renseignée.';
  const about = doctorData.bio || doctorData.user?.bio || doctorData.about || 'Spécialisée en cardiologie générale et interventionnelle, avec une expertise particulière dans le traitement des maladies cardiovasculaires chroniques. Formation continue en France et Belgique.';
  const availability = doctorData.availability || { days: [], timeSlots: [] };
  const dayLabels = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche'
  };

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

            {/* Horaires d'ouverture */}
            <div className="rounded-3xl bg-white p-8 shadow-md border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Horaires d'ouverture</h2>
              {Object.keys(availability).some(day => availability[day]?.enabled) ? (
                <div className="mt-6 space-y-3">
                  {Object.entries(availability).map(([day, hours]) => 
                    hours?.enabled ? (
                      <div key={day} className="flex justify-between items-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <span className="font-semibold text-slate-800">{dayLabels[day]}</span>
                        <span className="text-slate-700">
                          {hours.startTime} - {hours.endTime}
                        </span>
                      </div>
                    ) : null
                  )}
                </div>
              ) : (
                <p className="mt-4 text-slate-500">Aucun horaire renseigné pour le moment.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Adresses */}
            <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">Adresses</h2>
                <a href="#addresses" className="text-sm text-blue-600">Voir plus</a>
              </div>
              <div className="mt-4 text-sm text-slate-700">
                <div className="mb-3">
                  <div className="font-medium">Cabinet principal</div>
                  <div className="text-xs text-slate-500">{address}</div>
                </div>
              </div>
            </div>

            {/* Horaires d'ouverture résumé */}
            <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200">
              <h3 className="font-semibold text-slate-900">Horaires d'ouverture</h3>
              {Object.keys(availability).some(day => availability[day]?.enabled) ? (
                <div className="mt-3 text-sm text-slate-600 space-y-2">
                  {Object.entries(availability).map(([day, hours]) =>
                    hours?.enabled ? (
                      <div key={day} className="flex justify-between">
                        <span>{dayLabels[day] || day}</span>
                        <span className="font-medium">{hours.startTime} - {hours.endTime}</span>
                      </div>
                    ) : null
                  )}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">Aucun horaire renseigné.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DoctorProfile;

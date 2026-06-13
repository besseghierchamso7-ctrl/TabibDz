import { useParams, Link } from 'react-router-dom';

const DoctorProfile = () => {
  const { id } = useParams();

  const doctor = {
    id,
    name: 'Dr. Yasmine Ben Fatima',
    specialty: 'Cardiologie',
    wilaya: 'Alger',
    rating: 4.9,
    reviews: 127,
    price: 4500,
    experience: '12 ans',
    about: 'Spécialisée en cardiologie générale et interventionnelle, avec une expertise particulière dans le traitement des maladies cardiovasculaires chroniques. Formation continue en France et Belgique.',
    languages: ['Français', 'Arabe', 'Anglais'],
    degrees: ['Médecine Générale - Université d\'Alger (2010)', 'Cardiologie - Université de Paris (2015)'],
    availability: { days: ['Lundi', 'Mercredi', 'Vendredi', 'Samedi'], hours: '09:00 - 17:00' },
    consultationType: ['Consultation pressentielle', 'Téléconsultation'],
    insurance: 'CNAS, CASNOS, Privé'
  };

  return (
    <>
      {/* Profile Header */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-8">
            <div className="flex-shrink-0">
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-5xl font-bold text-white shadow-lg">
                {doctor.name.charAt(4)}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-blue-200 text-sm font-semibold uppercase tracking-wide">Médecin vérifié</p>
              <h1 className="mt-2 text-4xl font-bold">{doctor.name}</h1>
              <p className="mt-2 text-lg text-blue-100">{doctor.specialty}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-4 py-2 font-semibold">
                  ⭐ {doctor.rating} ({doctor.reviews} avis)
                </span>
                <span className="rounded-full bg-white/20 px-4 py-2">{doctor.experience} d'expérience</span>
                <span className="rounded-full bg-white/20 px-4 py-2">📍 {doctor.wilaya}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Link to={`/booking/${id}`} className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-8 py-3 font-semibold text-white transition hover:bg-blue-600 text-lg">
                🗓️ Réserver maintenant
              </Link>
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
              <h2 className="text-2xl font-bold text-slate-900">À propos</h2>
              <p className="mt-4 leading-relaxed text-slate-600">{doctor.about}</p>
            </div>

            {/* Qualifications */}
            <div className="rounded-3xl bg-white p-8 shadow-md border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Diplômes & Certifications</h2>
              <ul className="mt-6 space-y-3">
                {doctor.degrees.map((degree, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-blue-600 text-lg">🎓</span>
                    <span className="text-slate-700">{degree}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Availability */}
            <div className="rounded-3xl bg-white p-8 shadow-md border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Disponibilités</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-slate-600">Jours</p>
                  <div className="mt-2 space-y-2">
                    {doctor.availability.days.map((day) => (
                      <span key={day} className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 border border-blue-200">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600">Horaires</p>
                  <p className="mt-2 rounded-lg bg-blue-50 px-4 py-2 text-sm text-slate-700 border border-blue-200">
                    {doctor.availability.hours}
                  </p>
                </div>
              </div>
            </div>

            {/* Consultation Types */}
            <div className="rounded-3xl bg-white p-8 shadow-md border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Types de consultations</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {doctor.consultationType.map((type) => (
                  <div key={type} className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                    <p className="text-slate-700 font-medium">{type}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 p-8 shadow-md border border-blue-200 sticky top-20">
              <p className="text-xs font-semibold uppercase text-blue-600 tracking-wide">Tarif de consultation</p>
              <p className="mt-4 text-4xl font-bold text-slate-900">{doctor.price} DA</p>
              <p className="mt-2 text-sm text-slate-600">Consultation pressentielle ou téléconsultation</p>
              <Link to={`/booking/${id}`} className="mt-6 block w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700">
                Réserver une consultation
              </Link>
            </div>

            {/* Quick Info */}
            <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-600 tracking-wide">Langues</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {doctor.languages.map((lang) => (
                    <span key={lang} className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-xs font-semibold uppercase text-slate-600 tracking-wide">Assurances acceptées</p>
                <p className="mt-2 text-sm text-slate-700">{doctor.insurance}</p>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-xs font-semibold uppercase text-slate-600 tracking-wide">Localisation</p>
                <p className="mt-2 text-sm text-slate-700">📍 {doctor.wilaya}, Algérie</p>
              </div>
            </div>

            {/* Reviews Preview */}
            <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Avis patients</h3>
                <span className="text-2xl font-bold text-amber-500">{doctor.rating}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{doctor.reviews} avis vérifiés</p>
              <div className="mt-4 space-y-2">
                {[5, 4.5, 5].map((rate, idx) => (
                  <div key={idx} className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400">{'⭐'.repeat(Math.floor(rate))}</span>
                      <span className="text-slate-600">Excellent service</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DoctorProfile;

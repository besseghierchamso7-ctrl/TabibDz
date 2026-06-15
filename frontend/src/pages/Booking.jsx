import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import apiClient from '../api/apiClient';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ date: '', time: '', reason: '' });
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState({ dateRanges: [], availability: null });
  const [expandedDateIndex, setExpandedDateIndex] = useState(0);
  const [visibleDates, setVisibleDates] = useState(3);

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const [{ data: doctorData }, { data: availabilityData }] = await Promise.all([
          apiClient.get(`/doctors/${id}`),
          apiClient.get(`/doctors/${id}/availability?days=14`)
        ]);
        setDoctor(doctorData);
        setAvailability(availabilityData);
        if (availabilityData.dateRanges?.length) {
          setFormData((prev) => ({ ...prev, date: availabilityData.dateRanges[0].date, time: availabilityData.dateRanges[0].times[0] || '' }));
        }
      } catch (err) {
        console.error('Error fetching doctor or availability:', err);
        setError('Impossible de charger les informations du médecin ou ses créneaux disponibles.');
      }
    };

    if (id) fetchDoctor();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatFrenchDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const reasons = [
    'Première consultation',
    'Deuxième consultation'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!formData.reason) {
        setError('Veuillez sélectionner un motif de consultation.');
        return;
      }
      setStep(2);
      return;
    }

    if (!user) {
      setError('Vous devez être connecté pour réserver');
      return;
    }

    setIsLoading(true);
    try {
      const scheduledAt = `${formData.date}T${formData.time}:00.000Z`;
      await apiClient.post('/appointments', {
        doctorId: id,
        scheduledAt,
        reason: formData.reason,
        price: doctor?.consultationPrice || doctor?.price || 3000
      });
      alert('Rendez-vous réservé avec succès!');
      navigate('/dashboard/patient');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">Prenez votre rendez-vous en ligne</h1>
          <p className="mt-3 text-slate-600">Renseignez les informations suivantes</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
          <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200">
            <button
              type="button"
              onClick={() => (step === 1 ? navigate(-1) : setStep(1))}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 mb-6"
            >
              <span className="text-xl">←</span> Étape précédente
            </button>
            <h2 className="text-2xl font-semibold text-slate-900">
              {step === 1 ? 'Choisissez votre motif de consultation' : 'Choisissez la date de consultation'}
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              {step === 1
                ? 'Sélectionnez le motif qui correspond le mieux à votre besoin.'
                : 'Choisissez une date et un créneau horaire disponibles pour votre consultation.'}
            </p>

            {step === 1 ? (
              <div className="mt-8 space-y-4">
                {reasons.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setFormData({ ...formData, reason })}
                    className={`w-full rounded-3xl border px-6 py-5 text-left transition ${formData.reason === reason ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-blue-300'}`}>
                    <p className="font-medium text-slate-900">{reason}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Date de consultation</p>
                      <p className="mt-2 text-sm text-slate-600">Choisissez le jour qui vous convient.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {availability.dateRanges?.slice(0, visibleDates).map((range, index) => {
                    const isOpen = index === expandedDateIndex;
                    return (
                      <div key={range.date} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedDateIndex(index);
                            setFormData({ ...formData, date: range.date, time: range.times[0] || '' });
                          }}
                          className="flex items-center justify-between w-full px-5 py-4 text-left"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{formatFrenchDate(range.date)}</p>
                            <p className="mt-1 text-sm text-slate-600">{range.times.length} créneau{range.times.length > 1 ? 'x' : ''} disponible{range.times.length > 1 ? 's' : ''}</p>
                          </div>
                          <span className="text-slate-400">{isOpen ? '−' : '+'}</span>
                        </button>

                        {isOpen && (
                          <div className="border-t border-slate-200 bg-slate-50 p-4">
                            <div className="flex flex-wrap gap-3">
                              {range.times.map((time) => (
                                <button
                                  key={`${range.date}-${time}`}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, date: range.date, time })}
                                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${formData.date === range.date && formData.time === time ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200 hover:border-blue-300'}`}>
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {availability.dateRanges?.length > visibleDates && (
                  <button
                    type="button"
                    onClick={() => setVisibleDates((prev) => prev + 3)}
                    className="w-full rounded-full border border-blue-600 bg-white px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                  >
                    Voir plus de dates
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-lg bg-rose-50 border border-rose-200 p-4">
                <p className="text-sm font-medium text-rose-700">{error}</p>
              </div>
            )}

            {!user && (
              <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm text-amber-700">Vous devez <a href="/login" className="font-semibold underline">vous connecter</a> pour réserver un rendez-vous</p>
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Réservation en cours...' : step === 1 ? 'Continuer' : 'Confirmer la réservation'}
              </button>
            </div>
          </form>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-lg border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
                  {doctor?.user?.firstName?.charAt(0) || doctor?.firstName?.charAt(0) || 'D'}
                </div>
                <div>
                  <p className="text-sm text-slate-500">Dr</p>
                  <h3 className="text-xl font-semibold text-slate-900">{doctor?.user?.firstName || doctor?.firstName || 'Emma'} {doctor?.user?.lastName || doctor?.lastName || 'OUVARD'}</h3>
                  <p className="mt-1 text-sm text-slate-600">{doctor?.specialty?.name || doctor?.specialty || 'Cardiologue'}</p>
                </div>
              </div>
              <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Votre rendez-vous en détail</p>
                <p className="mt-4 text-sm text-slate-600">385 Avenue de l'Argonne, 33700 Mérignac</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default Booking;

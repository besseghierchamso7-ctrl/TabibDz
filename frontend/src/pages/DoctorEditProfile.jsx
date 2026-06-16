import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import apiClient from '../api/apiClient';
import { AuthContext } from '../contexts/AuthContext';

const DoctorEditProfile = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    address: '',
    bio: '',
    availability: {
      monday: { enabled: false, startTime: '08:00', endTime: '17:00' },
      tuesday: { enabled: false, startTime: '08:00', endTime: '17:00' },
      wednesday: { enabled: false, startTime: '08:00', endTime: '17:00' },
      thursday: { enabled: false, startTime: '08:00', endTime: '17:00' },
      friday: { enabled: false, startTime: '08:00', endTime: '17:00' },
      saturday: { enabled: false, startTime: '08:00', endTime: '17:00' },
      sunday: { enabled: false, startTime: '08:00', endTime: '17:00' }
    }
  });

  const availableDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche'
  };

  // Fetch doctor profile on mount
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        // Get current user's doctor profile
        const response = await apiClient.get('/doctors/me');
        setDoctor(response.data);
        
        // Initialize availability from response data
        const availabilityData = response.data.availability || {};
        const initialAvailability = {
          monday: { enabled: false, startTime: '08:00', endTime: '17:00' },
          tuesday: { enabled: false, startTime: '08:00', endTime: '17:00' },
          wednesday: { enabled: false, startTime: '08:00', endTime: '17:00' },
          thursday: { enabled: false, startTime: '08:00', endTime: '17:00' },
          friday: { enabled: false, startTime: '08:00', endTime: '17:00' },
          saturday: { enabled: false, startTime: '08:00', endTime: '17:00' },
          sunday: { enabled: false, startTime: '08:00', endTime: '17:00' }
        };
        
        // Map old format (days array) to new format if needed
        if (availabilityData.days && availabilityData.days.length > 0) {
          availabilityData.days.forEach(day => {
            initialAvailability[day].enabled = true;
          });
        }
        
        // Merge with new format if available
        Object.keys(availabilityData).forEach(key => {
          if (key !== 'days' && initialAvailability[key]) {
            initialAvailability[key] = { ...initialAvailability[key], ...availabilityData[key] };
          }
        });
        
        setFormData({
          address: response.data.address || '',
          bio: response.data.bio || '',
          availability: initialAvailability
        });
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
        setError('Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'doctor') {
      fetchDoctorProfile();
    } else {
      setError('Vous n\'êtes pas autorisé à accéder à cette page');
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          enabled: !prev.availability[day].enabled
        }
      }
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.address.trim()) {
      setError('L\'adresse est requise');
      return;
    }
    if (!formData.bio.trim()) {
      setError('La présentation est requise');
      return;
    }
    
    // Check if at least one day is selected
    const enabledDays = availableDays.filter(day => formData.availability[day].enabled);
    if (enabledDays.length === 0) {
      setError('Sélectionnez au moins un jour de disponibilité');
      return;
    }
    
    // Validate time ranges
    for (let day of enabledDays) {
      const { startTime, endTime } = formData.availability[day];
      if (!startTime || !endTime) {
        setError(`Veuillez saisir les horaires pour ${dayLabels[day]}`);
        return;
      }
      if (startTime >= endTime) {
        setError(`L'heure de fin doit être après l'heure de début pour ${dayLabels[day]}`);
        return;
      }
    }

    setSaving(true);
    setError('');

    try {
      const response = await apiClient.put(`/doctors/${doctor._id}`, formData);
      setDoctor(response.data);
      alert('Profil mis à jour avec succès!');
      setTimeout(() => navigate('/dashboard/doctor'), 1500);
    } catch (err) {
      console.error('Error updating doctor profile:', err);
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error && !doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800 font-semibold">{error}</p>
          <button
            onClick={() => navigate('/dashboard/doctor')}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/doctor')}
            className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Retour
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Modifier mon profil</h1>
          <p className="mt-2 text-slate-600">Mettez à jour vos informations professionnelles</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Adresses Section */}
          <div className="rounded-3xl bg-white p-8 shadow-md border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">📍 Adresses</h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Adresse du cabinet
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Ex: 123 Rue de la Paix, Alger 16000"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              <p className="mt-2 text-sm text-slate-500">
                Entrez l'adresse complète de votre cabinet ou lieu de consultation
              </p>
            </div>
          </div>

          {/* Présentation Section */}
          <div className="rounded-3xl bg-white p-8 shadow-md border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">✍️ Présentation</h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Votre présentation
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Parlez de votre expérience, expertise, formations..."
                rows={6}
                maxLength={1000}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
              />
              <p className="mt-2 text-sm text-slate-500">
                {formData.bio.length}/1000 caractères
              </p>
            </div>
          </div>

          {/* Horaires d'ouverture Section */}
          <div className="rounded-3xl bg-white p-8 shadow-md border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">🕒 Horaires d'ouverture</h2>
            
            <div className="space-y-4">
              {availableDays.map(day => (
                <div key={day} className="flex items-end gap-4 p-4 rounded-lg border border-slate-200 hover:border-blue-300 transition">
                  {/* Day Toggle */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`day-${day}`}
                      checked={formData.availability[day].enabled}
                      onChange={() => handleDayToggle(day)}
                      className="w-5 h-5 accent-blue-600 cursor-pointer"
                    />
                    <label htmlFor={`day-${day}`} className="text-sm font-semibold text-slate-700 cursor-pointer w-24">
                      {dayLabels[day]}
                    </label>
                  </div>

                  {/* Time Range Inputs */}
                  {formData.availability[day].enabled && (
                    <>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">De</label>
                        <input
                          type="time"
                          value={formData.availability[day].startTime}
                          onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">À</label>
                        <input
                          type="time"
                          value={formData.availability[day].endTime}
                          onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            <p className="mt-6 text-sm text-slate-500">
              ✓ Cochez le jour et définissez vos horaires d'ouverture (ex: 08:00 à 15:30)
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard/doctor')}
              className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorEditProfile;

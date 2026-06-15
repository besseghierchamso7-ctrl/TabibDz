import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [profileFields, setProfileFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    avatar: ''
  });
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileFields({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setProfileFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus('Mise à jour en cours...');

    try {
      await updateProfile(profileFields);
      setStatus('Profil mis à jour avec succès');
    } catch (error) {
      setStatus(error.message || 'Échec de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-white shadow-sm border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">Mon profil</h1>
          <p className="mt-2 text-slate-600">Mettez à jour vos informations personnelles ici, sans passer par le tableau de bord.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200">
          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Prénom</label>
              <input
                value={profileFields.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
                className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Nom</label>
              <input
                value={profileFields.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
                className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                value={profileFields.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Téléphone</label>
              <input
                value={profileFields.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Genre</label>
              <select
                value={profileFields.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Sélectionner</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Avatar (URL)</label>
              <input
                value={profileFields.avatar}
                onChange={(e) => handleChange('avatar', e.target.value)}
                className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                placeholder="https://..."
              />
            </div>

            <div className="lg:col-span-2">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">{status}</p>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Profile;

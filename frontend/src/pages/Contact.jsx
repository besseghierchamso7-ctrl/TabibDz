import { useState } from 'react';

const Contact = () => {
  const [formStatus, setFormStatus] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('Envoi en cours...');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormStatus('Message envoyé avec succès! Nous vous répondrons bientôt.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus(''), 5000);
    } catch (error) {
      setFormStatus('Erreur lors de l\'envoi du message.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-600 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold sm:text-5xl">Nous contacter</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            Avez-vous des questions ou besoin d'aide ? Notre équipe est là pour vous aider 24/7.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Contact Form */}
          <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">Envoyez-nous un message</h2>
            <p className="mt-2 text-slate-600">Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24 heures.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Nom complet</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none transition"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none transition"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Sujet</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none transition"
                  placeholder="Sujet de votre message"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none transition resize-none"
                  placeholder="Décrivez votre question ou demande..."
                />
              </div>

              {formStatus && (
                <p className={`text-sm font-medium ${formStatus.includes('succès') ? 'text-emerald-600' : formStatus.includes('Erreur') ? 'text-rose-600' : 'text-blue-600'}`}>
                  {formStatus}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-95"
              >
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Informations</h3>
              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-2xl">📧</p>
                  <p className="mt-2 font-medium text-slate-900">Email</p>
                  <p className="mt-1 text-slate-600 break-all">support@tabibdz.com</p>
                </div>
                <div>
                  <p className="text-2xl">📞</p>
                  <p className="mt-2 font-medium text-slate-900">Téléphone</p>
                  <p className="mt-1 text-slate-600">+213 (0) 123 45 67</p>
                </div>
                <div>
                  <p className="text-2xl">🕐</p>
                  <p className="mt-2 font-medium text-slate-900">Horaires</p>
                  <p className="mt-1 text-slate-600">Lun - Dim: 8h - 20h</p>
                </div>
                <div>
                  <p className="text-2xl">📍</p>
                  <p className="mt-2 font-medium text-slate-900">Adresse</p>
                  <p className="mt-1 text-slate-600">Alger, Algérie</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-blue-50 p-8 border border-blue-200">
              <p className="text-sm font-semibold text-blue-600">💡 Conseil</p>
              <p className="mt-2 text-sm text-slate-700">
                Pour une réponse plus rapide, veuillez fournir tous les détails pertinents et être aussi descriptif que possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Questions fréquentes</h2>
            <p className="mt-4 text-slate-600">Trouvez des réponses aux questions les plus posées</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900">Comment réserver une consultation ?</h3>
              <p className="mt-2 text-sm text-slate-600">Créez un compte, recherchez un médecin, et sélectionnez un créneau disponible. C'est aussi simple que ça!</p>
            </div>
            <div className="rounded-2xl bg-white p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900">Puis-je annuler ma réservation ?</h3>
              <p className="mt-2 text-sm text-slate-600">Oui, vous pouvez annuler ou modifier votre rendez-vous jusqu'à 24h avant la date prévue.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900">Comment les médecins sont-ils vérifiés ?</h3>
              <p className="mt-2 text-sm text-slate-600">Chaque médecin est manuellement vérifié par notre équipe administrative avant d'apparaître sur la plateforme.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900">Mes données sont-elles sécurisées ?</h3>
              <p className="mt-2 text-sm text-slate-600">Oui! Nous utilisons le chiffrement SSL et respectons les normes de protection des données personnelles.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;

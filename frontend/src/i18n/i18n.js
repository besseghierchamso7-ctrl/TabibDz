import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

const resources = {
  en: {
    translation: {
      common: {
        appName: 'Tabib DZ',
        tagline: 'Intelligent Medical Platform',
        language: 'English',
        logout: 'Logout',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        back: 'Back'
      },
      nav: {
        home: 'Home',
        doctors: 'Find Doctor',
        dashboard: 'Dashboard',
        appointments: 'Appointments',
        profile: 'Profile',
        admin: 'Admin',
        login: 'Login',
        register: 'Register'
      },
      home: {
        hero: 'Find and Book Your Doctor Online',
        heroSub: 'The most advanced medical appointment and clinic management platform in Algeria',
        searchPlaceholder: 'Search doctor, specialty, location...',
        availableToday: 'Available Today',
        topDoctors: 'Top Rated Doctors',
        specialties: 'Popular Specialties',
        howItWorks: 'How It Works',
        step1: 'Search Doctors',
        step2: 'Book Appointment',
        step3: 'Consult Online',
        step4: 'Get Prescription'
      },
      auth: {
        login: 'Login',
        register: 'Register',
        forgotPassword: 'Forgot Password?',
        email: 'Email',
        password: 'Password',
        firstName: 'First Name',
        lastName: 'Last Name',
        phone: 'Phone Number',
        rememberMe: 'Remember me',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
        signUp: 'Sign Up',
        signIn: 'Sign In'
      },
      doctor: {
        profile: 'Doctor Profile',
        specialty: 'Specialty',
        experience: 'Experience',
        patients: 'Patients',
        rating: 'Rating',
        reviews: 'Reviews',
        workingHours: 'Working Hours',
        consultationPrice: 'Consultation Price',
        telehealth: 'Teleconsultation Available',
        bookNow: 'Book Now',
        consultationType: 'Consultation Type',
        inPerson: 'In-Person',
        online: 'Online',
        qualifications: 'Qualifications'
      },
      appointment: {
        appointments: 'Appointments',
        upcomingAppointments: 'Upcoming Appointments',
        pastAppointments: 'Past Appointments',
        date: 'Date',
        time: 'Time',
        doctor: 'Doctor',
        status: 'Status',
        pending: 'Pending',
        confirmed: 'Confirmed',
        completed: 'Completed',
        cancelled: 'Cancelled',
        reschedule: 'Reschedule',
        bookAppointment: 'Book Appointment',
        selectDate: 'Select Date',
        selectTime: 'Select Time',
        confirmBooking: 'Confirm Booking',
        reason: 'Reason for Visit',
        cancel: 'Cancel Appointment'
      },
      queue: {
        queue: 'Queue',
        queueNumber: 'Queue Number',
        currentNumber: 'Current Patient Number',
        positionInQueue: 'Your Position',
        estimatedWaitTime: 'Estimated Wait Time',
        patientsAhead: 'Patients Ahead',
        minutes: 'minutes'
      },
      prescription: {
        prescriptions: 'Prescriptions',
        medications: 'Medications',
        dosage: 'Dosage',
        duration: 'Duration',
        downloadPDF: 'Download PDF',
        print: 'Print'
      },
      patient: {
        myAppointments: 'My Appointments',
        medicalHistory: 'Medical History',
        documents: 'Documents',
        prescriptions: 'Prescriptions',
        uploadDocument: 'Upload Document'
      }
    }
  },
  fr: {
    translation: {
      common: {
        appName: 'Tabib DZ',
        tagline: 'Plateforme Médicale Intelligente',
        language: 'Français',
        logout: 'Déconnexion',
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        cancel: 'Annuler',
        save: 'Enregistrer',
        delete: 'Supprimer',
        edit: 'Modifier',
        back: 'Retour'
      },
      nav: {
        home: 'Accueil',
        doctors: 'Trouver un Médecin',
        dashboard: 'Tableau de Bord',
        appointments: 'Rendez-vous',
        profile: 'Profil',
        admin: 'Admin',
        login: 'Connexion',
        register: "S'inscrire"
      },
      home: {
        hero: 'Trouvez et Réservez Votre Médecin en Ligne',
        heroSub: 'La plateforme la plus avancée de gestion de rendez-vous médicaux en Algérie',
        searchPlaceholder: 'Chercher un médecin, spécialité, lieu...',
        availableToday: 'Disponible Aujourd\'hui',
        topDoctors: 'Médecins les Mieux Notés',
        specialties: 'Spécialités Populaires',
        howItWorks: 'Comment Ça Marche',
        step1: 'Chercher un Médecin',
        step2: 'Réserver une Consultation',
        step3: 'Consulter en Ligne',
        step4: 'Obtenir une Ordonnance'
      },
      auth: {
        login: 'Connexion',
        register: "S'inscrire",
        forgotPassword: 'Mot de passe oublié?',
        email: 'Email',
        password: 'Mot de passe',
        firstName: 'Prénom',
        lastName: 'Nom',
        phone: 'Numéro de Téléphone',
        rememberMe: 'Se souvenir de moi',
        noAccount: "Vous n'avez pas de compte?",
        haveAccount: 'Vous avez déjà un compte?',
        signUp: "S'inscrire",
        signIn: 'Se connecter'
      },
      doctor: {
        profile: 'Profil du Médecin',
        specialty: 'Spécialité',
        experience: 'Expérience',
        patients: 'Patients',
        rating: 'Évaluation',
        reviews: 'Avis',
        workingHours: 'Heures de Travail',
        consultationPrice: 'Prix de Consultation',
        telehealth: 'Téléconsultation Disponible',
        bookNow: 'Réserver Maintenant',
        consultationType: 'Type de Consultation',
        inPerson: 'En Personne',
        online: 'En Ligne',
        qualifications: 'Qualifications'
      },
      appointment: {
        appointments: 'Rendez-vous',
        upcomingAppointments: 'Rendez-vous à Venir',
        pastAppointments: 'Rendez-vous Passés',
        date: 'Date',
        time: 'Heure',
        doctor: 'Médecin',
        status: 'Statut',
        pending: 'En Attente',
        confirmed: 'Confirmé',
        completed: 'Terminé',
        cancelled: 'Annulé',
        reschedule: 'Reprogrammer',
        bookAppointment: 'Réserver une Consultation',
        selectDate: 'Sélectionner la Date',
        selectTime: 'Sélectionner l\'Heure',
        confirmBooking: 'Confirmer la Réservation',
        reason: 'Motif de la Visite',
        cancel: 'Annuler le Rendez-vous'
      },
      queue: {
        queue: 'File d\'Attente',
        queueNumber: 'Numéro de File',
        currentNumber: 'Numéro du Patient Actuel',
        positionInQueue: 'Votre Position',
        estimatedWaitTime: 'Temps d\'Attente Estimé',
        patientsAhead: 'Patients Devant Vous',
        minutes: 'minutes'
      },
      prescription: {
        prescriptions: 'Ordonnances',
        medications: 'Médicaments',
        dosage: 'Dosage',
        duration: 'Durée',
        downloadPDF: 'Télécharger PDF',
        print: 'Imprimer'
      },
      patient: {
        myAppointments: 'Mes Rendez-vous',
        medicalHistory: 'Historique Médical',
        documents: 'Documents',
        prescriptions: 'Ordonnances',
        uploadDocument: 'Télécharger un Document'
      }
    }
  },
  ar: {
    translation: {
      common: {
        appName: 'طبيب الجزائر',
        tagline: 'منصة طبية ذكية',
        language: 'العربية',
        logout: 'تسجيل الخروج',
        loading: 'جاري التحميل...',
        error: 'خطأ',
        success: 'نجاح',
        cancel: 'إلغاء',
        save: 'حفظ',
        delete: 'حذف',
        edit: 'تعديل',
        back: 'رجوع'
      },
      nav: {
        home: 'الرئيسية',
        doctors: 'ابحث عن طبيب',
        dashboard: 'لوحة التحكم',
        appointments: 'المواعيد',
        profile: 'الملف الشخصي',
        admin: 'الإدارة',
        login: 'دخول',
        register: 'تسجيل'
      },
      home: {
        hero: 'ابحث واحجز موعدك الطبي أونلاين',
        heroSub: 'أكثر منصة متقدمة لإدارة المواعيد الطبية والعيادات في الجزائر',
        searchPlaceholder: 'ابحث عن طبيب، تخصص، موقع...',
        availableToday: 'متاح اليوم',
        topDoctors: 'أفضل الأطباء',
        specialties: 'التخصصات الشهيرة',
        howItWorks: 'كيف يعمل',
        step1: 'ابحث عن طبيب',
        step2: 'احجز موعد',
        step3: 'استشير أونلاين',
        step4: 'احصل على وصفة'
      },
      auth: {
        login: 'دخول',
        register: 'تسجيل',
        forgotPassword: 'هل نسيت كلمة المرور؟',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        firstName: 'الاسم الأول',
        lastName: 'اسم العائلة',
        phone: 'رقم الهاتف',
        rememberMe: 'تذكرني',
        noAccount: 'ليس لديك حساب؟',
        haveAccount: 'هل لديك حساب بالفعل؟',
        signUp: 'تسجيل',
        signIn: 'دخول'
      },
      doctor: {
        profile: 'ملف الطبيب',
        specialty: 'التخصص',
        experience: 'الخبرة',
        patients: 'المرضى',
        rating: 'التقييم',
        reviews: 'التقييمات',
        workingHours: 'ساعات العمل',
        consultationPrice: 'سعر الاستشارة',
        telehealth: 'الاستشارة عن بعد متاحة',
        bookNow: 'احجز الآن',
        consultationType: 'نوع الاستشارة',
        inPerson: 'حضوري',
        online: 'أونلاين',
        qualifications: 'المؤهلات'
      },
      appointment: {
        appointments: 'المواعيد',
        upcomingAppointments: 'المواعيد القادمة',
        pastAppointments: 'المواعيد السابقة',
        date: 'التاريخ',
        time: 'الوقت',
        doctor: 'الطبيب',
        status: 'الحالة',
        pending: 'في الانتظار',
        confirmed: 'مؤكد',
        completed: 'مكتمل',
        cancelled: 'ملغى',
        reschedule: 'إعادة جدولة',
        bookAppointment: 'احجز موعد',
        selectDate: 'اختر التاريخ',
        selectTime: 'اختر الوقت',
        confirmBooking: 'تأكيد الحجز',
        reason: 'سبب الزيارة',
        cancel: 'إلغاء الموعد'
      },
      queue: {
        queue: 'قائمة الانتظار',
        queueNumber: 'رقم الانتظار',
        currentNumber: 'رقم المريض الحالي',
        positionInQueue: 'موقعك',
        estimatedWaitTime: 'وقت الانتظار المتوقع',
        patientsAhead: 'المرضى أمامك',
        minutes: 'دقيقة'
      },
      prescription: {
        prescriptions: 'الوصفات',
        medications: 'الأدوية',
        dosage: 'الجرعة',
        duration: 'المدة',
        downloadPDF: 'تحميل PDF',
        print: 'طباعة'
      },
      patient: {
        myAppointments: 'مواعيدي',
        medicalHistory: 'السجل الطبي',
        documents: 'المستندات',
        prescriptions: 'الوصفات',
        uploadDocument: 'تحميل مستند'
      }
    }
  }
};

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const es = {
  app: { name: 'Community Hub', tagline: 'Conectando comunidades', loading: 'Cargando...' },
  auth: {
    login: 'Iniciar sesión', register: 'Registrarse', logout: 'Cerrar sesión',
    email: 'Correo electrónico', password: 'Contraseña', confirmPassword: 'Confirmar contraseña',
    fullName: 'Nombre completo', birthDate: 'Fecha de nacimiento',
    ageError: 'Debes tener al menos 16 años', loginWithGoogle: 'Continuar con Google',
    forgotPassword: '¿Olvidaste tu contraseña?', noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?', createAccount: 'Crear cuenta',
    welcomeBack: 'Bienvenido de nuevo', joinCommunity: 'Únete a nuestra comunidad',
    rememberMe: 'Recordarme', or: 'o'
  },
  navigation: {
    home: 'Inicio', communities: 'Comunidades', myCommunities: 'Mis comunidades',
    explore: 'Explorar', profile: 'Perfil', settings: 'Ajustes', about: 'Acerca de', menu: 'Menú'
  },
  community: {
    create: 'Crear comunidad', createTitle: 'Crear nueva comunidad', name: 'Nombre',
    description: 'Descripción', logo: 'Logo', slug: 'URL', maxMembers: 'Límite de miembros',
    settings: 'Configuración', members: 'Miembros', join: 'Unirse', leave: 'Salir',
    invite: 'Invitar', manage: 'Gestionar', requireApproval: 'Requerir aprobación',
    requireOnboarding: 'Requerir onboarding', postsNeedApproval: 'Posts necesitan aprobación',
    allowGuests: 'Permitir invitados', memberCount: '{{count}} miembros',
    upload: 'Subir imagen'
  },
  roles: { admin: 'Admin', moderator: 'Moderador', member: 'Miembro', guest: 'Invitado' },
  feed: {
    title: 'Feed', newPost: 'Nueva publicación', createPost: 'Crear publicación',
    titlePlaceholder: 'Título', contentPlaceholder: '¿Qué quieres compartir?',
    publish: 'Publicar', noPosts: 'No hay publicaciones', loadMore: 'Cargar más',
    comments: 'Comentarios', likes: 'Me gusta', share: 'Compartir'
  },
  events: {
    title: 'Eventos', newEvent: 'Nuevo evento', createEvent: 'Crear evento',
    eventName: 'Nombre', eventDescription: 'Descripción', location: 'Ubicación',
    startDate: 'Inicio', endDate: 'Fin', maxAttendees: 'Capacidad máxima',
    types: { meetup: 'Encuentro', webinar: 'Webinar', workshop: 'Taller', social: 'Social' },
    rsvp: 'Asistiré', cancelRsvp: 'Cancelar', attendees: 'Asistentes', noEvents: 'Sin eventos'
  },
  polls: {
    title: 'Encuestas', newPoll: 'Nueva encuesta', createPoll: 'Crear encuesta',
    question: 'Pregunta', options: 'Opciones', addOption: 'Añadir opción',
    singleChoice: 'Única', multipleChoice: 'Múltiple', anonymous: 'Anónima',
    vote: 'Votar', totalVotes: 'Votos', noPolls: 'Sin encuestas'
  },
  settings: {
    title: 'Ajustes', language: 'Idioma', theme: 'Tema', notifications: 'Notificaciones',
    account: 'Cuenta', security: 'Seguridad',
    themes: { light: 'Claro', dark: 'Oscuro', ocean: 'Océano', forest: 'Bosque', sunset: 'Atardecer' },
    unlockPremium: 'Desbloquear temas premium', enterCode: 'Código', unlock: 'Desbloquear',
    premiumUnlocked: '¡Temas desbloqueados!', version: 'Versión', year: '2026',
    rights: 'Todos los derechos reservados', developer: 'Desarrollador', author: 'Vertil Jivenson',
    donate: 'Apoyar proyecto'
  },
  profile: { title: 'Perfil', edit: 'Editar', save: 'Guardar', changePhoto: 'Cambiar foto', joined: 'Miembro desde' },
  about: {
    title: 'Acerca de', description: 'Community Hub es una plataforma para gestión de comunidades locales.',
    mission: 'Nuestra misión es conectar comunidades.', developer: 'Desarrollador',
    donate: 'Apoyar', copyright: '© 2026 Vertil Jivenson. Todos los derechos reservados.'
  },
  errors: { generic: 'Ha ocurrido un error', notFound: 'No encontrado', unauthorized: 'No autorizado' },
  common: { save: 'Guardar', cancel: 'Cancelar', delete: 'Eliminar', edit: 'Editar', create: 'Crear', search: 'Buscar', close: 'Cerrar', open: 'Abrir', back: 'Atrás', continue: 'Continuar', submit: 'Enviar', success: 'Éxito', error: 'Error', loading: 'Cargando...', noResults: 'Sin resultados', manage: 'Gestionar' }
};

const fr = {
  app: { name: 'Community Hub', tagline: 'Connecter les communautés', loading: 'Chargement...' },
  auth: {
    login: 'Se connecter', register: "S'inscrire", logout: 'Se déconnecter',
    email: 'E-mail', password: 'Mot de passe', confirmPassword: 'Confirmer',
    fullName: 'Nom complet', birthDate: 'Date de naissance',
    ageError: 'Vous devez avoir au moins 16 ans', loginWithGoogle: 'Continuer avec Google',
    forgotPassword: 'Mot de passe oublié?', noAccount: 'Pas de compte?',
    hasAccount: 'Déjà un compte?', createAccount: 'Créer un compte',
    welcomeBack: 'Bon retour', joinCommunity: 'Rejoignez notre communauté',
    rememberMe: 'Se souvenir', or: 'ou'
  },
  navigation: {
    home: 'Accueil', communities: 'Communautés', myCommunities: 'Mes communautés',
    explore: 'Explorer', profile: 'Profil', settings: 'Paramètres', about: 'À propos', menu: 'Menu'
  },
  community: {
    create: 'Créer une communauté', createTitle: 'Créer une communauté', name: 'Nom',
    description: 'Description', logo: 'Logo', slug: 'URL', maxMembers: 'Limite',
    settings: 'Configuration', members: 'Membres', join: 'Rejoindre', leave: 'Quitter',
    invite: 'Inviter', manage: 'Gérer', requireApproval: 'Exiger approbation',
    requireOnboarding: 'Exiger onboarding', postsNeedApproval: 'Posts nécessitent approbation',
    allowGuests: 'Permettre invités', memberCount: '{{count}} membres',
    upload: 'Télécharger'
  },
  roles: { admin: 'Admin', moderator: 'Modérateur', member: 'Membre', guest: 'Invité' },
  feed: {
    title: 'Fil', newPost: 'Nouvelle publication', createPost: 'Créer publication',
    titlePlaceholder: 'Titre', contentPlaceholder: 'Que voulez-vous partager?',
    publish: 'Publier', noPosts: 'Pas de publications', loadMore: 'Charger plus',
    comments: 'Commentaires', likes: "J'aime", share: 'Partager'
  },
  events: {
    title: 'Événements', newEvent: 'Nouvel événement', createEvent: 'Créer événement',
    eventName: 'Nom', eventDescription: 'Description', location: 'Lieu',
    startDate: 'Début', endDate: 'Fin', maxAttendees: 'Capacité',
    types: { meetup: 'Rencontre', webinar: 'Webinaire', workshop: 'Atelier', social: 'Social' },
    rsvp: 'Je participe', cancelRsvp: 'Annuler', attendees: 'Participants', noEvents: 'Sans événements'
  },
  polls: {
    title: 'Sondages', newPoll: 'Nouveau sondage', createPoll: 'Créer sondage',
    question: 'Question', options: 'Options', addOption: 'Ajouter option',
    singleChoice: 'Unique', multipleChoice: 'Multiple', anonymous: 'Anonyme',
    vote: 'Voter', totalVotes: 'Votes', noPolls: 'Sans sondages'
  },
  settings: {
    title: 'Paramètres', language: 'Langue', theme: 'Thème', notifications: 'Notifications',
    account: 'Compte', security: 'Sécurité',
    themes: { light: 'Clair', dark: 'Sombre', ocean: 'Océan', forest: 'Forêt', sunset: 'Coucher' },
    unlockPremium: 'Débloquer thèmes premium', enterCode: 'Code', unlock: 'Débloquer',
    premiumUnlocked: 'Thèmes débloqués!', version: 'Version', year: '2026',
    rights: 'Tous droits réservés', developer: 'Développeur', author: 'Vertil Jivenson',
    donate: 'Soutenir'
  },
  profile: { title: 'Profil', edit: 'Modifier', save: 'Enregistrer', changePhoto: 'Changer photo', joined: 'Membre depuis' },
  about: {
    title: 'À propos', description: 'Community Hub est une plateforme pour la gestion de communautés.',
    mission: 'Notre mission est de connecter les communautés.', developer: 'Développeur',
    donate: 'Soutenir', copyright: '© 2026 Vertil Jivenson. Tous droits réservés.'
  },
  errors: { generic: 'Une erreur est survenue', notFound: 'Non trouvé', unauthorized: 'Non autorisé' },
  common: { save: 'Enregistrer', cancel: 'Annuler', delete: 'Supprimer', edit: 'Modifier', create: 'Créer', search: 'Rechercher', close: 'Fermer', open: 'Ouvrir', back: 'Retour', continue: 'Continuer', submit: 'Soumettre', success: 'Succès', error: 'Erreur', loading: 'Chargement...', noResults: 'Pas de résultats', manage: 'Gérer' }
};

const translations = { es, fr };
export type Language = 'es' | 'fr';

interface I18nState {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const useI18n = create<I18nState>()(
  persist(
    (set, get) => ({
      lang: 'es',
      setLang: (lang) => set({ lang }),
      t: (key: string, params?: Record<string, string | number>) => {
        const { lang } = get();
        const keys = key.split('.');
        let value: any = translations[lang];
        for (const k of keys) {
          if (value && typeof value === 'object') value = value[k];
          else { value = undefined; break; }
        }
        if (typeof value !== 'string') return key;
        if (params) {
          return Object.entries(params).reduce((acc, [k, v]) => acc.replace(`{{${k}}}`, String(v)), value);
        }
        return value;
      },
    }),
    { name: 'i18n-storage' }
  )
);

export const useTranslation = () => {
  const { lang, setLang, t } = useI18n();
  return { t, lang, changeLanguage: setLang };
};

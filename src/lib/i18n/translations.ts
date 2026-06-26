// UI translation strings. English is the source of truth; other locales
// fall back to English for any missing key.
const en = {
  'nav.home': 'Home',
  'nav.explore': 'Explore',
  'nav.about': 'About Us',
  'nav.addListing': 'Add Listing',
  'nav.signIn': 'Sign In',
  'hero.subtitle':
    'Discover top-rated restaurants hotels tours beaches and activities across Rhodes all in one place.',
  'hero.searchWhat': 'What are you looking for?',
  'hero.location': 'Location',
  'hero.allCategories': 'All categories',
  'hero.search': 'Search',
  'footer.community': 'Community',
  'footer.gettingStarted': 'Getting Started',
  'footer.business': 'Rhodes Things To Do Business',
  'footer.getInTouch': 'Get In Touch',
  'footer.rights': 'All rights reserved.',
  'cookie.title': 'We value your privacy',
  'cookie.text':
    'We use cookies to analyse traffic and improve your experience on Rhodes Things To Do.',
  'cookie.accept': 'Accept',
  'cookie.decline': 'Decline',
  'cookie.learn': 'Learn more',
};

export type TranslationKey = keyof typeof en;
type Dict = Partial<Record<TranslationKey, string>>;

const el: Dict = {
  'nav.home': 'Αρχική',
  'nav.explore': 'Εξερεύνηση',
  'nav.about': 'Σχετικά',
  'nav.addListing': 'Καταχώριση',
  'nav.signIn': 'Σύνδεση',
  'hero.subtitle':
    'Βρείτε κορυφαία εστιατόρια, ξενοδοχεία, εκδρομές, παραλίες και δραστηριότητες σε όλη τη Ρόδο, όλα σε ένα μέρος.',
  'hero.searchWhat': 'Τι ψάχνετε;',
  'hero.location': 'Τοποθεσία',
  'hero.allCategories': 'Όλες οι κατηγορίες',
  'hero.search': 'Αναζήτηση',
  'footer.community': 'Κοινότητα',
  'footer.gettingStarted': 'Ξεκινήστε',
  'footer.business': 'Rhodes Things To Do για Επιχειρήσεις',
  'footer.getInTouch': 'Επικοινωνία',
  'footer.rights': 'Με επιφύλαξη παντός δικαιώματος.',
  'cookie.title': 'Σεβόμαστε το απόρρητό σας',
  'cookie.text':
    'Χρησιμοποιούμε cookies για ανάλυση επισκεψιμότητας και βελτίωση της εμπειρίας σας στο Rhodes Things To Do.',
  'cookie.accept': 'Αποδοχή',
  'cookie.decline': 'Απόρριψη',
  'cookie.learn': 'Μάθετε περισσότερα',
};

const de: Dict = {
  'nav.home': 'Startseite',
  'nav.explore': 'Entdecken',
  'nav.about': 'Über uns',
  'nav.addListing': 'Eintrag hinzufügen',
  'nav.signIn': 'Anmelden',
  'hero.subtitle':
    'Finden Sie Top-Restaurants, Hotels, Touren, Strände und Aktivitäten auf ganz Rhodos, Griechenland – alles an einem Ort.',
  'hero.searchWhat': 'Wonach suchen Sie?',
  'hero.location': 'Ort',
  'hero.allCategories': 'Alle Kategorien',
  'hero.search': 'Suchen',
  'footer.community': 'Community',
  'footer.gettingStarted': 'Erste Schritte',
  'footer.business': 'Rhodes Things To Do für Unternehmen',
  'footer.getInTouch': 'Kontakt',
  'footer.rights': 'Alle Rechte vorbehalten.',
  'cookie.title': 'Ihre Privatsphäre ist uns wichtig',
  'cookie.text':
    'Wir verwenden Cookies, um den Verkehr zu analysieren und Ihr Erlebnis auf Rhodes Things To Do zu verbessern.',
  'cookie.accept': 'Akzeptieren',
  'cookie.decline': 'Ablehnen',
  'cookie.learn': 'Mehr erfahren',
};

const fr: Dict = {
  'nav.home': 'Accueil',
  'nav.explore': 'Explorer',
  'nav.about': 'À propos',
  'nav.addListing': 'Ajouter une annonce',
  'nav.signIn': 'Connexion',
  'hero.subtitle':
    'Trouvez les meilleurs restaurants, hôtels, excursions, plages et activités à travers Rhodes, en Grèce, le tout au même endroit.',
  'hero.searchWhat': 'Que recherchez-vous ?',
  'hero.location': 'Lieu',
  'hero.allCategories': 'Toutes les catégories',
  'hero.search': 'Rechercher',
  'footer.community': 'Communauté',
  'footer.gettingStarted': 'Pour commencer',
  'footer.business': 'Rhodes Things To Do pour les entreprises',
  'footer.getInTouch': 'Contact',
  'footer.rights': 'Tous droits réservés.',
  'cookie.title': 'Nous respectons votre vie privée',
  'cookie.text':
    'Nous utilisons des cookies pour analyser le trafic et améliorer votre expérience sur Rhodes Things To Do.',
  'cookie.accept': 'Accepter',
  'cookie.decline': 'Refuser',
  'cookie.learn': 'En savoir plus',
};

const es: Dict = {
  'nav.home': 'Inicio',
  'nav.explore': 'Explorar',
  'nav.about': 'Acerca de',
  'nav.addListing': 'Añadir negocio',
  'nav.signIn': 'Iniciar sesión',
  'hero.subtitle':
    'Encuentra los mejores restaurantes, hoteles, excursiones, playas y actividades de toda Rodas, Grecia, todo en un solo lugar.',
  'hero.searchWhat': '¿Qué estás buscando?',
  'hero.location': 'Ubicación',
  'hero.allCategories': 'Todas las categorías',
  'hero.search': 'Buscar',
  'footer.community': 'Comunidad',
  'footer.gettingStarted': 'Primeros pasos',
  'footer.business': 'Rhodes Things To Do para empresas',
  'footer.getInTouch': 'Contacto',
  'footer.rights': 'Todos los derechos reservados.',
  'cookie.title': 'Valoramos tu privacidad',
  'cookie.text':
    'Usamos cookies para analizar el tráfico y mejorar tu experiencia en Rhodes Things To Do.',
  'cookie.accept': 'Aceptar',
  'cookie.decline': 'Rechazar',
  'cookie.learn': 'Más información',
};

const it: Dict = {
  'nav.home': 'Home',
  'nav.explore': 'Esplora',
  'nav.about': 'Chi siamo',
  'nav.addListing': 'Aggiungi attività',
  'nav.signIn': 'Accedi',
  'hero.subtitle':
    'Trova i migliori ristoranti, hotel, tour, spiagge e attività in tutta Rodi, Grecia, tutto in un unico posto.',
  'hero.searchWhat': 'Cosa stai cercando?',
  'hero.location': 'Località',
  'hero.allCategories': 'Tutte le categorie',
  'hero.search': 'Cerca',
  'footer.community': 'Comunità',
  'footer.gettingStarted': 'Per iniziare',
  'footer.business': 'Rhodes Things To Do per le aziende',
  'footer.getInTouch': 'Contatti',
  'footer.rights': 'Tutti i diritti riservati.',
  'cookie.title': 'Teniamo alla tua privacy',
  'cookie.text':
    'Utilizziamo i cookie per analizzare il traffico e migliorare la tua esperienza su Rhodes Things To Do.',
  'cookie.accept': 'Accetta',
  'cookie.decline': 'Rifiuta',
  'cookie.learn': 'Scopri di più',
};

const nl: Dict = {
  'nav.home': 'Home',
  'nav.explore': 'Ontdekken',
  'nav.about': 'Over ons',
  'nav.addListing': 'Bedrijf toevoegen',
  'nav.signIn': 'Inloggen',
  'hero.subtitle':
    'Vind de best beoordeelde restaurants, hotels, tours, stranden en activiteiten op heel Rhodos, Griekenland, allemaal op één plek.',
  'hero.searchWhat': 'Waar ben je naar op zoek?',
  'hero.location': 'Locatie',
  'hero.allCategories': 'Alle categorieën',
  'hero.search': 'Zoeken',
  'footer.community': 'Community',
  'footer.gettingStarted': 'Aan de slag',
  'footer.business': 'Rhodes Things To Do voor bedrijven',
  'footer.getInTouch': 'Contact',
  'footer.rights': 'Alle rechten voorbehouden.',
  'cookie.title': 'Wij waarderen uw privacy',
  'cookie.text':
    'We gebruiken cookies om het verkeer te analyseren en uw ervaring op Rhodes Things To Do te verbeteren.',
  'cookie.accept': 'Accepteren',
  'cookie.decline': 'Weigeren',
  'cookie.learn': 'Meer informatie',
};

export const translations: Record<string, Dict> = { en, el, de, fr, es, it, nl };

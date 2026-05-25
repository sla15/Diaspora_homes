export type Language = 'en' | 'fr' | 'es';

export interface Translations {
  // Navigation
  home: string;
  buyRent: string;
  services: string;
  sell: string;
  admin: string;
  searchPlaceholder: string;

  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroPlaceholder: string;
  discoverSanctuary: string;
  browseBuy: string;
  browseRent: string;
  exploreDestinations: string;
  exploreDestinationsSub: string;

  // Quick navigation
  buyCardTitle: string;
  buyCardDesc: string;
  rentCardTitle: string;
  rentCardDesc: string;
  agentsCardTitle: string;
  agentsCardDesc: string;
  hubsCardTitle: string;
  hubsCardDesc: string;
  vettedCrewCardTitle: string;
  vettedCrewCardDesc: string;
  findCrew: string;
  listYourProperty: string;
  browseListing: string;
  meetAgents: string;
  exploreOffices: string;

  // Layout Headers & Intros
  featuredPropertiesTitle: string;
  featuredPropertiesDesc: string;
  vettedProvidersTitle: string;
  vettedProvidersDesc: string;
  viewFullDirectory: string;
  marketInsightsTitle: string;
  marketInsightsDesc: string;

  // Property Details
  backToProperties: string;
  agentContact: string;
  whatsAppAgent: string;
  callAgent: string;
  propertyFeatures: string;
  locationDetails: string;
  mortgageCalculator: string;
  estimatedMonthly: string;
  downPayment: string;
  loanTerm: string;
  interestRate: string;
  disclaimer: string;

  // General buttons / Labels
  apply: string;
  cancel: string;
  submit: string;
  loading: string;
  vettedBadge: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    home: "Home",
    buyRent: "Buy/Rent",
    services: "Services",
    sell: "Sell",
    admin: "Admin",
    searchPlaceholder: "Search properties...",

    heroTitle: "Secure Your Global Sanctuary",
    heroSubtitle: "Explore premium and hand-picked global real estate assets worldwide. Discover, buy, or rent with total legal security and trusted support.",
    heroPlaceholder: "Search by country, city, or property type...",
    discoverSanctuary: "Discover Sanctuary",
    browseBuy: "Browse Properties for Sale",
    browseRent: "Browse Properties for Rent",
    exploreDestinations: "Explore Global Destinations",
    exploreDestinationsSub: "Curated premium locations with rising rental yields and high appreciation potential",

    buyCardTitle: "Acquire Luxury",
    buyCardDesc: "Discover off-market private villas, luxury penthouses, and high-yielding rental investments globally.",
    rentCardTitle: "Premium Rentals",
    rentCardDesc: "Secure high-end corporate suites and fully serviced beach villas for short-term or seasonal stays.",
    agentsCardTitle: "Verified Agents",
    agentsCardDesc: "Connect with certified local professionals who hold proper credentials and local real estate expertise.",
    hubsCardTitle: "Commercial Hubs",
    hubsCardDesc: "Acquire prime commercial retail spaces, co-working offices, and strategic high-traffic headquarters.",
    vettedCrewCardTitle: "Vetted Crew",
    vettedCrewCardDesc: "Access premium licensed builders, structural engineers, electricians, and plumbers across all regions.",

    findCrew: "Find Vetted Crew",
    listYourProperty: "List Your Property",
    browseListing: "Browse Listings",
    meetAgents: "Meet Top Agents",
    exploreOffices: "Explore Offices",

    featuredPropertiesTitle: "Featured Global Estates",
    featuredPropertiesDesc: "Hand-picked high-end investment opportunities verified for absolute legal, financial, and structural integrity.",
    vettedProvidersTitle: "Vetted Local Experts & Contractors",
    vettedProvidersDesc: "Review a sample of our pre-vetted builders, structural engineers, electricians, and legal escrow coordinators offering secured professional services.",
    viewFullDirectory: "View Directory",
    marketInsightsTitle: "Global Market Trends",
    marketInsightsDesc: "Strategic historical appraisal trends and yield insights compiled by international property experts.",

    backToProperties: "Back to Properties",
    agentContact: "Inquire with Professional Agent",
    whatsAppAgent: "Chat on WhatsApp",
    callAgent: "Direct Voice Call",
    propertyFeatures: "Premium Property Features",
    locationDetails: "Interactive Location Analysis",
    mortgageCalculator: "Financial Purchase Planner",
    estimatedMonthly: "Estimated Monthly Installment",
    downPayment: "Down Payment Requirement",
    loanTerm: "Loan Term Duration",
    interestRate: "Annual Interest Rate",
    disclaimer: "Legal Disclaimer: Mortgage estimations provided by this tool are for informational purposes only. Actual interest rates, loan approvals, Down Payment requirements, and monthly payment amounts will vary according to specific credit reviews, bank terms, and insurance policies by respective lenders in your target jurisdiction. Consult with a qualified financial institution before making investment decisions.",

    apply: "Apply for Verification",
    cancel: "Cancel",
    submit: "Submit Details",
    loading: "Processing request...",
    vettedBadge: "Vetted & Vouched"
  },
  fr: {
    home: "Accueil",
    buyRent: "Acheter/Louer",
    services: "Services",
    sell: "Vendre",
    admin: "Admin",
    searchPlaceholder: "Rechercher des propriétés...",

    heroTitle: "Sécurisez Votre Sanctuaire Global",
    heroSubtitle: "Explorez des actifs immobiliers mondiaux haut de gamme et sélectionnés à la main. Découvrez, achetez ou louez en toute sécurité juridique.",
    heroPlaceholder: "Rechercher par pays, ville, type de propriété...",
    discoverSanctuary: "Découvrir le Sanctuaire",
    browseBuy: "Parcourir les Ventes",
    browseRent: "Parcourir les Locations",
    exploreDestinations: "Explorez les Destinations Globales",
    exploreDestinationsSub: "Emplacements premium sélectionnés avec des rendements locatifs croissants et un fort potentiel d'appréciation",

    buyCardTitle: "Acquérir le Luxe",
    buyCardDesc: "Découvrez des villas privées hors marché, des penthouses de luxe et des investissements locatifs à haut rendement dans le monde entier.",
    rentCardTitle: "Locations Premium",
    rentCardDesc: "Sécurisez des suites d'affaires haut de gamme et des villas de plage avec service complet pour des séjours de courte durée.",
    agentsCardTitle: "Agents Vérifiés",
    agentsCardDesc: "Connectez-vous avec des professionnels locaux certifiés détenant les qualifications appropriées et l'expertise locale.",
    hubsCardTitle: "Centres Commerciaux",
    hubsCardDesc: "Acquérez des espaces commerciaux de premier choix, des bureaux de cotravail et des sièges sociaux stratégiques.",
    vettedCrewCardTitle: "Équipe Vérifiée",
    vettedCrewCardDesc: "Accédez à des constructeurs agréés premium, des ingénieurs structurels, des électriciens et des plombiers dans toutes les régions.",

    findCrew: "Trouver une Équipe",
    listYourProperty: "Inscrire un Bien",
    browseListing: "Parcourir les Biens",
    meetAgents: "Rencontrer nos Agents",
    exploreOffices: "Explorer les Bureaux",

    featuredPropertiesTitle: "Domaines Globaux en Vedette",
    featuredPropertiesDesc: "Sélection d'opportunités d'investissement haut de gamme vérifiées pour une intégrité juridique, financière et structurelle absolue.",
    vettedProvidersTitle: "Experts Locaux et Artisans Agréés",
    vettedProvidersDesc: "Consultez un échantillon de nos constructeurs agréés, ingénieurs structurels, électriciens et coordinateurs juridiques pré-vérifiés.",
    viewFullDirectory: "Voir l'Annuaire",
    marketInsightsTitle: "Tendances du Marché Mondial",
    marketInsightsDesc: "Tendances d'évaluation historique stratégiques et aperçus des rendements compilés par des experts immobiliers internationaux.",

    backToProperties: "Retour aux Propriétés",
    agentContact: "S'informer auprès de l'Agent Professionnel",
    whatsAppAgent: "Discuter sur WhatsApp",
    callAgent: "Appel Vocal Direct",
    propertyFeatures: "Caractéristiques Premium du Bien",
    locationDetails: "Analyse Interactive de l'Emplacement",
    mortgageCalculator: "Planificateur d'Achat Financier",
    estimatedMonthly: "Mensualité Estimée",
    downPayment: "Apport Initial Requis",
    loanTerm: "Durée du Prêt",
    interestRate: "Taux d'Intérêt Annuel",
    disclaimer: "Avis juridique: Les estimations hypothécaires fournies par cet outil sont à titre informatif uniquement. Les taux d'intérêt réels, les approbations de prêt, les exigences d'apport et les mensualités varieront selon les évaluations de crédit spécifiques, les conditions bancaires et les politiques d'assurance des prêteurs dans votre juridiction cible. Consultez un établissement financier qualifié avant de prendre des décisions d'investissement.",

    apply: "Demander une Vérification",
    cancel: "Annuler",
    submit: "Soumettre les Détails",
    loading: "Traitement en cours...",
    vettedBadge: "Validé et Approuvé"
  },
  es: {
    home: "Inicio",
    buyRent: "Comprar/Alquilar",
    services: "Servicios",
    sell: "Vender",
    admin: "Admin",
    searchPlaceholder: "Buscar propiedades...",

    heroTitle: "Asegure su Santuario Global",
    heroSubtitle: "Explore activos inmobiliarios globales de primera calidad seleccionados a mano en todo el mundo. Descubra, compre o alquile con total seguridad jurídica.",
    heroPlaceholder: "Buscar por país, ciudad o tipo de propiedad...",
    discoverSanctuary: "Descubrir el Santuario",
    browseBuy: "Explorar Propiedades en Venta",
    browseRent: "Explorar Propiedades en Alquiler",
    exploreDestinations: "Explore Destinos Globales",
    exploreDestinationsSub: "Ubicaciones premium seleccionadas con crecientes rendimientos de alquiler y alto potencial de valorización",

    buyCardTitle: "Adquirir Lujo",
    buyCardDesc: "Descubra villas privadas exclusivas, lofts de lujo e inversiones de alquiler de alto rendimiento en todo el mundo.",
    rentCardTitle: "Alquileres Premium",
    rentCardDesc: "Asegure suites ejecutivas de alta gama y villas de playa con servicio completo para estancias de corta duración o de temporada.",
    agentsCardTitle: "Agentes Verificados",
    agentsCardDesc: "Conéctese con profesionales locales certificados que cuenten con las credenciales adecuadas y experiencia en el mercado local.",
    hubsCardTitle: "Centros Comerciales",
    hubsCardDesc: "Adquiera locales comerciales de primer nivel, oficinas de cotrabajo y sedes corporativas estratégicas de alto tráfico.",
    vettedCrewCardTitle: "Personal Verificado",
    vettedCrewCardDesc: "Acceda a constructores licenciados de primera clase, ingenieros estructurales, electricistas y fontaneros en todas las regiones.",

    findCrew: "Buscar Personal",
    listYourProperty: "Publicar Propiedad",
    browseListing: "Buscar Anuncios",
    meetAgents: "Conocer Agentes",
    exploreOffices: "Explorar Oficinas",

    featuredPropertiesTitle: "Propiedades Globales Destacadas",
    featuredPropertiesDesc: "Oportunidades de inversión de alta gama cuidadosamente seleccionadas y verificadas para asegurar total integridad legal, financiera y estructural.",
    vettedProvidersTitle: "Expertos Locales y Contratistas Verificados",
    vettedProvidersDesc: "Revise una muestra de nuestros constructores autorizados, ingenieros estructurales, electricistas y coordinadores legales verificados.",
    viewFullDirectory: "Ver Directorio",
    marketInsightsTitle: "Tendencias del Mercado Global",
    marketInsightsDesc: "Tendencias de valoración histórica estratégica y análisis de rendimiento compilados por expertos internacionales en propiedades.",

    backToProperties: "Volver a Propiedades",
    agentContact: "Consultar con el Agente Profesional",
    whatsAppAgent: "Chatear por WhatsApp",
    callAgent: "Llamada de Voz Directa",
    propertyFeatures: "Características Premium de la Propiedad",
    locationDetails: "Análisis de Ubicación Interactivo",
    mortgageCalculator: "Planificador de Compra Financiera",
    estimatedMonthly: "Cuota Mensual Estimada",
    downPayment: "Pago Inicial Requerido",
    loanTerm: "Duración del Préstamo",
    interestRate: "Taux d'Intérêt Annuel / Tasa de Interés Anual",
    disclaimer: "Descargo de responsabilidad legal: Las estimaciones hipotecarias proporcionadas por esta herramienta tienen carácter puramente informativo. Los tipos de interés reales, las aprobaciones de préstamos, los requisitos de pago inicial y los importes de los pagos mensuales variarán según las revisiones de crédito específicas, las condiciones bancarias y las pólizas de seguro de los respectivos prestamistas en su territorio de destino. Consulte a una entidad financiera cualificada antes de tomar decisiones de inversión.",

    apply: "Solicitar Verificación",
    cancel: "Cancelar",
    submit: "Enviar Detalles",
    loading: "Procesando solicitud...",
    vettedBadge: "Verificado y Aprobado"
  }
};

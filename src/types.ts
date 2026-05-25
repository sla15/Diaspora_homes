export type CurrencyCode = 'GMD' | 'USD' | 'EUR' | 'GBP' | 'XOF' | 'CAD' | 'AUD' | 'JPY' | 'CNY' | 'CHF' | 'INR' | 'ZAR' | 'NGN' | 'BRL' | 'RUB' | 'KRW' | 'MXN' | 'AED' | 'SAR' | 'TRY';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rate: number; // Rate relative to GMD (Dalasi)
}

export const CURRENCIES: Currency[] = [
  { code: 'GMD', symbol: 'D', label: 'Gambian Dalasi', rate: 1 },
  { code: 'USD', symbol: '$', label: 'US Dollar', rate: 0.015 },
  { code: 'EUR', symbol: '€', label: 'Euro', rate: 0.014 },
  { code: 'GBP', symbol: '£', label: 'British Pound', rate: 0.012 },
  { code: 'XOF', symbol: 'CFA', label: 'West African CFA', rate: 9.15 },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar', rate: 0.020 },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar', rate: 0.023 },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen', rate: 2.25 },
  { code: 'CNY', symbol: '¥', label: 'Chinese Yuan', rate: 0.11 },
  { code: 'CHF', symbol: 'Fr', label: 'Swiss Franc', rate: 0.013 },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee', rate: 1.25 },
  { code: 'ZAR', symbol: 'R', label: 'South African Rand', rate: 0.28 },
  { code: 'NGN', symbol: '₦', label: 'Nigerian Naira', rate: 22.5 },
  { code: 'BRL', symbol: 'R$', label: 'Brazilian Real', rate: 0.075 },
  { code: 'RUB', symbol: '₽', label: 'Russian Ruble', rate: 1.40 },
  { code: 'KRW', symbol: '₩', label: 'South Korean Won', rate: 20.2 },
  { code: 'MXN', symbol: '$', label: 'Mexican Peso', rate: 0.25 },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham', rate: 0.055 },
  { code: 'SAR', symbol: '﷼', label: 'Saudi Riyal', rate: 0.056 },
  { code: 'TRY', symbol: '₺', label: 'Turkish Lira', rate: 0.48 },
];

export const COMMON_AMENITIES = [
  'Pool',
  'Solar Array',
  'Security',
  'Gym',
  'Parking',
  'Modern Kitchen',
  'Balcony',
  'Beachfront',
  'Eco-friendly',
  'Private Garden',
  'Furnished',
  'Smart Home',
  'Ocean View',
  'Wine Cellar',
  'AC'
];

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  type: 'buy' | 'rent';
  propertyType: 'villa' | 'apartment' | 'house' | 'land' | 'commercial';
  duration?: 'full' | 'monthly' | 'yearly' | 'daily' | 'weekly' | 'six-months';
  bedrooms: number;
  bathrooms: number;
  sittingRooms?: number;
  sqm: number;
  parking: number;
  description: string;
  images: string[];
  features: string[];
  agent: {
    name: string;
    role: string;
    rating: number;
    image: string;
    phone: string;
    whatsapp?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  coordinates: [number, number];
  isUserListing?: boolean;
}

export interface POI {
  id: string;
  title: string;
  description: string;
  category: 'landmark' | 'market' | 'nature' | 'beach';
  coordinates: [number, number];
}

export const POIS: POI[] = [
  {
    id: "table-mountain",
    title: "Table Mountain",
    description: "An iconic flat-topped mountain overlooking the city of Cape Town, South Africa.",
    category: 'nature',
    coordinates: [-33.9628, 18.4098]
  },
  {
    id: "hyde-park",
    title: "Hyde Park",
    description: "One of the largest royal parks in London, offering vast green space and a serene lake.",
    category: 'nature',
    coordinates: [51.5073, -0.1657]
  },
  {
    id: "blue-mountains",
    title: "Blue Mountains",
    description: "A majestic, heavily forested region in Jamaica known for Blue Mountain coffee.",
    category: 'nature',
    coordinates: [18.0463, -76.6548]
  },
  {
    id: "national-theatre",
    title: "National Arts Theatre",
    description: "The primary center for performing arts in Lagos, Nigeria, shaped like a military cap.",
    category: 'landmark',
    coordinates: [6.4913, 3.3698]
  },
  {
    id: "shibuya-crossing",
    title: "Shibuya Crossing",
    description: "The world's busiest pedestrian scramble crossing, located in Tokyo, Japan.",
    category: 'landmark',
    coordinates: [35.6595, 139.7005]
  },
  {
    id: "copacabana-beach",
    title: "Copacabana Beach",
    description: "A world-famous 4km crescent-shaped beach in Rio de Janeiro, Brazil.",
    category: 'beach',
    coordinates: [-22.9714, -43.1823]
  },
  {
    id: "tulum-ruins",
    title: "Tulum Archaeological Zone",
    description: "Stunning 13th-century walled Mayan ruins perched on cliffs above the Caribbean Sea.",
    category: 'landmark',
    coordinates: [20.2151, -87.4293]
  },
  {
    id: "black-star-square",
    title: "Black Star Square",
    description: "A monumental public square in Accra, Ghana, symbolizing independence and freedom.",
    category: 'landmark',
    coordinates: [5.5488, -0.1926]
  }
];

export const PROPERTIES: Property[] = [
  {
    id: "azure-sanctuary",
    title: "The Azure Sanctuary",
    location: "Clifton, Cape Town, South Africa",
    price: 82500000,
    currency: "D",
    type: 'buy',
    propertyType: 'villa',
    duration: 'full',
    bedrooms: 5,
    bathrooms: 6,
    sqm: 850,
    parking: 3,
    description: "Designed as a dialogue between modern brutalism and the serene Atlantic horizon, The Azure Sanctuary offers unparalleled luxury in Clifton, Cape Town. This estate features an open-concept living space that flows seamlessly onto a 200sqm travertine deck. Every room offers panoramic ocean views, framed by double-glazed acoustic glass to ensure total tranquility.",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop"
    ],
    features: [
      "Pool",
      "Solar Array",
      "Security",
      "Wine Cellar",
      "Gym",
      "Ocean View"
    ],
    agent: {
      name: "Mustapha Bah",
      role: "Listing Agent",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
      phone: "+27 21 777 7777",
      whatsapp: "+27 21 777 7777",
      instagram: "instagram.com/mustapha_realestate",
      facebook: "facebook.com/mustaphabah"
    },
    coordinates: [-33.9372, 18.3789]
  },
  {
    id: "kotu-heights",
    title: "Kensington Heights Loft",
    location: "Kensington, London, United Kingdom",
    price: 21120000,
    currency: "D",
    type: 'buy',
    propertyType: 'apartment',
    duration: 'full',
    bedrooms: 3,
    bathrooms: 2,
    sqm: 210,
    parking: 1,
    description: "Stylish boutique apartment interior in Kensington, contemporary European art on walls, soft neutral tones, evening lighting.",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"],
    features: ["Pool", "Modern Kitchen", "Balcony", "Security"],
    agent: {
      name: "Fatou Jallow",
      role: "Senior Consultant",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
      phone: "+44 20 3333 3333"
    },
    coordinates: [51.5014, -0.1921]
  },
  {
    id: "sanyang-beach",
    title: "Cabarete Breeze Beach House",
    location: "Cabarete, Puerto Plata, Dominican Republic",
    price: 12870000,
    currency: "D",
    type: 'buy',
    propertyType: 'house',
    duration: 'full',
    bedrooms: 2,
    bathrooms: 1,
    sqm: 120,
    parking: 2,
    description: "Minimalist pool house in Cabarete, white walls, turquoise water, palm tree shadows, bright sunny day.",
    images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop"],
    features: ["Beachfront", "Eco-friendly", "Private Garden", "Solar Array"],
    agent: {
      name: "Ebrima Sowe",
      role: "Property Manager",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
      phone: "+1 809 555 5555"
    },
    coordinates: [19.7497, -70.4087]
  },
  {
    id: "modern-apartment-fajara",
    title: "Modern Cantonments Suite",
    location: "Cantonments, Accra, Ghana",
    price: 45000,
    currency: "D",
    type: 'rent',
    propertyType: 'apartment',
    duration: 'monthly',
    bedrooms: 2,
    bathrooms: 2,
    sqm: 140,
    parking: 1,
    description: "Modern 2-bedroom apartment in the heart of Cantonments. Close to all amenities and premium business hubs.",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop"],
    features: ["Security", "Furnished", "Balcony", "AC"],
    agent: {
      name: "Fatou Jallow",
      role: "Senior Consultant",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
      phone: "+233 30 333 3333"
    },
    coordinates: [5.5683, -0.1708]
  },
  {
    id: "brufut-garden-plot",
    title: "Premium Residential Plot Epe",
    location: "Epe, Lagos State, Nigeria",
    price: 3500000,
    currency: "D",
    type: 'buy',
    propertyType: 'land',
    bedrooms: 0,
    bathrooms: 0,
    sqm: 600,
    parking: 0,
    description: "A perfectly rectangular 20m x 30m residential plot in the highly sought-after Epe development. Fully fenced, with water and electricity connections already at the boundary. Ready for immediate construction of your dream villa.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fee74a62?q=80&w=2070&auto=format&fit=crop"],
    features: ["Security", "Prime Location", "Solar Array"],
    agent: {
      name: "Mustapha Bah",
      role: "Listing Agent",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
      phone: "+234 1 777 7777"
    },
    coordinates: [6.5833, 3.9833]
  },
  {
    id: "bijilo-commercial-hub",
    title: "Westlands Elite Business Plaza",
    location: "Westlands, Nairobi, Kenya",
    price: 450000,
    currency: "D",
    type: 'rent',
    propertyType: 'commercial',
    duration: 'monthly',
    bedrooms: 0,
    bathrooms: 4,
    sqm: 450,
    parking: 10,
    description: "Prime commercial space in the main business sector of Westlands. Ideal for a flagship store, corporate office, or luxury showroom. Features large glass frontage, dedicated parking, and backup generator connectivity.",
    images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"],
    features: ["Security", "AC", "Parking", "Modern Kitchen"],
    agent: {
      name: "Fatou Jallow",
      role: "Senior Consultant",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
      phone: "+254 20 333 3333"
    },
    coordinates: [-1.2635, 36.8041]
  },
  {
    id: "tujereng-estate-land",
    title: "Agro-Residential Estate St. Elizabeth",
    location: "St. Elizabeth, Jamaica",
    price: 1800000,
    currency: "D",
    type: 'buy',
    propertyType: 'land',
    bedrooms: 0,
    bathrooms: 0,
    sqm: 1200,
    parking: 0,
    description: "Massive 1200sqm plot in the expanding and beautiful St. Elizabeth parish. Perfect for a large homestead with garden space or a multi-unit development. The area is known for its fertile soil and proximity to the highway.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fee74a62?q=80&w=2070&auto=format&fit=crop"],
    features: ["Eco-friendly", "Private Garden"],
    agent: {
      name: "Ebrima Sowe",
      role: "Property Manager",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
      phone: "+1 876 555 5555"
    },
    coordinates: [18.0264, -77.7770]
  },
  {
    id: "atlantic-breeze",
    title: "Dakar Ocean Breeze Villa",
    location: "Almadies, Dakar, Senegal",
    price: 48000000,
    currency: "D",
    type: 'buy',
    propertyType: 'villa',
    duration: 'full',
    bedrooms: 4,
    bathrooms: 4,
    sqm: 480,
    parking: 2,
    description: "Nestled along the premium coastline of Almadies, this modern architectural gem blends seamless indoor-outdoor living with breathtaking views of the ocean. Styled with high-end travertine tiles, custom hardwood accents, and floor-to-ceiling panoramic glass doors.",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
    ],
    features: [
      "Pool",
      "Solar Array",
      "Security",
      "Modern Kitchen",
      "AC"
    ],
    agent: {
      name: "Mustapha Bah",
      role: "Listing Agent",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
      phone: "+221 33 777 7777",
      whatsapp: "+221 33 777 7777",
      instagram: "instagram.com/mustapha_realestate",
      facebook: "facebook.com/mustaphabah"
    },
    coordinates: [14.7483, -17.5147]
  },
  {
    id: "senegambia-penthouse",
    title: "Saint-Tropez Luxury Penthouse",
    location: "Saint-Tropez, French Riviera, France",
    price: 150000,
    currency: "D",
    type: 'rent',
    propertyType: 'apartment',
    duration: 'monthly',
    bedrooms: 3,
    bathrooms: 3,
    sqm: 290,
    parking: 2,
    description: "An exclusive split-level penthouse in the ultra-trendy Saint-Tropez area. Walking distance to the finest restaurants and the beach. Premium finishes, luxury furnishings, and two massive rooftop entertaining terraces.",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop"
    ],
    features: [
      "Pool",
      "Security",
      "AC",
      "Balcony",
      "Modern Kitchen"
    ],
    agent: {
      name: "Fatou Jallow",
      role: "Senior Consultant",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
      phone: "+33 4 3333 3333",
      instagram: "instagram.com/fatou_jallow_property"
    },
    coordinates: [43.2678, 6.6405]
  },
  {
    id: "kerr-sering-estate",
    title: "Tulum Tropical Garden Estate",
    location: "Tulum, Quintana Roo, Mexico",
    price: 19500000,
    currency: "D",
    type: 'buy',
    propertyType: 'house',
    duration: 'full',
    bedrooms: 4,
    bathrooms: 3,
    sqm: 380,
    parking: 3,
    description: "Set in a beautifully landscaped half-acre tropical garden, this traditional yet modern family home is located in a quiet enclave of Tulum. Boasts high wooden ceilings, a massive poolside gazebo, and state-of-the-art climate-efficient engineering.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=2073&auto=format&fit=crop"
    ],
    features: [
      "Pool",
      "Security",
      "Private Garden",
      "Eco-friendly"
    ],
    agent: {
      name: "Ebrima Sowe",
      role: "Property Manager",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
      phone: "+52 984 555 5555"
    },
    coordinates: [20.2114, -87.4658]
  }
];

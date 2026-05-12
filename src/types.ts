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
    id: "arch-22",
    title: "Arch 22",
    description: "A commemorative arch on the road into Banjul, offering panoramic views of the city.",
    category: 'landmark',
    coordinates: [13.4564, -16.5819]
  },
  {
    id: "kachikally",
    title: "Kachikally Crocodile Pool",
    description: "A sacred crocodile pool in Bakau, used for fertility rituals.",
    category: 'nature',
    coordinates: [13.4764, -16.6719]
  },
  {
    id: "abuko",
    title: "Abuko Nature Reserve",
    description: "Gambia's first nature reserve, home to diverse wildlife and tropical flora.",
    category: 'nature',
    coordinates: [13.3933, -16.6500]
  },
  {
    id: "serekunda-market",
    title: "Serekunda Market",
    description: "The largest and busiest market in Gambia, a vibrant hub of local life.",
    category: 'market',
    coordinates: [13.4383, -16.6833]
  },
  {
    id: "bijilo-forest",
    title: "Bijilo Forest Park",
    description: "A coastal forest park known for its monkey population and birdlife.",
    category: 'nature',
    coordinates: [13.4333, -16.7250]
  },
  {
    id: "kotu-beach",
    title: "Kotu Beach",
    description: "One of Gambia's most popular beaches, known for its golden sands and birdwatching opportunities.",
    category: 'beach',
    coordinates: [13.4583, -16.7125]
  },
  {
    id: "craft-market",
    title: "Senegambia Craft Market",
    description: "A great place to find local woodcarvings, textiles, and traditional Gambian crafts.",
    category: 'market',
    coordinates: [13.4389, -16.7214]
  },
  {
    id: "fajara-golf",
    title: "Fajara Golf Club",
    description: "A historic golf course offering beautiful views and a relaxed atmosphere.",
    category: 'landmark',
    coordinates: [13.4722, -16.6917]
  }
];

export const PROPERTIES: Property[] = [
  {
    id: "azure-sanctuary",
    title: "The Azure Sanctuary",
    location: "Brufut Heights, West Coast Region, Gambia",
    price: 82500000,
    currency: "D",
    type: 'buy',
    propertyType: 'villa',
    duration: 'full',
    bedrooms: 5,
    bathrooms: 6,
    sqm: 850,
    parking: 3,
    description: "Designed as a dialogue between modern brutalism and the serene Atlantic horizon, The Azure Sanctuary offers unparalleled luxury in Brufut Heights. This estate features an open-concept living space that flows seamlessly onto a 200sqm travertine deck. Every room offers panoramic ocean views, framed by double-glazed acoustic glass to ensure total tranquility.",
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
      phone: "2207777777",
      whatsapp: "2207777777",
      instagram: "instagram.com/mustapha_realestate",
      facebook: "facebook.com/mustaphabah"
    },
    coordinates: [13.3833, -16.7667]
  },
  {
    id: "kotu-heights",
    title: "Kotu Heights Loft",
    location: "Kotu, Kanifing Municipality, Gambia",
    price: 21120000,
    currency: "D",
    type: 'buy',
    propertyType: 'apartment',
    duration: 'full',
    bedrooms: 3,
    bathrooms: 2,
    sqm: 210,
    parking: 1,
    description: "Stylish boutique apartment interior in Kotu, contemporary African art on walls, soft neutral tones, evening lighting.",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"],
    features: ["Pool", "Modern Kitchen", "Balcony", "Security"],
    agent: {
      name: "Fatou Jallow",
      role: "Senior Consultant",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
      phone: "2203333333"
    },
    coordinates: [13.4583, -16.7125]
  },
  {
    id: "sanyang-beach",
    title: "Sanyang Beach House",
    location: "Sanyang, West Coast Region, Gambia",
    price: 12870000,
    currency: "D",
    type: 'buy',
    propertyType: 'house',
    duration: 'full',
    bedrooms: 2,
    bathrooms: 1,
    sqm: 120,
    parking: 2,
    description: "Minimalist pool house in Sanyang, white walls, turquoise water, palm tree shadows, bright sunny day.",
    images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop"],
    features: ["Beachfront", "Eco-friendly", "Private Garden", "Solar Array"],
    agent: {
      name: "Ebrima Sowe",
      role: "Property Manager",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
      phone: "2205555555"
    },
    coordinates: [13.2667, -16.7833]
  },
  {
    id: "modern-apartment-fajara",
    title: "Modern Fajara Apartment",
    location: "Fajara, Kanifing Municipality, Gambia",
    price: 45000,
    currency: "D",
    type: 'rent',
    propertyType: 'apartment',
    duration: 'monthly',
    bedrooms: 2,
    bathrooms: 2,
    sqm: 140,
    parking: 1,
    description: "Modern 2-bedroom apartment in the heart of Fajara. Close to all amenities and the beach.",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop"],
    features: ["Security", "Furnished", "Balcony", "AC"],
    agent: {
      name: "Fatou Jallow",
      role: "Senior Consultant",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
      phone: "2203333333"
    },
    coordinates: [13.4722, -16.6917]
  }
];

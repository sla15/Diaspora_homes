import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Plus, 
  LayoutDashboard, 
  User, 
  ChevronRight, 
  SlidersHorizontal,
  ChevronDown,
  Pencil, 
  Share2, 
  Eye, 
  Heart,
  ArrowLeft,
  Lock,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Globe,
  MessageCircle,
  Waves,
  Zap,
  Shield,
  Wine,
  Wifi,
  Car,
  Tv,
  Coffee,
  Utensils,
  Wind,
  Check,
  LogOut,
  ImagePlus,
  X,
  Bed,
  Bath,
  Maximize,
  Trash2,
  Armchair
} from 'lucide-react';
import { LocationPicker } from './LocationPicker';

import { CustomDropdown } from './CustomDropdown';

interface SellerViewProps {
  onBack: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
}

const Tooltip = ({ children, text }: { children: React.ReactNode, text: string }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-primary text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-primary"></div>
    </div>
  </div>
);

import { Property } from '../types';

export const SellerView: React.FC<SellerViewProps> = ({ onBack, isLoggedIn, setIsLoggedIn, properties, setProperties }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    twitter: '',
    website: ''
  });

  const [listingFormData, setListingFormData] = useState({
    id: null as string | null,
    propertyName: '',
    propertyType: 'villa' as Property['propertyType'],
    listingType: 'buy' as 'buy' | 'rent',
    price: '',
    currency: 'GMD' as Property['currency'],
    duration: 'full' as Property['duration'],
    location: '',
    bedrooms: '',
    bathrooms: '',
    sittingRooms: '',
    parking: '',
    size: '',
    description: '',
    amenities: [] as string[],
    lat: '13.4432',
    lng: '-16.6475',
    images: [] as string[]
  });

  // Filter properties that were created by the user
  const listings = properties.filter(p => p.isUserListing);

  const handleEdit = (listing: Property) => {
    setListingFormData({
      id: listing.id,
      propertyName: listing.title,
      propertyType: listing.propertyType,
      listingType: listing.type,
      price: listing.price.toString(),
      currency: listing.currency || 'GMD',
      duration: listing.duration || 'full',
      location: listing.location,
      bedrooms: listing.bedrooms.toString(),
      bathrooms: listing.bathrooms.toString(),
      sittingRooms: listing.sittingRooms?.toString() || '',
      parking: listing.parking.toString(),
      size: listing.sqm.toString(),
      description: listing.description,
      amenities: listing.features,
      lat: listing.coordinates[0].toString(),
      lng: listing.coordinates[1].toString(),
      images: listing.images
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      setProperties(prev => prev.filter(l => l.id !== showDeleteConfirm));
      setShowDeleteConfirm(null);
    }
  };

  const handleSubmitListing = () => {
    if (!isFormValid()) return;

    const priceNum = parseFloat(listingFormData.price.replace(/,/g, '')) || 0;
    const bedroomsNum = parseInt(listingFormData.bedrooms) || 0;
    const bathroomsNum = parseInt(listingFormData.bathrooms) || 0;
    const sittingRoomsNum = parseInt(listingFormData.sittingRooms) || 0;
    const parkingNum = parseInt(listingFormData.parking) || 0;
    const sizeNum = parseInt(listingFormData.size) || 0;
    const latNum = parseFloat(listingFormData.lat) || 13.4432;
    const lngNum = parseFloat(listingFormData.lng) || -16.6475;

    if (listingFormData.id) {
      // Update existing listing
      setProperties(prev => prev.map(l => l.id === listingFormData.id ? {
        ...l,
        title: listingFormData.propertyName,
        propertyType: listingFormData.propertyType,
        type: listingFormData.listingType,
        price: priceNum,
        currency: listingFormData.currency,
        duration: listingFormData.duration,
        location: listingFormData.location,
        bedrooms: bedroomsNum,
        bathrooms: bathroomsNum,
        sittingRooms: sittingRoomsNum,
        parking: parkingNum,
        sqm: sizeNum,
        description: listingFormData.description,
        features: listingFormData.amenities,
        coordinates: [latNum, lngNum],
        images: listingFormData.images.length > 0 ? listingFormData.images : [l.images[0]]
      } : l));
    } else {
      // Create new listing
      const newListing: Property = {
        id: Math.random().toString(36).substr(2, 9),
        title: listingFormData.propertyName,
        propertyType: listingFormData.propertyType,
        type: listingFormData.listingType,
        price: priceNum,
        currency: listingFormData.currency,
        duration: listingFormData.duration,
        location: listingFormData.location,
        bedrooms: bedroomsNum,
        bathrooms: bathroomsNum,
        sittingRooms: sittingRoomsNum,
        parking: parkingNum,
        sqm: sizeNum,
        description: listingFormData.description,
        features: listingFormData.amenities,
        coordinates: [latNum, lngNum],
        images: listingFormData.images.length > 0 ? listingFormData.images : ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop"],
        isUserListing: true,
        agent: {
          name: formData.name || "Mustapha Bah",
          role: "Listing Agent",
          rating: 5,
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
          phone: formData.phone || "2207777777",
          whatsapp: formData.whatsapp,
          instagram: formData.instagram,
          facebook: formData.facebook,
          linkedin: formData.linkedin
        }
      };
      setProperties(prev => [newListing, ...prev]);
    }

    // Reset form
    setListingFormData({
      id: null,
      propertyName: '',
      propertyType: 'villa',
      listingType: 'buy',
      price: '',
      currency: 'GMD',
      duration: 'full',
      location: '',
      bedrooms: '',
      bathrooms: '',
      sittingRooms: '',
      parking: '',
      size: '',
      description: '',
      amenities: [],
      lat: '13.4432',
      lng: '-16.6475',
      images: []
    });
  };

  const isFormValid = () => {
    return (
      listingFormData.propertyName.trim() !== '' &&
      listingFormData.price.trim() !== '' &&
      listingFormData.images.length > 0 &&
      listingFormData.location.trim() !== '' &&
      listingFormData.description.trim() !== '' &&
      listingFormData.lat !== '' &&
      listingFormData.lng !== ''
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const files = Array.from(fileList) as File[];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setListingFormData(prev => ({
            ...prev,
            images: [...prev.images, reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setListingFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/registration
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group mb-12"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-primary tracking-tighter mb-6 leading-tight">
              Sell your property on <br />
              <span className="text-secondary">The Digital Estate.</span>
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed max-w-lg mb-8">
              Join the world's top real estate network. Reach buyers and manage your listings easily.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">High Visibility</h3>
                  <p className="text-on-surface-variant">Show your property to local and global buyers.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Safe & Secure</h3>
                  <p className="text-on-surface-variant">Safe payments and legal checks.</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-surface-variant/10"
          >
            <h2 className="text-3xl font-bold text-primary mb-8">Get Started</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="Mustapha Bah"
                  className="w-full bg-background border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Phone Number</label>
                <input 
                  required
                  type="tel" 
                  placeholder="+220 777 7777"
                  className="w-full bg-background border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Email Address (Optional)</label>
                <input 
                  type="email" 
                  placeholder="mustapha@example.com"
                  className="w-full bg-background border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Password</label>
                <div className="relative">
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-background border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40" />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-[1.01] transition-all mt-4"
              >
                Create Seller Account
              </button>
              <p className="text-center text-sm text-on-surface-variant">
                Already have an account? <button type="button" className="text-primary font-bold hover:underline">Log in</button>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0 space-y-8 sticky top-12">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4 ml-1">Menu</h3>
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-surface-variant/20 text-primary font-bold' : 'text-on-surface-variant font-medium hover:bg-surface-variant/10'}`}
              >
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-surface-variant/20 text-primary font-bold' : 'text-on-surface-variant font-medium hover:bg-surface-variant/10'}`}
              >
                <User className="w-5 h-5" /> Profile
              </button>
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-red-500 font-medium hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </nav>
          </div>

          <div className="bg-primary p-6 rounded-[2rem] text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-bold text-lg mb-2">Need help?</h4>
              <p className="text-surface-variant/60 text-sm mb-6">Call us for support.</p>
              <a 
                href="tel:2202725142"
                className="w-full bg-white text-primary py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                Call 220 2725142
              </a>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-12">
          {activeTab === 'dashboard' ? (
            <>
              <header>
                <h1 className="text-5xl font-black text-primary tracking-tighter mb-2">Dashboard</h1>
                <p className="text-on-surface-variant font-medium">Manage your properties and profile here.</p>
              </header>

              {/* Create New Listing */}
              <section className="bg-white p-10 rounded-[2.5rem] border border-surface-variant/20 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">{listingFormData.id ? 'Edit Listing' : 'New Listing'}</h2>
                  </div>
                  {listingFormData.id && (
                    <button 
                      onClick={() => setListingFormData({
                        id: null,
                        propertyName: '',
                        propertyType: 'villa',
                        listingType: 'buy',
                        price: '',
                        currency: 'GMD',
                        duration: 'full',
                        location: '',
                        bedrooms: '',
                        bathrooms: '',
                        sittingRooms: '',
                        parking: '',
                        size: '',
                        description: '',
                        amenities: [],
                        lat: '13.4432',
                        lng: '-16.6475',
                        images: []
                      })}
                      className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline"
                    >
                      Cancel Edit
                    </button>
                  )}
                  {!listingFormData.id && <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">New</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Property Name</label>
                    <input 
                      type="text" 
                      placeholder='"The Azure Sanctuary"'
                      className="w-full bg-background border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                      value={listingFormData.propertyName || ''}
                      onChange={(e) => setListingFormData({...listingFormData, propertyName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Listing Type</label>
                    <div className="flex bg-background p-1 rounded-xl">
                      <button 
                        type="button"
                        onClick={() => setListingFormData({...listingFormData, listingType: 'buy'})}
                        className={`flex-1 py-3 rounded-lg font-bold text-xs transition-all ${
                          listingFormData.listingType === 'buy' 
                            ? 'bg-primary text-white shadow-md' 
                            : 'text-on-surface-variant hover:bg-surface-variant/20'
                        }`}
                      >
                        Buy
                      </button>
                      <button 
                        type="button"
                        onClick={() => setListingFormData({...listingFormData, listingType: 'rent'})}
                        className={`flex-1 py-3 rounded-lg font-bold text-xs transition-all ${
                          listingFormData.listingType === 'rent' 
                            ? 'bg-primary text-white shadow-md' 
                            : 'text-on-surface-variant hover:bg-surface-variant/20'
                        }`}
                      >
                        Rent
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <CustomDropdown
                      label="Property Type"
                      options={[
                        { value: 'villa', label: 'Villa' },
                        { value: 'apartment', label: 'Apartment' },
                        { value: 'house', label: 'House' },
                        { value: 'land', label: 'Land' },
                        { value: 'commercial', label: 'Commercial' },
                      ]}
                      value={listingFormData.propertyType}
                      onChange={(val) => setListingFormData({...listingFormData, propertyType: val as Property['propertyType']})}
                      placeholder="Select Type"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Price & Currency</label>
                    <div className="flex gap-2">
                      <div className="relative min-w-[100px]">
                        <CustomDropdown
                          options={[
                            { value: 'GMD', label: 'GMD (D)' },
                            { value: 'USD', label: 'USD ($)' },
                            { value: 'EUR', label: 'EUR (€)' },
                            { value: 'GBP', label: 'GBP (£)' },
                            { value: 'XOF', label: 'CFA' },
                          ]}
                          value={listingFormData.currency}
                          onChange={(val) => setListingFormData({...listingFormData, currency: val as Property['currency']})}
                        />
                      </div>
                      <div className="relative flex-1">
                        <input 
                          type="text" 
                          placeholder='"82,500,000"'
                          className="w-full bg-background border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                          value={listingFormData.price || ''}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            const formatted = val ? parseInt(val).toLocaleString() : '';
                            setListingFormData({...listingFormData, price: formatted});
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Payment Plan</label>
                    <div className="relative w-full">
                      <CustomDropdown
                        options={[
                          { value: 'full', label: 'Full Amount' },
                          { value: 'daily', label: 'Daily' },
                          { value: 'weekly', label: 'Weekly' },
                          { value: 'monthly', label: 'Monthly' },
                          { value: 'six-months', label: 'Every 6 Months' },
                          { value: 'yearly', label: 'Yearly' },
                        ]}
                        value={listingFormData.duration}
                        onChange={(val) => setListingFormData({...listingFormData, duration: val as Property['duration']})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:col-span-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-1">
                        <Bed className="w-3 h-3" /> Bedrooms
                      </label>
                      <input 
                        type="number" 
                        placeholder="0"
                        className="w-full bg-background border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-center"
                        value={listingFormData.bedrooms || ''}
                        onChange={(e) => setListingFormData({...listingFormData, bedrooms: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-1">
                        <Bath className="w-3 h-3" /> Bathrooms
                      </label>
                      <input 
                        type="number" 
                        placeholder="0"
                        className="w-full bg-background border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-center"
                        value={listingFormData.bathrooms || ''}
                        onChange={(e) => setListingFormData({...listingFormData, bathrooms: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-1">
                        <Armchair className="w-3 h-3" /> Sitting
                      </label>
                      <input 
                        type="number" 
                        placeholder="0"
                        className="w-full bg-background border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-center"
                        value={listingFormData.sittingRooms || ''}
                        onChange={(e) => setListingFormData({...listingFormData, sittingRooms: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-1">
                        <Car className="w-3 h-3" /> Parking
                      </label>
                      <input 
                        type="number" 
                        placeholder="0"
                        className="w-full bg-background border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-center"
                        value={listingFormData.parking || ''}
                        onChange={(e) => setListingFormData({...listingFormData, parking: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-1">
                        <Maximize className="w-3 h-3" /> Size (sqm)
                      </label>
                      <input 
                        type="number" 
                        placeholder="0"
                        className="w-full bg-background border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-center"
                        value={listingFormData.size || ''}
                        onChange={(e) => setListingFormData({...listingFormData, size: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Property Media</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {listingFormData.images.map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                          <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button 
                            onClick={() => removeImage(i)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <label className="aspect-square rounded-2xl border-2 border-dashed border-surface-variant/40 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all group cursor-pointer">
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageUpload}
                        />
                        <ImagePlus className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">Add Photos</span>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Full Address / Location</label>
                    <input 
                      type="text" 
                      placeholder='"82, Coastal Road, West Coast Region"'
                      className="w-full bg-background border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                      value={listingFormData.location || ''}
                      onChange={(e) => setListingFormData({...listingFormData, location: e.target.value})}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Drop Pin on Map</label>
                    <LocationPicker 
                      lat={parseFloat(listingFormData.lat || '13.4432')} 
                      lng={parseFloat(listingFormData.lng || '-16.6475')} 
                      onChange={(lat, lng) => setListingFormData({
                        ...listingFormData, 
                        lat: lat.toFixed(6), 
                        lng: lng.toFixed(6)
                      })} 
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Description</label>
                    <textarea 
                      placeholder="Describe your property..."
                      rows={4}
                      className="w-full bg-background border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium resize-none"
                      value={listingFormData.description || ''}
                      onChange={(e) => setListingFormData({...listingFormData, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Amenities</label>
                    <span className="text-[10px] font-bold text-primary">{(listingFormData.amenities || []).length} Selected</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {[
                      { id: 'pool', label: 'Infinity Pool', icon: Waves },
                      { id: 'solar', label: 'Solar Array', icon: Zap },
                      { id: 'security', label: 'Advanced Security', icon: Shield },
                      { id: 'wine', label: 'Wine Cellar', icon: Wine },
                      { id: 'wifi', label: 'High-Speed WiFi', icon: Wifi },
                      { id: 'parking', label: 'Private Parking', icon: Car },
                      { id: 'cinema', label: 'Home Cinema', icon: Tv },
                      { id: 'coffee', label: 'Coffee Station', icon: Coffee },
                      { id: 'kitchen', label: 'Chef\'s Kitchen', icon: Utensils },
                      { id: 'ac', label: 'Climate Control', icon: Wind },
                    ].map((amenity) => {
                      const isSelected = (listingFormData.amenities || []).includes(amenity.id);
                      return (
                        <button 
                          key={amenity.id}
                          type="button"
                          onClick={() => {
                            const current = listingFormData.amenities || [];
                            const next = isSelected
                              ? current.filter(id => id !== amenity.id)
                              : [...current, amenity.id];
                            setListingFormData({...listingFormData, amenities: next});
                          }}
                          className={`relative p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 text-center group ${
                            isSelected
                              ? 'bg-primary/5 border-primary text-primary shadow-sm'
                              : 'bg-background border-surface-variant/20 text-on-surface-variant hover:border-primary/40'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-primary text-white' : 'bg-surface-variant/10 text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary'
                          }`}>
                            <amenity.icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-tight leading-tight">{amenity.label}</span>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>


                <div className="mt-12 flex flex-col items-end gap-4">
                  {!isFormValid() && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                      Please fill all required fields marked with *
                    </p>
                  )}
                  <button 
                    onClick={handleSubmitListing}
                    disabled={!isFormValid()}
                    className={`px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all ${
                      isFormValid() 
                        ? 'bg-primary text-white hover:shadow-xl hover:scale-[1.02]' 
                        : 'bg-surface-variant/20 text-on-surface-variant/40 cursor-not-allowed'
                    }`}
                  >
                    <Share2 className="w-5 h-5" /> {listingFormData.id ? 'Update Listing' : 'Publish Listing'}
                  </button>
                </div>
              </section>

              {/* My Listings */}
              <section className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-primary">My Listings</h2>
                  {listings.length > 0 && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant bg-surface-variant/10 px-3 py-1 rounded-full">
                      {listings.length} Properties
                    </span>
                  )}
                </div>

                {listings.length === 0 ? (
                  <div className="bg-white p-16 rounded-[3rem] border border-surface-variant/10 flex flex-col items-center text-center relative overflow-hidden shadow-sm">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-20"></div>
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
                    
                    <div className="relative">
                      <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary mb-8 relative group">
                        <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] scale-110 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <Building2 className="w-12 h-12 relative z-10" />
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white shadow-lg"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>

                    <div className="space-y-4 max-w-sm relative z-10">
                      <h3 className="text-3xl font-black text-primary tracking-tight">Your Portfolio is Empty</h3>
                      <p className="text-on-surface-variant font-medium leading-relaxed">
                        Start your journey on The Digital Estate. List your premium properties and reach a global audience of verified buyers.
                      </p>
                    </div>

                    <button 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="mt-10 px-10 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Create Your First Listing
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {listings.map((listing) => (
                      <div key={listing.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-surface-variant/10 flex flex-col shadow-sm group hover:shadow-xl transition-all duration-500">
                        <div className="h-64 relative overflow-hidden">
                          <img 
                            src={listing.images[0]} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                            alt={listing.title} 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-6 left-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg backdrop-blur-md ${listing.type === 'buy' ? 'bg-green-500/90' : 'bg-secondary/90'}`}>
                              {listing.type === 'buy' ? 'For Sale' : 'For Rent'}
                            </span>
                          </div>
                          <div className="absolute top-6 right-6 flex gap-2">
                            <Tooltip text="Share Listing">
                              <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-lg">
                                <Share2 className="w-4 h-4" />
                              </button>
                            </Tooltip>
                            <Tooltip text="View Public Page">
                              <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-lg">
                                <Eye className="w-4 h-4" />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                        <div className="p-8 flex flex-col flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-black text-2xl text-primary leading-tight mb-1 group-hover:text-secondary transition-colors">{listing.title}</h3>
                              <p className="text-sm text-on-surface-variant font-medium flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-secondary" /> {listing.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-black text-secondary text-xl">D {listing.price.toLocaleString()}</div>
                              <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">{listing.duration}</div>
                            </div>
                          </div>

                          <div className="flex gap-4 py-6 my-6 border-y border-surface-variant/10">
                            <div className="flex items-center gap-1.5 text-on-surface-variant font-bold text-xs">
                              <Bed className="w-4 h-4 text-primary" /> {listing.bedrooms} Beds
                            </div>
                            <div className="flex items-center gap-1.5 text-on-surface-variant font-bold text-xs">
                              <Bath className="w-4 h-4 text-primary" /> {listing.bathrooms} Baths
                            </div>
                            <div className="flex items-center gap-1.5 text-on-surface-variant font-bold text-xs">
                              <Maximize className="w-4 h-4 text-primary" /> {listing.sqm} sqm
                            </div>
                          </div>

                          <div className="mt-auto flex items-center gap-4">
                            <Tooltip text="Edit Listing Details">
                              <button 
                                onClick={() => handleEdit(listing)}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl text-sm font-bold hover:shadow-xl hover:scale-[1.02] transition-all"
                              >
                                <Pencil className="w-4 h-4" /> Edit Listing
                              </button>
                            </Tooltip>
                            <Tooltip text="Delete Listing">
                              <button 
                                onClick={() => handleDelete(listing.id)}
                                className="flex items-center justify-center w-14 h-14 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-100"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            <>
              <header>
                <h1 className="text-5xl font-black text-primary tracking-tighter mb-2">Profile</h1>
                <p className="text-on-surface-variant font-medium">Update your contact info and social links.</p>
              </header>

              <section className="bg-white p-10 rounded-[2.5rem] border border-surface-variant/20 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <User className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">WhatsApp Number</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="2207777777"
                        className="w-full bg-background border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium pl-14"
                        value={formData.whatsapp || ''}
                        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      />
                      <MessageCircle className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Public Phone</label>
                    <input 
                      type="text" 
                      placeholder="2203333333"
                      className="w-full bg-background border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary">Social Media Links</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Instagram</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="instagram.com/yourname"
                        className="w-full bg-background border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium pl-14"
                        value={formData.instagram || ''}
                        onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                      />
                      <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Facebook</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="facebook.com/yourname"
                        className="w-full bg-background border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium pl-14"
                        value={formData.facebook || ''}
                        onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                      />
                      <Facebook className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">LinkedIn</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="linkedin.com/in/yourname"
                        className="w-full bg-background border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium pl-14"
                        value={formData.linkedin || ''}
                        onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                      />
                      <Linkedin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-700" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Twitter / X</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="twitter.com/yourname"
                        className="w-full bg-background border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium pl-14"
                        value={formData.twitter || ''}
                        onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                      />
                      <Twitter className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-500" />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Personal Website</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="www.yourwebsite.com"
                        className="w-full bg-background border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium pl-14"
                        value={formData.website || ''}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                      />
                      <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-end">
                  <button className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all">
                    Save Profile Changes
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
      </div>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(null)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-surface-variant/20"
            >
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-8">
                <Trash2 className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-primary tracking-tight mb-4">Delete Listing?</h3>
              <p className="text-on-surface-variant font-medium leading-relaxed mb-10">
                Are you sure you want to remove this property? This action cannot be undone and the listing will be permanently deleted from our records.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-8 py-4 bg-background text-primary rounded-2xl font-bold hover:bg-surface-variant/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-8 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

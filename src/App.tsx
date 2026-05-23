import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetails } from './components/PropertyDetails';
import { PropertyMap } from './components/PropertyMap';
import { SellerView } from './components/SellerView';
import { BrowseView } from './components/BrowseView';
import { AdminView } from './components/AdminView';
import { PROPERTIES, Property, CURRENCIES, CurrencyCode } from './types';
import { Search, Home, SlidersHorizontal, CreditCard, TrendingUp, Mail, User, ArrowRight, ChevronDown, Maximize, Building2, MessageCircle, X, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

const STORAGE_KEY = 'the_digital_estate_listings';
const REGISTRATION_STORAGE_KEY = 'diaspora_registration_requests';
const INQUIRIES_STORAGE_KEY = 'diaspora_support_inquiries';

const DEFAULT_REGISTRATIONS = [
  {
    id: 'req-1',
    name: 'Mustapha Bah',
    phone: '2207777777',
    email: 'mustapha@diaspora.gm',
    preferredPassword: 'mustapha-secret',
    notes: 'Approved primary real estate broker for Brufut Heights sector.',
    status: 'approved' as const,
    submittedAt: '2026-05-20',
    generatedUsername: 'mustapha_bah',
    generatedPassword: 'DH-BAH-8910',
    decisionDate: '2026-05-21',
    adminNotes: 'Onboarded.'
  },
  {
    id: 'req-2',
    name: 'Fatou Jallow',
    phone: '2203333333',
    email: 'fatou.jallow@realestate.gm',
    preferredPassword: 'fatou-secret',
    notes: 'Premium agency consultant representing Kotu and Fajara listings.',
    status: 'approved' as const,
    submittedAt: '2026-05-21',
    generatedUsername: 'fatou_jallow',
    generatedPassword: 'DH-JALLOW-4821',
    decisionDate: '2026-05-21',
    adminNotes: 'Verified professional.'
  },
  {
    id: 'req-3',
    name: 'Ebrima Sowe',
    phone: '2205555555',
    email: 'ebrima@sanyang-villas.gm',
    preferredPassword: 'sowe-secret',
    notes: 'Wants to list shoreline development plots at Tujereng coastal road.',
    status: 'pending' as const,
    submittedAt: '2026-05-23'
  },
  {
    id: 'req-4',
    name: 'Amadou Diallo',
    phone: '2209999999',
    email: 'amadou@gambia-estate.com',
    preferredPassword: 'amadou-secret',
    notes: 'Local landlord looking to post rental units in Fajara.',
    status: 'more_info' as const,
    submittedAt: '2026-05-22',
    adminNotes: 'Please supply scan of commercial business registration certificate.'
  }
];

const DEFAULT_INQUIRIES = [
  {
    id: 'inq-1',
    email: 'sladibba15@gmail.com',
    subject: 'List a 6-bedroom oceanfront villa in Brufut',
    message: 'Hi, I want to list a premium 6-bedroom oceanfront villa in Brufut heights. How can I verify my account so I can post it live immediately?',
    submittedAt: '2026-05-23 04:30',
    status: 'pending' as const
  },
  {
    id: 'inq-2',
    email: 'director@uk-diaspora.co.uk',
    subject: 'Escrow payment and bank transfer compliance',
    message: 'Hello, what escrow accounts do you use to hold Dalasi or GBP deposits before legal land transfers are validated?',
    submittedAt: '2026-05-21 11:15',
    status: 'resolved' as const
  }
];

import { CustomDropdown } from './components/CustomDropdown';

export default function App() {
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return PROPERTIES;
        const userIds = new Set(parsed.map((p: Property) => p.id));
        const defaults = PROPERTIES.filter(p => !userIds.has(p.id));
        return [...parsed, ...defaults];
      } catch (e) {
        return PROPERTIES;
      }
    }
    return PROPERTIES;
  });

  const [registrationRequests, setRegistrationRequests] = useState(() => {
    const saved = localStorage.getItem(REGISTRATION_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_REGISTRATIONS;
      }
    }
    return DEFAULT_REGISTRATIONS;
  });

  const [supportInquiries, setSupportInquiries] = useState(() => {
    const saved = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_INQUIRIES;
      }
    }
    return DEFAULT_INQUIRIES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify(registrationRequests));
  }, [registrationRequests]);

  useEffect(() => {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(supportInquiries));
  }, [supportInquiries]);

  const [view, setView] = useState<'home' | 'details' | 'sell' | 'browse' | 'admin'>('home');
  const [browseType, setBrowseType] = useState<'buy' | 'rent'>('buy');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [heroPropertyType, setHeroPropertyType] = useState('');
  const [isSellerLoggedIn, setIsSellerLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('GMD');
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormStatus, setContactFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // New binding states for contact inputs
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const propertyTypeOptions = [
    { value: 'villa', label: 'Villa' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' },
  ];

  const handlePropertySelect = (prop: Property) => {
    setSelectedProperty(prop);
    setView('details');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setSelectedProperty(null);
    setView('home');
    window.scrollTo(0, 0);
  };

  const handleBackToBrowse = () => {
    setSelectedProperty(null);
    setView('browse');
    window.scrollTo(0, 0);
  };

  const handleBrowse = (type: 'buy' | 'rent') => {
    setBrowseType(type);
    setView('browse');
    window.scrollTo(0, 0);
  };

  const handleSell = () => {
    setView('sell');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen overflow-x-clip">
      {view !== 'sell' && view !== 'admin' && (
        <Navbar 
          onSellClick={handleSell} 
          onLogoClick={handleBackToHome}
          onBuyClick={() => handleBrowse('buy')}
          onRentClick={() => handleBrowse('rent')}
          onAdminClick={() => { setView('admin'); window.scrollTo(0, 0); }}
          currentView={view}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isScrolled={isScrolled}
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
        />
      )}
      
      <main className={(view !== 'sell' && view !== 'admin') ? (view === 'home' ? "" : "pt-24") : ""}>
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero Section */}
              <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden mb-24">
                <img 
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.65]" 
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" 
                  alt="Luxury Villa"
                  referrerPolicy="no-referrer"
                />
                
                <div className="relative z-10 text-center px-6 w-full max-w-5xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-12 leading-[0.9] font-headline">
                      Find your piece of <br/>
                      <span className="text-secondary italic">The World.</span>
                    </h1>
                  </motion.div>
                  
                  {/* Search Bar */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="bg-white/95 backdrop-blur-md p-3 md:p-4 rounded-[2rem] md:rounded-full shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-3 border border-white/20 max-w-4xl mx-auto"
                  >
                    <div className="flex-1 flex items-center gap-4 px-6 py-2 md:py-0 border-b md:border-b-0 md:border-r border-surface-variant/10">
                      <Search className="w-6 h-6 text-primary" />
                      <input 
                        className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-bold py-4 outline-none text-lg placeholder:text-on-surface-variant/40" 
                        placeholder="Search by neighborhood..." 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex-1 flex items-center gap-4 px-6 py-2 md:py-0">
                      <Home className="w-6 h-6 text-primary" />
                      <div className="w-full">
                        <CustomDropdown
                          options={propertyTypeOptions}
                          value={heroPropertyType}
                          onChange={setHeroPropertyType}
                          placeholder="Property Type"
                          className="w-full border-none !bg-transparent"
                        />
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleBrowse('buy')}
                      className="bg-primary text-white px-12 py-5 rounded-2xl md:rounded-full font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
                    >
                      Search
                    </button>
                  </motion.div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden md:block">
                  <ChevronDown className="w-8 h-8 text-white/50" />
                </div>
              </section>

              {/* Quick Navigation */}
              <section className="px-6 mb-16 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Buy Card */}
                  <motion.div 
                    whileHover={{ y: -10 }}
                    onClick={() => {
                      setHeroPropertyType('any');
                      handleBrowse('buy');
                    }}
                    className="group bg-white rounded-[2.5rem] p-10 cursor-pointer border border-surface-variant/20 shadow-2xl shadow-primary/5 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                      <Search className="w-24 h-24" />
                    </div>
                    <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mb-8">
                      <Search className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-black text-primary mb-4 leading-none">Buy Premium</h3>
                    <p className="text-on-surface-variant font-bold text-sm leading-relaxed mb-6 opacity-70">
                      Explore our curated collection of verified villas and high-end estates.
                    </p>
                    <div className="flex items-center gap-3 text-secondary font-black text-xs uppercase tracking-widest">
                      View Listings <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>

                  {/* Rent Card */}
                  <motion.div 
                    whileHover={{ y: -10 }}
                    onClick={() => {
                      setHeroPropertyType('any');
                      handleBrowse('rent');
                    }}
                    className="group bg-secondary rounded-[2.5rem] p-10 cursor-pointer shadow-2xl shadow-secondary/20 relative overflow-hidden text-white"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                      <Home className="w-24 h-24" />
                    </div>
                    <div className="w-16 h-16 rounded-[2rem] bg-white/10 flex items-center justify-center text-white mb-8">
                      <Home className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-black mb-4 leading-none text-white">Elite Rentals</h3>
                    <p className="text-surface-variant/60 font-bold text-sm leading-relaxed mb-6 opacity-70">
                      Discover exclusive long-term stays and luxury short-term holiday homes.
                    </p>
                    <div className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest">
                      Explore rentals <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>

                  {/* Land Card */}
                  <motion.div 
                    whileHover={{ y: -10 }}
                    onClick={() => {
                      setHeroPropertyType('land');
                      handleBrowse('buy');
                    }}
                    className="group bg-white rounded-[2.5rem] p-10 cursor-pointer border border-surface-variant/20 shadow-2xl shadow-primary/5 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                      <Maximize className="w-24 h-24" />
                    </div>
                    <div className="w-16 h-16 rounded-[2rem] bg-secondary/10 flex items-center justify-center text-secondary mb-8">
                      <Maximize className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-black text-primary mb-4 leading-none">Plots of Land</h3>
                    <p className="text-on-surface-variant font-bold text-sm leading-relaxed mb-6 opacity-70">
                      Invest in premium residential and agricultural lands across prime locations.
                    </p>
                    <div className="flex items-center gap-3 text-secondary font-black text-xs uppercase tracking-widest">
                      View Plots <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>

                  {/* Commercial Card */}
                  <motion.div 
                    whileHover={{ y: -10 }}
                    onClick={() => {
                      setHeroPropertyType('commercial');
                      handleBrowse('buy');
                    }}
                    className="group bg-primary text-white rounded-[2.5rem] p-10 cursor-pointer shadow-2xl shadow-primary/20 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                      <Building2 className="w-24 h-24" />
                    </div>
                    <div className="w-16 h-16 rounded-[2rem] bg-white/10 flex items-center justify-center text-white mb-8">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-black mb-4 leading-none text-white">Commercial</h3>
                    <p className="text-surface-variant/60 font-bold text-sm leading-relaxed mb-6 opacity-70">
                      Modern business centers and retail spaces for corporate growth.
                    </p>
                    <div className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest">
                      Business Hubs <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Featured Listings */}
              <section className="px-6 mb-12 max-w-7xl mx-auto flex items-center justify-between">
                <h2 className="text-3xl font-black text-primary tracking-tight">Featured Listings</h2>
                <button 
                  onClick={() => handleBrowse('buy')}
                  className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all"
                >
                  View All <ArrowRight className="w-5 h-5" />
                </button>
              </section>

              {/* Bento Grid */}
              <section className="px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 min-h-[800px]">
                  {properties.slice(0, 3).map((prop, idx) => (
                    <PropertyCard 
                      key={prop.id} 
                      property={prop} 
                      featured={idx === 0}
                      onClick={() => handlePropertySelect(prop)}
                      selectedCurrency={selectedCurrency}
                    />
                  ))}
                  
                  {/* Skeleton/Placeholder for more */}
                  <div className="bg-background rounded-3xl p-6 flex flex-col border border-surface-variant/20 opacity-50">
                    <div className="w-full h-48 bg-surface-variant/20 rounded-2xl mb-4"></div>
                    <div className="h-6 w-3/4 bg-surface-variant/20 rounded-md mb-2"></div>
                    <div className="h-4 w-1/2 bg-surface-variant/20 rounded-md mb-6"></div>
                    <div className="mt-auto h-10 w-full bg-surface-variant/20 rounded-full"></div>
                  </div>
                </div>
              </section>

              {/* Explore Section */}
              <section className="mt-24 px-6 max-w-7xl mx-auto">
                <div className="mb-12">
                  <h2 className="text-4xl font-extrabold text-primary tracking-tight mb-4">Explore Global Destinations</h2>
                  <p className="text-on-surface-variant text-lg max-w-2xl">Discover landmarks, markets, and natural wonders across the world. Use our interactive map to find points of interest near your future home.</p>
                </div>
                <div className="h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-surface-variant/10 relative">
                  <PropertyMap 
                    center={[13.4432, -16.6466]} 
                    zoom={11} 
                    showSearch={true}
                    markers={properties.map(p => ({
                      position: p.coordinates,
                      title: p.title,
                      type: 'property'
                    }))}
                  />
                </div>
              </section>

              {/* Value Props */}
              <section className="mt-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-10 bg-primary rounded-[2.5rem] text-white">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                      <Home className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Verified Listings</h3>
                    <p className="text-surface-variant font-medium leading-relaxed">Every property in Diaspora Homes undergoes a rigorous legal and structural verification process by local experts.</p>
                  </div>
                  <div className="p-10 bg-secondary rounded-[2.5rem] text-white">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Legal Support</h3>
                    <p className="text-surface-variant font-medium leading-relaxed">Our legal team ensures all property transfers are fully compliant with local land laws, providing peace of mind for global investors.</p>
                  </div>
                  <div className="p-10 bg-white rounded-[2.5rem] text-primary border border-surface-variant/20">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <User className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Property Management</h3>
                    <p className="text-on-surface-variant font-medium leading-relaxed">We offer comprehensive management services, from tenant screening to maintenance, maximizing your investment returns.</p>
                  </div>
                </div>
              </section>
            </motion.div>
          ) : view === 'browse' ? (
            <BrowseView 
              key="browse"
              initialType={browseType}
              onPropertyClick={handlePropertySelect}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              propertyType={heroPropertyType}
              onPropertyTypeChange={setHeroPropertyType}
              properties={properties}
              selectedCurrency={selectedCurrency}
            />
          ) : view === 'details' && selectedProperty ? (
            <PropertyDetails 
              key="details"
              property={selectedProperty} 
              onBack={handleBackToBrowse} 
              selectedCurrency={selectedCurrency}
              allProperties={properties}
              onPropertyClick={handlePropertySelect}
            />
          ) : view === 'admin' ? (
            <AdminView
              key="admin"
              onBack={handleBackToHome}
              properties={properties}
              setProperties={setProperties}
              registrationRequests={registrationRequests}
              setRegistrationRequests={setRegistrationRequests}
              supportInquiries={supportInquiries}
              setSupportInquiries={setSupportInquiries}
              selectedCurrency={selectedCurrency}
            />
          ) : (
            <SellerView 
              key="sell"
              onBack={handleBackToHome}
              isLoggedIn={isSellerLoggedIn}
              setIsLoggedIn={setIsSellerLoggedIn}
              properties={properties}
              setProperties={setProperties}
              registrationRequests={registrationRequests}
              setRegistrationRequests={setRegistrationRequests}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      {view !== 'admin' && view !== 'sell' && (
        <footer className="w-full py-20 px-6 bg-primary text-white mt-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
              <div className="space-y-6">
                <div className="font-black text-3xl tracking-tighter">Diaspora Homes</div>
                <p className="text-surface-variant/60 max-w-sm leading-relaxed text-lg">
                  The world's premier digital real estate platform. We connect global investors with verified properties.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 md:col-span-2">
                <div className="space-y-6">
                  <h4 className="font-black uppercase tracking-widest text-xs text-secondary">Navigation</h4>
                  <ul className="space-y-4 font-bold text-surface-variant/80">
                    <li><button onClick={() => handleBrowse('buy')} className="hover:text-secondary transition-colors">Buy Property</button></li>
                    <li><button onClick={() => handleBrowse('rent')} className="hover:text-secondary transition-colors">Rentals</button></li>
                    <li><button onClick={handleSell} className="hover:text-secondary transition-colors">Sell Property</button></li>
                    <li><button onClick={() => { setView('admin'); window.scrollTo(0, 0); }} className="hover:text-secondary text-secondary font-black tracking-wider text-[11px] uppercase transition-colors text-left flex items-center gap-1.5 mt-2">🛡️ Admin Console</button></li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="font-black uppercase tracking-widest text-xs text-secondary">Contact</h4>
                  <ul className="space-y-4 font-bold text-surface-variant/80">
                    <li><button onClick={() => setShowContactForm(true)} className="hover:text-secondary transition-colors text-left">Contact Support</button></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-surface-variant/40 text-xs font-bold uppercase tracking-widest">© 2026 Diaspora Homes. Built with pride for the World.</p>
            </div>
          </div>
        </footer>
      )}

      {/* Global Contact Us Modal */}
      <AnimatePresence>
        {showContactForm && (
          <div className="fixed inset-0 z-[10000] flex items-start justify-center overflow-y-auto p-4 md:p-6 bg-primary/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContactForm(false)}
              className="fixed inset-0"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 max-w-lg w-full shadow-2xl border border-surface-variant/20 my-auto"
            >
              <button 
                onClick={() => setShowContactForm(false)}
                className="absolute top-6 md:top-8 right-6 md:right-8 p-2 rounded-full hover:bg-surface-variant/10 text-on-surface-variant transition-all z-10 bg-white/80 backdrop-blur-sm"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/5 rounded-2xl md:rounded-3xl flex items-center justify-center text-primary mb-6 md:mb-8">
                <MessageCircle className="w-8 h-8 md:w-10 md:h-10" />
              </div>

              {contactFormStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                    <Check className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black text-primary tracking-tight mb-4">Message Sent!</h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed mb-10">
                    Thank you for reaching out. Our support team will get back to you within 24 hours.
                  </p>
                  <button 
                    onClick={() => {
                      setShowContactForm(false);
                      setContactFormStatus('idle');
                    }}
                    className="w-full px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:shadow-lg transition-all"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-3xl font-black text-primary tracking-tight mb-4">Contact Support</h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed mb-8">
                    Have a question or need assistance? Fill out the form below and we'll help you out.
                  </p>

                  <form className="space-y-6" onSubmit={(e) => {
                    e.preventDefault();
                    setContactFormStatus('submitting');
                    
                    const newInq = {
                      id: `inq-${Date.now()}`,
                      email: contactEmail || 'visitor@diasporahomes.com',
                      subject: contactSubject,
                      message: contactMessage,
                      submittedAt: new Date().toLocaleDateString() + ' ' + new Date().toTimeString().split(' ')[0],
                      status: 'pending' as const
                    };

                    setTimeout(() => {
                      setSupportInquiries(prev => [newInq, ...prev]);
                      setContactFormStatus('success');
                      setContactEmail('');
                      setContactSubject('');
                      setContactMessage('');
                    }, 1200);
                  }}>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        placeholder="your@email.com"
                        className="w-full bg-background border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Subject</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Question about listing verification"
                        className="w-full bg-background border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Message</label>
                      <textarea 
                        required
                        rows={4}
                        placeholder="Tell us what you need help with..."
                        className="w-full bg-background border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium resize-none shadow-inner"
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={contactFormStatus === 'submitting'}
                      className="w-full px-8 py-5 bg-primary text-white rounded-2xl font-bold hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                    >
                      {contactFormStatus === 'submitting' ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Send Message <ChevronRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

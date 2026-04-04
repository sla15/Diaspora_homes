import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetails } from './components/PropertyDetails';
import { GambiaMap } from './components/GambiaMap';
import { SellerView } from './components/SellerView';
import { BrowseView } from './components/BrowseView';
import { PROPERTIES, Property } from './types';
import { Search, Home, SlidersHorizontal, CreditCard, TrendingUp, Mail, User, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

const STORAGE_KEY = 'the_digital_estate_listings';

import { CustomDropdown } from './components/CustomDropdown';

export default function App() {
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return PROPERTIES;
        // Merge saved with default if needed, or just use saved
        // For this app, let's merge to ensure default ones are always there but user ones persist
        const userIds = new Set(parsed.map((p: Property) => p.id));
        const defaults = PROPERTIES.filter(p => !userIds.has(p.id));
        return [...parsed, ...defaults];
      } catch (e) {
        return PROPERTIES;
      }
    }
    return PROPERTIES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  }, [properties]);

  const [view, setView] = useState<'home' | 'details' | 'sell' | 'browse'>('home');
  const [browseType, setBrowseType] = useState<'buy' | 'rent'>('buy');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [heroPropertyType, setHeroPropertyType] = useState('');
  const [isSellerLoggedIn, setIsSellerLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
    <div className="min-h-screen">
      {!(view === 'sell' && isSellerLoggedIn) && (
        <Navbar 
          onSellClick={handleSell} 
          onLogoClick={handleBackToHome}
          onBuyClick={() => handleBrowse('buy')}
          onRentClick={() => handleBrowse('rent')}
          currentView={view}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isScrolled={isScrolled}
        />
      )}
      
      <main className={!(view === 'sell' && isSellerLoggedIn) ? (view === 'home' ? "" : "pt-24") : ""}>
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
                      <span className="text-secondary italic">The Gambia.</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <button 
                    onClick={() => handleBrowse('buy')}
                    className="group relative h-64 rounded-[2.5rem] overflow-hidden flex items-center justify-center"
                  >
                    <img 
                      className="absolute inset-0 w-full h-full object-cover brightness-50 group-hover:scale-110 transition-transform duration-700" 
                      src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
                      alt="Buy Properties"
                      referrerPolicy="no-referrer"
                    />
                    <div className="relative z-10 text-center">
                      <h3 className="text-4xl font-black text-white mb-2">Buy Property</h3>
                      <div className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl">
                        Explore Listings <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleBrowse('rent')}
                    className="group relative h-64 rounded-[2.5rem] overflow-hidden flex items-center justify-center"
                  >
                    <img 
                      className="absolute inset-0 w-full h-full object-cover brightness-50 group-hover:scale-110 transition-transform duration-700" 
                      src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop" 
                      alt="Rent Properties"
                      referrerPolicy="no-referrer"
                    />
                    <div className="relative z-10 text-center">
                      <h3 className="text-4xl font-black text-white mb-2">Rentals</h3>
                      <div className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl">
                        View Available <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
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
                  <h2 className="text-4xl font-extrabold text-primary tracking-tight mb-4">Explore The Gambia</h2>
                  <p className="text-on-surface-variant text-lg max-w-2xl">Discover landmarks, markets, and natural wonders across the Smiling Coast. Use our interactive map to find points of interest near your future home.</p>
                </div>
                <div className="h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-surface-variant/10 relative">
                  <GambiaMap 
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
                    <p className="text-surface-variant font-medium leading-relaxed">Every property in The Digital Estate undergoes a rigorous legal and structural verification process by local Gambian experts.</p>
                  </div>
                  <div className="p-10 bg-secondary rounded-[2.5rem] text-white">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Legal Support</h3>
                    <p className="text-surface-variant font-medium leading-relaxed">Our legal team ensures all property transfers are fully compliant with Gambian land laws, providing peace of mind for global investors.</p>
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
            />
          ) : view === 'details' && selectedProperty ? (
            <PropertyDetails 
              key="details"
              property={selectedProperty} 
              onBack={handleBackToHome} 
            />
          ) : (
            <SellerView 
              key="sell"
              onBack={handleBackToHome}
              isLoggedIn={isSellerLoggedIn}
              setIsLoggedIn={setIsSellerLoggedIn}
              properties={properties}
              setProperties={setProperties}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      {!(view === 'sell' && isSellerLoggedIn) && (
        <footer className="w-full py-20 px-6 bg-primary text-white mt-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
              <div className="space-y-6">
                <div className="font-black text-3xl tracking-tighter">The Digital Estate</div>
                <p className="text-surface-variant/60 max-w-sm leading-relaxed text-lg">
                  The Smiling Coast's premier digital real estate platform. We connect global investors with verified Gambian properties.
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
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="font-black uppercase tracking-widest text-xs text-secondary">Contact</h4>
                  <ul className="space-y-4 font-bold text-surface-variant/80">
                    <li><a href="#" className="hover:text-secondary transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-secondary transition-colors">Contact Support</a></li>
                    <li><a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-surface-variant/40 text-xs font-bold uppercase tracking-widest">© 2024 The Digital Estate. Built with pride for The Gambia.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

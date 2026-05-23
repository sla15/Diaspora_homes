import React, { useState, useMemo } from 'react';
import { Property, CurrencyCode, PROPERTIES } from '../types';
import { 
  ArrowLeft, MapPin, Bed, Bath, Square, Car, Waves, Zap, Shield, Wine, Star, 
  Mail, CreditCard, Calendar, TrendingUp, Instagram, Facebook, Linkedin, 
  Twitter, Globe, MessageCircle, Wifi, Tv, Coffee, Utensils, Wind, X, 
  ChevronLeft, ChevronRight, Phone, Percent 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PropertyMap } from './PropertyMap';
import { displayPrice } from '../lib/currency';

interface PropertyDetailsProps {
  property: Property;
  onBack: () => void;
  selectedCurrency: CurrencyCode;
  allProperties?: Property[];
  onPropertyClick?: (property: Property) => void;
}

const amenityCatalog = [
  { id: 'pool', label: 'Infinity Pool', icon: Waves, desc: 'Heated saltwater oasis' },
  { id: 'solar', label: 'Solar Array', icon: Zap, desc: 'Eco-friendly smart power grid' },
  { id: 'security', label: 'Advanced Security', icon: Shield, desc: '24/7 biometric and camera security' },
  { id: 'wine', label: 'Wine Cellar', icon: Wine, desc: 'Climate-controlled premium vintage storage' },
  { id: 'wifi', label: 'High-Speed WiFi', icon: Wifi, desc: 'Gigabit connection with full coverage' },
  { id: 'parking', label: 'Private Parking', icon: Car, desc: 'Secure parking for multiple vehicles' },
  { id: 'cinema', label: 'Home Cinema', icon: Tv, desc: '4K laser projector and dolby atmos sound' },
  { id: 'coffee', label: 'Coffee Station', icon: Coffee, desc: 'Artisanal espresso and coffee bar' },
  { id: 'kitchen', label: 'Chef\'s Kitchen', icon: Utensils, desc: 'Professional-grade luxury appliances' },
  { id: 'ac', label: 'Climate Control', icon: Wind, desc: 'Multi-zone intelligent cooling system' },
];

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ 
  property, 
  onBack, 
  selectedCurrency,
  allProperties = PROPERTIES,
  onPropertyClick
}) => {
  // Lightbox index state
  const [activeImgIndex, setActiveImgIndex] = useState<number | null>(null);
  const [mobileSlideIndex, setMobileSlideIndex] = useState(0);

  // Mortgage Calculator State
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8);
  const [loanTermYears, setLoanTermYears] = useState(25);

  // Historical Year Hover state
  const [hoveredYearIndex, setHoveredYearIndex] = useState<number>(4);

  const historyData = useMemo(() => {
    const P = property.price;
    return [
      { year: 2022, rate: 0.72, x: 30, y: 90 },
      { year: 2023, rate: 0.81, x: 90, y: 73 },
      { year: 2024, rate: 0.88, x: 150, y: 58 },
      { year: 2025, rate: 0.94, x: 210, y: 41 },
      { year: 2026, rate: 1.00, x: 270, y: 20 }
    ].map(item => ({
      ...item,
      val: Math.round(P * item.rate)
    }));
  }, [property.price]);

  const activeYearInfo = historyData[hoveredYearIndex];

  // Parse amenities from property features
  const propertyFeatures = useMemo(() => {
    if (!property.features || property.features.length === 0) {
      return [
        { icon: Waves, title: 'Infinity Edge Pool', desc: 'Saltwater with solar heating' },
        { icon: Zap, title: 'Full Solar Array', desc: '24/7 autonomous power backup' },
        { icon: Shield, title: 'Advanced Security', desc: 'Biometric access & 4K surveillance' },
        { icon: Wine, title: 'Private Wine Cellar', desc: 'Climate controlled storage' },
      ];
    }

    return property.features.map(feat => {
      let id = feat;
      let customDesc = '';
      
      if (feat.includes(':')) {
        const idx = feat.indexOf(':');
        id = feat.substring(0, idx).trim();
        customDesc = feat.substring(idx + 1).trim();
      }

      const catalogItem = amenityCatalog.find(
        item => item.id.toLowerCase() === id.toLowerCase() || item.label.toLowerCase() === id.toLowerCase()
      );
      
      return {
        icon: catalogItem ? catalogItem.icon : Zap,
        title: catalogItem ? catalogItem.label : id.charAt(0).toUpperCase() + id.slice(1),
        desc: customDesc || (catalogItem ? catalogItem.desc : 'Premium quality feature')
      };
    });
  }, [property.features]);

  // Find other properties by the same agent
  const agentProperties = useMemo(() => {
    const currentAgentName = property.agent.name.toLowerCase().trim();
    return allProperties.filter(
      p => p.id !== property.id && p.agent.name.toLowerCase().trim() === currentAgentName
    );
  }, [property, allProperties]);

  // Mortgage Payment calculation
  const loanAmount = useMemo(() => {
    return property.price * (1 - downPaymentPercent / 100);
  }, [property.price, downPaymentPercent]);

  const monthlyPayment = useMemo(() => {
    const monthlyInterest = (interestRate / 100) / 12;
    const totalPayments = loanTermYears * 12;
    if (monthlyInterest === 0) return loanAmount / totalPayments;
    return loanAmount * (monthlyInterest * Math.pow(1 + monthlyInterest, totalPayments)) / (Math.pow(1 + monthlyInterest, totalPayments) - 1);
  }, [loanAmount, interestRate, loanTermYears]);

  // Dynamic Touch Slider Scroll Listener
  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.getBoundingClientRect().width;
    if (width > 0) {
      const newIdx = Math.round(scrollLeft / width);
      if (newIdx !== mobileSlideIndex) {
        setMobileSlideIndex(newIdx);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transitionEnd: { transform: "none" } }}
      className="max-w-screen-xl mx-auto px-4 md:px-6 pb-44 md:pb-40 lg:pb-24"
    >
      <div className="py-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all group px-4 py-2 rounded-full hover:bg-surface-variant/10 w-fit"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm uppercase tracking-widest">Back to Listings</span>
        </button>
      </div>

      {/* Hero Image Gallery */}
      <section className="mb-12">
        {/* Mobile Swipe Slider Carousel (Visible on phones & small screens) */}
        <div className="block md:hidden relative w-full h-[320px] rounded-3xl overflow-hidden shadow-2xl bg-surface-variant group">
          <div 
            onScroll={handleMobileScroll}
            className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {property.images.map((img, index) => (
              <div 
                key={index}
                onClick={() => setActiveImgIndex(index)}
                className="w-full h-full flex-shrink-0 snap-center relative cursor-zoom-in"
              >
                <img 
                  src={img} 
                  alt={`${property.title} slide view ${index + 1}`} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>

          {/* Floating Mobile Tags */}
          <div className="absolute top-5 left-5 flex flex-wrap gap-2 pointer-events-none">
            <span className="bg-primary/95 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-lg backdrop-blur-sm">
              New Construction
            </span>
          </div>

          {/* Swipe Indicator */}
          <div className="absolute bottom-5 right-5 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-2xl text-white font-black text-[9px] tracking-widest uppercase flex items-center gap-1.5 pointer-events-none">
            <span>Swipe</span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          </div>

          {/* Sliding Pager Bullet Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-full pointer-events-none">
            {property.images.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  mobileSlideIndex === i ? 'bg-secondary scale-125 w-3' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Split Image Grid Layout (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[600px]">
          {/* Main Large Image */}
          <div 
            onClick={() => setActiveImgIndex(0)}
            className="md:col-span-8 relative overflow-hidden rounded-3xl bg-surface-variant group h-[300px] md:h-full shadow-2xl cursor-pointer"
          >
            <img 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              src={property.images[0]} 
              alt={property.title} 
              referrerPolicy="no-referrer" 
            />
            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-primary text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg backdrop-blur-md"
              >
                New Construction
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-secondary text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg backdrop-blur-md"
              >
                Waterfront
              </motion.span>
            </div>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-white/90 text-primary px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl backdrop-blur-sm scale-95 group-hover:scale-100 transition-all">Click to Expand</span>
            </div>
          </div>

          {/* Side Images Grid */}
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-4 h-[200px] md:h-full">
            <div 
              onClick={() => setActiveImgIndex(1)}
              className="relative overflow-hidden rounded-3xl bg-surface-variant group shadow-lg cursor-pointer"
            >
              <img 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                src={property.images[1] || property.images[0]} 
                alt="Interior" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white/90 text-primary px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl scale-95 group-hover:scale-100 transition-all">Expand</span>
              </div>
            </div>
            <div 
              onClick={() => setActiveImgIndex(2)}
              className="relative overflow-hidden rounded-3xl bg-surface-variant group shadow-lg cursor-pointer"
            >
              <img 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                src={property.images[2] || property.images[0]} 
                alt="Detail" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-black text-xs uppercase tracking-widest bg-primary/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-2xl">View Gallery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-grow space-y-16 lg:max-w-[calc(100%-440px)]">
          {/* Headline & Price */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tighter leading-none">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-on-surface-variant font-bold">
                  <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-lg">{property.location}</span>
                </div>
              </div>
              <div className="bg-secondary/5 px-8 py-4 rounded-3xl border border-secondary/10 w-fit">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-1">Asking Price</p>
                <p className="text-4xl font-black text-secondary tracking-tight">
                  {displayPrice(property.price, selectedCurrency)}
                </p>
              </div>
            </div>

            {/* Spec Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
                { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
                { icon: Square, label: 'Sq Meters', value: property.sqm },
                { icon: Car, label: 'Parking', value: property.parking },
              ].map((spec, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-surface-variant/10 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
                    <spec.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-black text-primary">{spec.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{spec.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-grow bg-surface-variant/20"></div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant whitespace-nowrap">Architectural Narrative</h2>
              <div className="h-px flex-grow bg-surface-variant/20"></div>
            </div>
            <p className="text-on-surface-variant leading-relaxed text-xl font-medium">
              {property.description}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-primary tracking-tight">Curated Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {propertyFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-white rounded-[2rem] border border-surface-variant/10 hover:border-primary/20 transition-colors group">
                  <div className="w-16 h-16 rounded-3xl bg-secondary/5 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-primary">{feature.title}</p>
                    <p className="text-sm text-on-surface-variant font-bold">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Mortgage Calculator */}
          <div className="bg-white border border-surface-variant/10 rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Percent className="w-40 h-40" />
            </div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center">
                <Percent className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-black text-2xl text-primary tracking-tight">Mortgage Estimator</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Sliders Side */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider text-on-surface-variant">
                    <span>Down Payment</span>
                    <span className="text-primary font-mono">{downPaymentPercent}% ({displayPrice(property.price * (downPaymentPercent / 100), selectedCurrency)})</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="80" 
                    step="5"
                    value={downPaymentPercent} 
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full h-2 bg-surface-variant/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider text-on-surface-variant">
                    <span>Interest Rate</span>
                    <span className="text-primary font-mono">{interestRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="15" 
                    step="0.1"
                    value={interestRate} 
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-surface-variant/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-on-surface-variant block">Loan Duration</span>
                  <div className="flex flex-wrap gap-2">
                    {[10, 15, 20, 25, 30].map((years) => (
                      <button
                        key={years}
                        onClick={() => setLoanTermYears(years)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wider transition-all ${
                          loanTermYears === years
                            ? 'bg-primary text-white shadow-lg'
                            : 'bg-background border border-surface-variant/15 text-on-surface-variant hover:border-primary/40'
                        }`}
                      >
                        {years} Yrs
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Outputs Box */}
              <div className="bg-secondary/5 rounded-[2rem] border border-secondary/10 p-6 md:p-8 flex flex-col justify-between text-center relative overflow-hidden">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Estimated Monthly Payment</p>
                  <p className="text-4xl md:text-5xl font-black text-secondary tracking-tighter">
                    {displayPrice(monthlyPayment, selectedCurrency)}
                  </p>
                  <p className="text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest mt-1">/ Month</p>
                </div>

                <div className="mt-6 pt-6 border-t border-secondary/10 text-left space-y-2 text-xs font-bold text-on-surface-variant/80">
                  <div className="flex justify-between">
                    <span>Property Price:</span>
                    <span className="font-mono text-primary">{displayPrice(property.price, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Down Payment amount:</span>
                    <span className="font-mono text-primary">{displayPrice(property.price * (downPaymentPercent / 100), selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Loan amount:</span>
                    <span className="font-mono text-primary">{displayPrice(loanAmount, selectedCurrency)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mortgage Calculator Disclaimer */}
            <div className="mt-8 pt-6 border-t border-surface-variant/10 text-left">
              <p className="text-[10px] text-on-surface-variant/40 leading-relaxed italic font-bold">
                * Legal Disclaimer: Mortgage estimations provided by this tool are for informational purposes only. Actual interest rates, loan approvals, Down Payment requirements, and monthly payment amounts will vary according to specific credit reviews, bank terms, and insurance policies in the Republic of the Gambia. Consult with a qualified financial institution before making investment decisions.
              </p>
            </div>
          </div>

          {/* Map View */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-primary tracking-tight">The Neighborhood</h2>
            <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden relative shadow-2xl border-4 border-white">
              <PropertyMap 
                center={property.coordinates} 
                markers={[{ position: property.coordinates, title: property.title }]} 
              />
              <div className="absolute bottom-8 left-8 z-[1000] bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-surface-variant/10 max-w-xs">
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Location Context</p>
                <p className="text-xl font-black text-primary mb-1">{property.location.split(',')[0]} Area</p>
                <p className="text-sm text-on-surface-variant font-bold leading-relaxed">Located in a premium residential zone with high appreciation potential.</p>
              </div>
            </div>
          </div>

          {/* Value Trajectory Card */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-primary tracking-tight">Value Trajectory</h2>
            <div className="bg-primary text-white p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform">
                <TrendingUp className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-widest text-xs">Compound Appreciation</h3>
                    <p className="text-[10px] text-surface-variant/70 font-bold uppercase tracking-wider">5-Year Historical Valuation</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 mb-6">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-secondary font-black text-2xl tracking-tight">{activeYearInfo.year}</span>
                    <span className="font-mono text-white text-base font-bold">
                      {displayPrice(activeYearInfo.val, selectedCurrency)}
                    </span>
                  </div>

                  {/* SVG Chart */}
                  <div className="relative h-40 w-full select-none mt-2">
                    <svg viewBox="0 0 300 110" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      <line x1="10" y1="20" x2="290" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3b" />
                      <line x1="10" y1="58" x2="290" y2="58" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3b" />
                      <line x1="10" y1="90" x2="290" y2="90" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3b" />

                      {/* Area Under the Curve */}
                      <path 
                        d="M 30 100 L 30 90 C 60 85, 60 78, 90 73 C 120 72, 120 63, 150 58 C 180 57, 180 46, 210 41 C 240 35, 240 23, 270 20 L 270 100 Z"
                        fill="url(#chartGrad)"
                      />

                      {/* Main Sparkline Path */}
                      <path 
                        d="M 30 90 C 60 85, 60 78, 90 73 C 120 72, 120 63, 150 58 C 180 57, 180 46, 210 41 C 240 35, 240 23, 270 20"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Axis Ticks */}
                      {historyData.map((d, i) => (
                        <g key={i}>
                          {/* Active hover indicator column bar */}
                          {hoveredYearIndex === i && (
                            <line 
                              x1={d.x} 
                              y1="10" 
                              x2={d.x} 
                              y2="100" 
                              stroke="rgba(245, 158, 11, 0.25)" 
                              strokeWidth="1"
                              strokeDasharray="2 2"
                            />
                          )}

                          {/* Data point circle */}
                          <circle 
                            cx={d.x} 
                            cy={d.y} 
                            r={hoveredYearIndex === i ? "6" : "4"} 
                            className="transition-all duration-200 cursor-pointer fill-white"
                            stroke="#f59e0b"
                            strokeWidth="2.5"
                            onMouseEnter={() => setHoveredYearIndex(i)}
                          />

                          {/* Label Ticks */}
                          <text 
                            x={d.x} 
                            y="112" 
                            textAnchor="middle" 
                            fontSize="8.5" 
                            fontWeight="bold"
                            fill={hoveredYearIndex === i ? "#f59e0b" : "rgba(255,255,255,0.4)"}
                            className="font-mono cursor-pointer transition-colors"
                            onMouseEnter={() => setHoveredYearIndex(i)}
                          >
                            {d.year}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] uppercase font-bold tracking-widest text-white/50 border-t border-white/5 pt-4">
                  <span>Compound appreciation</span>
                  <span className="text-secondary font-black">Solid Growth Profiler</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Listings of Agent */}
          {agentProperties.length > 0 && (
            <div className="space-y-8 pt-8 border-t border-surface-variant/10">
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-secondary">EXCLUSIVE PORTFOLIO</p>
                <h2 className="text-3xl font-black text-primary tracking-tight">Other Listings by {property.agent.name}</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {agentProperties.slice(0, 4).map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => onPropertyClick?.(item)}
                    className="p-4 bg-white rounded-3xl border border-surface-variant/10 shadow-sm hover:shadow-xl hover:bg-surface-variant/5 transition-all cursor-pointer group flex flex-col gap-4"
                  >
                    <div className="h-44 rounded-2xl overflow-hidden relative bg-surface-variant">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm shadow px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider text-primary">
                        {item.type === 'buy' ? 'For Sale' : 'For Rent'}
                      </span>
                    </div>
                    <div className="space-y-1 px-1">
                      <h4 className="font-extrabold text-primary text-lg truncate group-hover:text-secondary transition-colors">{item.title}</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-on-surface-variant font-semibold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-secondary" /> {item.location.split(',')[0]}
                        </span>
                        <span className="font-black text-primary text-sm">
                          {displayPrice(item.price, selectedCurrency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-[400px] flex-shrink-0 lg:sticky lg:top-28 lg:self-start">
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-primary/5 border border-surface-variant/10">
              <div className="flex items-center gap-6 mb-10 pb-10 border-b border-surface-variant/10">
                <div className="relative">
                  <img className="w-20 h-20 rounded-3xl object-cover shadow-lg" src={property.agent.image} alt={property.agent.name} />
                  <div className="absolute -bottom-2 -right-2 bg-secondary text-white p-1.5 rounded-xl shadow-lg">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Listing Agent</p>
                  <p className="text-2xl font-black text-primary">{property.agent.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(property.agent.rating) ? 'fill-secondary text-secondary' : 'text-surface-variant'}`} />
                    ))}
                    <span className="text-[10px] font-black text-on-surface-variant ml-2">VERIFIED</span>
                  </div>
                </div>
              </div>

              {/* Contact Options Grid */}
              <div className="flex flex-col gap-4 w-full items-center select-none">
                <a 
                  href={`tel:${property.agent.phone}`}
                  className="w-full lg:max-w-[260px] bg-primary hover:bg-primary/95 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Phone className="w-4 h-4" /> Voice Call
                </a>
                <a 
                  href={`mailto:${`${property.agent.name.toLowerCase().replace(/\s+/g, '')}@gambiarealty.com`}?subject=Inquiry for ${property.title}`}
                  className="w-full lg:max-w-[260px] bg-secondary hover:bg-secondary/95 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-secondary/10 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Mail className="w-4 h-4" /> Email Contact
                </a>
              </div>

              {/* Social Links */}
              {(property.agent.instagram || property.agent.facebook || property.agent.linkedin) && (
                <div className="mt-10 pt-10 border-t border-surface-variant/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-6 text-center">Digital Presence</p>
                  <div className="flex justify-center gap-4">
                    {[
                      { icon: Instagram, link: property.agent.instagram, color: 'text-pink-600 bg-pink-50' },
                      { icon: Facebook, link: property.agent.facebook, color: 'text-blue-600 bg-blue-50' },
                      { icon: Linkedin, link: property.agent.linkedin, color: 'text-blue-800 bg-blue-50' },
                    ].filter(s => s.link).map((social, i) => (
                      <a 
                        key={i}
                        href={social.link?.startsWith('http') ? social.link : `https://${social.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg ${social.color}`}
                      >
                        <social.icon className="w-6 h-6" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="text-[10px] font-black uppercase text-on-surface-variant/30 tracking-widest text-center mt-6">OFFICIAL INSURED LISTING</p>
          </div>
        </div>
      </div>

      {/* Full Image Lightbox Overlay Modal */}
      <AnimatePresence>
        {activeImgIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[99999] flex flex-col justify-between p-4 md:p-8 select-none"
          >
            {/* Top Bar controls */}
            <div className="flex justify-between items-center text-white/80">
              <span className="font-bold font-mono text-sm tracking-wider">{activeImgIndex + 1} / {property.images.length}</span>
              <button 
                onClick={() => setActiveImgIndex(null)}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all hover:scale-105 active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Picture Container */}
            <div className="flex-grow flex items-center justify-between gap-4 relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImgIndex(prev => prev !== null ? (prev - 1 + property.images.length) % property.images.length : null);
                }}
                className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <div className="max-h-[75vh] max-w-[80vw] flex items-center justify-center overflow-hidden">
                <motion.img 
                  key={activeImgIndex}
                  src={property.images[activeImgIndex]} 
                  alt="Expanded gallery listing picture" 
                  className="max-h-[75vh] max-w-[80vw] object-contain rounded-2xl shadow-3xl select-none cursor-grab active:cursor-grabbing touch-pan-y"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(e, info) => {
                    const swipeThreshold = 50;
                    if (info.offset.x < -swipeThreshold) {
                      // Swipe Left -> Next
                      setActiveImgIndex(prev => prev !== null ? (prev + 1) % property.images.length : null);
                    } else if (info.offset.x > swipeThreshold) {
                      // Swipe Right -> Prev
                      setActiveImgIndex(prev => prev !== null ? (prev - 1 + property.images.length) % property.images.length : null);
                    }
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImgIndex(prev => prev !== null ? (prev + 1) % property.images.length : null);
                }}
                className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all hover:scale-110 active:scale-95"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>

            {/* Carousel Thumbnails */}
            <div className="flex justify-center gap-2 overflow-x-auto py-4 max-w-lg mx-auto scrollbar-hide">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImgIndex(i)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImgIndex === i ? 'border-secondary scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Gallery thumb ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Sticky Voice and Email Contact Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-surface-variant/15 py-4 px-6 z-[999] shadow-[0_-8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center lg:hidden">
        <div className="max-w-screen-xl w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={property.agent.image} 
              alt={property.agent.name} 
              className="w-10 h-10 rounded-xl object-cover border border-surface-variant/10 shadow-sm" 
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-[9px] font-black uppercase text-on-surface-variant/70 tracking-widest leading-none mb-1">Inquire with Agent</p>
              <p className="text-sm font-black text-primary leading-none">{property.agent.name}</p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <a 
              href={`tel:${property.agent.phone}`}
              className="flex-1 md:flex-initial bg-primary hover:bg-primary/95 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4" /> Voice Call
            </a>
            <a 
              href={`mailto:${`${property.agent.name.toLowerCase().replace(/\s+/g, '')}@gambiarealty.com`}?subject=Inquiry for ${property.title}`}
              className="flex-1 md:flex-initial bg-secondary hover:bg-secondary/95 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-secondary/10 transition-all hover:-translate-y-0.5"
            >
              <Mail className="w-4 h-4" /> Email Contact
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

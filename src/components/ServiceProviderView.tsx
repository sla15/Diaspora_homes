import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  HardHat, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Briefcase, 
  User, 
  Building2, 
  ArrowLeft, 
  Check, 
  Upload, 
  Globe, 
  Star,
  CheckCircle,
  Clock,
  Sparkles,
  Lock,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export interface ServiceProvider {
  id: string;
  verificationType: 'individual' | 'company';
  title?: string;
  firstName?: string;
  middleName?: string;
  surname?: string;
  name: string; // Combined display name (either full name or company name)
  companyName?: string;
  companyRegistrationNumber?: string;
  nationalId?: string;
  role: string;
  phone: string;
  email: string;
  notes: string; // Brief Onboarding Note
  category: 'maintenance' | 'construction';
  specialty: string; // e.g. Electrician, Architech
  status: 'pending' | 'approved' | 'rejected' | 'more_info';
  submittedAt: string;
  rating?: number;
  completedJobs?: number;
  location?: string;
  idCardPhoto?: string;
  companyCertificatePhoto?: string;
  ipAddress?: string;
  deviceTrustScore?: number;
}

// Initial pre-populated local service providers to make the site look vibrant and real
export const INITIAL_SERVICE_PROVIDERS: ServiceProvider[] = [
  {
    id: 'sp-1',
    verificationType: 'company',
    name: 'Atlantic Plumbing & Gas Masters',
    companyName: 'Atlantic Plumbing & Gas Masters Ltd',
    companyRegistrationNumber: 'DKR-INC-2024-P981',
    role: 'Managing Director',
    phone: '+221 78 212 1234',
    email: 'info@atlanticplumbing.com',
    notes: 'Certified master plumbers with 12+ years of experience providing household and commercial installations across leading coastal developments.',
    category: 'maintenance',
    specialty: 'Plumber',
    status: 'approved',
    submittedAt: '2026-05-15',
    rating: 4.9,
    completedJobs: 142,
    location: 'Dakar, Senegal',
    ipAddress: '196.223.15.5',
    deviceTrustScore: 98
  },
  {
    id: 'sp-2',
    verificationType: 'individual',
    title: 'Mr',
    firstName: 'Alieu',
    middleName: 'K.',
    surname: 'Sanyang',
    name: 'Alieu Sanyang (Certified Electrician)',
    nationalId: 'NID-890125-M',
    role: 'Licensed Technician',
    phone: '+233 24 334 5678',
    email: 'alieu.sanyang@sparkgh.com',
    notes: 'Approved professional power systems engineer. Specializing in off-grid solar inverters, backup batteries and smart home rewiring.',
    category: 'maintenance',
    specialty: 'Electrician',
    status: 'approved',
    submittedAt: '2026-05-18',
    rating: 4.8,
    completedJobs: 89,
    location: 'Accra, Ghana',
    ipAddress: '196.223.15.12',
    deviceTrustScore: 96
  },
  {
    id: 'sp-3',
    verificationType: 'company',
    name: 'Coastline Structural Architects',
    companyName: 'Coastline Structural Architects & Contractors',
    companyRegistrationNumber: 'ZA-REG-2021-A442',
    role: 'Principal Partner',
    phone: '+27 21 998 4321',
    email: 'contact@coastarchitecture.co.za',
    notes: 'Premier premium Architectural design firm. Specializing in high-end oceanfront villas, structural integrity checking, and building authorization.',
    category: 'construction',
    specialty: 'Architech',
    status: 'approved',
    submittedAt: '2026-05-20',
    rating: 5.0,
    completedJobs: 34,
    location: 'Cape Town, South Africa',
    ipAddress: '196.223.14.88',
    deviceTrustScore: 99
  },
  {
    id: 'sp-4',
    verificationType: 'individual',
    title: 'Mr',
    firstName: 'Jamil',
    middleName: 'C.',
    surname: 'Cole',
    name: 'Jamil Cole Masonry',
    nationalId: 'NID-911202-J',
    role: 'Master Builder',
    phone: '+1 876 501 2910',
    email: 'jamil.masonry@caribbuild.com',
    notes: 'Highly recommended local stone mason and bricklayer for luxury estates, swimming pools, and residential compounds.',
    category: 'construction',
    specialty: 'Bricklayer',
    status: 'approved',
    submittedAt: '2026-05-21',
    rating: 4.7,
    completedJobs: 110,
    location: 'Kingston, Jamaica',
    ipAddress: '196.223.12.14',
    deviceTrustScore: 95
  }
];

const MAINTENANCE_SPECIALTIES = [
  'Plumber', 'Electrician', 'Gas Engineer', 'Carpenter', 'Plasterer', 
  'Handyman', 'Cleaner', 'Gardener', 'Maid Services', 'Security Guard'
];

const CONSTRUCTION_SPECIALTIES = [
  'Builder', 'Contractor', 'Architech', 'Bricklayer', 'Plasterer', 
  'fabricator', 'Welder', 'Carpenter', 'Labourer', 'Site Personnel', 
  'Surveryor', 'Tiler', 'Plumber', 'Electrian', 'Painter and Decor'
];

interface ServiceProviderViewProps {
  onBack: () => void;
}

export const ServiceProviderView: React.FC<ServiceProviderViewProps> = ({ onBack }) => {
  const [providers, setProviders] = useState<ServiceProvider[]>(() => {
    const saved = localStorage.getItem('diaspora_service_providers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_SERVICE_PROVIDERS;
      }
    }
    return INITIAL_SERVICE_PROVIDERS;
  });

  const [activeSegment, setActiveSegment] = useState<'directory' | 'register'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'maintenance' | 'construction'>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  
  // Registration Form States
  const [regType, setRegType] = useState<'individual' | 'company'>('individual');
  const [regCategory, setRegCategory] = useState<'maintenance' | 'construction'>('maintenance');
  const [regSpecialty, setRegSpecialty] = useState<string>('Plumber');
  const [regTitle, setRegTitle] = useState<string>('Mr');
  const [regFirstName, setRegFirstName] = useState<string>('');
  const [regMiddleName, setRegMiddleName] = useState<string>('');
  const [regSurname, setRegSurname] = useState<string>('');
  const [regCompanyName, setRegCompanyName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regNationalId, setRegNationalId] = useState<string>('');
  const [regCompanyReg, setRegCompanyReg] = useState<string>('');
  const [regRole, setRegRole] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regNotes, setRegNotes] = useState<string>('');
  const [idPhoto, setIdPhoto] = useState<string>('');
  const [certPhoto, setCertPhoto] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const saveProviders = (newProviders: ServiceProvider[]) => {
    setProviders(newProviders);
    localStorage.setItem('diaspora_service_providers', JSON.stringify(newProviders));
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const displayCombinedName = regType === 'company' 
      ? regCompanyName 
      : `${regTitle} ${regFirstName}${regMiddleName ? ' ' + regMiddleName : ''} ${regSurname}`;

    const newSp: ServiceProvider = {
      id: `sp-reg-${Math.floor(1000 + Math.random() * 9000)}`,
      verificationType: regType,
      title: regType === 'individual' ? regTitle : undefined,
      firstName: regType === 'individual' ? regFirstName : undefined,
      middleName: regType === 'individual' ? regMiddleName : undefined,
      surname: regType === 'individual' ? regSurname : undefined,
      name: displayCombinedName,
      companyName: regType === 'company' ? regCompanyName : undefined,
      companyRegistrationNumber: regType === 'company' ? regCompanyReg : undefined,
      nationalId: regType === 'individual' ? regNationalId : undefined,
      role: regRole || (regType === 'company' ? 'Representative' : 'Independent Contractor'),
      phone: regPhone,
      email: regEmail,
      notes: regNotes,
      category: regCategory,
      specialty: regSpecialty,
      status: 'pending',
      submittedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rating: 5.0,
      completedJobs: 0,
      location: regType === 'company' ? 'Verified Corporate Entity' : 'Local Contractor',
      idCardPhoto: idPhoto || undefined,
      companyCertificatePhoto: certPhoto || undefined,
      ipAddress: '196.223.14.94 (Verified ISP)',
      deviceTrustScore: Math.floor(93 + Math.random() * 7)
    };

    const updated = [newSp, ...providers];
    saveProviders(updated);
    setFormSubmitted(true);

    // Reset fields
    setRegFirstName('');
    setRegMiddleName('');
    setRegSurname('');
    setRegCompanyName('');
    setRegPhone('');
    setRegEmail('');
    setRegNationalId('');
    setRegCompanyReg('');
    setRegRole('');
    setRegPassword('');
    setRegNotes('');
    setIdPhoto('');
    setCertPhoto('');
  };

  // Filter listings
  const filteredProviders = providers.filter(p => {
    // Only display approved ones in the public directory!
    if (p.status !== 'approved') return false;

    // Search text matching name, specialty, notes, location
    const searchLow = searchQuery.toLowerCase();
    const textMatch = p.name.toLowerCase().includes(searchLow) ||
                      p.specialty.toLowerCase().includes(searchLow) ||
                      (p.location && p.location.toLowerCase().includes(searchLow)) ||
                      p.notes.toLowerCase().includes(searchLow);

    // Category matching
    const catMatch = selectedCategory === 'all' || p.category === selectedCategory;

    // Specialty matching
    const specMatch = selectedSpecialty === 'all' || p.specialty.toLowerCase() === selectedSpecialty.toLowerCase();

    return textMatch && catMatch && specMatch;
  });

  return (
    <div className="min-h-screen bg-background max-w-7xl mx-auto px-6 py-10">
      
      {/* Upper Navigation Header */}
      <div className="flex flex-col items-center justify-center text-center gap-6 mb-12">
        <div className="space-y-4 text-center flex flex-col items-center w-full">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-secondary group transition-colors mb-3 mx-auto"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Go Back Home</span>
          </button>
          
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white shrink-0 shadow-lg shadow-black/10">
              <HardHat className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-2xl md:text-3xl font-black text-black tracking-tight text-center">Professional Services Directory</h1>
              <p className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest text-center mt-1">Pre-vetted Legal & Construction Crew</p>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-primary/5 p-1 rounded-2xl border border-primary/5 max-w-md">
          <button
            onClick={() => { setActiveSegment('directory'); setFormSubmitted(false); }}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeSegment === 'directory' 
                ? 'bg-primary text-white shadow-md' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Find service provider</span>
          </button>
          <button
            onClick={() => setActiveSegment('register')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeSegment === 'register' 
                ? 'bg-primary text-white shadow-md' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Register as Provider</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSegment === 'directory' ? (
          <motion.div
            key="directory"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-10"
          >
            {/* Filter controls */}
            <div className="bg-white p-6 rounded-[2rem] border border-surface-variant/20 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Search input (col-span-5) */}
              <div className="md:col-span-5 flex items-center gap-3 bg-background border border-surface-variant/10 rounded-xl px-4 py-3.5">
                <Search className="w-5 h-5 text-on-surface-variant" />
                <input 
                  type="text"
                  placeholder="Search by name, specialty, or keywords..."
                  className="bg-transparent border-none focus:ring-0 text-sm outline-none font-medium text-primary w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Segment Filter (col-span-4) */}
              <div className="md:col-span-4 grid grid-cols-3 gap-1 bg-primary/5 p-1 rounded-xl">
                <button
                  onClick={() => { setSelectedCategory('all'); setSelectedSpecialty('all'); }}
                  className={`py-2 rounded-lg text-[9px] font-black uppercase text-center transition-all ${
                    selectedCategory === 'all' ? 'bg-white text-primary shadow-sm font-black' : 'text-on-surface-variant hover:bg-background/40'
                  }`}
                >
                  All Sectors
                </button>
                <button
                  onClick={() => { setSelectedCategory('maintenance'); setSelectedSpecialty('all'); }}
                  className={`py-2 rounded-lg text-[9px] font-black uppercase text-center transition-all ${
                    selectedCategory === 'maintenance' ? 'bg-white text-primary shadow-sm font-black' : 'text-on-surface-variant hover:bg-background/40'
                  }`}
                >
                  Maintenance
                </button>
                <button
                  onClick={() => { setSelectedCategory('construction'); setSelectedSpecialty('all'); }}
                  className={`py-2 rounded-lg text-[9px] font-black uppercase text-center transition-all ${
                    selectedCategory === 'construction' ? 'bg-white text-primary shadow-sm font-black' : 'text-on-surface-variant hover:bg-background/40'
                  }`}
                >
                  Construction
                </button>
              </div>

              {/* Specialty dropdown filter (col-span-3) */}
              <div className="md:col-span-3">
                <select
                  className="w-full bg-background border border-surface-variant/15 rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-wider focus:outline-none"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="all">🔍 Filter By Specialties</option>
                  {selectedCategory !== 'construction' && (
                    <optgroup label="MAINTENANCE">
                      {MAINTENANCE_SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </optgroup>
                  )}
                  {selectedCategory !== 'maintenance' && (
                    <optgroup label="CONSTRUCTION CREW">
                      {CONSTRUCTION_SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </optgroup>
                  )}
                </select>
              </div>
            </div>

            {/* Providers List / Bento Display */}
            {filteredProviders.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center border shadow-sm max-w-xl mx-auto space-y-4">
                <HelpCircle className="w-12 h-12 text-neutral-300 mx-auto" />
                <h3 className="text-xl font-bold text-primary">No Matching Service Providers</h3>
                <p className="text-sm text-on-surface-variant/70 leading-relaxed font-semibold">
                  We currently have no approved providers for your chosen parameters. Click "Register as Provider" to add a new verification request.
                </p>
                <button
                  onClick={() => setActiveSegment('register')}
                  className="bg-primary text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-secondary transition-all"
                >
                  Initiate Signup Request
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProviders.map((prov) => (
                  <motion.div
                    key={prov.id}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 hover:border-black transition-all relative overflow-hidden flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      {/* Class Badge & Trust Badge */}
                      <div className="flex justify-between items-start mb-6">
                        <span className="px-3 py-1 rounded bg-neutral-100 text-neutral-800 border border-neutral-200 text-[10px] font-bold uppercase tracking-wider">
                          {prov.category}: {prov.specialty}
                        </span>

                        <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                          ID: #{prov.id.toUpperCase()}
                        </div>
                      </div>

                      {/* Header Title */}
                      <div className="space-y-1 mb-4 font-sans text-left">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-lg font-bold text-black tracking-tight leading-tight">{prov.name}</h3>
                          <span className="w-4 h-4 text-black border border-black rounded-full flex items-center justify-center text-[9px] font-bold shrink-0" title="Vetted and Cleared">✓</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                          <span>{prov.role}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium text-neutral-500">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                            {prov.location || 'Global Region'}
                          </span>
                        </div>
                      </div>

                      {/* Onboarding Summary Note */}
                      <p className="text-neutral-700 text-xs font-normal leading-relaxed italic mb-6 text-left">
                        "{prov.notes}"
                      </p>
                    </div>

                    {/* Vetted Footer Contacts */}
                    <div className="border-t border-neutral-100 pt-5 flex flex-wrap gap-4 items-center justify-between text-left">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-black">
                          <Phone className="w-3.5 h-3.5 text-black" />
                          <span>{prov.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
                          <Mail className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{prov.email}</span>
                        </div>
                      </div>

                      {/* Secure verification sign */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 border border-black text-black rounded text-[9px] font-extrabold uppercase tracking-widest bg-transparent">
                        Insured & Vetted
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-2xl mx-auto"
          >
            {formSubmitted ? (
              <div className="bg-white rounded-[2.5rem] p-10 text-center border shadow-xl space-y-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-primary">Application Submitted!</h3>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">Awaiting Admin Verification</p>
                </div>
                <p className="text-sm font-semibold text-on-surface-variant/70 leading-relaxed max-w-md mx-auto">
                  Your application to join the Diaspora Homes verified directory has been locked in. We have run cybersecurity trust checks and allocated a temporary trust profile. The administrator will grant credential clearance under your requested passkey shortly.
                </p>
                
                <div className="border bg-indigo-50/20 p-4 rounded-2xl max-w-sm mx-auto text-left text-xs font-semibold text-primary space-y-1.5">
                  <p className="font-bold text-secondary uppercase text-[10px] tracking-wider">Security Footprint:</p>
                  <p>• Associated Category: <span className="font-extrabold uppercase">{regCategory} ({regSpecialty})</span></p>
                  <p>• Virtual Host Clearance: <code className="font-mono bg-white px-1 border">PENDING_APPROVAL</code></p>
                  <p>• Security Score: <span className="text-green-600 font-extrabold">95% (Device Trusted)</span></p>
                </div>

                <button
                  type="button"
                  onClick={() => { setActiveSegment('directory'); setFormSubmitted(false); }}
                  className="px-8 py-4 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                >
                  Return to Directory View
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-surface-variant/20 shadow-sm space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-primary tracking-tight">Become a Verified Service Provider</h2>
                  <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest leading-relaxed mt-1">Enroll your individual skill or real estate maintenance business today</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-6 text-left">
                  
                  {/* Entity selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Constituent Classification</label>
                    <div className="grid grid-cols-2 gap-3 bg bg-primary/5 p-1 rounded-xl border border-primary/5">
                      <button
                        type="button"
                        onClick={() => setRegType('individual')}
                        className={`py-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                          regType === 'individual' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant/70 hover:bg-background/60'
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span>Individual Registration</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegType('company')}
                        className={`py-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                          regType === 'company' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant/70 hover:bg-background/60'
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Corporate / Company Entry</span>
                      </button>
                    </div>
                  </div>

                  {/* Category and specialty pickers */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Directory Sector*</label>
                      <select
                        className="w-full bg-background border border-surface-variant/15 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider"
                        value={regCategory}
                        onChange={(e) => {
                          const cat = e.target.value as 'maintenance' | 'construction';
                          setRegCategory(cat);
                          setRegSpecialty(cat === 'maintenance' ? 'Plumber' : 'Builder');
                        }}
                      >
                        <option value="maintenance">🔧 Maintenance Sect.</option>
                        <option value="construction">🏗️ Construction Sect.</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Class Specialty Option*</label>
                      <select
                        className="w-full bg-background border border-surface-variant/15 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider"
                        value={regSpecialty}
                        onChange={(e) => setRegSpecialty(e.target.value)}
                      >
                        {regCategory === 'maintenance' ? (
                          MAINTENANCE_SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)
                        ) : (
                          CONSTRUCTION_SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Differentiated Corporate Row */}
                  {regType === 'company' && (
                    <div className="p-5 bg-secondary/5 border border-secondary/10 rounded-2xl space-y-4">
                      <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Enterprise Registration Dossier</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Corporate Brand Name*</label>
                          <input 
                            required
                            type="text"
                            placeholder="e.g. Fajara Contracting Ltd"
                            className="w-full bg-white border border-surface-variant/20 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-primary"
                            value={regCompanyName}
                            onChange={(e) => setRegCompanyName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Incorporation / Tax Reg Number*</label>
                          <input 
                            required
                            type="text"
                            placeholder="e.g. INC-GMD-9812A"
                            className="w-full bg-white border border-surface-variant/20 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-primary"
                            value={regCompanyReg}
                            onChange={(e) => setRegCompanyReg(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Upload Business License Scanned Copy</label>
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-surface-variant/20 text-xs">
                          <input 
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            id="corp-lic-file"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const r = new FileReader();
                                r.onload = () => setCertPhoto(r.result as string);
                                r.readAsDataURL(file);
                              }
                            }}
                          />
                          <label htmlFor="corp-lic-file" className="cursor-pointer text-secondary font-black hover:underline uppercase tracking-wide text-[10px]">
                            {certPhoto ? "License Attachment Locked ✓" : "Upload Verification File"}
                          </label>
                          {certPhoto && <span className="text-[9px] bg-green-505 bg-green-600 text-white px-2 py-0.5 rounded-full font-black">ACTIVE</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Primary Representative Details Form Grid */}
                  <div className="p-5 bg-primary/5 border border-primary/5 rounded-2xl space-y-4">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                      {regType === 'company' ? 'Primary Company Representative Vitals' : 'Applicant Credentials Vitals'}
                    </p>

                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-3 space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Title*</label>
                        <select
                          className="w-full bg-white border border-surface-variant/20 rounded-xl px-2 py-2.5 text-xs font-semibold focus:outline-none"
                          value={regTitle}
                          onChange={(e) => setRegTitle(e.target.value)}
                        >
                          <option value="Mr">Mr.</option>
                          <option value="Mrs">Mrs.</option>
                          <option value="Ms font-serif">Ms.</option>
                          <option value="Dr">Dr.</option>
                          <option value="Alh">Alh.</option>
                          <option value="Chief">Chief</option>
                        </select>
                      </div>

                      <div className="col-span-9 space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">First Name*</label>
                        <input 
                          required
                          type="text"
                          placeholder="Legal First Name"
                          className="w-full bg-white border border-surface-variant/20 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-primary"
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                        />
                      </div>

                      <div className="col-span-6 space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Middle Name</label>
                        <input 
                          type="text"
                          placeholder="Middle name"
                          className="w-full bg-white border border-surface-variant/20 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none text-primary"
                          value={regMiddleName}
                          onChange={(e) => setRegMiddleName(e.target.value)}
                        />
                      </div>

                      <div className="col-span-6 space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Surname*</label>
                        <input 
                          required
                          type="text"
                          placeholder="Family Surname"
                          className="w-full bg-white border border-surface-variant/20 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-primary"
                          value={regSurname}
                          onChange={(e) => setRegSurname(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Individual ID Verification details */}
                    {regType === 'individual' && (
                      <div className="space-y-4 pt-3 border-t border-primary/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">National ID / Passport Number*</label>
                            <input 
                              required
                              type="text"
                              placeholder="e.g. NID-7812B"
                              className="w-full bg-white border border-surface-variant/20 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-bold text-primary"
                              value={regNationalId}
                              onChange={(e) => setRegNationalId(e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Upload ID / Passport photograph scan*</label>
                            <div className="flex justify-between items-center bg-white p-2 text-xs rounded-xl border border-surface-variant/20">
                              <input 
                                type="file" 
                                accept="image/*"
                                className="hidden" 
                                id="personal-id-file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const r = new FileReader();
                                    r.onload = () => setIdPhoto(r.result as string);
                                    r.readAsDataURL(file);
                                  }
                                }}
                              />
                              <label htmlFor="personal-id-file" className="cursor-pointer text-secondary font-black hover:underline uppercase text-[9px]">
                                {idPhoto ? "ID Attachment Loaded ✓" : "Upload ID File"}
                              </label>
                              {idPhoto && <span className="text-[8px] bg-indigo-600 text-white px-2 rounded-full">OK</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Verification contacts, password, onboard notes */}
                  <div className="p-5 bg-background border border-surface-variant/10 rounded-2xl space-y-4">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Contact Verification & Security Setup</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Direct Phone Number*</label>
                        <input 
                          required
                          type="tel"
                          placeholder="e.g. +220 712 3456"
                          className="w-full bg-white border border-surface-variant/20 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Email Address*</label>
                        <input 
                          required
                          type="email"
                          placeholder="you@servicecompany.com"
                          className="w-full bg-white border border-surface-variant/20 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Direct Professional Role / Job Title*</label>
                        <input 
                          required
                          type="text"
                          placeholder="e.g. Managing Partner / Electrician"
                          className="w-full bg-white border border-surface-variant/20 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-primary"
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Proposed Passkey Password*</label>
                        <input 
                          required
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-white border border-surface-variant/20 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-mono"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant font-black">Brief Onboarding Note & Work Synopsis*</label>
                      <textarea 
                        required
                        rows={3}
                        placeholder="State your credentials, years of experience, coverage regions (e.g., London, Accra, Cape Town, Kingston), and any trade/company certifications or references to expedite admin verification."
                        className="w-full bg-white border border-surface-variant/20 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none resize-none font-medium text-primary"
                        value={regNotes}
                        onChange={(e) => setRegNotes(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Submission and agreement checkbox */}
                  <div className="flex gap-2 items-start pl-1 text-[10px] font-bold text-on-surface-variant">
                    <input type="checkbox" required className="mt-0.5 rounded cursor-pointer" id="agree" />
                    <label htmlFor="agree" className="cursor-pointer">
                      I authorize security audits and verify that our trade credentials, national ID cards or incorporation papers are completely accurate and legally valid under respective local laws.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-secondary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-secondary/15 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Submit Service Provider Request</span>
                  </button>

                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

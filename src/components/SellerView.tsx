import React, { useState, useRef } from 'react';
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
  Camera,
  Upload,
  Bed,
  Bath,
  Maximize,
  Trash2,
  Armchair,
  KeyRound,
  ShieldCheck,
  XCircle,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { LocationPicker } from './LocationPicker';

import { CustomDropdown } from './CustomDropdown';

interface RegistrationRequest {
  id: string;
  verificationType: 'individual' | 'company';
  title?: string;
  firstName?: string;
  middleName?: string;
  surname?: string;
  name: string; // Combined display name (either full name or company name)
  phone: string;
  email: string;
  preferredPassword: string;
  notes?: string; // Brief Onboarding Note
  status: 'pending' | 'approved' | 'rejected' | 'more_info';
  submittedAt: string;
  decisionDate?: string;
  adminNotes?: string;
  generatedUsername?: string;
  generatedPassword?: string;
  
  // Anti-fraud detail fields
  nationalId?: string; // National ID Card
  companyName?: string; // Company Name
  companyRegistrationNumber?: string; // Company Registration Number 
  role: string; // Vetted role
  idCardPhoto?: string; // Scanned file uploads or Camera snap (base64)
  companyCertificatePhoto?: string; // scanned document (base64)
  ipAddress?: string;
  deviceTrustScore?: number;
}

interface SellerViewProps {
  onBack: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  registrationRequests: RegistrationRequest[];
  setRegistrationRequests: React.Dispatch<React.SetStateAction<RegistrationRequest[]>>;
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

export const SellerView: React.FC<SellerViewProps> = ({ 
  onBack, 
  isLoggedIn, 
  setIsLoggedIn, 
  properties, 
  setProperties,
  registrationRequests,
  setRegistrationRequests
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormStatus, setContactFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Verification Login & Registration portal states
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [tempRegName, setTempRegName] = useState('');

  // Rich Verification form states
  const [regType, setRegType] = useState<'individual' | 'company'>('individual');
  const [regTitle, setRegTitle] = useState<string>('Mr');
  const [regFirstName, setRegFirstName] = useState<string>('');
  const [regMiddleName, setRegMiddleName] = useState<string>('');
  const [regSurname, setRegSurname] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regCompanyName, setRegCompanyName] = useState<string>('');
  const [regNationalId, setRegNationalId] = useState<string>('');
  const [regCompanyRegNumber, setRegCompanyRegNumber] = useState<string>('');
  const [regRole, setRegRole] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regNotes, setRegNotes] = useState<string>('');
  const [regIdPhoto, setRegIdPhoto] = useState<string>(''); // base64
  const [regDocPhoto, setRegDocPhoto] = useState<string>(''); // base64 / certificate

  // Profile and Camera States & Handlers
  const [profileSaved, setProfileSaved] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 300, height: 300, facingMode: 'user' } 
      });
      streamRef.current = stream;
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError("Camera access was denied or is not supported. Please upload a file instead.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;
        const size = Math.min(videoWidth, videoHeight);
        const sx = (videoWidth - size) / 2;
        const sy = (videoHeight - size) / 2;
        ctx.drawImage(videoRef.current, sx, sy, size, size, 0, 0, 300, 300);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setFormData(prev => ({ ...prev, image: dataUrl }));
        stopCamera();
      }
    }
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const DEFAULT_AVATARS = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
  ];

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 4000);

    // Dynamic propagation to user's listings
    setProperties(prev => prev.map(p => {
      if (p.isUserListing) {
        return {
          ...p,
          agent: {
            ...p.agent,
            name: formData.name || p.agent.name,
            phone: formData.phone || p.agent.phone,
            image: formData.image || p.agent.image,
            whatsapp: formData.whatsapp || p.agent.whatsapp,
            instagram: formData.instagram || p.agent.instagram,
            facebook: formData.facebook || p.agent.facebook,
            linkedin: formData.linkedin || p.agent.linkedin
          }
        };
      }
      return p;
    }));
  };

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
    website: '',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
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
    amenityDescriptions: {} as Record<string, string>,
    lat: '13.4432',
    lng: '-16.6475',
    images: [] as string[]
  });

  // Filter properties that were created by the user
  const listings = properties.filter(p => p.isUserListing);

  const handleEdit = (listing: Property) => {
    const parsedAmenities: string[] = [];
    const parsedDescriptions: Record<string, string> = {};

    (listing.features || []).forEach(feat => {
      if (feat.includes(':')) {
        const [id, desc] = feat.split(':');
        parsedAmenities.push(id);
        parsedDescriptions[id] = desc;
      } else {
        parsedAmenities.push(feat);
      }
    });

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
      amenities: parsedAmenities,
      amenityDescriptions: parsedDescriptions,
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

    const mappedFeatures = (listingFormData.amenities || []).map(id => {
      const desc = listingFormData.amenityDescriptions?.[id];
      return desc ? `${id}:${desc}` : id;
    });

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
        features: mappedFeatures,
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
        features: mappedFeatures,
        coordinates: [latNum, lngNum],
        images: listingFormData.images.length > 0 ? listingFormData.images : ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop"],
        isUserListing: true,
        agent: {
          name: formData.name || "Mustapha Bah",
          role: "Listing Agent",
          rating: 5,
          image: formData.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
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
      amenityDescriptions: {},
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

  const handleAgentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // Search for approved registration requests matching credentials
    const foundApproved = registrationRequests.find(req => 
      req.status === 'approved' && 
      req.generatedUsername === loginId.trim() && 
      req.generatedPassword === loginPass.trim()
    );

    if (foundApproved) {
      // Authenticate!
      setFormData({
        name: foundApproved.name,
        email: foundApproved.email || '',
        phone: foundApproved.phone,
        password: foundApproved.preferredPassword,
        whatsapp: foundApproved.phone,
        instagram: '',
        facebook: '',
        linkedin: '',
        twitter: '',
        website: '',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
      });
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      setLoginId('');
      setLoginPass('');
    } else {
      // Look if the matching request exists but has other status
      const existingReq = registrationRequests.find(req => 
        (req.generatedUsername === loginId.trim() || req.name.toLowerCase() === loginId.trim().toLowerCase())
      );

      if (existingReq) {
        if (existingReq.status === 'pending') {
          setAuthError('Your verification application is still PENDING review. Admin has not issued credentials yet.');
        } else if (existingReq.status === 'more_info') {
          setAuthError(`Admin requested more information: "${existingReq.adminNotes}". Please contact support to submit details.`);
        } else if (existingReq.status === 'rejected') {
          setAuthError(`Access Denied: Application was declined by Admin. Reason: "${existingReq.adminNotes}".`);
        } else {
          setAuthError('Invalid credentials entered. Please double check issued ID and Password.');
        }
      } else {
        setAuthError('Credentials pairing not found in our verified logs. Try mustapha_bah / DH-BAH-8910 or submit a verification request.');
      }
    }
  };

  const handleApplyRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    const combinedName = regType === 'company' 
      ? regCompanyName 
      : `${regTitle} ${regFirstName}${regMiddleName ? ' ' + regMiddleName : ''} ${regSurname}`;

    const newRequest: RegistrationRequest = {
      id: `req-${Math.floor(1000 + Math.random() * 9000)}`,
      verificationType: regType,
      title: regType === 'individual' ? regTitle : undefined,
      firstName: regType === 'individual' ? regFirstName : undefined,
      middleName: regType === 'individual' ? regMiddleName : undefined,
      surname: regType === 'individual' ? regSurname : undefined,
      name: combinedName,
      companyName: regType === 'company' ? regCompanyName : undefined,
      companyRegistrationNumber: regType === 'company' ? regCompanyRegNumber : undefined,
      nationalId: regType === 'individual' ? regNationalId : undefined,
      role: regRole || 'Agent / Partner',
      phone: regPhone,
      email: regEmail,
      preferredPassword: regPassword,
      notes: regNotes || 'Verification entry and agency credentials application.',
      idCardPhoto: regIdPhoto || undefined,
      companyCertificatePhoto: regDocPhoto || undefined,
      status: 'pending',
      submittedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ipAddress: '196.223.14.89 (Verified Client)',
      deviceTrustScore: Math.floor(92 + Math.random() * 8)
    };

    setRegistrationRequests(prev => [newRequest, ...prev]);
    setAppSubmitted(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group mb-12"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-wider text-xs">Exit Portal</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 space-y-6 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/10 text-secondary rounded-full text-xs font-black uppercase tracking-widest border border-secondary/20 justify-center">
              <Shield className="w-4 h-4 shrink-0" /> Verified Onboarding Registry
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tighter col-span-1 leading-none text-center">
              List on the World's <br />
              <span className="text-secondary italic">Safest Marketplace.</span>
            </h1>
            <p className="text-lg text-on-surface-variant/85 leading-relaxed font-medium text-center">
              To guarantee zero fraudulent listings and assure diaspora buyers we hold sellers accountably verified, all agents must obtain Administrator approved credentials before posting properties.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex gap-4 p-4 rounded-2xl bg-white border border-surface-variant/10 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <KeyRound className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-base">Anti-Fraud Protection</h3>
                  <p className="text-xs font-medium text-on-surface-variant/80 mt-0.5">Admin-audited profiles build high trust and faster transaction conversion rates.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl bg-white border border-surface-variant/10 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-base">Legal Compliance</h3>
                  <p className="text-xs font-medium text-on-surface-variant/80 mt-0.5">Accountable listings ensure legally sound escrow payouts for properties sold.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              {appSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-surface-variant/10 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-inner">
                    <Check className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-black text-primary tracking-tight">Application Submitted!</h2>
                  <p className="text-sm font-medium text-on-surface-variant/90 leading-relaxed">
                    Thank you! Your registration form has been transmitted safely to the Diaspora Homes Supervision Board for review.
                  </p>
                  
                  <div className="p-4 bg-primary/5 text-primary text-xs font-bold rounded-xl space-y-1.5 border border-primary/5 text-left">
                    <div className="flex justify-between"><span>Status:</span> <span className="text-secondary font-black">PENDING VERIFICATION</span></div>
                    <div className="flex justify-between"><span>Applicant:</span> <span>{formData.name}</span></div>
                    <div className="flex justify-between"><span>Assigned ID:</span> <span className="font-mono">T-VERI-{Math.floor(100 + Math.random() * 900)}</span></div>
                  </div>

                  <p className="text-[11px] font-bold text-on-surface-variant/60 leading-normal">
                    💡 <strong className="text-secondary">Demo Preview Tip:</strong> Open the <strong className="text-primary uppercase">Admin Panel</strong> in the top navbar first, view the pending requests, click <strong className="text-green-600">Approve & Issue Key</strong>, and then return here to log in using those official credentials!
                  </p>

                  <button 
                    onClick={() => {
                      setAppSubmitted(false);
                      setIsRegisterMode(false);
                    }}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-secondary transition-all"
                  >
                    Proceed to Login Screen
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key={isRegisterMode ? "register" : "login"}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-surface-variant/10 space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-black text-primary tracking-tight">
                      {isRegisterMode ? 'Apply for Verification' : 'Verified Agent Sign In'}
                    </h2>
                    <p className="text-xs font-bold text-on-surface-variant/55 uppercase tracking-widest mt-1">
                      {isRegisterMode ? 'Diaspora Homes Agency Registration Form' : 'Login using credentials generated by Administrator'}
                    </p>
                  </div>

                  {!isRegisterMode ? (
                    /* LOGIN FORM */
                    <form onSubmit={handleAgentLogin} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Official User ID / Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="e.g. mustapha_bah"
                          className="w-full bg-background border border-surface-variant/10 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-sm"
                          value={loginId}
                          onChange={(e) => setLoginId(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Issued Secure Passkey</label>
                        <div className="relative">
                          <input 
                            required
                            type="password" 
                            placeholder="e.g. DH-BAH-8910"
                            className="w-full bg-background border border-surface-variant/10 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-sm"
                            value={loginPass}
                            onChange={(e) => setLoginPass(e.target.value)}
                          />
                          <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/30" />
                        </div>
                      </div>

                      {authError && (
                        <p className="text-xs font-bold text-red-500 bg-red-50 p-3.5 rounded-xl border border-red-100 flex items-start gap-2 text-wrap leading-normal">
                          <XCircle className="w-4 h-4 shrink-0 mt-0.5" /> {authError}
                        </p>
                      )}

                      <button 
                        type="submit"
                        className="w-full bg-primary text-white py-4.5 rounded-xl font-bold text-sm tracking-wide hover:shadow-lg transition-all"
                      >
                        Verify Credentials & Sign In
                      </button>

                      <div className="text-center pt-2">
                        <p className="text-xs text-on-surface-variant/70">
                          New Agent?{' '}
                          <button 
                            type="button" 
                            onClick={() => { setIsRegisterMode(true); setAuthError(''); }}
                            className="text-secondary font-black hover:underline"
                          >
                            Submit Application Form
                          </button>
                        </p>
                      </div>

                      <div className="bg-primary/5 p-4 rounded-xl text-[11px] font-semibold text-primary space-y-1 border border-primary/5">
                        <p className="font-bold text-[10px] text-secondary uppercase tracking-wider mb-1">Preset Verified Test Agents:</p>
                        <div className="flex justify-between font-mono">
                          <span>User ID: <strong>mustapha_bah</strong></span>
                          <span>Passkey: <strong>DH-BAH-8910</strong></span>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span>User ID: <strong>fatou_jallow</strong></span>
                          <span>Passkey: <strong>DH-JALLOW-4821</strong></span>
                        </div>
                      </div>
                    </form>
                  ) : (
                    /* APPLY REGISTRATION FORM */
                    <form onSubmit={handleApplyRequest} className="space-y-4 text-left">
                      {/* 1. Entity Type Selector */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Entity Classification</label>
                        <div className="grid grid-cols-2 gap-3 bg bg-primary/5 p-1 rounded-xl border border-primary/5">
                          <button
                            type="button"
                            onClick={() => {
                              setRegType('individual');
                              setRegRole('Independent Broker');
                            }}
                            className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                              regType === 'individual' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant/70 hover:bg-background/60'
                            }`}
                          >
                            Individual Portal
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRegType('company');
                              setRegRole('Corporate Representative');
                            }}
                            className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                              regType === 'company' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant/70 hover:bg-background/60'
                            }`}
                          >
                            Corporate / company
                          </button>
                        </div>
                      </div>

                      {/* 2. Differentiated Corporate Info Header */}
                      {regType === 'company' && (
                        <div className="p-4 bg-secondary/5 rounded-2xl border border-secondary/10 space-y-3">
                          <p className="text-[10px] font-black text-secondary uppercase tracking-widest">A. Company Registration Details</p>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Corporate Registered Name*</label>
                              <input 
                                required
                                type="text"
                                placeholder="Global Realty Ltd or Premium Horizons Agency"
                                className="w-full bg-white border border-surface-variant/20 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-primary"
                                value={regCompanyName}
                                onChange={(e) => setRegCompanyName(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Tax ID / Company Incorporation Reg Number*</label>
                              <input 
                                required
                                type="text"
                                placeholder="REG-INT-2026-X812"
                                className="w-full bg-white border border-surface-variant/20 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-primary"
                                value={regCompanyRegNumber}
                                onChange={(e) => setRegCompanyRegNumber(e.target.value)}
                              />
                            </div>
                            {/* License document upload */}
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Company Incorporation / Regulatory Certificate</label>
                              <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-surface-variant/20 text-[10px]">
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  className="hidden" 
                                  id="cert-file"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const r = new FileReader();
                                      r.onload = () => setRegDocPhoto(r.result as string);
                                      r.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <label htmlFor="cert-file" className="cursor-pointer text-secondary font-black hover:underline uppercase">
                                  {regDocPhoto ? "Certificate Added ✓" : "Upload Scanned Document"}
                                </label>
                                {regDocPhoto && <span className="text-[8px] bg-green-500 text-white px-2 py-0.5 rounded-full">OK</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. Applicant Personal Information Grid */}
                      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/5 space-y-3">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                          {regType === 'company' ? 'B. Primary Company Representative Details' : 'A. Applicant Details'}
                        </p>
                        
                        {/* Name Grid Layout */}
                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-3 space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Title*</label>
                            <select
                              className="w-full bg-white border border-surface-variant/20 rounded-lg px-2 py-2 text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
                              value={regTitle}
                              onChange={(e) => setRegTitle(e.target.value)}
                            >
                              <option value="Mr">Mr.</option>
                              <option value="Mrs">Mrs.</option>
                              <option value="Ms">Ms.</option>
                              <option value="Dr">Dr.</option>
                              <option value="Alh">Alh.</option>
                              <option value="Chief">Chief</option>
                            </select>
                          </div>
                          <div className="col-span-9 space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">First Name*</label>
                            <input 
                              required
                              type="text"
                              placeholder="John"
                              className="w-full bg-white border border-surface-variant/20 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-primary"
                              value={regFirstName}
                              onChange={(e) => setRegFirstName(e.target.value)}
                            />
                          </div>
                          <div className="col-span-6 space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Middle Name</label>
                            <input 
                              type="text"
                              placeholder="Optional"
                              className="w-full bg-white border border-surface-variant/20 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-medium text-primary"
                              value={regMiddleName}
                              onChange={(e) => setRegMiddleName(e.target.value)}
                            />
                          </div>
                          <div className="col-span-6 space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Surname*</label>
                            <input 
                              required
                              type="text"
                              placeholder="Smith"
                              className="w-full bg-white border border-surface-variant/20 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-primary"
                              value={regSurname}
                              onChange={(e) => setRegSurname(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* ID Document upload for individual */}
                        {regType === 'individual' && (
                          <div className="space-y-2 pt-1 border-t border-primary/5">
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">National ID Card / Passport ID*</label>
                              <input 
                                required
                                type="text"
                                placeholder="GMB-ID-78192-M"
                                className="w-full bg-white border border-surface-variant/20 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-bold text-primary"
                                value={regNationalId}
                                onChange={(e) => setRegNationalId(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Upload ID Photograph or Passport Copy*</label>
                              <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-surface-variant/20 text-[10px]">
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  className="hidden" 
                                  id="id-file"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const r = new FileReader();
                                      r.onload = () => setRegIdPhoto(r.result as string);
                                      r.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <label htmlFor="id-file" className="cursor-pointer text-secondary font-black hover:underline uppercase">
                                  {regIdPhoto ? "ID Captured ✓" : "Upload Scanned Copy"}
                                </label>
                                {regIdPhoto && <span className="text-[8px] bg-green-500 text-white px-2 py-0.5 rounded-full">Verified</span>}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 4. Professional Credentials */}
                      <div className="p-4 bg-background border border-surface-variant/10 rounded-2xl space-y-3.5">
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">C. Contact & Agency Parameters</p>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant text-wrap">International Phone*</label>
                            <input 
                              required
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              className="w-full bg-white border border-surface-variant/20 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                              value={regPhone}
                              onChange={(e) => setRegPhone(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Email Address*</label>
                            <input 
                              required
                              type="email"
                              placeholder="vetted@agent.com"
                              className="w-full bg-white border border-surface-variant/20 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Broker / Agent Role*</label>
                            <input 
                              required
                              type="text"
                              placeholder="e.g. Managing Broker"
                              className="w-full bg-white border border-surface-variant/20 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-primary"
                              value={regRole}
                              onChange={(e) => setRegRole(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Proposed Passkey*</label>
                            <input 
                              required
                              type="password"
                              placeholder="••••••••"
                              className="w-full bg-white border border-surface-variant/20 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Brief Onboarding Note & Fraud Prevention details*</label>
                          <textarea 
                            required
                            rows={2}
                            placeholder="State years of experience, regional licensing details or local escrow connections to aid fast validation reviews..."
                            className="w-full bg-white border border-surface-variant/20 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                            value={regNotes}
                            onChange={(e) => setRegNotes(e.target.value)}
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-secondary text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:shadow-lg transition-all mt-2"
                      >
                        Submit Verification Request
                      </button>

                      <div className="text-center pt-2">
                        <p className="text-xs text-on-surface-variant/70">
                          Already registered?{' '}
                          <button 
                            type="button" 
                            onClick={() => { setIsRegisterMode(false); setAuthError(''); }}
                            className="text-primary font-black hover:underline"
                          >
                            Log In Here
                          </button>
                        </p>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative flex flex-col lg:flex-row">
      {/* Mobile Backdrop Overlay */}
      {isSidebarVisible && (
        <div 
          onClick={() => setIsSidebarVisible(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-[10000] transition-opacity duration-300"
        />
      )}

      {/* Floating Toggle Button when Sidebar is Hidden */}
      {!isSidebarVisible && (
        <button
          onClick={() => setIsSidebarVisible(true)}
          className="fixed top-6 left-6 z-[9990] bg-primary text-white p-3.5 rounded-2xl shadow-2xl hover:bg-secondary hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 font-black text-[10px] uppercase tracking-widest border border-white/10"
          title="Show Sidebar Dashboard"
        >
          <Menu className="w-5 h-5 text-secondary" />
          <span>Show Agent Menu</span>
        </button>
      )}

      {/* Sidebar Dashboard Navigation */}
      <aside 
        className={`bg-white border-r border-surface-variant/10 shadow-sm flex flex-col fixed top-0 left-0 h-screen z-[10001] overflow-y-auto transition-all duration-300 ease-in-out ${
          isSidebarVisible ? 'w-72 translate-x-0 opacity-100' : 'w-72 -translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-6 flex flex-col gap-6 h-full min-w-[288px]">
          {/* Logo & Title & Hide Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shrink-0">
                <LayoutDashboard className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h1 className="text-sm font-black text-primary tracking-tighter leading-none mb-0.5">Diaspora Homes</h1>
                <p className="text-[9px] text-on-surface-variant/60 font-black uppercase tracking-widest">Seller Portal</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsSidebarVisible(false)}
              className="p-2 text-on-surface-variant hover:bg-surface-variant/10 rounded-xl transition-colors shrink-0"
              title="Hide Sidebar"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>
          </div>

          <div className="w-full border-t border-surface-variant/10" />

          {/* Nav Items */}
          <nav className="flex-1 flex flex-col gap-2">
            {[
              { id: 'dashboard', label: 'My Dashboard', icon: <LayoutDashboard className="w-4 h-4 text-secondary" /> },
              { id: 'profile', label: 'Agent Profile', icon: <User className="w-4 h-4 text-secondary" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { 
                  setActiveTab(tab.id as any); 
                  window.scrollTo(0, 0); 
                  if (window.innerWidth < 1024) {
                    setIsSidebarVisible(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-on-surface-variant hover:bg-surface-variant/10'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="w-full border-t border-surface-variant/10" />

          {/* Expert Support Section */}
          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-center space-y-2">
            <h4 className="font-bold text-xs text-primary">Need Expert Help?</h4>
            <p className="text-[10px] text-on-surface-variant/70 leading-normal font-semibold">Our supervisory board and compliance officers are here 24/7.</p>
            <button 
              onClick={() => setShowContactForm(true)}
              className="w-full bg-primary text-white py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-secondary active:scale-[0.98] transition-all"
            >
              Contact Support
            </button>
          </div>

          <div className="w-full border-t border-surface-variant/10" />

          {/* Bottom Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <button 
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-variant/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit Portal
            </button>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all font-bold"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <div 
        className={`flex-1 w-full px-6 py-10 space-y-10 min-h-screen transition-all duration-300 ${
          isSidebarVisible ? 'lg:pl-80' : 'lg:pl-6'
        } ${!isSidebarVisible ? 'pt-24 lg:pt-10' : ''}`}
      >
        <div className="flex flex-col gap-0 items-start w-full">
          {/* Main Content Area */}
          <div className="w-full space-y-12">
            {/* Removed redundant titles from here */}
          {activeTab === 'dashboard' ? (
            <>

              {/* Create New Listing */}
              <section className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-surface-variant/20 shadow-sm">
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
                        amenityDescriptions: {},
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Property Name</label>
                    <input 
                      type="text" 
                      placeholder='"The Azure Sanctuary"'
                      className="w-full bg-background border-none rounded-xl px-4 md:px-6 py-3 md:py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-sm md:text-base"
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
                          className="w-full bg-background border-none rounded-xl px-4 md:px-6 py-3 md:py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-sm md:text-base"
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

                  {/* Curated Amenity Descriptions input fields */}
                  {(listingFormData.amenities || []).length > 0 && (
                    <div className="mt-6 bg-background p-6 rounded-2xl border border-surface-variant/10 space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">Add Descriptions to Selected Amenities (Optional)</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(listingFormData.amenities || []).map((amenityId: string) => {
                          const amenityObj = [
                            { id: 'pool', label: 'Infinity Pool' },
                            { id: 'solar', label: 'Solar Array' },
                            { id: 'security', label: 'Advanced Security' },
                            { id: 'wine', label: 'Wine Cellar' },
                            { id: 'wifi', label: 'High-Speed WiFi' },
                            { id: 'parking', label: 'Private Parking' },
                            { id: 'cinema', label: 'Home Cinema' },
                            { id: 'coffee', label: 'Coffee Station' },
                            { id: 'kitchen', label: 'Chef\'s Kitchen' },
                            { id: 'ac', label: 'Climate Control' },
                          ].find(a => a.id === amenityId) || { id: amenityId, label: amenityId };

                          const descValue = listingFormData.amenityDescriptions?.[amenityId] || '';

                          return (
                            <div key={amenityId} className="space-y-1.5 bg-white p-4 rounded-xl border border-surface-variant/5 shadow-sm">
                              <span className="text-[10px] font-black text-primary uppercase tracking-wider">{amenityObj.label}</span>
                              <input 
                                type="text"
                                placeholder={`e.g., "50-meter heated infinity pool"`}
                                value={descValue}
                                onChange={(e) => {
                                  const descs = { ...(listingFormData.amenityDescriptions || {}), [amenityId]: e.target.value };
                                  setListingFormData({
                                    ...listingFormData,
                                    amenityDescriptions: descs
                                  });
                                }}
                                className="w-full bg-background border border-surface-variant/10 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/25 outline-none font-bold placeholder:text-on-surface-variant/30 text-primary"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
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
                        Start your journey on Diaspora Homes. List your premium properties and reach a global audience of verified buyers.
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
              {/* Toast Notification */}
              <AnimatePresence>
                {profileSaved && (
                  <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="fixed top-24 right-6 z-[10010] bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-green-400/25"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Profile Updated Successfully</p>
                      <p className="text-[10px] text-white/80">Your details have been synchronized with your listings.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Profile Image & Identification Section */}
              <section className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-surface-variant/20 shadow-sm relative overflow-hidden mb-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-primary">Agent Photo & Trust Builder</h2>
                    <p className="text-sm text-on-surface-variant/70 font-medium leading-relaxed">Verify your listing identity with a secure camera snapshot or select a professional preset.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  {/* Left Column: Live Card Preview / Active Photo */}
                  <div className="lg:col-span-4 flex flex-col items-center justify-center bg-background/50 border border-surface-variant/10 rounded-3xl p-6 text-center shadow-inner relative">
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 mb-3 block">Live Agent Card Preview</span>
                    
                    <div className="relative w-40 h-40 rounded-3xl overflow-hidden shadow-xl border-4 border-white mb-4 group transition-transform duration-500 hover:scale-[1.02]">
                      <img 
                        src={formData.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop'} 
                        alt="Agent portrait" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white animate-pulse" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="font-black text-primary leading-tight text-lg">{formData.name || 'Mustapha Bah'}</p>
                      <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Verified Agent</p>
                    </div>

                    {/* Verified Shield Tag */}
                    <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black tracking-widest uppercase border border-green-100">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Insured Profile</span>
                    </div>
                  </div>

                  {/* Right Column: Upload Methods, Camera Stream & Curated Choices */}
                  <div className="lg:col-span-8 space-y-8">
                    {/* Choose Curated Avatar Row */}
                    <div>
                      <h3 className="text-xs font-black text-primary uppercase tracking-wider mb-3">1. Select a Verified Avatar Preset</h3>
                      <div className="flex gap-4 flex-wrap">
                        {DEFAULT_AVATARS.map((avatar, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => {
                              stopCamera();
                              setFormData({ ...formData, image: avatar });
                            }}
                            className={`relative w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                              formData.image === avatar ? 'border-secondary scale-110 shadow-lg' : 'border-transparent opacity-75 hover:opacity-100'
                            }`}
                          >
                            <img src={avatar} alt={`Default avatar preset ${idx+1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            {formData.image === avatar && (
                              <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
                                <Check className="w-6 h-6 text-white bg-secondary/80 rounded-full p-1" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Media Device Stream Camera Section */}
                    <div className="border border-surface-variant/10 rounded-2xl p-6 bg-background/45">
                      <h3 className="text-xs font-black text-primary uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-secondary animate-pulse" />
                        <span>2. Capture Device Camera Snapshot</span>
                      </h3>

                      {cameraActive ? (
                        <div className="space-y-4">
                          <div className="relative w-full max-w-xs mx-auto aspect-square bg-black rounded-2xl overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
                            <video 
                              ref={videoRef} 
                              autoPlay 
                              playsInline 
                              className="w-full h-full object-cover scale-x-[-1]"
                            />
                            {/* Scanning dynamic laser overlay */}
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-secondary/0 via-secondary to-secondary/0 animate-[bounce_2.5s_infinite]" />
                          </div>
                          
                          <div className="flex justify-center gap-3">
                            <button
                              type="button"
                              onClick={capturePhoto}
                              className="px-6 py-2.5 bg-secondary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg transition-all"
                            >
                              Take Photo
                            </button>
                            <button
                              type="button"
                              onClick={stopCamera}
                              className="px-6 py-2.5 bg-surface-variant/20 text-on-surface-variant rounded-xl text-xs font-black uppercase tracking-widest hover:bg-surface-variant/40 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          {cameraError && (
                            <p className="text-[11px] font-bold text-red-500 mb-4 bg-red-50 p-3 rounded-xl border border-red-100">
                              {cameraError}
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={startCamera}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg hover:scale-[1.02] transition-all"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Capture Photo with Camera</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Upload File Section */}
                    <div>
                      <h3 className="text-xs font-black text-primary uppercase tracking-wider mb-3">3. Upload Profile File</h3>
                      <label 
                        className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-surface-variant/20 rounded-2xl cursor-pointer bg-background/20 hover:bg-background/50 hover:border-primary/40 transition-all"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-on-surface-variant/40 mb-2" />
                          <p className="text-xs text-on-surface-variant font-bold">
                            <span>Click to upload photo</span> or drag & drop files
                          </p>
                          <p className="text-[9px] text-on-surface-variant/40 uppercase tracking-widest font-black mt-1">PNG, JPG or JPEG (MAX. 5MB)</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleProfileImageUpload} 
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-surface-variant/20 shadow-sm">
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
                        placeholder="15551234567"
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
                      placeholder="15559876543"
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
                  <button 
                    onClick={handleSaveProfile}
                    className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
      </div>
      {/* Contact Us Modal */}
      <AnimatePresence>
        {showContactForm && (
          <div className="fixed inset-0 z-[3000] flex items-start justify-center overflow-y-auto p-4 md:p-6 bg-primary/40 backdrop-blur-md">
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
                    setTimeout(() => setContactFormStatus('success'), 1500);
                  }}>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Subject</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Question about listing verification"
                        className="w-full bg-background border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Message</label>
                      <textarea 
                        required
                        rows={4}
                        placeholder="Tell us what you need help with..."
                        className="w-full bg-background border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium resize-none"
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(null)}
              className="fixed inset-0"
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

      {/* Floating Contact Support Button */}
      {!isSidebarVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowContactForm(true)}
          className="fixed bottom-6 md:bottom-8 right-6 md:right-8 z-[1000] bg-primary text-white px-4 md:px-6 py-3.5 md:py-4 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-primary/40 group border border-white/10"
        >
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </div>
          <span>Contact Support</span>
        </motion.button>
      )}
    </div>
  );
};

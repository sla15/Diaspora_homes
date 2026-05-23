import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  Search, 
  FileText, 
  Trash2, 
  Clock, 
  Unlock, 
  Send,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Zap,
  Shield,
  KeyRound,
  Eye,
  Lock,
  Globe,
  Settings,
  Mail,
  Check,
  TrendingUp,
  LayoutDashboard,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Property, CurrencyCode } from '../types';

interface RegistrationRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  preferredPassword: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'more_info';
  submittedAt: string;
  decisionDate?: string;
  adminNotes?: string;
  generatedUsername?: string;
  generatedPassword?: string;
}

interface SupportInquiry {
  id: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'pending' | 'resolved';
}

interface AdminViewProps {
  onBack: () => void;
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  registrationRequests: RegistrationRequest[];
  setRegistrationRequests: React.Dispatch<React.SetStateAction<RegistrationRequest[]>>;
  supportInquiries: SupportInquiry[];
  setSupportInquiries: React.Dispatch<React.SetStateAction<SupportInquiry[]>>;
  selectedCurrency: CurrencyCode;
}

export const AdminView: React.FC<AdminViewProps> = ({
  onBack,
  properties,
  setProperties,
  registrationRequests,
  setRegistrationRequests,
  supportInquiries,
  setSupportInquiries,
  selectedCurrency
}) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('diaspora_admin_logged_in') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'listings' | 'inquiries' | 'logs'>('overview');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states for actioning requests
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'more_info' | null>(null);
  
  // Form fields for approvals
  const [customGenUsername, setCustomGenUsername] = useState('');
  const [customGenPassword, setCustomGenPassword] = useState('');
  const [adminMemo, setAdminMemo] = useState('');

  // Simulated audit logs
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; time: string; text: string; category: string }>>(() => {
    const defaultLogs = [
      { id: '1', time: '05:12:08', text: 'System booted successfully. All security parameters active.', category: 'system' },
      { id: '2', time: '05:15:32', text: 'Admin account verification token renewed.', category: 'auth' },
      { id: '3', time: '05:18:22', text: 'Database synchronization completed: 7 active properties synced.', category: 'database' },
      { id: '4', time: '05:22:11', text: 'New support message received from sladibba15@gmail.com.', category: 'inquiry' },
      { id: '5', time: '05:24:45', text: 'Listing "The Azure Sanctuary" viewed by safe proxy server.', category: 'activity' }
    ];
    return defaultLogs;
  });

  const addLog = (text: string, category: string) => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    const newLog = { id: Math.random().toString(), time: timeStr, text, category };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'diaspora-secure') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('diaspora_admin_logged_in', 'true');
      setLoginError('');
      addLog('Admin logged in through web portal.', 'auth');
    } else {
      setLoginError('Invalid Username or Security Password. Try admin / diaspora-secure.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('diaspora_admin_logged_in');
    addLog('Admin logged out safely.', 'auth');
  };

  // Helper code generator for credentials
  const prefillApprove = (req: RegistrationRequest) => {
    const cleanName = req.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const issuedId = `${cleanName}-${Math.floor(1000 + Math.random() * 9000)}`;
    const issuedPass = `DH-${cleanName.substring(0, 4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    
    setCustomGenUsername(issuedId);
    setCustomGenPassword(issuedPass);
    setAdminMemo(`Welcome, ${req.name}. Your verified agency credentials have been issued. Please login immediately to list properties.`);
  };

  const processRequest = (status: 'approved' | 'rejected' | 'more_info') => {
    if (!selectedRequest) return;

    setRegistrationRequests(prev => prev.map(r => {
      if (r.id === selectedRequest.id) {
        return {
          ...r,
          status,
          adminNotes: adminMemo,
          decisionDate: new Date().toLocaleDateString(),
          generatedUsername: status === 'approved' ? customGenUsername : undefined,
          generatedPassword: status === 'approved' ? customGenPassword : undefined
        };
      }
      return r;
    }));

    if (status === 'approved') {
      addLog(`Approved Seller application for ${selectedRequest.name}. Provisioned User ID: ${customGenUsername}`, 'security');
    } else if (status === 'rejected') {
      addLog(`Rejected Seller application for ${selectedRequest.name}. Memo: ${adminMemo}`, 'security');
    } else {
      addLog(`Requested supplementary details from ${selectedRequest.name}`, 'security');
    }

    // Reset action modal
    setSelectedRequest(null);
    setActionType(null);
    setAdminMemo('');
  };

  const toggleListingActive = (id: string) => {
    // We can simulate deleting/deactivating by removing or setting an invisible flag.
    // Let's toggle userListing field or delete. To preserve original ones, let's allow deleting custom ones or changing title
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        const isCurrentlyDeactivated = p.title.includes(' [DELISTED]');
        const nextTitle = isCurrentlyDeactivated 
          ? p.title.replace(' [DELISTED]', '') 
          : `${p.title} [DELISTED]`;
        
        addLog(`Toggled listing deactivation for ID ${id}.`, 'properties');
        return { ...p, title: nextTitle };
      }
      return p;
    }));
  };

  const toggleListingFeatured = (id: string, isCurrentlyFeatured: boolean) => {
    // If it's the first card, it's featured on homepage (index 0). 
    // Let's swap the array element to index 0 to make it featured!
    const itemIndex = properties.findIndex(p => p.id === id);
    if (itemIndex > -1) {
      const copy = [...properties];
      const [item] = copy.splice(itemIndex, 1);
      if (isCurrentlyFeatured) {
        // move to end
        copy.push(item);
        addLog(`Removed listing "${item.title}" from featured bento grid spot.`, 'properties');
      } else {
        // move to front (index 0)
        copy.unshift(item);
        addLog(`Elevated listing "${item.title}" to featured bento grid spot.`, 'properties');
      }
      setProperties(copy);
    }
  };

  const resolveInquiry = (id: string) => {
    setSupportInquiries(prev => prev.map(inq => {
      if (inq.id === id) {
        addLog(`Contact Support message from ${inq.email} marked resolved.`, 'inquiry');
        return { ...inq, status: 'resolved' };
      }
      return inq;
    }));
  };

  // Stats Counters
  const totalPropertiesCount = properties.length;
  const pendingRequests = registrationRequests.filter(r => r.status === 'pending').length;
  const approvedSellers = registrationRequests.filter(r => r.status === 'approved').length;
  const activeSupportCount = supportInquiries.filter(i => i.status === 'pending').length;

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 min-h-[80vh] flex flex-col justify-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group mb-8 self-start"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-wider text-xs">Exit Admin Panel</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-primary/10">
              <ShieldCheck className="w-4 h-4 text-secondary" /> Secure Administrator Console
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tighter leading-none">
              Supervise & Safeguard <br />
              <span className="text-secondary italic">Diaspora Real Estate.</span>
            </h1>
            <p className="text-lg text-on-surface-variant/80 font-medium max-w-xl leading-relaxed">
              Verify legal identities, grant access passes to approved Sellers/Agents, and regulate the entire listing ecosystem to maintain absolute security.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-lg">
              <div className="p-5 rounded-2xl bg-white border border-surface-variant/10 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 font-bold">1</div>
                <p className="text-sm font-bold text-primary">Identity Check Prevents Frauds</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-surface-variant/10 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold">2</div>
                <p className="text-sm font-bold text-primary">Admin Holds Sellers Accountable</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-surface-variant/10"
            >
              <h2 className="text-2xl font-black text-primary tracking-tight mb-2">Admin Sign In</h2>
              <p className="text-xs font-bold text-on-surface-variant/60 mb-8 uppercase tracking-wider">Authorize with issued credentials</p>
              
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Username</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. admin"
                    className="w-full bg-background border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-sm border border-surface-variant/10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Secure Password</label>
                  <div className="relative">
                    <input 
                      required
                      type="password" 
                      placeholder="e.g. diaspora-secure"
                      className="w-full bg-background border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-sm border border-surface-variant/10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                  </div>
                </div>

                {loginError && (
                  <p className="text-xs font-bold text-red-500 bg-red-50 p-3.5 rounded-xl border border-red-100 flex items-center gap-2">
                    <XCircle className="w-4 h-4 shrink-0" /> {loginError}
                  </p>
                )}

                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-xl hover:scale-[1.01] transition-all"
                >
                  Verify & Open Dashboard
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-surface-variant/10"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Demo Credentials</span>
                  <div className="flex-grow border-t border-surface-variant/10"></div>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl space-y-1 border border-primary/10">
                  <div className="flex justify-between text-xs font-bold text-primary">
                    <span>User:</span> <code className="font-mono text-secondary">admin</code>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-primary">
                    <span>Pass:</span> <code className="font-mono text-secondary">diaspora-secure</code>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername('admin');
                      setPassword('diaspora-secure');
                    }}
                    className="w-full text-center text-[10px] font-black uppercase tracking-widest text-secondary pt-2 text-right hover:underline"
                  >
                    Quick Auto-Fill Click
                  </button>
                </div>
              </form>
            </motion.div>
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
          <span>Show Admin Console</span>
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
                <ShieldCheck className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h1 className="text-sm font-black text-primary tracking-tighter leading-none mb-0.5">Admin Supervisory</h1>
                <p className="text-[9px] text-on-surface-variant/60 font-black uppercase tracking-widest">Operations Manager</p>
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
              { id: 'overview', label: 'Monitor Board', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'requests', label: `Sellers Requests`, count: pendingRequests, icon: <Users className="w-4 h-4" /> },
              { id: 'listings', label: 'Listings Regulator', icon: <Building2 className="w-4 h-4" /> },
              { id: 'inquiries', label: `Web Mail`, count: activeSupportCount, icon: <Mail className="w-4 h-4" /> },
              { id: 'logs', label: 'Audit Log Trail', icon: <FileText className="w-4 h-4" /> }
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
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-on-surface-variant hover:bg-surface-variant/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  {tab.icon}
                  {tab.label}
                </div>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-primary text-white'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="w-full border-t border-surface-variant/10" />

          {/* Bottom Actions */}
          <div className="flex flex-col gap-2 mt-auto pt-4">
            <button 
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-variant/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit Admin
            </button>
            <button 
              onClick={handleAdminLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-colors"
            >
              <Shield className="w-4 h-4" />
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
        
        {/* VIEW: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Bento Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-8 bg-white border border-surface-variant/15 rounded-[2.2rem] shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-primary mb-1">{totalPropertiesCount}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Total Web Listings</p>
                </div>
                <div className="absolute right-6 top-6 text-xs text-green-500 font-bold bg-green-50 px-2 py-1 rounded-md">Live</div>
              </div>

              <div className="p-8 bg-white border border-surface-variant/15 rounded-[2.2rem] shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-primary mb-1">{pendingRequests} Pending</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Registration Applications</p>
                </div>
                {pendingRequests > 0 ? (
                  <div className="absolute right-6 top-6 text-xs text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded-md animate-pulse">Action Required</div>
                ) : (
                  <div className="absolute right-6 top-6 text-xs text-green-500 font-bold bg-green-50 px-2 py-1 rounded-md">Cleared</div>
                )}
              </div>

              <div className="p-8 bg-white border border-surface-variant/15 rounded-[2.2rem] shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-primary mb-1">{approvedSellers} Issued</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Verified Secured Sellers</p>
                </div>
                <div className="absolute right-6 top-6 text-[10px] font-black text-emerald-500 bg-emerald-50/50 border border-emerald-100 px-2.5 py-1 rounded-full uppercase">100% Legit</div>
              </div>

              <div className="p-8 bg-primary text-white rounded-[2.2rem] shadow-xl shadow-primary/10 relative overflow-hidden flex flex-col justify-between">
                <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-1 text-white">{activeSupportCount} New</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Contact support inboxes</p>
                </div>
                <div className="absolute right-6 top-6 text-xs text-white/80 font-bold bg-white/10 px-2.5 py-1 rounded-md">Mail Hub</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Quick Processing Board */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-[2rem] border border-surface-variant/15 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-primary">Priority Registrations Pool</h2>
                    <p className="text-xs text-on-surface-variant font-bold uppercase opacity-50 tracking-wide mt-0.5">Approve or Reject pending agent enrollments</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('requests')} 
                    className="text-xs font-black uppercase tracking-widest text-secondary hover:underline flex items-center gap-1.5"
                  >
                    View All Request Queue <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {registrationRequests.filter(r => r.status === 'pending').length === 0 ? (
                  <div className="py-12 text-center rounded-2xl bg-background/50 border border-dashed border-surface-variant/20 flex flex-col items-center justify-center p-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500 mb-3" />
                    <p className="font-bold text-primary text-sm leading-tight">No Pending Seller Applications!</p>
                    <p className="text-xs text-on-surface-variant mt-1">Excellent job! All incoming fraud checks are cleared.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-surface-variant/10">
                    {registrationRequests.filter(r => r.status === 'pending').slice(0, 3).map(req => (
                      <div key={req.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <p className="font-black text-primary text-base">{req.name}</p>
                          <p className="text-xs font-bold text-on-surface-variant/70 mt-0.5 flex items-center gap-2">
                            <span>Phone: {req.phone}</span> • <span>Email: {req.email || "N/A"}</span>
                          </p>
                          <p className="text-xs italic text-on-surface-variant/50 mt-1 max-w-lg">"Applying for: {req.notes || "Professional landlord selling real estate properties."}"</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              prefillApprove(req);
                              setActionType('approve');
                            }}
                            className="px-3.5 py-2 rounded-xl bg-green-50 hover:bg-green-500 hover:text-white transition-all text-green-600 font-bold text-[10px] uppercase tracking-widest"
                          >
                            Approve Pass
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setActionType('reject');
                            }}
                            className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white transition-all text-red-500 font-bold text-[10px] uppercase tracking-widest"
                          >
                            Block
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Mini Audit Logs */}
              <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-[2rem] border border-surface-variant/15 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-primary text-base">Realtime System Stream</h3>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                </div>
                
                <div className="flex-1 space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {auditLogs.slice(0, 8).map(log => (
                    <div key={log.id} className="flex gap-3 text-xs leading-relaxed">
                      <span className="font-mono text-[10px] font-bold text-secondary bg-primary/5 px-1.5 py-0.5 rounded leading-none self-start shrink-0">{log.time}</span>
                      <div>
                        <span className="font-medium text-on-surface-variant">{log.text}</span>
                        <span className="inline-block text-[8px] font-black uppercase text-secondary/70 tracking-widest bg-secondary/5 px-1 ml-2 rounded">{log.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => setActiveTab('logs')}
                  className="w-full text-center text-[10px] font-black uppercase tracking-widest text-primary hover:underline pt-4 mt-4 border-t border-surface-variant/5"
                >
                  Inspect Full Trail Console
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: REQUESTS DETAILS & ACTION BOARD */}
        {activeTab === 'requests' && (
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-surface-variant/15 shadow-sm space-y-8">
            <div>
              <h2 className="text-2xl font-black text-primary tracking-tight">Seller Account Approval Board</h2>
              <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mt-1">Manual Identity Verifications and Credentials Provisioning Center</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-variant/10 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
                    <th className="pb-4 pl-4">Applicant Detail</th>
                    <th className="pb-4">Proposed Password</th>
                    <th className="pb-4">Status & Decision</th>
                    <th className="pb-4">Provisioned Account ID</th>
                    <th className="pb-4 text-right pr-4 text-xs">Authorize</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant/10 text-sm">
                  {registrationRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-on-surface-variant italic font-medium">No registrations logged in history.</td>
                    </tr>
                  ) : (
                    registrationRequests.map(req => (
                      <tr key={req.id} className="hover:bg-background/20 transition-all">
                        <td className="py-5 pl-4">
                          <p className="font-black text-primary text-base">{req.name}</p>
                          <p className="text-xs font-bold text-on-surface-variant/80 mt-0.5">{req.email} • {req.phone}</p>
                          <p className="text-xs text-on-surface-variant/40 mt-1 uppercase font-black">Submitted: {req.submittedAt}</p>
                          {req.notes && (
                            <p className="text-xs font-bold text-on-surface-variant bg-primary/5 p-2 rounded-lg border border-primary/5 mt-2 max-w-sm font-sans italic">
                              "{req.notes}"
                            </p>
                          )}
                        </td>
                        <td className="py-5 font-mono text-xs font-semibold text-on-surface-variant/60">
                          {req.preferredPassword}
                        </td>
                        <td className="py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            req.status === 'approved' ? 'bg-green-50 text-green-600 border border-green-100' :
                            req.status === 'rejected' ? 'bg-red-50 text-red-500 border border-red-100' :
                            req.status === 'more_info' ? 'bg-amber-50 text-amber-500 border border-amber-100' :
                            'bg-indigo-50 text-indigo-500 border border-indigo-100 animate-pulse'
                          }`}>
                            {req.status === 'approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                            {req.status === 'rejected' ? <XCircle className="w-3.5 h-3.5" /> : null}
                            {req.status === 'more_info' ? <HelpCircle className="w-3.5 h-3.5" /> : null}
                            {req.status === 'pending' ? <Clock className="w-3.5 h-3.5" /> : null}
                            {req.status.replace('_', ' ')}
                          </span>
                          {req.adminNotes && (
                            <p className="text-xs font-bold text-on-surface-variant/70 bg-gray-50 p-2 rounded-lg max-w-xs mt-2 text-wrap">
                              Note: {req.adminNotes}
                            </p>
                          )}
                        </td>
                        <td className="py-5">
                          {req.status === 'approved' ? (
                            <div className="space-y-1 bg-green-50/50 p-2.5 rounded-xl border border-green-100 max-w-[200px]">
                              <p className="text-[10px] font-black uppercase tracking-widest text-green-600 leading-none">Access Details</p>
                              <p className="text-xs font-bold text-primary">Login ID: <code className="font-mono text-secondary bg-white px-1 py-0.5 rounded border border-green-200">{req.generatedUsername}</code></p>
                              <p className="text-xs font-bold text-primary">Passkey: <code className="font-mono text-secondary bg-white px-1 py-0.5 rounded border border-green-200">{req.generatedPassword}</code></p>
                            </div>
                          ) : (
                            <span className="text-xs text-on-surface-variant/40 font-bold uppercase tracking-wider">—</span>
                          )}
                        </td>
                        <td className="py-5 text-right pr-4">
                          {req.status === 'pending' || req.status === 'more_info' ? (
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedRequest(req);
                                  prefillApprove(req);
                                  setActionType('approve');
                                }}
                                className="px-3.5 py-2.5 rounded-xl bg-green-50 hover:bg-green-500 hover:text-white transition-all text-green-600 font-bold text-[10px] uppercase tracking-widest"
                              >
                                Accept & Provision
                              </button>
                              
                              <button
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setActionType('more_info');
                                }}
                                className="px-3 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-500 hover:text-white transition-all text-amber-500 font-bold text-[10px] uppercase tracking-widest"
                              >
                                Need Info
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setActionType('reject');
                                }}
                                className="px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white transition-all text-red-500 font-bold text-[10px] uppercase tracking-widest"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedRequest(req);
                                prefillApprove(req);
                                setActionType('approve'); // Re-provision is allowed
                              }}
                              className="px-3.5 py-2 rounded-xl bg-primary/5 hover:bg-primary/20 text-on-surface-variant font-bold text-[10px] uppercase tracking-widest"
                            >
                              Reset / Edit Access
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: LISTINGS MANAGER */}
        {activeTab === 'listings' && (
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-surface-variant/15 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-primary tracking-tight">Ecosystem Listings Regulator</h2>
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mt-1">Suspend, Delist, or Feature individual properties live online</p>
              </div>
              <div className="relative w-64">
                <input 
                  type="text" 
                  placeholder="Search live listings..."
                  className="w-full bg-background border-none rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold outline-none ring-1 ring-surface-variant/10 focus:ring-2 focus:ring-primary/25"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="w-3.5 h-3.5 text-on-surface-variant/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-variant/10 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
                    <th className="pb-4 pl-4">Property info</th>
                    <th className="pb-4">Agent/Owner ID</th>
                    <th className="pb-4">Price Setting</th>
                    <th className="pb-4">Bento Rank</th>
                    <th className="pb-4 text-right pr-4">Regulate Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant/10 text-sm">
                  {properties
                    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((prop, idx) => {
                      const isFeatured = idx === 0;
                      const isDelisted = prop.title.includes('[DELISTED]');
                      
                      return (
                        <tr key={prop.id} className="hover:bg-background/20 transition-all">
                          <td className="py-4 pl-4">
                            <div className="flex items-center gap-3">
                              <img src={prop.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover" referrerPolicy="no-referrer" />
                              <div>
                                <h4 className="font-extrabold text-primary text-sm leading-tight">{prop.title}</h4>
                                <p className="text-xs font-bold text-on-surface-variant/70 mt-0.5">{prop.location}</p>
                                <p className="text-[9px] font-black uppercase tracking-wider text-secondary mt-1">{prop.propertyType} • {prop.type}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 font-bold text-xs text-on-surface-variant">
                            {prop.agent.name} {prop.isUserListing && <span className="bg-primary/10 text-primary text-[9px] px-1.5 py-0.5 rounded ml-1 font-black">USER</span>}
                          </td>
                          <td className="py-4 font-black text-xs text-primary">
                            D {prop.price.toLocaleString()}
                          </td>
                          <td className="py-4">
                            <button
                              onClick={() => toggleListingFeatured(prop.id, isFeatured)}
                              className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                isFeatured 
                                  ? 'bg-amber-100 text-amber-600 border border-amber-200' 
                                  : 'bg-background hover:bg-surface-variant/10 text-on-surface-variant border border-surface-variant/20'
                              }`}
                            >
                              {isFeatured ? '★ Featured Slot' : 'Make Featured'}
                            </button>
                          </td>
                          <td className="py-4 text-right pr-4">
                            <button
                              onClick={() => toggleListingActive(prop.id)}
                              className={`px-3.5 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                                isDelisted
                                  ? 'bg-green-100 hover:bg-green-500 hover:text-white text-green-600 border border-green-200'
                                  : 'bg-red-50 hover:bg-red-500 hover:text-white text-red-500 border border-red-100'
                              }`}
                            >
                              {isDelisted ? 'Restore Listing' : 'Delist Property'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: SUPPORT MAILBOX */}
        {activeTab === 'inquiries' && (
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-surface-variant/15 shadow-sm space-y-8">
            <div>
              <h2 className="text-2xl font-black text-primary tracking-tight">Customer Support & Inquiries Console</h2>
              <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mt-1">Review contact forms and help support messages submitted across the platform</p>
            </div>

            <div className="space-y-4">
              {supportInquiries.length === 0 ? (
                <div className="py-12 text-center text-on-surface-variant italic font-medium">No inbox messages received yet.</div>
              ) : (
                supportInquiries.map(inq => (
                  <div 
                    key={inq.id} 
                    className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
                      inq.status === 'resolved' 
                        ? 'bg-background/40 border-surface-variant/10 opacity-60' 
                        : 'bg-white border-primary/20 shadow-md border-l-4 border-l-primary'
                    }`}
                  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-primary text-sm">{inq.email}</span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/40">{inq.submittedAt}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide ${
                          inq.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                      <p className="font-bold text-primary text-base underline decoration-secondary leading-tight">{inq.subject}</p>
                      <p className="text-sm font-medium text-on-surface-variant leading-relaxed">"{inq.message}"</p>
                    </div>

                    {inq.status === 'pending' && (
                      <button
                        onClick={() => resolveInquiry(inq.id)}
                        className="px-4 py-2 bg-primary text-white hover:bg-secondary hover:scale-[1.01] transition-all rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* VIEW: SYSTEM LOGS AUDIT TRAIL */}
        {activeTab === 'logs' && (
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-surface-variant/15 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-surface-variant/10 pb-6">
              <div>
                <h2 className="text-2xl font-black text-primary tracking-tight">Interactive Secure Audit Logs</h2>
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mt-1">Review live security-sensitive actions and operations executed by the admin</p>
              </div>
              <button 
                onClick={() => setAuditLogs([])} 
                className="text-xs font-black uppercase tracking-widest text-red-500 hover:underline"
              >
                Clear Log Screen
              </button>
            </div>

            <div className="bg-primary text-green-400 p-6 rounded-2xl font-mono text-xs overflow-y-auto max-h-[500px] space-y-3 shadow-inner">
              <p className="text-white/40 font-bold border-b border-white/10 pb-2 mb-2">// DIASPORA GENERAL SYSTEM SECURE AUDIT CONSOLE</p>
              {auditLogs.length === 0 ? (
                <p className="text-white/30 italic">Console log buffered cleared. Monitoring idle state...</p>
              ) : (
                auditLogs.map(log => (
                  <div key={log.id} className="flex gap-4">
                    <span className="text-white/30 shrink-0">[{log.time}]</span>
                    <span className="text-white shrink-0">({log.category.toUpperCase()})</span>
                    <span className="text-green-300">{log.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* MODALS: AUTHORIZE ACCOUNT STATUS MODAL */}
      <AnimatePresence>
        {selectedRequest && actionType && (
          <div className="fixed inset-0 z-[10002] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedRequest(null); setActionType(null); }}
              className="fixed inset-0"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white rounded-[2.5rem] p-8 md:p-10 max-w-lg w-full shadow-2xl border border-surface-variant/20 text-primary z-[10003]"
            >
              <button 
                onClick={() => { setSelectedRequest(null); setActionType(null); }}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-surface-variant/10 text-on-surface-variant transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary block mb-1">Safety Enforcer Tool</span>
                <h3 className="text-2xl font-black">
                  {actionType === 'approve' && 'Approve & Issue Access Key'}
                  {actionType === 'reject' && 'Decline Enlistment Request'}
                  {actionType === 'more_info' && 'Request Extra Information'}
                </h3>
                <p className="text-xs font-bold text-on-surface-variant/70 mt-1 uppercase">For Agent: {selectedRequest.name}</p>
              </div>

              {actionType === 'approve' && (
                <div className="space-y-6">
                  <div className="bg-secondary/5 p-5 rounded-2xl border border-secondary/15 space-y-4">
                    <div className="flex items-center gap-2 mb-2 text-primary font-black text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-secondary animate-pulse" /> Verified Login Credentials Provisioned:
                    </div>
                    
                    <div className="space-y-3 text-sm font-semibold">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70">Official Authorized Username/ID</label>
                        <input 
                          type="text" 
                          className="w-full bg-white border border-secondary/30 rounded-xl px-4 py-3 font-mono text-secondary text-sm font-semibold outline-none focus:ring-2 focus:ring-secondary/20"
                          value={customGenUsername}
                          onChange={(e) => setCustomGenUsername(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70">Security Password Passkey (Editable)</label>
                        <input 
                          type="text" 
                          className="w-full bg-white border border-secondary/30 rounded-xl px-4 py-3 font-mono text-secondary text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/20"
                          value={customGenPassword}
                          onChange={(e) => setCustomGenPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <p className="text-[9px] font-bold text-on-surface-variant leading-tight italic pt-2 opacity-70">
                      * Accepting this user triggers safety keys. The Seller must log in using these exact custom administrator-vouched credentials.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Official Message / Memo to Seller (Optional)</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-background border border-surface-variant/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none font-medium resize-none"
                      value={adminMemo}
                      onChange={(e) => setAdminMemo(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => { setSelectedRequest(null); setActionType(null); }}
                      className="flex-1 py-4 bg-background hover:bg-surface-variant/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                    >
                      Cancel Action
                    </button>
                    <button 
                      onClick={() => processRequest('approved')}
                      className="flex-1 py-4 bg-green-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Issue Access Key
                    </button>
                  </div>
                </div>
              )}

              {actionType === 'reject' && (
                <div className="space-y-6">
                  <p className="text-xs font-bold text-on-surface-variant/80 bg-red-50 p-4 border border-red-100 rounded-xl">
                    Declining this application declines full system portal entry. Please specify a solid reason or legal grounds.
                  </p>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Refusal grounds message (Sent to applicant)</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="e.g. Unverifiable national licensing registration details."
                      className="w-full bg-background border border-surface-variant/15 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-100 outline-none font-medium resize-none"
                      value={adminMemo}
                      onChange={(e) => setAdminMemo(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => { setSelectedRequest(null); setActionType(null); }}
                      className="flex-1 py-4 bg-background hover:bg-surface-variant/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => processRequest('rejected')}
                      disabled={!adminMemo.trim()}
                      className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                        adminMemo.trim() 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-surface-variant/20 text-on-surface-variant/40 cursor-not-allowed'
                      }`}
                    >
                      Confirm Reject
                    </button>
                  </div>
                </div>
              )}

              {actionType === 'more_info' && (
                <div className="space-y-6">
                  <p className="text-xs font-bold text-on-surface-variant/80 bg-amber-50 p-4 border border-amber-100 rounded-xl">
                    Requesting supplementary documentation blocks initial access until approved verification criteria are supplied.
                  </p>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Instructions for applicant</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="e.g. Please supply photographic scan of Business Registration and National Tax clearance certificate."
                      className="w-full bg-background border border-surface-variant/15 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-200 outline-none font-medium resize-none"
                      value={adminMemo}
                      onChange={(e) => setAdminMemo(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => { setSelectedRequest(null); setActionType(null); }}
                      className="flex-1 py-4 bg-background hover:bg-surface-variant/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => processRequest('more_info')}
                      disabled={!adminMemo.trim()}
                      className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                        adminMemo.trim() 
                          ? 'bg-amber-500 text-white hover:bg-amber-600' 
                          : 'bg-surface-variant/20 text-on-surface-variant/40 cursor-not-allowed'
                      }`}
                    >
                      Request Info
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

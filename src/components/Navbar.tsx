import React, { useState } from 'react';
import { Search, Bell, MessageSquare, User, Menu, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CURRENCIES, CurrencyCode } from '../types';

interface NavbarProps {
  onSellClick: () => void;
  onLogoClick: () => void;
  onBuyClick: () => void;
  onRentClick: () => void;
  currentView: 'home' | 'details' | 'sell' | 'browse';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isScrolled?: boolean;
  selectedCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onSellClick, 
  onLogoClick, 
  onBuyClick, 
  onRentClick, 
  currentView,
  searchQuery,
  onSearchChange,
  isScrolled = false,
  selectedCurrency,
  onCurrencyChange
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  const navLinks = [
    { label: 'Home', onClick: () => { onLogoClick(); setIsMenuOpen(false); }, active: currentView === 'home' },
    { label: 'Buy', onClick: () => { onBuyClick(); setIsMenuOpen(false); }, active: currentView === 'browse' },
    { label: 'Sell', onClick: () => { onSellClick(); setIsMenuOpen(false); }, active: currentView === 'sell' },
  ];

  const headerStyles = currentView === 'home' 
    ? (isScrolled 
        ? "bg-white/90 backdrop-blur-xl border-b border-surface-variant/10 py-4 shadow-lg" 
        : "bg-transparent border-transparent py-6")
    : "bg-white/90 backdrop-blur-xl border-b border-surface-variant/10 py-4 shadow-lg";

  const textStyles = currentView === 'home' && !isScrolled ? "text-white" : "text-primary";
  const navTextStyles = currentView === 'home' && !isScrolled ? "text-white/80 hover:text-white" : "text-on-surface-variant hover:text-primary";

  return (
    <header className={`fixed top-0 w-full flex justify-between items-center px-6 transition-all duration-500 max-w-screen-2xl mx-auto z-[9999] ${headerStyles}`}>
      <div className="flex items-center">
        <span 
          onClick={onLogoClick}
          className={`text-2xl font-black tracking-tighter cursor-pointer transition-colors ${textStyles}`}
        >
          The Digital Estate
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        {navLinks.map((link) => (
          <button 
            key={link.label}
            onClick={link.onClick} 
            className={`relative py-2 transition-all font-bold text-sm tracking-wide ${
              link.active 
                ? (currentView === 'home' && !isScrolled ? 'text-white' : 'text-primary') 
                : navTextStyles
            }`}
          >
            {link.label}
            {link.active && (
              <motion.div 
                layoutId="activeNav"
                className={`absolute -bottom-1 left-0 right-0 h-1 rounded-full ${
                  currentView === 'home' && !isScrolled ? 'bg-white' : 'bg-secondary'
                }`}
              />
            )}
          </button>
        ))}
      </nav>
      
      <div className="flex items-center gap-4">
        {/* Currency Selector */}
        <div className="relative">
          <button 
            onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all border font-bold text-xs ${
              currentView === 'home' && !isScrolled 
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                : 'bg-background border-surface-variant/20 text-primary hover:bg-surface-variant/10'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            {selectedCurrency}
          </button>

          <AnimatePresence>
            {isCurrencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-surface-variant/10 p-2 z-[10000] max-h-[400px] overflow-y-auto custom-scrollbar"
                >
                {CURRENCIES.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      onCurrencyChange(currency.code);
                      setIsCurrencyOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      selectedCurrency === currency.code 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'text-on-surface-variant hover:bg-surface-variant/10'
                    }`}
                  >
                    <span>{currency.label}</span>
                    <span className="opacity-60">{currency.symbol}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`hidden md:flex rounded-full px-4 py-2 items-center gap-2 border transition-all ${
          currentView === 'home' && !isScrolled 
            ? 'bg-white/10 border-white/20' 
            : 'bg-background border-surface-variant/20'
        }`}>
          <Search className={`w-4 h-4 ${currentView === 'home' && !isScrolled ? 'text-white/60' : 'text-on-surface-variant'}`} />
          <input 
            className={`bg-transparent border-none focus:ring-0 text-sm w-48 font-sans outline-none ${
              currentView === 'home' && !isScrolled ? 'text-white placeholder:text-white/40' : 'text-on-surface'
            }`} 
            placeholder="Search properties..." 
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (currentView !== 'browse' && e.target.value.length > 0) {
                onBuyClick();
              }
            }}
          />
        </div>
        
        <div className="flex gap-1">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-full transition-all ${
              currentView === 'home' && !isScrolled 
                ? 'hover:bg-white/10' 
                : 'hover:bg-surface-variant/30'
            }`}
          >
            <Menu className={`w-5 h-5 ${currentView === 'home' && !isScrolled ? 'text-white' : 'text-on-surface-variant'}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-surface-variant/10 p-6 flex flex-col gap-4 md:hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.onClick}
                className={`text-left py-4 font-bold text-lg border-b border-surface-variant/5 last:border-none ${
                  link.active ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="bg-background rounded-2xl px-4 py-4 flex items-center gap-3 border border-surface-variant/20 mt-2">
              <Search className="w-5 h-5 text-on-surface-variant" />
              <input 
                className="bg-transparent border-none focus:ring-0 text-base w-full font-sans outline-none" 
                placeholder="Search properties..." 
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentView !== 'browse' && e.target.value.length > 0) {
                    onBuyClick();
                    setIsMenuOpen(false);
                  }
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

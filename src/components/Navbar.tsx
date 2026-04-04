import React, { useState } from 'react';
import { Search, Bell, MessageSquare, User, Menu } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  onSellClick: () => void;
  onLogoClick: () => void;
  onBuyClick: () => void;
  onRentClick: () => void;
  currentView: 'home' | 'details' | 'sell' | 'browse';
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onSellClick, 
  onLogoClick, 
  onBuyClick, 
  onRentClick, 
  currentView,
  searchQuery,
  onSearchChange
}) => {
  const navLinks = [
    { label: 'Home', onClick: onLogoClick, active: currentView === 'home' },
    { label: 'Buy', onClick: onBuyClick, active: currentView === 'browse' },
    { label: 'Sell', onClick: onSellClick, active: currentView === 'sell' },
  ];

  return (
    <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 max-w-screen-2xl mx-auto bg-white/80 backdrop-blur-xl z-[9999] border-b border-surface-variant/10">
      <div className="flex items-center">
        <span 
          onClick={onLogoClick}
          className="text-2xl font-black tracking-tighter text-primary cursor-pointer"
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
              link.active ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {link.label}
            {link.active && (
              <motion.div 
                layoutId="activeNav"
                className="absolute -bottom-1 left-0 right-0 h-1 bg-secondary rounded-full"
              />
            )}
          </button>
        ))}
      </nav>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex bg-background rounded-full px-4 py-2 items-center gap-2 border border-surface-variant/20">
          <Search className="w-4 h-4 text-on-surface-variant" />
          <input 
            className="bg-transparent border-none focus:ring-0 text-sm w-48 font-sans outline-none" 
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
          <button className="md:hidden p-2 rounded-full hover:bg-surface-variant/30 transition-all">
            <Menu className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>
      </div>
    </header>
  );
};

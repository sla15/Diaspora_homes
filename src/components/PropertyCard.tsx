import React from 'react';
import { Property, CurrencyCode } from '../types';
import { Bed, Bath, Square, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { displayPrice } from '../lib/currency';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
  featured?: boolean;
  selectedCurrency: CurrencyCode;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, featured, selectedCurrency }) => {
  if (featured) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        onClick={onClick}
        className="md:col-span-2 md:row-span-2 bg-white rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-700 cursor-pointer border border-surface-variant/10"
      >
        <div className="relative h-full flex flex-col">
          <div className="relative flex-1 overflow-hidden min-h-[400px]">
            <img 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              src={property.images[0]} 
              alt={property.title}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute top-8 left-8 flex gap-3">
              <span className="bg-primary text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg backdrop-blur-md">Featured</span>
              <span className="bg-secondary text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg backdrop-blur-md">New Build</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-8">
                <div className="text-white">
                  <h3 className="text-2xl md:text-4xl font-black tracking-tighter mb-1 md:mb-2 leading-tight">{property.title}</h3>
                  <p className="flex items-center gap-2 font-bold text-white/80 text-sm md:text-base">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-secondary" /> {property.location}
                  </p>
                </div>
                <div className="md:text-right text-white bg-black/20 backdrop-blur-sm p-3 md:p-0 rounded-2xl md:bg-transparent">
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-0.5 md:mb-1">Price</p>
                  <p className="text-2xl md:text-3xl font-black whitespace-nowrap">{displayPrice(property.price, selectedCurrency)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 bg-white grid grid-cols-3 gap-4">
            {[
              { icon: Bed, label: 'Beds', value: property.bedrooms },
              { icon: Bath, label: 'Baths', value: property.bathrooms },
              { icon: Square, label: 'sqm', value: property.sqm },
            ].map((spec, i) => (
              <div key={i} className="flex flex-col items-center gap-1 py-4 bg-primary/5 rounded-2xl">
                <spec.icon className="w-5 h-5 text-primary mb-1" />
                <span className="text-lg font-black text-primary leading-none">{spec.value}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">{spec.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/5 group border border-surface-variant/10 hover:shadow-primary/10 transition-all duration-500 cursor-pointer flex flex-col"
    >
      <div className="h-64 relative overflow-hidden">
        <img 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          src={property.images[0]} 
          alt={property.title}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute top-6 left-6">
          <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-lg">Verified</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/40 to-transparent">
          <p className="text-2xl font-black text-white tracking-tighter">{displayPrice(property.price, selectedCurrency)}</p>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h4 className="text-xl font-black text-primary tracking-tight mb-1">{property.title}</h4>
        <p className="text-sm text-on-surface-variant font-bold truncate mb-6 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {property.location}
        </p>
        <div className="mt-auto flex justify-between items-center pt-6 border-t border-surface-variant/10">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-on-surface-variant font-black text-[10px] uppercase tracking-widest">
              <Bed className="w-4 h-4 text-primary" /> {property.bedrooms}
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant font-black text-[10px] uppercase tracking-widest">
              <Bath className="w-4 h-4 text-primary" /> {property.bathrooms}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
            <Square className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

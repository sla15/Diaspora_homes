import React from 'react';
import { Property } from '../types';
import { Bed, Bath, Square, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
  featured?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, featured }) => {
  if (featured) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        onClick={onClick}
        className="md:col-span-2 md:row-span-2 bg-surface rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-surface-variant/10"
      >
        <div className="relative h-full flex flex-col">
          <div className="relative flex-1 overflow-hidden min-h-[300px]">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              src={property.images[0]} 
              alt={property.title}
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter text-primary">Featured</span>
              <span className="bg-secondary/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter text-white">New Build</span>
            </div>
          </div>
          <div className="p-8 bg-surface">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-3xl font-bold text-primary mb-1">{property.title}</h3>
                <p className="text-on-surface-variant flex items-center gap-1 font-medium">
                  <MapPin className="w-4 h-4" /> {property.location}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-secondary uppercase tracking-widest block mb-1">Price</span>
                <span className="text-3xl font-black text-primary whitespace-nowrap">D {property.price.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex gap-6 pt-6 border-t border-surface-variant/20">
              <div className="flex items-center gap-2 text-on-surface-variant font-semibold">
                <Bed className="w-5 h-5" /> {property.bedrooms} Beds
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant font-semibold">
                <Bath className="w-5 h-5" /> {property.bathrooms} Baths
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant font-semibold">
                <Square className="w-5 h-5" /> {property.sqm} sqm
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="bg-surface rounded-3xl overflow-hidden shadow-sm group border border-surface-variant/10 hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="h-48 relative overflow-hidden">
        <img 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          src={property.images[0]} 
          alt={property.title}
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-6">
        <h4 className="text-lg font-bold text-primary">{property.title}</h4>
        <p className="text-sm text-on-surface-variant truncate mb-4">{property.location}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="font-black text-primary whitespace-nowrap">D {property.price.toLocaleString()}</span>
          <span className="text-xs font-bold text-on-surface-variant">{property.bedrooms} Beds • {property.bathrooms} Baths</span>
        </div>
      </div>
    </motion.div>
  );
};

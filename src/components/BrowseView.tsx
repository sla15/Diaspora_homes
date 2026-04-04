import React, { useState, useMemo } from 'react';
import { PropertyCard } from './PropertyCard';
import { Property, PROPERTIES } from '../types';
import { Search, SlidersHorizontal, Map as MapIcon, LayoutGrid, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GambiaMap } from './GambiaMap';

import { CustomDropdown } from './CustomDropdown';

interface BrowseViewProps {
  onPropertyClick: (property: Property) => void;
  initialType?: 'buy' | 'rent';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  propertyType: string;
  onPropertyTypeChange: (type: string) => void;
  properties: Property[];
}

export const BrowseView: React.FC<BrowseViewProps> = ({ 
  onPropertyClick, 
  initialType = 'buy',
  searchQuery,
  onSearchChange,
  propertyType,
  onPropertyTypeChange,
  properties
}) => {
  const [activeType, setActiveType] = useState<'buy' | 'rent'>(initialType);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [bedrooms, setBedrooms] = useState<string>('any');
  const [bathrooms, setBathrooms] = useState<string>('any');
  const [showFilters, setShowFilters] = useState(false);

  const propertyTypeOptions = [
    { value: 'any', label: 'Any Property Type' },
    { value: 'villa', label: 'Villa' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' },
  ];

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      const matchesType = prop.type === activeType;
      const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           prop.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = prop.price >= priceRange[0] && prop.price <= priceRange[1];
      
      const matchesBedrooms = bedrooms === 'any' || 
                             (bedrooms === '4' ? prop.bedrooms >= 4 : prop.bedrooms === parseInt(bedrooms));
      const matchesBathrooms = bathrooms === 'any' || 
                              (bathrooms === '4' ? prop.bathrooms >= 4 : prop.bathrooms === parseInt(bathrooms));
      const matchesPropertyType = propertyType === 'any' || propertyType === '' || prop.propertyType === propertyType;

      return matchesType && matchesSearch && matchesPrice && matchesBedrooms && matchesBathrooms && matchesPropertyType;
    });
  }, [activeType, searchQuery, priceRange, bedrooms, bathrooms, propertyType]);

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header & Type Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-primary tracking-tight mb-2">
              {activeType === 'buy' ? 'Properties for Sale' : 'Properties for Rent'}
            </h1>
            <p className="text-on-surface-variant font-medium">
              Discover {filteredProperties.length} verified listings in The Gambia
            </p>
          </div>

          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-surface-variant/10 self-start">
            <button 
              onClick={() => setActiveType('buy')}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                activeType === 'buy' 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-on-surface-variant hover:bg-surface-variant/20'
              }`}
            >
              Buy
            </button>
            <button 
              onClick={() => setActiveType('rent')}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                activeType === 'rent' 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-on-surface-variant hover:bg-surface-variant/20'
              }`}
            >
              Rent
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input 
              type="text"
              placeholder="Search by neighborhood, city or property name..."
              className="w-full bg-white border border-surface-variant/20 rounded-2xl px-14 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium shadow-sm"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`bg-white border border-surface-variant/20 rounded-2xl px-6 py-4 flex items-center justify-center gap-3 font-bold transition-colors shadow-sm ${showFilters ? 'text-secondary border-secondary' : 'text-primary hover:bg-surface-variant/10'}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-surface-variant/10">
            <button 
              onClick={() => setViewMode('grid')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                viewMode === 'grid' 
                  ? 'bg-secondary text-white shadow-md' 
                  : 'text-on-surface-variant hover:bg-surface-variant/20'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Grid
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                viewMode === 'map' 
                  ? 'bg-secondary text-white shadow-md' 
                  : 'text-on-surface-variant hover:bg-surface-variant/20'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              Map
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="bg-white border border-surface-variant/20 rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-sm">
                <div className="space-y-3">
                  <CustomDropdown
                    label="Property Type"
                    options={propertyTypeOptions}
                    value={propertyType}
                    onChange={onPropertyTypeChange}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Bedrooms</label>
                  <div className="flex bg-background p-1 rounded-xl">
                    {['any', '1', '2', '3', '4+'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setBedrooms(val === '4+' ? '4' : val)}
                        className={`flex-1 py-3 rounded-lg font-bold text-xs transition-all ${
                          (bedrooms === val || (bedrooms === '4' && val === '4+'))
                            ? 'bg-primary text-white shadow-md' 
                            : 'text-on-surface-variant hover:bg-surface-variant/20'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Bathrooms</label>
                  <div className="flex bg-background p-1 rounded-xl">
                    {['any', '1', '2', '3', '4+'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setBathrooms(val === '4+' ? '4' : val)}
                        className={`flex-1 py-3 rounded-lg font-bold text-xs transition-all ${
                          (bathrooms === val || (bathrooms === '4' && val === '4+'))
                            ? 'bg-primary text-white shadow-md' 
                            : 'text-on-surface-variant hover:bg-surface-variant/20'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProperties.length > 0 ? (
                filteredProperties.map(prop => (
                  <PropertyCard 
                    key={prop.id}
                    property={prop}
                    onClick={() => onPropertyClick(prop)}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="w-20 h-20 bg-surface-variant/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-on-surface-variant" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-2">No properties found</h3>
                  <p className="text-on-surface-variant max-w-md mx-auto">
                    We couldn't find any properties matching your current search and filters. Try adjusting your criteria.
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-[700px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-surface-variant/10 relative"
            >
              <GambiaMap 
                center={[13.4432, -16.6466]} 
                zoom={11} 
                showSearch={false}
                markers={filteredProperties.map(p => ({
                  position: p.coordinates,
                  title: p.title,
                  type: 'property',
                  price: `${p.currency} ${p.price.toLocaleString()}`,
                  image: p.images[0],
                  description: p.location
                }))}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

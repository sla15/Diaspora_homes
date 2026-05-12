import React, { useState, useMemo } from 'react';
import { PropertyCard } from './PropertyCard';
import { Property, PROPERTIES, CurrencyCode, COMMON_AMENITIES } from '../types';
import { Search, SlidersHorizontal, Map as MapIcon, LayoutGrid, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PropertyMap } from './PropertyMap';
import { displayPrice } from '../lib/currency';

import { CustomDropdown } from './CustomDropdown';

interface BrowseViewProps {
  onPropertyClick: (property: Property) => void;
  initialType?: 'buy' | 'rent';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  propertyType: string;
  onPropertyTypeChange: (type: string) => void;
  properties: Property[];
  selectedCurrency: CurrencyCode;
}

export const BrowseView: React.FC<BrowseViewProps> = ({ 
  onPropertyClick, 
  initialType = 'buy',
  searchQuery,
  onSearchChange,
  propertyType,
  onPropertyTypeChange,
  properties,
  selectedCurrency
}) => {
  const [activeType, setActiveType] = useState<'buy' | 'rent'>(initialType);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [bedrooms, setBedrooms] = useState<string>('any');
  const [bathrooms, setBathrooms] = useState<string>('any');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
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
      const matchesAmenities = selectedAmenities.length === 0 || 
                              selectedAmenities.every(amenity => prop.features.includes(amenity));

      return matchesType && matchesSearch && matchesPrice && matchesBedrooms && matchesBathrooms && matchesPropertyType && matchesAmenities;
    });
  }, [activeType, searchQuery, priceRange, bedrooms, bathrooms, propertyType, selectedAmenities]);

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header & Type Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tighter leading-none">
              {activeType === 'buy' ? 'Properties for Sale' : 'Properties for Rent'}
            </h1>
            <p className="text-lg text-on-surface-variant font-bold">
              Discover {filteredProperties.length} verified listings <span className="text-secondary italic">Globally.</span>
            </p>
          </div>

          <div className="flex bg-white p-1.5 rounded-[2rem] shadow-2xl shadow-primary/5 border border-surface-variant/10 self-start">
            <button 
              onClick={() => setActiveType('buy')}
              className={`px-10 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all ${
                activeType === 'buy' 
                  ? 'bg-primary text-white shadow-xl' 
                  : 'text-on-surface-variant hover:bg-surface-variant/10'
              }`}
            >
              Buy
            </button>
            <button 
              onClick={() => setActiveType('rent')}
              className={`px-10 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all ${
                activeType === 'rent' 
                  ? 'bg-primary text-white shadow-xl' 
                  : 'text-on-surface-variant hover:bg-surface-variant/10'
              }`}
            >
              Rent
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-grow relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-focus-within:bg-primary group-focus-within:text-white transition-all">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text"
              placeholder="Search by neighborhood, city or property name..."
              className="w-full bg-white border border-surface-variant/10 rounded-[2rem] pl-20 pr-8 py-6 focus:ring-4 focus:ring-primary/5 outline-none font-bold text-lg shadow-2xl shadow-primary/5 placeholder:text-on-surface-variant/30"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setPriceRange([0, 100000000]);
                  setBedrooms('any');
                  setBathrooms('any');
                  setSelectedAmenities([]);
                  onPropertyTypeChange('any');
                }}
                className="bg-white border border-surface-variant/10 rounded-[2rem] px-6 py-6 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all shadow-2xl shadow-primary/5 font-bold text-sm uppercase tracking-widest"
                title="Clear All Filters"
              >
                Clear
              </button>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`bg-white border border-surface-variant/10 rounded-[2rem] px-8 py-6 flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-primary/5 ${showFilters ? 'text-secondary border-secondary/30 bg-secondary/5' : 'text-primary hover:bg-surface-variant/5'}`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                {showFilters ? 'Hide' : 'Filters'}
              </button>

            <div className="flex bg-white p-1.5 rounded-[2rem] shadow-2xl shadow-primary/5 border border-surface-variant/10">
              <button 
                onClick={() => setViewMode('grid')}
                className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-secondary text-white shadow-lg' 
                    : 'text-on-surface-variant hover:bg-surface-variant/10'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all ${
                  viewMode === 'map' 
                    ? 'bg-secondary text-white shadow-lg' 
                    : 'text-on-surface-variant hover:bg-surface-variant/10'
                }`}
                title="Map View"
              >
                <MapIcon className="w-6 h-6" />
              </button>
            </div>
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

              {/* Amenities Filter */}
              <div className="mt-8 pt-8 border-t border-surface-variant/10">
                <div className="flex items-center justify-between mb-6">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Amenities</label>
                  {selectedAmenities.length > 0 && (
                    <button 
                      onClick={() => setSelectedAmenities([])}
                      className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline"
                    >
                      Clear Amenities
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {COMMON_AMENITIES.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        onClick={() => {
                          setSelectedAmenities(prev => 
                            isSelected ? prev.filter(a => a !== amenity) : [...prev, amenity]
                          );
                        }}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all text-left ${
                          isSelected 
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                            : 'bg-white border-surface-variant/10 text-on-surface-variant hover:border-primary/30'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span className="text-sm font-bold">{amenity}</span>
                      </button>
                    );
                  })}
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
                    selectedCurrency={selectedCurrency}
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
              <PropertyMap 
                center={[13.4432, -16.6466]} 
                zoom={11} 
                showSearch={false}
                markers={filteredProperties.map(p => ({
                  position: p.coordinates,
                  title: p.title,
                  type: 'property',
                  price: displayPrice(p.price, selectedCurrency),
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

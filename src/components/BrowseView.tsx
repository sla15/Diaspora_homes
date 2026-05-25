import React, { useState, useMemo } from 'react';
import { PropertyCard } from './PropertyCard';
import { Property, PROPERTIES, CurrencyCode, COMMON_AMENITIES, CURRENCIES } from '../types';
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
  const [isPropertyTypeExpanded, setIsPropertyTypeExpanded] = useState(true);
  const [isAmenitiesExpanded, setIsAmenitiesExpanded] = useState(false);

  const targetCurrency = useMemo(() => {
    return CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];
  }, [selectedCurrency]);

  const hasFilters = useMemo(() => {
    return (
      priceRange[0] !== 0 || 
      priceRange[1] !== 100000000 || 
      bedrooms !== 'any' || 
      bathrooms !== 'any' || 
      selectedAmenities.length > 0 || 
      (propertyType !== 'any' && propertyType !== '') ||
      searchQuery !== ''
    );
  }, [priceRange, bedrooms, bathrooms, selectedAmenities, propertyType, searchQuery]);

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
    <div className="min-h-screen bg-background pt-12 pb-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header & Type Toggle */}
        <div className="flex flex-col items-center justify-center text-center gap-6 mb-12 md:mb-16 max-w-4xl mx-auto">
          <div className="space-y-4 text-center flex flex-col items-center">
            <h1 className="text-3xl md:text-6xl font-black text-primary tracking-tighter leading-none text-center">
              {activeType === 'buy' ? 'Properties for Sale' : 'Properties for Rent'}
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant font-bold text-center">
              Discover {filteredProperties.length} verified listings <span className="text-secondary italic">Globally.</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 md:mt-6">
              {propertyTypeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onPropertyTypeChange(opt.value)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    propertyType === opt.value
                      ? 'bg-secondary text-white shadow-lg'
                      : 'bg-white text-on-surface-variant border border-surface-variant/10 hover:border-secondary/30'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex bg-white p-1.5 rounded-[2rem] shadow-2xl shadow-primary/5 border border-surface-variant/10">
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
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-focus-within:bg-primary group-focus-within:text-white transition-all">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text"
              placeholder="Search by neighborhood, city or property name..."
              className="w-full bg-white border border-surface-variant/10 rounded-[2rem] pl-16 md:pl-20 pr-8 py-5 md:py-6 focus:ring-4 focus:ring-primary/5 outline-none font-bold text-base md:text-lg shadow-2xl shadow-primary/5 placeholder:text-on-surface-variant/30"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <AnimatePresence>
                {hasFilters && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => {
                      setPriceRange([0, 100000000]);
                      setBedrooms('any');
                      setBathrooms('any');
                      setSelectedAmenities([]);
                      onPropertyTypeChange('any');
                      onSearchChange('');
                    }}
                    className="bg-white border border-secondary/30 rounded-2xl md:rounded-[2rem] px-4 md:px-6 py-4 md:py-6 flex items-center justify-center text-secondary hover:bg-secondary/5 transition-all shadow-xl shadow-secondary/5 font-black text-[10px] md:text-sm uppercase tracking-widest gap-2"
                    title="Clear All Filters"
                  >
                    Clear All
                  </motion.button>
                )}
              </AnimatePresence>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`bg-white border border-surface-variant/10 rounded-2xl md:rounded-[2rem] px-6 md:px-8 py-4 md:py-6 flex items-center justify-center gap-2 md:gap-3 font-black text-[10px] md:text-sm uppercase tracking-widest transition-all shadow-2xl shadow-primary/5 ${showFilters ? 'text-secondary border-secondary/30 bg-secondary/5' : 'text-primary hover:bg-surface-variant/5'}`}
              >
                <SlidersHorizontal className="w-4 h-4 md:w-5 md:h-5" />
                {showFilters ? 'Hide' : 'Filters'}
              </button>

            <div className="flex bg-white p-1 rounded-2xl md:rounded-[2rem] shadow-2xl shadow-primary/5 border border-surface-variant/10 ml-auto lg:ml-0">
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
              <div className="bg-white border border-surface-variant/20 rounded-[2rem] p-6 lg:p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-surface-variant/10 pb-6 md:pb-0">
                    <button 
                      onClick={() => setIsPropertyTypeExpanded(!isPropertyTypeExpanded)}
                      className="w-full flex items-center justify-between group mb-4"
                    >
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-primary">Property Category</label>
                      <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-300 ${isPropertyTypeExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isPropertyTypeExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-2">
                            {propertyTypeOptions.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => onPropertyTypeChange(opt.value)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                                  propertyType === opt.value
                                    ? 'bg-primary/5 text-primary'
                                    : 'hover:bg-background text-on-surface-variant'
                                }`}
                              >
                                <span className={`text-sm ${propertyType === opt.value ? 'font-black' : 'font-bold'}`}>{opt.label}</span>
                                {propertyType === opt.value && <Check className="w-4 h-4" />}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-6 md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-primary ml-1">Bedrooms</label>
                        <div className="flex bg-background p-1 rounded-xl border border-surface-variant/10">
                          {['any', '1', '2', '3', '4+'].map((val) => (
                            <button
                              key={val}
                              onClick={() => setBedrooms(val === '4+' ? '4' : val)}
                              className={`flex-1 py-3 rounded-lg font-black text-[10px] md:text-xs transition-all ${
                                (bedrooms === val || (bedrooms === '4' && val === '4+'))
                                  ? 'bg-primary text-white shadow-lg' 
                                  : 'text-on-surface-variant hover:bg-surface-variant/20'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-primary ml-1">Bathrooms</label>
                        <div className="flex bg-background p-1 rounded-xl border border-surface-variant/10">
                          {['any', '1', '2', '3', '4+'].map((val) => (
                            <button
                              key={val}
                              onClick={() => setBathrooms(val === '4+' ? '4' : val)}
                              className={`flex-1 py-3 rounded-lg font-black text-[10px] md:text-xs transition-all ${
                                (bathrooms === val || (bathrooms === '4' && val === '4+'))
                                  ? 'bg-primary text-white shadow-lg' 
                                  : 'text-on-surface-variant hover:bg-surface-variant/20'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-surface-variant/10">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-primary select-none">Price Range ({targetCurrency.symbol} - {targetCurrency.code})</label>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="relative flex items-center">
                          <span className="absolute left-4 text-xs font-bold text-on-surface-variant/40">{targetCurrency.symbol}</span>
                          <input 
                            type="number" 
                            placeholder="Min Price" 
                            className="w-full bg-background border border-surface-variant/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/25 outline-none font-bold placeholder:text-on-surface-variant/30 text-primary"
                            value={priceRange[0] === 0 ? '' : Math.round(priceRange[0] * targetCurrency.rate)}
                            onChange={(e) => {
                              const val = e.target.value === '' ? 0 : Number(e.target.value);
                              const gmdVal = val / targetCurrency.rate;
                              setPriceRange([gmdVal, priceRange[1]]);
                            }}
                          />
                        </div>
                        <div className="relative flex items-center">
                          <span className="absolute left-4 text-xs font-bold text-on-surface-variant/40">{targetCurrency.symbol}</span>
                          <input 
                            type="number" 
                            placeholder="Max Price" 
                            className="w-full bg-background border border-surface-variant/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/25 outline-none font-bold placeholder:text-on-surface-variant/30 text-primary"
                            value={priceRange[1] === 100000000 ? '' : Math.round(priceRange[1] * targetCurrency.rate)}
                            onChange={(e) => {
                              const val = e.target.value === '' ? 100000000 : Number(e.target.value);
                              const gmdVal = val / targetCurrency.rate;
                              setPriceRange([priceRange[0], gmdVal]);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-surface-variant/10">
                      <button 
                        onClick={() => setIsAmenitiesExpanded(!isAmenitiesExpanded)}
                        className="w-full flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-black uppercase tracking-[0.2em] text-primary">Amenities & Features</label>
                          {selectedAmenities.length > 0 && (
                            <span className="bg-secondary text-white text-[9px] font-black px-2 py-0.5 rounded-full">{selectedAmenities.length}</span>
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-300 ${isAmenitiesExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isAmenitiesExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-6"
                          >
                            <div className="flex flex-wrap gap-2 md:gap-3">
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
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-left ${
                                      isSelected 
                                        ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/10' 
                                        : 'bg-white border-surface-variant/10 text-on-surface-variant hover:border-secondary/30'
                                    }`}
                                  >
                                    {isSelected && <Check className="w-3.5 h-3.5" />}
                                    <span className={`text-xs ${isSelected ? 'font-black' : 'font-bold'}`}>{amenity}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
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

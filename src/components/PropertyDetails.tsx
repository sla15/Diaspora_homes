import React from 'react';
import { Property, CurrencyCode } from '../types';
import { ArrowLeft, MapPin, Bed, Bath, Square, Car, Waves, Zap, Shield, Wine, Star, Mail, CreditCard, Calendar, TrendingUp, Instagram, Facebook, Linkedin, Twitter, Globe, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { PropertyMap } from './PropertyMap';
import { displayPrice } from '../lib/currency';

interface PropertyDetailsProps {
  property: Property;
  onBack: () => void;
  selectedCurrency: CurrencyCode;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, onBack, selectedCurrency }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-screen-xl mx-auto px-4 md:px-6 pb-24"
    >
      <div className="py-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all group px-4 py-2 rounded-full hover:bg-surface-variant/10 w-fit"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm uppercase tracking-widest">Back to Listings</span>
        </button>
      </div>

      {/* Hero Image Gallery */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[600px]">
          {/* Main Large Image */}
          <div className="md:col-span-8 relative overflow-hidden rounded-3xl bg-surface-variant group h-[300px] md:h-full shadow-2xl">
            <img 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              src={property.images[0]} 
              alt={property.title} 
              referrerPolicy="no-referrer" 
            />
            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-primary text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg backdrop-blur-md"
              >
                New Construction
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-secondary text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg backdrop-blur-md"
              >
                Waterfront
              </motion.span>
            </div>
          </div>

          {/* Side Images Grid */}
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-4 h-[200px] md:h-full">
            <div className="relative overflow-hidden rounded-3xl bg-surface-variant group shadow-lg">
              <img 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                src={property.images[1] || property.images[0]} 
                alt="Interior" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <div className="relative overflow-hidden rounded-3xl bg-surface-variant group shadow-lg">
              <img 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                src={property.images[2] || property.images[0]} 
                alt="Detail" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-white font-black text-xs uppercase tracking-widest">View Gallery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-grow space-y-16">
          {/* Headline & Price */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tighter leading-none">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-on-surface-variant font-bold">
                  <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-lg">{property.location}</span>
                </div>
              </div>
              <div className="bg-secondary/5 px-8 py-4 rounded-3xl border border-secondary/10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-1">Asking Price</p>
                <p className="text-4xl font-black text-secondary tracking-tight">
                  {displayPrice(property.price, selectedCurrency)}
                </p>
              </div>
            </div>

            {/* Spec Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
                { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
                { icon: Square, label: 'Sq Meters', value: property.sqm },
                { icon: Car, label: 'Parking', value: property.parking },
              ].map((spec, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-surface-variant/10 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
                    <spec.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-black text-primary">{spec.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{spec.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-grow bg-surface-variant/20"></div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant whitespace-nowrap">Architectural Narrative</h2>
              <div className="h-px flex-grow bg-surface-variant/20"></div>
            </div>
            <p className="text-on-surface-variant leading-relaxed text-xl font-medium">
              {property.description}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-primary tracking-tight">Curated Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Waves, title: 'Infinity Edge Pool', desc: 'Saltwater with solar heating' },
                { icon: Zap, title: 'Full Solar Array', desc: '24/7 autonomous power backup' },
                { icon: Shield, title: 'Advanced Security', desc: 'Biometric access & 4K surveillance' },
                { icon: Wine, title: 'Private Wine Cellar', desc: 'Climate controlled storage' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-white rounded-[2rem] border border-surface-variant/10 hover:border-primary/20 transition-colors group">
                  <div className="w-16 h-16 rounded-3xl bg-secondary/5 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-primary">{feature.title}</p>
                    <p className="text-sm text-on-surface-variant font-bold">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map View */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-primary tracking-tight">The Neighborhood</h2>
            <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden relative shadow-2xl border-4 border-white">
              <PropertyMap 
                center={property.coordinates} 
                markers={[{ position: property.coordinates, title: property.title }]} 
              />
              <div className="absolute bottom-8 left-8 z-[1000] bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-surface-variant/10 max-w-xs">
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Location Context</p>
                <p className="text-xl font-black text-primary mb-1">{property.location.split(',')[0]} Area</p>
                <p className="text-sm text-on-surface-variant font-bold leading-relaxed">Located in a premium residential zone with high appreciation potential.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-[400px] flex-shrink-0">
          <div className="sticky top-24 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-primary/5 border border-surface-variant/10">
              <div className="flex items-center gap-6 mb-10 pb-10 border-b border-surface-variant/10">
                <div className="relative">
                  <img className="w-20 h-20 rounded-3xl object-cover shadow-lg" src={property.agent.image} alt={property.agent.name} />
                  <div className="absolute -bottom-2 -right-2 bg-secondary text-white p-1.5 rounded-xl shadow-lg">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Listing Agent</p>
                  <p className="text-2xl font-black text-primary">{property.agent.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(property.agent.rating) ? 'fill-secondary text-secondary' : 'text-surface-variant'}`} />
                    ))}
                    <span className="text-[10px] font-black text-on-surface-variant ml-2">VERIFIED</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <a 
                  href={`https://wa.me/${property.agent.phone}?text=I'm interested in ${property.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-6 h-6" /> Contact Seller
                </a>
                <button className="w-full bg-background text-primary py-5 rounded-2xl font-black text-lg border border-surface-variant/20 hover:bg-surface-variant/10 transition-all flex items-center justify-center gap-3">
                  <Calendar className="w-6 h-6" /> Schedule Viewing
                </button>
              </div>

              {/* Social Links */}
              {(property.agent.whatsapp || property.agent.instagram || property.agent.facebook || property.agent.linkedin) && (
                <div className="mt-10 pt-10 border-t border-surface-variant/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-6 text-center">Digital Presence</p>
                  <div className="flex justify-center gap-4">
                    {[
                      { icon: MessageCircle, link: property.agent.whatsapp ? `https://wa.me/${property.agent.whatsapp}` : null, color: 'text-green-600 bg-green-50' },
                      { icon: Instagram, link: property.agent.instagram, color: 'text-pink-600 bg-pink-50' },
                      { icon: Facebook, link: property.agent.facebook, color: 'text-blue-600 bg-blue-50' },
                      { icon: Linkedin, link: property.agent.linkedin, color: 'text-blue-800 bg-blue-50' },
                    ].filter(s => s.link).map((social, i) => (
                      <a 
                        key={i}
                        href={social.link?.startsWith('http') ? social.link : `https://${social.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg ${social.color}`}
                      >
                        <social.icon className="w-6 h-6" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Market Insight Card */}
            <div className="bg-primary text-white p-10 rounded-[3rem] shadow-2xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-xs">Market Insight</h3>
                </div>
                <p className="text-surface-variant font-bold text-lg mb-6 leading-relaxed">
                  Properties in <span className="text-white">{property.location.split(',')[0]}</span> have appreciated by <span className="text-secondary font-black text-2xl">12%</span> in the last 12 months.
                </p>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '75%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-secondary"
                  ></motion.div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">High Demand Investment Zone</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

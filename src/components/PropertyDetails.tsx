import React from 'react';
import { Property } from '../types';
import { ArrowLeft, MapPin, Bed, Bath, Square, Car, Waves, Zap, Shield, Wine, Star, Mail, CreditCard, Calendar, TrendingUp, Instagram, Facebook, Linkedin, Twitter, Globe, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { GambiaMap } from './GambiaMap';

interface PropertyDetailsProps {
  property: Property;
  onBack: () => void;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-screen-xl mx-auto px-6"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group mb-8"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Listings</span>
      </button>

      {/* Bento Image Gallery */}
      <section className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] mb-12">
        <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-xl bg-surface-variant group">
          <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={property.images[0]} alt={property.title} referrerPolicy="no-referrer" />
          <div className="absolute top-6 left-6 flex gap-2">
            <span className="bg-secondary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">New Construction</span>
            <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Waterfront</span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-surface-variant group">
          <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={property.images[1] || property.images[0]} alt="Interior" referrerPolicy="no-referrer" />
        </div>
        <div className="relative overflow-hidden rounded-xl bg-surface-variant group">
          <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={property.images[2] || property.images[0]} alt="Kitchen" referrerPolicy="no-referrer" />
        </div>
        <div className="md:col-span-2 relative overflow-hidden rounded-xl bg-surface-variant group">
          <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={property.images[3] || property.images[0]} alt="Terrace" referrerPolicy="no-referrer" />
          <button className="absolute bottom-6 right-6 bg-white text-primary px-6 py-3 rounded-full flex items-center gap-2 font-bold shadow-lg hover:scale-105 transition-transform">
            View all 24 photos
          </button>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-grow space-y-12">
          {/* Headline & Price */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tighter">{property.title}</h1>
                <p className="text-lg text-on-surface-variant flex items-center gap-2 mt-2">
                  <MapPin className="w-5 h-5" /> {property.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-secondary tracking-tight whitespace-nowrap">D {property.price.toLocaleString()}</p>
              </div>
            </div>

            {/* Bento Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="bg-background p-6 rounded-xl text-center border border-surface-variant/20">
                <Bed className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{property.bedrooms}</p>
                <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Bedrooms</p>
              </div>
              <div className="bg-background p-6 rounded-xl text-center border border-surface-variant/20">
                <Bath className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{property.bathrooms}</p>
                <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Bathrooms</p>
              </div>
              <div className="bg-background p-6 rounded-xl text-center border border-surface-variant/20">
                <Square className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{property.sqm}</p>
                <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Sq Meters</p>
              </div>
              <div className="bg-background p-6 rounded-xl text-center border border-surface-variant/20">
                <Car className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{property.parking}</p>
                <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Parking</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Architectural Narrative</h2>
            <p className="text-on-surface-variant leading-relaxed text-lg max-w-3xl">
              {property.description}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Curated Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-surface-variant/10">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Waves className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Infinity Edge Pool</p>
                  <p className="text-sm text-on-surface-variant">Saltwater with solar heating</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-surface-variant/10">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Full Solar Array</p>
                  <p className="text-sm text-on-surface-variant">24/7 autonomous power backup</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-surface-variant/10">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Advanced Security</p>
                  <p className="text-sm text-on-surface-variant">Biometric access & 4K surveillance</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-surface-variant/10">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Wine className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Private Wine Cellar</p>
                  <p className="text-sm text-on-surface-variant">Climate controlled storage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map View */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Location</h2>
            <div className="h-[400px] w-full rounded-xl overflow-hidden relative shadow-inner">
              <GambiaMap 
                center={property.coordinates} 
                markers={[{ position: property.coordinates, title: property.title }]} 
              />
              <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-surface-variant/20">
                <p className="font-bold">{property.location.split(',')[0]} Area</p>
                <p className="text-sm text-on-surface-variant">Premium Residential Zone</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-surface-variant/20">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-background">
                <img className="w-16 h-16 rounded-full object-cover" src={property.agent.image} alt={property.agent.name} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Listing Agent</p>
                  <p className="text-xl font-bold">{property.agent.name}</p>
                  <div className="flex items-center text-secondary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(property.agent.rating) ? 'fill-secondary' : ''}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <a 
                  href={`https://wa.me/${property.agent.phone}?text=I'm interested in ${property.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" /> Contact Seller
                </a>
              </div>
              <div className="mt-8 pt-8 border-t border-background text-center">
                <p className="text-sm text-on-surface-variant mb-4">Request a private tour of the estate</p>
                <button className="text-primary font-bold hover:underline flex items-center justify-center gap-2 w-full">
                  <Calendar className="w-5 h-5" /> Schedule Viewing
                </button>
              </div>
            </div>

            {/* Social Links Card */}
            {(property.agent.whatsapp || property.agent.instagram || property.agent.facebook || property.agent.linkedin) && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-surface-variant/20">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4 ml-1">Connect with Seller</h4>
                <div className="flex flex-wrap gap-3">
                  {property.agent.whatsapp && (
                    <a 
                      href={`https://wa.me/${property.agent.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 hover:bg-green-500 hover:text-white transition-all"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>
                  )}
                  {property.agent.instagram && (
                    <a 
                      href={property.agent.instagram.startsWith('http') ? property.agent.instagram : `https://${property.agent.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-600 hover:bg-pink-500 hover:text-white transition-all"
                      title="Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {property.agent.facebook && (
                    <a 
                      href={property.agent.facebook.startsWith('http') ? property.agent.facebook : `https://${property.agent.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-700 hover:bg-blue-600 hover:text-white transition-all"
                      title="Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {property.agent.linkedin && (
                    <a 
                      href={property.agent.linkedin.startsWith('http') ? property.agent.linkedin : `https://${property.agent.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-blue-700/10 flex items-center justify-center text-blue-800 hover:bg-blue-700 hover:text-white transition-all"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="bg-primary text-white p-8 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Market Insight</h3>
                <TrendingUp className="w-5 h-5 opacity-50" />
              </div>
              <p className="text-surface-variant text-sm mb-4">Properties in this area have appreciated by <span className="font-bold text-white">12%</span> in the last 12 months.</p>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-secondary"></div>
              </div>
              <p className="text-[10px] mt-4 opacity-60 uppercase tracking-widest font-bold">High Demand Area</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

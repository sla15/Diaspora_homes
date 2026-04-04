import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Search, MapPin, Info, Home } from 'lucide-react';
import { POI, POIS } from '../types';

// Fix for default marker icons in Leaflet with React using CDN
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const POIIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map view changes
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

interface GambiaMapProps {
  center: [number, number];
  zoom?: number;
  markers?: { 
    position: [number, number]; 
    title: string; 
    type?: 'property' | 'poi';
    price?: string;
    image?: string;
    description?: string;
  }[];
  showSearch?: boolean;
}

export const GambiaMap: React.FC<GambiaMapProps> = ({ 
  center: initialCenter, 
  zoom: initialZoom = 13, 
  markers: initialMarkers = [],
  showSearch = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>(initialCenter);
  const [mapZoom, setMapZoom] = useState(initialZoom);

  const allMarkers = useMemo(() => {
    const poiMarkers = POIS.map(poi => ({
      position: poi.coordinates,
      title: poi.title,
      description: poi.description,
      type: 'poi' as const
    }));
    
    const propertyMarkers = initialMarkers.map(m => ({
      ...m,
      type: 'property' as const
    }));

    return [...propertyMarkers, ...poiMarkers];
  }, [initialMarkers]);

  const filteredMarkers = useMemo(() => {
    if (!searchQuery.trim()) return allMarkers;
    return allMarkers.filter(m => 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allMarkers, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredMarkers.length > 0) {
      setMapCenter(filteredMarkers[0].position);
      setMapZoom(14);
    }
  };

  return (
    <div className="h-full w-full relative rounded-xl overflow-hidden shadow-inner border border-surface-variant/20">
      {showSearch && (
        <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-center">
          <form 
            onSubmit={handleSearch}
            className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-xl border border-surface-variant/20 flex items-center gap-2 w-full max-w-md"
          >
            <Search className="w-5 h-5 text-on-surface-variant ml-3" />
            <input 
              type="text" 
              placeholder="Search points of interest..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium outline-none"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      )}

      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <ChangeView center={mapCenter} zoom={mapZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredMarkers.map((marker, idx) => (
          <Marker 
            key={idx} 
            position={marker.position}
            icon={marker.type === 'poi' ? POIIcon : DefaultIcon}
          >
            <Tooltip direction="top" offset={[0, -40]} opacity={1} permanent={false}>
              {marker.type === 'property' ? (
                <div className="w-48 bg-white rounded-2xl overflow-hidden shadow-2xl border border-surface-variant/10">
                  {marker.image && (
                    <div className="h-24 relative">
                      <img src={marker.image} alt={marker.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-lg text-[10px] font-black">
                        {marker.price}
                      </div>
                    </div>
                  )}
                  <div className="p-3">
                    <h4 className="font-black text-primary text-xs truncate">{marker.title}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-secondary" />
                      <span className="text-[10px] text-on-surface-variant font-medium truncate">{marker.description || 'Gambia'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-2 bg-white rounded-xl shadow-lg border border-surface-variant/10">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-secondary" />
                    <span className="font-bold text-primary text-xs">{marker.title}</span>
                  </div>
                </div>
              )}
            </Tooltip>
            <Popup>
              <div className="p-1">
                <div className="flex items-center gap-2 mb-1">
                  {marker.type === 'poi' ? <Info className="w-4 h-4 text-secondary" /> : <MapPin className="w-4 h-4 text-primary" />}
                  <span className="font-bold text-primary">{marker.title}</span>
                </div>
                {marker.description && (
                  <p className="text-xs text-on-surface-variant leading-tight">{marker.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

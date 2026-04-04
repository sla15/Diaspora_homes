import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

function MapEvents({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ lat, lng, onChange }) => {
  return (
    <div className="h-64 w-full rounded-2xl overflow-hidden border border-surface-variant/20 shadow-inner">
      <MapContainer 
        center={[lat, lng]} 
        zoom={13} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onChange={onChange} />
        <Marker position={[lat, lng]} />
      </MapContainer>
      <div className="bg-surface-variant/10 px-4 py-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center">
        Click on the map to set property location
      </div>
    </div>
  );
};

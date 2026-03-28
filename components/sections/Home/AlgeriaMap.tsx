"use client";


// 1. Import the specific types needed
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 2. Define your spot type for better safety
interface HuntingSpot {
  id: number;
  name: string;
  coords: [number, number];
  wilaya: string;
}

const huntingSpots: HuntingSpot[] = [
  { id: 1, name: "Djurdjura Expedition", coords: [36.46, 4.2], wilaya: "Tizi Ouzou" },
  { id: 2, name: "Aurès Highlands", coords: [35.55, 6.17], wilaya: "Batna" },
];

export default function AlgeriaMap() {
  // 3. Fix for the default icon issue (standard in Leaflet + Next.js)
  const customIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="h-[500px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
      <MapContainer 
        center={[36.7, 3.0]} 
        zoom={6} 
        scrollWheelZoom={false}
        className="h-full w-full" // Use CSS classes instead of the 'style' prop if possible
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {huntingSpots.map((spot) => (
          <Marker 
            key={spot.id} 
            position={spot.coords} 
            icon={customIcon}
          >
            <Popup>
              <div className="text-black p-1">
                <p className="font-bold">{spot.name}</p>
                <p className="text-xs uppercase text-gray-500">{spot.wilaya}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
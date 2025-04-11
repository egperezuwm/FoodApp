import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import restaurantIconUrl from '../assets/home.png';


function MapSection({ drivers, customers }) {
  // center the map around the restaurant’s coordinates
  const restaurantPosition = [43.075083, -87.888147];

  const restaurantIcon = new L.Icon({
    iconUrl: restaurantIconUrl,
    iconSize: [32, 32], // Adjust as needed
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
  });

  return (
    <div className="map-section">
      <MapContainer center={restaurantPosition} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Restaurant marker */}
        <Marker position={restaurantPosition} icon={restaurantIcon}>
          <Popup>Restaurant</Popup>
        </Marker>
        {/* Driver markers */}
        {drivers.map(driver => (
          <Marker key={driver.id} position={driver.location}>
            <Popup>{driver.customerName}</Popup>
          </Marker>
        ))}
        {/* Customer markers */}
        {customers.map(customer => (
          <Marker key={customer.id} position={customer.location}>
            <Popup>{customer.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapSection;
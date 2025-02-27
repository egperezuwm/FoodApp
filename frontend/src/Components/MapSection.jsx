import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


function MapSection({ drivers, customers }) {
  // center the map around the restaurant’s coordinates
  const restaurantPosition = [43.075083, -87.888147];

  return (
    <div className="map-section">
      <MapContainer center={restaurantPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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

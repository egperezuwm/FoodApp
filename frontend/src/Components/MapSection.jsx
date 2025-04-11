import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import restaurantIconUrl from '../assets/home.png';
import doordashIconUrl from '../assets/doordash.png';
import grubhubIconUrl from '../assets/grubhub.png';
import ubereatsIconUrl from '../assets/ubereats.png';


function MapSection({ orders, customers }) {
  console.log("Orders in MapSection:", orders);
  // center the map around the restaurant’s coordinates
  const restaurantPosition = [43.075083, -87.888147];

  const restaurantIcon = new L.Icon({
    iconUrl: restaurantIconUrl,
    iconSize: [32, 32], // Adjust as needed
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
  });

  const doordashIcon = new L.Icon({
    iconUrl: doordashIconUrl,
    iconSize: [64, 64],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
  
  const grubhubIcon = new L.Icon({
    iconUrl: grubhubIconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
  
  const ubereatsIcon = new L.Icon({
    iconUrl: ubereatsIconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
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
        {/* Order markers (AKA Driver markers) */}
        {/* Restaurant marker */}
        <Marker position={restaurantPosition} icon={restaurantIcon}>
          <Popup>Restaurant</Popup>
        </Marker>

        {/* Order markers (AKA Driver markers) */}
        {orders
          .filter(order =>
            order.status === 'pending' &&
            typeof order.driver_lat === 'number' &&
            typeof order.driver_lng === 'number'
          )
          .map(order => {
            let icon = restaurantIcon; // fallback

            if (order.platform === 'DoorDash') {
              icon = doordashIcon;
            } else if (order.platform === 'GrubHub') {
              icon = grubhubIcon;
            } else if (order.platform === 'UberEats') {
              icon = ubereatsIcon;
            }

            return (
              <Marker
                key={order.id}
                position={[order.driver_lat, order.driver_lng]}
                icon={icon}
              >
                <Popup>
                  <strong>{order.platform}</strong><br />
                  {order.customer_name}<br />
                  ETA: {order.eta} min
                </Popup>
              </Marker>
            );
          })}

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
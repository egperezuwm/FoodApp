import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './styles/MapSection.css';
import axios from 'axios';
import restaurantIconUrl from '../assets/home.png';
import carIconUrl from '../assets/car_icon.png';

function RestaurantMarker({ position, icon, name }) {
  const [showInput, setShowInput] = useState(false);
  const [address, setAddress] = useState("");
  const map = useMap();

  const handleAddressSubmit = (e) => {
    e.preventDefault(); // Prevent popup from closing
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      .then(res => res.json())
      .then(data => {
        if (!data.length) return alert("Address not found.");
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        axios.patch('http://127.0.0.1:8000/api/update-restaurant-location/', {
          location_lat: lat,
          location_lng: lng
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
        }).then(() => {
          map.setView([lat, lng]);
          alert("Location updated.");
          setShowInput(false);
        });
      });
  };

  const handleStartEdit = (e) => {
    e.preventDefault(); // Prevent popup close
    setShowInput(true);
    setTimeout(() => markerRef.current?.openPopup(), 0);
  };

  const handleCancel = (e) => {
    e.preventDefault(); // Prevent popup close
    setShowInput(false);
    setAddress("");
    setTimeout(() => markerRef.current?.openPopup(), 0);
  };

  const markerRef = useRef();

  return (
    <Marker position={position} icon={icon} ref={markerRef}>
      <Popup
        maxWidth={300}
        minWidth={200}
        className={showInput ? "wide-popup" : ""}
      >
        <div>
          <strong>{name}</strong>
        </div>
        <div style={{ marginTop: '5px' }}>
          {showInput ? (
            <>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Enter address"
                style={{ width: '100%' }}
              />
              <button type="button" onClick={handleAddressSubmit} style={{ marginTop: '5px' }}>Update</button>
              <button type="button" onClick={handleCancel} style={{ marginTop: '5px' }}>Cancel</button>
            </>
          ) : (
            <button type="button" onClick={handleStartEdit}>Change Address</button>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

function MapSection({ orders, customers, restaurantPosition, restaurant, selectedOrderId }) {
  console.log("Orders in MapSection:", orders);
  const [activePopup, setActivePopup] = useState(null); // stores selected order popup

  const restaurantIcon = new L.Icon({
    iconUrl: restaurantIconUrl,
    iconSize: [32, 32], // Adjust as needed
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
  });

  const doordashIcon = new L.Icon({
    iconUrl: carIconUrl,
    iconSize: [64, 64],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const grubhubIcon = new L.Icon({
    iconUrl: carIconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const ubereatsIcon = new L.Icon({
    iconUrl: carIconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  return (
    <div className="map-section">
      <MapContainer center={restaurantPosition} zoom={14} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

        <PopupTrigger selectedOrderId={selectedOrderId} orders={orders} /> 
        {/* Restaurant Marker with address update option */}
        <RestaurantMarker position={restaurantPosition} icon={restaurantIcon} name={restaurant.name} />

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
function PopupTrigger({ selectedOrderId, orders }) {
  const map = useMap();

  useEffect(() => {
    const selected = orders.find(o => o.id === selectedOrderId);
    if (selected) {
      const latlng = [selected.driver_lat, selected.driver_lng];
      const popupContent = `
        <strong>${selected.platform}</strong><br />
        ${selected.customer_name}<br />
        ETA: ${selected.eta} min
      `;
      const leafletPopup = L.popup({ offset: [0, -15] })
        .setLatLng(latlng)
        .setContent(popupContent)
        .openOn(map);
    }
  }, [selectedOrderId, orders, map]);

  return null; // this component does not render anything
}

export default MapSection;
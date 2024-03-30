import React, { Component } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from './../marker.png';

export default class Contact extends Component {
  render() {
    const position = [52.221158, 21.008440]; // Coordinates for Warsaw University of Technology

    const customMarkerIcon = L.icon({
      iconUrl: markerIcon,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    return (
      <div style={{ width: '80vw', height: '80vh', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '20px' }}>
        <p>Having Questions? Feel free to ask us</p>
        <p>Clinic Polmedic</p>
        <p>plac Politechniki 1, 00-661 Warszawa</p>
      </div>
      <div style={{ width: '80vw', height: '80vh', margin: 'auto', position: 'relative' }}>
        <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position} icon={customMarkerIcon}>
            <Popup>
              Clinic Polmedic
              <br /> plac Politechniki 1, 00-661 Warszawa
            </Popup>
          </Marker>
        </MapContainer>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '10px' }}>
          <p>plac Politechniki 1, 00-661 Warszawa</p>
        </div>
      </div>
      </div>
    );
  }
}

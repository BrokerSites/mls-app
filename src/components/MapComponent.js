import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from './MarkerClusterGroup';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const MapComponent = ({ listings, siteDomain }) => {
  // Coordinates for Houston, Texas
  const position = [29.7604, -95.3698];

  return (
    <MapContainer center={position} zoom={11} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup
        listings={listings}
        siteDomain={siteDomain}
        options={{ spiderfyDistanceMultiplier: 2 }} // Adjust this value to increase spiderfy distance
      />
    </MapContainer>
  );
};

export default MapComponent;

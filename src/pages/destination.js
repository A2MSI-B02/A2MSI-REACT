// src/pages/destination.js
import React from 'react';
import Footer from '../components/footer';
import { APIProvider, Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps';

const Destination = () => (
  <div>
    <h1>Carte des Destinations</h1>
    <APIProvider
      apiKey={'AIzaSyCRXfz02kudZpFDr4ogAmdA7BVm5AnUMuc'}
      onLoad={() => console.log('Maps API has loaded.')}
    >
      <Map
        defaultZoom={13}
        defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
        }
        style={{ height: '500px', width: '100%' }} // Ajout de styles pour la carte
      />
    </APIProvider>
    <Footer /> {/* Utilisation du composant Footer */}
  </div>
);

export default Destination;



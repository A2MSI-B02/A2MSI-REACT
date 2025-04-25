import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/accueil.css';
import 'leaflet/dist/leaflet.css';
import Footer from '../components/footer';

function Accueil() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null); // État pour stocker la position de l'utilisateur

  const cities = [
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'Bangkok', lat: 13.7563, lng: 100.5018 },
    { name: 'Hanoï', lat: 21.0285, lng: 105.8542 },
    { name: 'Porto', lat: 41.1579438, lng: -8.6291053 },
    { name: 'Barcelone', lat: 41.3851, lng: 2.1734 },
  ];

  const searchDestination = () => {
    const searchInput = document.getElementById('search').value;
    if (searchInput.trim() === '') {
      alert('Veuillez entrer une ville pour rechercher.');
    } else {
      localStorage.setItem('searchQuery', searchInput); // Stocke la recherche
      navigate('/destination'); // Redirection vers la page "Destinations"
    }
  };

  const handleLearnMore = (city) => {
    localStorage.setItem('searchQuery', city.name); // Stocke le nom de la ville
    localStorage.setItem('searchCoordinates', JSON.stringify({ lat: city.lat, lng: city.lng })); // Stocke les coordonnées
    navigate('/destination'); // Redirection vers la page "Destinations"
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          alert(`Votre position actuelle : Latitude ${latitude}, Longitude ${longitude}`);
        },
        (error) => {
          console.error("Erreur lors de la récupération de la géolocalisation :", error);
          alert("Impossible de récupérer votre position. Veuillez vérifier vos paramètres de localisation.");
        }
      );
    } else {
      alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
    }
  };

  return (
    <div>
      <header className="text-center my-5">
        <h1>Bienvenue sur Trip n'Go</h1>
        <p>Découvrez des destinations incroyables et planifiez votre prochain voyage !</p>
      </header>

      <main className="container">
        {/* Barre de recherche */}
        <div className="row centered-row">
          <div className="col-md-6">
            <h2>Planifier un roadtrip</h2>
            <input type="text" id="search" className="form-control" placeholder="Entrez une ville..." />
            <button className="btn btn-primary mt-2" onClick={searchDestination}>Rechercher</button>
          </div>
        </div>

        {/* Bouton de géolocalisation */}
        <div className="row centered-row mt-4">
          <div className="col-md-6">
            <button className="btn btn-secondary" onClick={handleGeolocation}>
              Utiliser ma position actuelle
            </button>
            {userLocation && (
              <p className="mt-2">
                Votre position : Latitude {userLocation.lat}, Longitude {userLocation.lng}
              </p>
            )}
          </div>
        </div>

        {/* Cartes des villes */}
        <div className="cards-container mt-5">
          {cities.map((city, index) => (
            <div key={index} className={`card card-${index + 1}`}>
              <div className="card-content">
                <h3 className="card-title">{city.name}</h3>
                <button className="btn btn-primary" onClick={() => handleLearnMore(city)}>En savoir plus</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Accueil;

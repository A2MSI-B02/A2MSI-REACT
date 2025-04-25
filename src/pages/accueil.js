import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/accueil.css';
import 'leaflet/dist/leaflet.css';
import Footer from '../components/footer';

function Accueil() {
  const navigate = useNavigate();

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

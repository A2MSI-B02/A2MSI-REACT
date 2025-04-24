import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import du hook useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/accueil.css'; // Assurez-vous que le chemin est correct
import 'leaflet/dist/leaflet.css';
import Footer from '../components/footer'; // Import du composant Footer

function Accueil() {
  const navigate = useNavigate(); // Initialisation du hook useNavigate

  const cities = [
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'Bangkok', lat: 13.7563, lng: 100.5018 },
    { name: 'Hanoï', lat: 21.0285, lng: 105.8542 },
    { name: 'Le Pirée', lat: 37.9402, lng: 23.6465 },
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
        <div className="row centered-row">
          <div className="col-md-6">
            <h2>Planifier un roadtrip</h2>
            <input type="text" id="search" className="form-control" placeholder="Entrez une ville..." />
            <button className="btn btn-primary mt-2" onClick={searchDestination}>Rechercher</button>
          </div>
        </div>

        <div className="cards-container mt-5">
          {cities.map((city, index) => (
          {['New York', 'Bangkok', 'Hanoï', 'Porto', 'Barcelone'].map((destination, index) => (
            <div key={index} className={`card card-${index + 1}`}>
              <div className="card-content">
                <h3 className="card-title">{city.name}</h3>
                <button className="btn btn-primary" onClick={() => handleLearnMore(city)}>En savoir plus</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer /> {/* Utilisation du composant Footer */}
    </div>
  );
}

export default Accueil;

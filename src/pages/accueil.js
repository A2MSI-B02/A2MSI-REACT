// src/pages/Accueil.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/index.css'; // Assurez-vous que le chemin est correct
import 'leaflet/dist/leaflet.css';

function Accueil() {
  const searchDestination = () => {
    // Exemple de fonctionnalité de recherche
    const searchInput = document.getElementById('search').value;
    if (searchInput.trim() === '') {
      alert('Veuillez entrer une ville pour rechercher.');
    } else {
      alert(`Recherche en cours pour : ${searchInput}`);
    }
  };

  const handleLearnMore = (destination) => {
    alert(`En savoir plus sur : ${destination}`);
  };

  return (
    <div>
      <header className="text-center my-5">
        <h1>Bienvenue sur Trip n'Go</h1>
        <p>Découvrez des destinations incroyables et planifiez votre prochain voyage !</p>
      </header>

      <main className="container">
        <div className="row">
          <div className="col-md-6">
            <h2>Planifier un roadtrip</h2>
            <input type="text" id="search" className="form-control" placeholder="Entrez une ville..." />
            <button className="btn btn-primary mt-2" onClick={searchDestination}>Rechercher</button>
          </div>
        </div>

        <div className="cards-container mt-5">
          {['Destination 1', 'Destination 2', 'Destination 3', 'Destination 4', 'Destination 5'].map((destination, index) => (
            <div key={index} className={`card card-${index + 1}`}>
              <div className="card-content">
                <h3 className="card-title">{destination}</h3>
                <button className="btn btn-primary" onClick={() => handleLearnMore(destination)}>En savoir plus</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer mt-6">
        <h4>Trip n'Go</h4>
        <p>2025 Voyage Explorer - Tous droits réservés</p>
      </footer>
    </div>
  );
}

export default Accueil;

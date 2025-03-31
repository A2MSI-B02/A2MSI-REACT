import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import du hook useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/accueil.css'; // Assurez-vous que le chemin est correct
import 'leaflet/dist/leaflet.css';
import Footer from '../components/footer'; // Import du composant Footer

function Accueil() {
  const navigate = useNavigate(); // Initialisation du hook useNavigate
  const searchDestination = () => {
    const searchInput = document.getElementById('search').value;
    if (searchInput.trim() === '') {
      alert('Veuillez entrer une ville pour rechercher.');
    } else {
      navigate('/destinations'); // Redirection vers la page "Destinations"
    }
  };

  const handleLearnMore = (destination) => {
    navigate('/destinations'); // Redirection vers la page "Destinations"
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
          {['New York', 'Bangkok', 'Hanoï', 'Le Pirée', 'Barcelone'].map((destination, index) => (
            <div key={index} className={`card card-${index + 1}`}>
              <div className="card-content">
                <h3 className="card-title">{destination}</h3>
                <button className="btn btn-primary" onClick={() => handleLearnMore(destination)}>En savoir plus</button>
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
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar'; // Assurez-vous que le chemin est correct
import Accueil from './pages/accueil'; // Assurez-vous que le chemin est correct
import Destination from './pages/destination'; // Assurez-vous que le chemin est correct
import Connexion from './pages/connexion'; // Assurez-vous que le chemin est correct
import Contact from './pages/contact'; // Assurez-vous que le chemin est correct
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/destination" element={<Destination />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;

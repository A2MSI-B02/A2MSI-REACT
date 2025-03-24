// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Remplacez Switch par Routes
import Navbar from './components/navbar';
import Accueil from './pages/accueil';
import Destination from './pages/destination';
import Connexion from './pages/connexion';
import Contact from './pages/contact';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes> {/* Utilisez Routes ici */}
        <Route path="/" element={<Accueil />} exact /> {/* Utilisez element au lieu de component */}
        <Route path="/destination" element={<Destination />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;

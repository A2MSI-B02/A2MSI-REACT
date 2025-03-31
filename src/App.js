// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Remplacez Switch par Routes
import Navbar from './components/navbar';
import Accueil from './pages/accueil';
import Destination from './pages/destination';
import Connexion from './pages/connexion';
import Inscription from './pages/inscription';
import ServiceClient from './pages/serviceClient';
import UserDashboard from "./pages/userdashboard";
import ProDashboard from "./pages/prodashboard";
import AdminDashboard from "./pages/admindashboard";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes> {/* Utilisez Routes ici */}
        <Route path="/" element={<Accueil />} exact /> {/* Utilisez element au lieu de component */}
        <Route path="/destination" element={<Destination />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/service-client" element={<ServiceClient />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/prodashboard" element={<ProDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

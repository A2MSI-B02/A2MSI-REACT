// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Remplacez Switch par Routes
import Navbar from './components/navbar';
import Accueil from './pages/accueil';
import Destination from './pages/destination';
import Connexion from './pages/connexion';
import Inscription from './pages/inscription';
import ServiceClient from './pages/serviceClient';
import UserDashboard from "./pages/dashboard/userdashboard";
import ProDashboard from "./pages/dashboard/prodashboard";
import AdminDashboard from "./pages/dashboard/admindashboard";
import Favoris from './pages/sousmenu/favoris';
import UserSettings from './pages/sousmenu/UserSettings'; 
import ProSettings from './pages/sousmenu/ProSettings'; 
import ViewService from './pages/sousmenu/ViewService'; 
import AddService from './pages/sousmenu/AddService'; 
import TrainBooking from './pages/TrainBooking';
import HotelBooking from './pages/HotelBooking';
import ActivityBooking from './pages/ActivitéBooking';
import Payment from './pages/Paiement';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes> {/* Utilisez Routes ici */}
        
        <Route path="/" element={<Accueil />} exact /> 
        <Route path="/destination" element={<Destination />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/service-client" element={<ServiceClient />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/prodashboard" element={<ProDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/favoris" element={<Favoris/>} />
        <Route path="/usersettings" element={<UserSettings />} />
        <Route path="/prosettings" element={<ProSettings />} />
        <Route path="/ViewService" element={<ViewService />} />
        <Route path="/AddService" element={<AddService />} />
        <Route path="/train-booking" element={<TrainBooking />} />
        <Route path="/hotel-booking" element={<HotelBooking />} />
        <Route path="/activity-booking" element={<ActivityBooking />} />
        <Route path="/paiement" element={<Payment />} />
      </Routes>
    </Router>
  );
}

export default App;

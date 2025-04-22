import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig"; // Firebase config importée depuis votre fichier firebase.js
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database"; // Import Realtime Database

const MyNavbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(sessionStorage.getItem("userRole")); // Récupère le rôle depuis sessionStorage
  const [isLoading, setIsLoading] = useState(true); // État pour gérer le chargement
  const navigate = useNavigate();

  // Vérifie l'état de l'utilisateur au chargement
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // Récupérer le rôle de l'utilisateur depuis Realtime Database
        try {
          const db = getDatabase(); // Initialise la base de données
          const userRef = ref(db, `users/${user.uid}`); // Référence au chemin utilisateur
          const snapshot = await get(userRef); // Récupère les données utilisateur
          if (snapshot.exists()) {
            const role = snapshot.val().role; // Récupère le rôle depuis les données
            setUserRole(role); // Met à jour l'état avec le rôle
            sessionStorage.setItem("userRole", role); // Stocke le rôle dans sessionStorage
          } else {
            console.error("Le document utilisateur n'existe pas dans Realtime Database.");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du rôle :", error);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
        sessionStorage.removeItem("userRole"); // Supprime le rôle de sessionStorage
      }
      setIsLoading(false); // Fin du chargement
    });

    return unsubscribe; // Nettoyage du listener
  }, []);

  // Gestion de la déconnexion
  const handleLogout = async () => {
    await signOut(auth); // Déconnecte l'utilisateur avec Firebase
    setCurrentUser(null); // Réinitialise l'utilisateur
    setUserRole(null); // Réinitialise le rôle
    sessionStorage.removeItem("userRole"); // Supprime le rôle de sessionStorage
    navigate("/"); // Redirige vers l'accueil
  };

  if (isLoading) {
    // Affiche un indicateur de chargement pendant la récupération des données
    return <p>Chargement...</p>;
  }

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Mon Planificateur</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Accueil</Nav.Link>
            <Nav.Link as={Link} to="/destination">Destinations</Nav.Link>
            <Nav.Link as={Link} to="/service-client">Service Client</Nav.Link>

            {currentUser ? (
              <>
                {userRole === "Admin" && (
                  <Nav.Link as={Link} to="/admindashboard">Mon compte (Admin)</Nav.Link>
                )}
                {userRole === "Utilisateur" && (
                  <Nav.Link as={Link} to="/userdashboard">Mon compte</Nav.Link>
                )}
                {userRole === "Professionnel" && (
                  <Nav.Link as={Link} to="/prodashboard">Mon compte (Professionnel)</Nav.Link>
                )}
                <Nav.Link onClick={handleLogout}>Déconnexion</Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/Connexion">Connexion</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
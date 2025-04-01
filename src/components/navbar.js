import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig"; // Firebase config importée depuis ton fichier firebase.js
import { onAuthStateChanged, signOut } from "firebase/auth";

const MyNavbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // Ajoute le rôle de l'utilisateur si nécessaire
  const navigate = useNavigate();

  // Vérifie l'état de l'utilisateur au chargement
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Si tu veux gérer les rôles, récupère-les depuis ta base de données Firestore
        // Exemple : récupère le rôle de l'utilisateur
        // const role = await fetchUserRoleFromDatabase(user.uid);
        const role = "Utilisateur"; // Met "Utilisateur" par défaut pour cet exemple
        setUserRole(role);
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
    });

    return unsubscribe; // Nettoyage du listener
  }, []);

  // Gestion de la déconnexion
  const handleLogout = async () => {
    await signOut(auth); // Déconnecte l'utilisateur avec Firebase
    setCurrentUser(null); // Réinitialise l'utilisateur
    setUserRole(null); // Réinitialise le rôle
    navigate("/"); // Redirige vers l'accueil
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Mon Planificateur</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Accueil</Nav.Link>
            <Nav.Link as={Link} to="/destinations">Destinations</Nav.Link>
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
import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

const MyNavbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(sessionStorage.getItem("userRole"));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        try {
          const db = getDatabase();
          const userRef = ref(db, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const role = snapshot.val().role;
            setUserRole(role);
            sessionStorage.setItem("userRole", role);
          } else {
            console.error("Le document utilisateur n'existe pas dans Realtime Database.");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du rôle :", error);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
        sessionStorage.removeItem("userRole");
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserRole(null);
    sessionStorage.removeItem("userRole");
    navigate("/");
  };

  if (isLoading) {
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
                  <>
                    <Nav.Link as={Link} to="/itineraire">Itinéraire</Nav.Link>
                    <Nav.Link as={Link} to="/admindashboard">Mon compte (Admin)</Nav.Link>
                  </>
                )}
                {userRole === "Utilisateur" && (
                  <>
                    <Nav.Link as={Link} to="/itineraire">Itinéraire</Nav.Link>
                    <Nav.Link as={Link} to="/userdashboard">Mon compte</Nav.Link>
                  </>
                )}
                {userRole === "Professionnel" && (
                  <>
                    <Nav.Link as={Link} to="/itineraire">Itinéraire</Nav.Link>
                    <Nav.Link as={Link} to="/prodashboard">Mon compte (Professionnel)</Nav.Link>
                  </>
                )}
                <Button variant="outline-light" onClick={handleLogout} className="ms-2">
                  Déconnexion
                </Button>
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

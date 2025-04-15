import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig"; // Firebase doit être correctement configuré
import { Container, Button } from "react-bootstrap";

const UserDashboard = () => {
    const navigate = useNavigate();
    const userFirstName = sessionStorage.getItem("userFirstName");

    const handleLogout = () => {
        auth.signOut().then(() => {
            sessionStorage.clear();
            navigate("/connexion");
        });
    };

    // Fonctions pour rediriger vers différentes pages
    const goToGestionCompte = () => navigate("/gestionducompte"); // Correction du chemin
    const goToFavoris = () => navigate("/favoris");
    const goToVoyages = () => navigate("/voyages");

    return (
        <Container className="mt-5">

            {/* Message de bienvenue */}
            <h2>Bienvenue, {userFirstName} ! 😊</h2>

            {/* Boutons du tableau de bord utilisateur */}
            <Button variant="primary" className="m-2" onClick={goToGestionCompte}>
                Gestion du compte
            </Button>
            <Button variant="secondary" className="m-2" onClick={goToFavoris}>
                Favoris
            </Button>
            <Button variant="info" className="m-2" onClick={goToVoyages}>
                Voyages
            </Button>
            <Button variant="danger" className="m-2" onClick={handleLogout}>
                Déconnexion
            </Button>
        </Container>
    );
};

export default UserDashboard;

import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig"; // Firebase doit être correctement configuré
import { Container, Button } from "react-bootstrap";
import UserProfileIcon from "../../components/userprofileicon"; // Composant pour la photo de profil

const UserDashboard = () => {
    const navigate = useNavigate();
    const userFirstName = sessionStorage.getItem("userFirstName");

    const handleLogout = () => {
        auth.signOut().then(() => {
            sessionStorage.clear();
            navigate("/connexion");
        });
    };

    return (
        <Container className="mt-5">
            {/* Icône/photo de profil */}
            <UserProfileIcon />

            {/* Message de bienvenue */}
            <h2>Bienvenue, {userFirstName} ! 😊</h2>

            {/* Boutons du tableau de bord utilisateur */}
            <Button variant="primary" className="m-2">
                Gestion du compte
            </Button>
            <Button variant="secondary" className="m-2">
                Favoris
            </Button>
            <Button variant="info" className="m-2">
                Voyages
            </Button>
            <Button variant="danger" className="m-2" onClick={handleLogout}>
                Déconnexion
            </Button>
        </Container>
    );
};

export default UserDashboard;

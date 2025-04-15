import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig"; // Assurez-vous que Firebase est bien configuré
import { Container, Button } from "react-bootstrap";

const ProDashboard = () => {
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

            {/* Message de bienvenue */}
            <h2>Bienvenue, {userFirstName} ! 😊</h2>

            {/* Boutons du tableau de bord professionnel */}
            <Button variant="primary" className="m-2">
                Gestion du compte
            </Button>
            <Button variant="secondary" className="m-2">
                Mes services
            </Button>
            <Button variant="info" className="m-2">
                Ajouter un service
            </Button>
            <Button variant="danger" className="m-2" onClick={handleLogout}>
                Déconnexion
            </Button>
        </Container>
    );
};

export default ProDashboard;

import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig"; // S'assurer que Firebase est correctement configuré
import { Container, Button } from "react-bootstrap";
import Footer from "../../components/footer";
import UserProfileIcon from "../../components/userprofileicon"; // Nouveau composant pour l'icône

const AdminDashboard = () => {
    const navigate = useNavigate();
    const userFirstName = sessionStorage.getItem("userFirstName");

    const handleLogout = () => {
        auth.signOut().then(() => {
            sessionStorage.clear();
            navigate("/connexion");
        });
    };

    return (
        <div>
            <Container className="mt-5">
                {/* Ajout de l'icône de la photo de profil */}
                <UserProfileIcon />

                {/* Message de bienvenue */}
                <h2>Bienvenue, {userFirstName} ! 😊</h2>

                {/* Boutons */}
                <Button variant="primary" className="m-2">
                    Notifications
                </Button>
                <Button variant="secondary" className="m-2">
                    Gestion des Utilisateurs
                </Button>
                <Button variant="danger" className="m-2" onClick={handleLogout}>
                    Déconnexion
                </Button>
            </Container>

            <Footer /> {/* Utilisation du composant Footer */}
        </div>
    );
};

export default AdminDashboard;

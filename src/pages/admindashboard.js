import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { Container, Button } from "react-bootstrap";
import Footer from "../components/footer";

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
            <h2>Bienvenue, {userFirstName} ! 😊</h2>
            <Button variant="primary" className="m-2">Gestion du compte</Button>
            <Button variant="secondary" className="m-2">Notifications</Button>
            <Button variant="info" className="m-2">Gestion des utilisateurs</Button>
            <Button variant="danger" className="m-2" onClick={handleLogout}>Déconnexion</Button>
        </Container>
        
        <Footer /> {/* Utilisation du composant Footer */}
        </div>

    );
};

export default AdminDashboard;

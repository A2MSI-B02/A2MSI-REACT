import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { Container, Button } from "react-bootstrap";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut().then(() => {
            sessionStorage.clear();
            navigate("/connexion");
        });
    };

    return (
        <Container className="mt-5">
            <h2>Bienvenue, Administrateur !</h2>
            <Button variant="primary" className="m-2">Gestion du compte</Button>
            <Button variant="secondary" className="m-2">Notifications</Button>
            <Button variant="info" className="m-2">Gestion des utilisateurs</Button>
            <Button variant="danger" className="m-2" onClick={handleLogout}>Déconnexion</Button>
        </Container>
    );
};

export default AdminDashboard;

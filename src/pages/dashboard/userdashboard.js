import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig"; // Firebase doit être correctement configuré
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { FaUser, FaHeart, FaPlane, FaSignOutAlt } from "react-icons/fa";
import { signOut } from "firebase/auth"; // Importez signOut de firebase/auth
import Footer from '../../components/footer'; // Import du composant Footer

const UserDashboard = () => {
    const navigate = useNavigate();
    const userFirstName = sessionStorage.getItem("userFirstName");

    const handleLogout = async () => {
        console.log("Début de la déconnexion...");
        try {
            await signOut(auth); // Déconnecte l'utilisateur avec Firebase
            console.log("Déconnexion réussie.");
            sessionStorage.clear();
            navigate("/connexion");
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };

    // Fonctions pour rediriger vers différentes pages
    const goToGestionCompte = () => navigate("/UserSettings");
    const goToFavoris = () => navigate("/favoris");
    const goToVoyages = () => navigate("/voyages");

    return (
        <>
            <Container className="mt-5">
                <h2 className="text-center mb-4">Bienvenue ! 😊</h2>

                {/* Cartes pour les options */}
                <Row className="g-4 justify-content-center">
                    <Col md={3}>
                        <Card className="text-center shadow-sm" style={{ height: "180px" }}>
                            <Card.Body>
                                <FaUser size={35} className="mb-2 text-primary" />
                                <Card.Title style={{ fontSize: "1.1rem", color: "#0d6efd" }}>Gestion du compte</Card.Title>
                                <Card.Text style={{ fontSize: "0.9rem" }}>
                                    Modifiez vos informations personnelles et vos paramètres.
                                </Card.Text>
                                <Button
                                    onClick={goToGestionCompte}
                                    style={{
                                        backgroundColor: "#0d6efd",
                                        borderColor: "#0d6efd",
                                        color: "#fff",
                                        fontSize: "0.85rem",
                                        padding: "5px 10px",
                                        marginBottom: "100px", // Ajout d'un margin-bottom
                                    }}
                                >
                                    Accéder
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow-sm" style={{ height: "180px" }}>
                            <Card.Body>
                                <FaHeart size={35} className="mb-2 text-danger" />
                                <Card.Title style={{ fontSize: "1.1rem", color: "#0d6efd" }}>Favoris</Card.Title>
                                <Card.Text style={{ fontSize: "0.9rem" }}>
                                    Consultez vos lieux et destinations préférés.
                                </Card.Text>
                                <Button
                                    onClick={goToFavoris}
                                    style={{
                                        backgroundColor: "#0d6efd",
                                        borderColor: "#0d6efd",
                                        color: "#fff",
                                        fontSize: "0.85rem",
                                        padding: "5px 10px",
                                        marginBottom: "100px", // Ajout d'un margin-bottom
                                    }}
                                >
                                    Accéder
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <div className="text-center mt-5">
                    <Button
                        size="lg"
                        onClick={handleLogout}
                        style={{
                            backgroundColor: "#FF0000",
                            borderColor: "#FF0000",
                            color: "#fff",
                            cursor: "pointer", // Assurez-vous que le curseur change pour indiquer l'interactivité
                        }}
                    >
                        <FaSignOutAlt className="me-2" />
                        Déconnexion
                    </Button>
                </div>
            </Container>

            <Footer /> {/* Ajout du composant Footer en dehors du Container */}
        </>
    );
};

export default UserDashboard;

import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig"; // Firebase doit être correctement configuré
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { FaUser, FaHeart, FaPlane, FaSignOutAlt } from "react-icons/fa";

const UserDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut().then(() => {
            sessionStorage.clear();
            navigate("/connexion");
        });
    };

    // Fonction pour rediriger vers UserSettings
    const goToGestionCompte = () => navigate("/usersettings");
    const goToFavoris = () => navigate("/favoris");
    const goToVoyages = () => navigate("/voyages");

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Bienvenue ! 😊</h2>

            {/* Cartes pour les options */}
            <Row className="g-4 justify-content-center">
                <Col md={3}>
                    <Card className="text-center shadow-sm" style={{ height: "200px", width: "100%" }}>
                        <Card.Body>
                            <FaUser size={35} className="mb-2 text-primary" />
                            <Card.Title style={{ fontSize: "1.1rem" }}>Gestion du compte</Card.Title>
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
                                    marginTop: "10px",
                                }}
                            >
                                Accéder
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center shadow-sm" style={{ height: "200px", width: "100%" }}>
                        <Card.Body>
                            <FaHeart size={35} className="mb-2 text-danger" />
                            <Card.Title style={{ fontSize: "1.1rem" }}>Favoris</Card.Title>
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
                                    marginTop: "10px",
                                }}
                            >
                                Accéder
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center shadow-sm" style={{ height: "200px", width: "100%" }}>
                        <Card.Body>
                            <FaPlane size={35} className="mb-2 text-info" />
                            <Card.Title style={{ fontSize: "1.1rem" }}>Voyages</Card.Title>
                            <Card.Text style={{ fontSize: "0.9rem" }}>
                                Planifiez et gérez vos voyages à venir.
                            </Card.Text>
                            <Button
                                onClick={goToVoyages}
                                style={{
                                    backgroundColor: "#0d6efd",
                                    borderColor: "#0d6efd",
                                    color: "#fff",
                                    fontSize: "0.85rem",
                                    padding: "5px 10px",
                                    marginTop: "10px",
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
                        backgroundColor: "#0d6efd",
                        borderColor: "#0d6efd",
                        color: "#fff",
                    }}
                >
                    <FaSignOutAlt className="me-2" />
                    Déconnexion
                </Button>
            </div>
        </Container>
    );
};

export default UserDashboard;

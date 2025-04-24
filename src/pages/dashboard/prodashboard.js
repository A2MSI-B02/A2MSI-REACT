import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig"; // Assurez-vous que Firebase est bien configuré
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { FaUser, FaBriefcase, FaPlusCircle, FaSignOutAlt } from "react-icons/fa";

const ProDashboard = () => {
    const navigate = useNavigate();
    const userFirstName = sessionStorage.getItem("userFirstName");

    const handleLogout = () => {
        auth.signOut().then(() => {
            sessionStorage.clear();
            navigate("/connexion");
        }).catch((error) => {
            console.error("Erreur lors de la déconnexion :", error);
        });
    };

    // Fonctions pour rediriger vers différentes pages
    const goToGestionCompte = () => navigate("/ProSettings");
    const goToMesServices = () => navigate("/mes-services");
    const goToAjouterService = () => navigate("/ajouter-service");

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Bienvenue, {userFirstName} ! 😊</h2>

            {/* Cartes pour les options */}
            <Row className="g-4 justify-content-center">
                <Col md={3}>
                    <Card className="text-center shadow-sm" style={{ height: "180px" }}>
                        <Card.Body>
                            <FaUser size={35} className="mb-2 text-primary" />
                            <Card.Title style={{ fontSize: "1.1rem" }}>Gestion du compte</Card.Title>
                            <Card.Text style={{ fontSize: "0.9rem" }}>
                                Modifiez vos informations professionnelles et vos paramètres.
                            </Card.Text>
                            <Button
                                onClick={goToGestionCompte}
                                style={{
                                    backgroundColor: "#0d6efd",
                                    borderColor: "#0d6efd",
                                    color: "#fff",
                                    fontSize: "0.85rem",
                                    padding: "5px 10px",
                                    marginBottom: "100px",
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
                            <FaBriefcase size={35} className="mb-2 text-secondary" />
                            <Card.Title style={{ fontSize: "1.1rem" }}>Mes services</Card.Title>
                            <Card.Text style={{ fontSize: "0.9rem" }}>
                                Consultez vos services actuels.
                            </Card.Text>
                            <Button
                                onClick={goToMesServices}
                                style={{
                                    backgroundColor: "#0d6efd",
                                    borderColor: "#0d6efd",
                                    color: "#fff",
                                    fontSize: "0.85rem",
                                    padding: "5px 10px",
                                    marginBottom: "100px",
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
                            <FaPlusCircle size={35} className="mb-2 text-info" />
                            <Card.Title style={{ fontSize: "1.1rem" }}>Ajouter un service</Card.Title>
                            <Card.Text style={{ fontSize: "0.9rem" }}>
                                Ajoutez un nouveau service à votre offre.
                            </Card.Text>
                            <Button
                                onClick={goToAjouterService}
                                style={{
                                    backgroundColor: "#0d6efd",
                                    borderColor: "#0d6efd",
                                    color: "#fff",
                                    fontSize: "0.85rem",
                                    padding: "5px 10px",
                                    marginBottom: "100px",
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

export default ProDashboard;

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { auth, db } from "../../firebaseConfig";
import { updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import '../../styles/UserSettings.css'; // Assurez-vous de créer ce fichier CSS

const UserSettings = () => {
    const [user, setUser] = useState(null);
    const [password, setPassword] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (!authUser) {
                navigate("/connexion");
            } else {
                setUser({ uid: authUser.uid });
                fetchUserData(authUser.uid);
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchUserData = async (userId) => {
        try {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setDescription(data.description || "");
            }
        } catch (error) {
            console.error("Erreur lors du chargement des données utilisateur :", error.message);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (!password) return alert("Veuillez entrer un mot de passe.");
        try {
            await updatePassword(auth.currentUser, password);
            alert("Mot de passe mis à jour avec succès !");
            setPassword("");
        } catch (error) {
            console.error("Erreur :", error.message);
            alert("Impossible de changer le mot de passe.");
        }
    };

    const handleDescriptionUpdate = async () => {
        try {
            const userId = auth.currentUser.uid;
            await updateDoc(doc(db, "users", userId), { description });
            alert("Description mise à jour avec succès !");
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la description :", error.message);
            alert("Impossible de mettre à jour la description.");
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4 text-white">Paramètres de l'utilisateur</h2>

            {!user && (
                <p className="text-center text-light">Chargement des données utilisateur...</p>
            )}

            {user && (
                <Row className="d-flex justify-content-center">
                    <Col md="auto">
                        <Card className="custom-card shadow-sm mx-2">
                            <Card.Body>
                                <h4 className="mb-4">Changer le mot de passe</h4>
                                <Form onSubmit={handlePasswordUpdate}>
                                    <Form.Group className="mb-3" controlId="formPassword">
                                        <Form.Label>Nouveau mot de passe</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Entrez un nouveau mot de passe"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button type="submit" variant="light">
                                        Mettre à jour
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md="auto">
                        <Card className="custom-card shadow-sm mx-2">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div>
                                    <h4 className="mb-4">Description</h4>
                                    <Form.Group>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            placeholder="Ajoutez une description..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </Form.Group>
                                </div>
                                <Button onClick={handleDescriptionUpdate} variant="light" className="mt-3">
                                    Mettre à jour
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default UserSettings;

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { auth, db, storage } from "../../firebaseConfig";
import { updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const UserSettings = () => {
    const [user, setUser] = useState(null);
    const [password, setPassword] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.currentUser) {
            navigate("/connexion"); // Redirige vers la page de connexion
        }
    }, [navigate]); // Ajout de 'navigate' dans le tableau des dépendances

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = auth.currentUser.uid;
                const docRef = doc(db, "users", userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUser(data);
                    setProfilePicUrl(data.profilePicUrl || "");
                    setDescription(data.description || "");
                }
            } catch (error) {
                console.error("Erreur lors du chargement des données utilisateur :", error.message);
            }
        };

        fetchUserData();
    }, []);

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

    const handleProfilePicUpdate = async () => {
        if (!profilePic) return alert("Veuillez sélectionner une photo de profil.");
        try {
            const userId = auth.currentUser.uid;
            const storageRef = ref(storage, `profilePictures/${userId}`);
            await uploadBytes(storageRef, profilePic);
            const downloadUrl = await getDownloadURL(storageRef);

            await updateDoc(doc(db, "users", userId), { profilePicUrl: downloadUrl });
            setProfilePicUrl(downloadUrl);
            alert("Photo de profil mise à jour avec succès !");
        } catch (error) {
            console.error("Erreur :", error.message);
            alert("Impossible de mettre à jour la photo de profil.");
        }
    };

    const handleDescriptionUpdate = async () => {
        try {
            const userId = auth.currentUser.uid;
            const userDocRef = doc(db, "users", userId);
            await updateDoc(userDocRef, { description });

            alert("Description mise à jour avec succès !");
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la description :", error.message);
            alert("Impossible de mettre à jour la description.");
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Paramètres de l'utilisateur</h2>

            {user && (
                <Row className="d-flex justify-content-center">
                    {/* Carte : Informations personnelles */}
                    <Col md="auto">
                        <Card
                            className="shadow-sm mx-2"
                            style={{
                                backgroundColor: "#0d6efd",
                                color: "#fff",
                                width: "300px",
                                height: "400px",
                                padding: "20px",
                            }}
                        >
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

                    {/* Carte : Photo de profil */}
                    <Col md="auto">
                        <Card
                            className="shadow-sm mx-2"
                            style={{
                                backgroundColor: "#0d6efd",
                                color: "#fff",
                                width: "300px",
                                height: "400px",
                                padding: "20px",
                            }}
                        >
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div>
                                    <h4 className="mb-4">Photo de profil</h4>
                                    {profilePicUrl && (
                                        <img
                                            src={profilePicUrl}
                                            alt="Profile"
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    )}
                                    <Form.Group className="mt-3">
                                        <Form.Control
                                            type="file"
                                            onChange={(e) => setProfilePic(e.target.files[0])}
                                        />
                                    </Form.Group>
                                </div>
                                <Button onClick={handleProfilePicUpdate} variant="light" className="mt-3">
                                    Mettre à jour
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Carte : Description */}
                    <Col md="auto">
                        <Card
                            className="shadow-sm mx-2"
                            style={{
                                backgroundColor: "#0d6efd",
                                color: "#fff",
                                width: "300px",
                                height: "400px",
                                padding: "20px",
                            }}
                        >
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
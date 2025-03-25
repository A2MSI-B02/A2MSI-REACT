import React, { useState } from "react";
import { auth, database } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";

const Connexion = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Réinitialise les erreurs

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            // Récupérer les infos de l'utilisateur depuis la base de données Firebase
            const snapshot = await get(ref(database, `users/${userId}`));
            if (snapshot.exists()) {
                const userData = snapshot.val();
                sessionStorage.setItem("userId", userId);
                sessionStorage.setItem("userRole", userData.role);

                alert(`Connexion réussie ! Rôle : ${userData.role}`);

                if (userData.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/dashboard");
                }
            } else {
                setError("Aucune donnée utilisateur trouvée.");
            }
        } catch (error) {
            setError("Erreur de connexion : " + error.message);
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center">Connexion</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Entrez votre email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Entrez votre mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Se connecter
                </Button>
            </Form>

            <div className="text-center mt-3">
                <p>Pas encore membre ? <a href="/signup">S'inscrire</a></p>
            </div>
        </Container>
    );
};

export default Connexion;

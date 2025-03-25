import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../firebaseConfig"; // Import Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import { Container, Form, Button } from "react-bootstrap";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Connexion Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            // Récupération du rôle depuis la base de données
            const userRef = ref(database, "users/" + userId);
            const snapshot = await get(userRef);
            const userData = snapshot.val();

            if (userData) {
                sessionStorage.setItem("userRole", userData.role);

                // Redirection selon le rôle
                if (userData.role === "Utilisateur") {
                    navigate("/userdashboard");
                } else if (userData.role === "Professionnel") {
                    navigate("/prodashboard");
                } else if (userData.role === "Administrateur") {
                    navigate("/admindashboard");
                }
            }
        } catch (error) {
            setError("Email ou mot de passe incorrect.");
        }
    };

    return (
        <Container className="mt-5">
            <h2>Connexion</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">Se connecter</Button>
            </Form>
        </Container>
    );
};

export default Login;

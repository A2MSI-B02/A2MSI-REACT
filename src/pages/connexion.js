import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../firebaseConfig"; // Import Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import { Container, Form, Button } from "react-bootstrap";
import Footer from "../components/footer";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            const userRef = ref(database, "users/" + userId);
            const snapshot = await get(userRef);
            const userData = snapshot.val();

            if (userData) {
                sessionStorage.setItem("userFirstName", userData.firstName);
                sessionStorage.setItem("userRole", userData.role);

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
        <div>
        <Container className="mt-5">
            <h2 className="text-center">Connexion</h2>
            {error && <p className="text-center text-danger">{error}</p>}
            <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "400px" }}>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3 w-100">Se connecter</Button>
            </Form>
            <div className="text-center mt-3">
                <p className="mb-0">Pas encore membre ? <a href="/inscription">S'inscrire</a></p>
            </div>
        </Container>
        <Footer /> {/* Utilisation du composant Footer */}
        </div>
    );
};

export default Login;

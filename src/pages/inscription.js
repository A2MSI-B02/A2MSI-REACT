import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database, createUserWithEmailAndPassword, ref, set } from "../firebaseConfig";
import { Container, Form, Button, Alert } from "react-bootstrap";

const Inscription = () => {
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Utilisateur"); // Valeur par défaut
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        if (!nom || !prenom || !email || !role || !password || !confirmPassword) {
            setError("Tous les champs doivent être remplis !");
            return;
        }

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas !");
            return;
        }

        try {
            // Créer l'utilisateur avec Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            // Sauvegarder les infos de l'utilisateur dans Firebase Database
            await set(ref(database, `users/${userId}`), {
                nom,
                prenom,
                email,
                role,
            });

            alert("Compte créé avec succès !");
            navigate("/connexion"); // Rediriger vers la page de connexion
        } catch (error) {
            setError("Erreur lors de l'inscription : " + error.message);
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center">Inscription</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSignup}>
                <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Choisir un rôle</Form.Label>
                    <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="Utilisateur">Utilisateur</option>
                        <option value="Professionnel">Professionnel</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Confirmer le mot de passe</Form.Label>
                    <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    S'inscrire
                </Button>
            </Form>

            <div className="text-center mt-3">
                <p>Déjà inscrit ? <a href="/login">Se connecter</a></p>
            </div>
        </Container>
    );
};

export default Inscription;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../firebaseConfig"; // Import Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { Container, Form, Button } from "react-bootstrap";

const Inscription = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "Utilisateur", // Valeur par défaut
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Gestion des changements des inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Vérification des champs
        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            // Création du compte Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const userId = userCredential.user.uid;

            // Sauvegarde des infos dans Firebase Database
            await set(ref(database, "users/" + userId), {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                role: formData.role,
            });

            // Redirection selon le rôle
            sessionStorage.setItem("userRole", formData.role);
            if (formData.role === "Utilisateur") {
                navigate("/userdashboard");
            } else if (formData.role === "Professionnel") {
                navigate("/prodashboard");
            } else if (formData.role === "Administrateur") {
                navigate("/admindashboard");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center">Inscription</h2>
            {error && <p className="text-center text-danger">{error}</p>}
            <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "400px" }}>
                <Form.Group>
                    <Form.Label>Nom</Form.Label>
                    <Form.Control type="text" name="lastName" required onChange={handleChange} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control type="text" name="firstName" required onChange={handleChange} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" required onChange={handleChange} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Choisir un rôle</Form.Label>
                    <Form.Select name="role" onChange={handleChange}>
                        <option value="Utilisateur">Utilisateur</option>
                        <option value="Professionnel">Professionnel</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control type="password" name="password" required onChange={handleChange} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Confirmer le mot de passe</Form.Label>
                    <Form.Control type="password" name="confirmPassword" required onChange={handleChange} />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3 w-100">S'inscrire</Button>
            </Form>
            <div className="text-center mt-3">
                <p className="mb-0">Déjà membre ? <a href="/connexion">Se connecter</a></p>
            </div>
        </Container>
    );
};

export default Inscription;

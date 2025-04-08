import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set as dbSet } from "firebase/database";
import { Container, Form, Button, Alert } from "react-bootstrap"; // Bootstrap pour la cohérence

const Inscription = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("user");
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Réinitialise les erreurs

        try {
            // Création de l'utilisateur dans Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Upload de l'image de profil (si choisie)
            let photoURL = "";
            if (profileImage) {
                const imageRef = ref(storage, `profilePictures/${user.uid}`);
                await uploadBytes(imageRef, profileImage);
                photoURL = await getDownloadURL(imageRef); // Récupère l'URL de l'image
            }

            // Mise à jour du profil utilisateur
            await updateProfile(user, {
                displayName: `${firstName} ${lastName}`,
                photoURL,
            });

            // Sauvegarde des informations utilisateur dans Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email,
                displayName: `${firstName} ${lastName}`,
                photoURL: photoURL || null,
                role,
            });

            // Enregistrement dans Realtime Database
            const realtimeDb = getDatabase(); // Récupère une instance de Realtime Database
            await dbSet(dbRef(realtimeDb, `users/${user.uid}`), {
                uid: user.uid,
                email,
                displayName: `${firstName} ${lastName}`,
                photoURL: photoURL || null,
                role,
            });

            // Redirection selon le rôle
            sessionStorage.setItem("userRole", role);
            if (role === "user") {
                navigate("/userdashboard");
            } else if (role === "pro") {
                navigate("/prodashboard");
            } else if (role === "admin") {
                navigate("/admindashboard");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center mt-4">
            <h2 className="mb-4">Créer un compte</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form style={{ maxWidth: "500px", width: "100%" }} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder="Entrez votre prénom"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="lastName">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder="Entrez votre nom"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Entrez votre adresse email"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Créez un mot de passe"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="role">
                    <Form.Label>Type de compte</Form.Label>
                    <Form.Select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="user">Utilisateur</option>
                        <option value="pro">Professionnel</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4" controlId="profileImage">
                    <Form.Label>Photo de profil (facultatif)</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfileImage(e.target.files[0])}
                    />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                    S'inscrire
                </Button>
            </Form>
            <div className="text-center mt-3">
                <p className="mb-0">Déjà membre ? <a href="/connexion">Se connecter</a></p>
            </div>
        </Container>
    );
};

export default Inscription;

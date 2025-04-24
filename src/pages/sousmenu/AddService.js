import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Form } from "react-bootstrap";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Footer from '../../components/footer';

const AddService = () => {
    const navigate = useNavigate();
    const [serviceName, setServiceName] = useState("");
    const [serviceDescription, setServiceDescription] = useState("");

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "services"), {
                name: serviceName,
                description: serviceDescription
            });
            console.log("Service ajouté avec succès.");
            setServiceName("");
            setServiceDescription("");
            navigate("/ProDashboard"); // Rediriger vers le tableau de bord après l'ajout
        } catch (error) {
            console.error("Erreur lors de l'ajout du service :", error);
        }
    };

    return (
        <>
            <Container className="mt-5">
                <h2 className="text-center mb-4">Ajouter un Nouveau Service</h2>
                <Form onSubmit={handleAddService}>
                    <Form.Group controlId="serviceName">
                        <Form.Label>Nom du service</Form.Label>
                        <Form.Control
                            type="text"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="serviceDescription">
                        <Form.Label>Description du service</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={serviceDescription}
                            onChange={(e) => setServiceDescription(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" className="mt-3">
                        Ajouter le Service
                    </Button>
                </Form>
            </Container>
            <Footer />
        </>
    );
};

export default AddService;

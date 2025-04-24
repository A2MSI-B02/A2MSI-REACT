import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, ListGroup } from "react-bootstrap";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Footer from '../../components/footer';

const ViewServices = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);

    const fetchServices = async () => {
        const querySnapshot = await getDocs(collection(db, "Services"));
        const servicesData = [];
        querySnapshot.forEach((doc) => {
            servicesData.push({ id: doc.id, ...doc.data() });
        });
        setServices(servicesData);
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <>
            <Container className="mt-5">
                <h2 className="text-center mb-4">Mes Services</h2>
                <ListGroup>
                    {services.map((service) => (
                        <ListGroup.Item key={service.id}>
                            <h5>{service.name}</h5>
                            <p>{service.description}</p>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <div className="text-center mt-5">
                    <Button
                        onClick={() => navigate("/AddService")}
                        style={{
                            backgroundColor: "#0d6efd",
                            borderColor: "#0d6efd",
                            color: "#fff",
                            cursor: "pointer",
                            marginTop: "20px",
                        }}
                    >
                        Ajouter un Nouveau Service
                    </Button>
                </div>
            </Container>
            <Footer />
        </>
    );
};

export default ViewServices;

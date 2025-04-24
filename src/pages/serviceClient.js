import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser'; // Import EmailJS
import Footer from '../components/footer'; // Import du composant Footer
import '../styles/ServiceClient.css'; // Assurez-vous que le chemin est correct

function ServiceClient() {
  const formRef = useRef(); // Référence au formulaire
  const [isSending, setIsSending] = useState(false); // État pour le bouton d'envoi

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true); // Indique que l'envoi est en cours

    const serviceID = 'service_m80kkp9'; // Service par défaut d'EmailJS
    const templateIDToClient = 'template_4lxgkkc'; // Template ID pour le client
    const templateIDToCompany = 'template_051llh7'; // Template ID pour l'entreprise
    const userID = 'tq688XGb9SWjM7D8V'; // Remplacez par votre User ID

    // Paramètres pour l'email au client
    const templateParamsToClient = {
      email: formRef.current.email.value, // Adresse email du client
      name: formRef.current.name.value, // Nom du client
    };

    // Paramètres pour l'email à l'entreprise
    const templateParamsToCompany = {
      to_email: 'a2msi.b02@gmail.com', // Adresse email de l'entreprise
      name: formRef.current.name.value, // Nom du client
      email: formRef.current.email.value, // Email du client
      subject: formRef.current.subject.value, // Sujet
      message: formRef.current.message.value, // Message
    };

    // Vérification des paramètres
    console.log('Paramètres pour le client :', templateParamsToClient);
    console.log('Paramètres pour l\'entreprise :', templateParamsToCompany);

    // Validation de l'email
    if (!formRef.current.email.value) {
      alert('Veuillez entrer une adresse email valide.');
      setIsSending(false);
      return;
    }

    // Envoi de l'email à l'entreprise
    emailjs
      .send(serviceID, templateIDToCompany, templateParamsToCompany, userID)
      .then(() => {
        console.log('Email envoyé à l\'entreprise avec succès.');
        // Envoi de l'email au client
        return emailjs.send(serviceID, templateIDToClient, templateParamsToClient, userID);
      })
      .then(() => {
        console.log('Email envoyé au client avec succès.');
        alert(`Merci ${formRef.current.name.value}, votre message a été envoyé avec succès. Vous recevrez une confirmation par email.`);
        formRef.current.reset(); // Réinitialise le formulaire
      })
      .catch((err) => {
        console.error('Erreur lors de l\'envoi de l\'email :', err);
        alert('Une erreur est survenue lors de l\'envoi de votre message.');
      })
      .finally(() => {
        setIsSending(false); // Réinitialise l'état du bouton
      });
  };

  return (
    <div className="content">
      <div className="container mt-5">
        <h1 className="text-center mb-4">Service Client</h1>
        <p className="text-center">
          Vous avez une question ou besoin d'aide ? Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais.
        </p>
        <form ref={formRef} onSubmit={handleSubmit} className="mt-4" id="form">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nom</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              placeholder="Entrez votre nom"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Entrez votre email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="subject" className="form-label">Sujet</label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="form-control"
              placeholder="Entrez le sujet de votre message"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea
              id="message"
              name="message"
              className="form-control"
              rows="5"
              placeholder="Entrez votre message"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            id="button"
            className="btn btn-primary w-100"
            disabled={isSending}
          >
            {isSending ? 'Envoi en cours...' : 'Envoyer'}
          </button>
        </form>
      </div>
      <Footer /> {/* Utilisation du composant Footer */}
    </div>
  );
}

export default ServiceClient;

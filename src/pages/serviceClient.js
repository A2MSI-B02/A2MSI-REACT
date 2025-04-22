import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser'; // Import EmailJS

function ServiceClient() {
  const formRef = useRef(); // Référence au formulaire
  const [isSending, setIsSending] = useState(false); // État pour le bouton d'envoi

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true); // Indique que l'envoi est en cours

    const serviceID = 'service_m80kkp9'; // Service par défaut d'EmailJS
    const templateID = 'template_4lxgkkc'; // Remplacez par votre Template ID

    emailjs
      .sendForm(serviceID, templateID, formRef.current, 'tq688XGb9SWjM7D8V') // Remplacez par votre User ID
      .then(() => {
        alert('Merci, votre message a été envoyé avec succès !');
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
  );
}

export default ServiceClient;
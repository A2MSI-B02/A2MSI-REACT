import React, { useState } from 'react';

function ServiceClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Merci ${formData.name}, votre message a été envoyé avec succès !`);
    // Vous pouvez ajouter ici une logique pour envoyer les données à un serveur
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Service Client</h1>
      <p className="text-center">
        Vous avez une question ou besoin d'aide ? Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais.
      </p>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nom</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            placeholder="Entrez votre nom"
            value={formData.name}
            onChange={handleChange}
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
            value={formData.email}
            onChange={handleChange}
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
            value={formData.subject}
            onChange={handleChange}
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
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary w-100">Envoyer</button>
      </form>
    </div>
  );
}

export default ServiceClient;
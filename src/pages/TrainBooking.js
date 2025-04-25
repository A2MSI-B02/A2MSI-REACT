// filepath: src/components/TrainBooking.js
import React, { useState } from "react";
import { db } from "../../src/firebaseConfig";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

const TrainBooking = () => {
  const [formData, setFormData] = useState({
    departure: "",
    destination: "",
    date: "",
    time: "",
    seats: 1,
    trainId: "",
    availableSeats: 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ajouter la réservation
      const reservationRef = await addDoc(collection(db, "trainReservations"), formData);

      // Mettre à jour les places disponibles
      const trainRef = doc(db, "trains", formData.trainId); // Ajoutez un champ trainId dans le formulaire
      await updateDoc(trainRef, {
        availableSeats: formData.availableSeats - formData.seats,
      });

      alert("Réservation réussie !");
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="departure" placeholder="Départ" onChange={handleChange} />
      <input name="destination" placeholder="Destination" onChange={handleChange} />
      <input type="date" name="date" onChange={handleChange} />
      <input type="time" name="time" onChange={handleChange} />
      <input type="number" name="seats" placeholder="Nombre de places" onChange={handleChange} />
      <input name="trainId" placeholder="ID du train" onChange={handleChange} />
      <input type="number" name="availableSeats" placeholder="Places disponibles" onChange={handleChange} />
      <button type="submit">Réserver</button>
    </form>
  );
};

export default TrainBooking;
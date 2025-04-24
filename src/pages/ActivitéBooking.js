import React, { useState } from "react";
import { db } from "../../src/firebaseConfig";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

const ActivityBooking = () => {
  const [formData, setFormData] = useState({
    activityId: "",
    date: "",
    participants: 1,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ajouter la réservation
      await addDoc(collection(db, "activityReservations"), formData);

      // Mettre à jour les places disponibles
      const activityRef = doc(db, "activities", formData.activityId);
      await updateDoc(activityRef, {
        availableSpots: formData.availableSpots - formData.participants,
      });

      alert("Réservation réussie !");
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="activityId" placeholder="ID de l'activité" onChange={handleChange} />
      <input type="date" name="date" onChange={handleChange} />
      <input type="number" name="participants" placeholder="Nombre de participants" onChange={handleChange} />
      <button type="submit">Réserver</button>
    </form>
  );
};

export default ActivityBooking;
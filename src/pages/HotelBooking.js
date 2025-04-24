// filepath: src/components/HotelBooking.js
import React, { useState } from "react";
import { db } from "../../src/firebaseConfig";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

const HotelBooking = () => {
  const [formData, setFormData] = useState({
    hotelId: "",
    checkInDate: "",
    checkOutDate: "",
    rooms: 1,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ajouter la réservation
      await addDoc(collection(db, "hotelReservations"), formData);

      // Mettre à jour les chambres disponibles
      const hotelRef = doc(db, "hotels", formData.hotelId);
      await updateDoc(hotelRef, {
        availableRooms: formData.availableRooms - formData.rooms,
      });

      alert("Réservation réussie !");
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="hotelId" placeholder="ID de l'hôtel" onChange={handleChange} />
      <input type="date" name="checkInDate" onChange={handleChange} />
      <input type="date" name="checkOutDate" onChange={handleChange} />
      <input type="number" name="rooms" placeholder="Nombre de chambres" onChange={handleChange} />
      <button type="submit">Réserver</button>
    </form>
  );
};

export default HotelBooking;
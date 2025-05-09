import React, { useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import Footer from "../../components/footer";
import { getAuth } from "firebase/auth";

// Helpers
const emptyHours = {
  monday: "",
  tuesday: "",
  wednesday: "",
  thursday: "",
  friday: "",
  saturday: "",
  sunday: "",
};

/**
 * Géocode une adresse avec l’API Google Maps
 * @param {string} address
 * @returns {Promise<{lat: number, lng: number}>}
 */
function geocodeAddress(address) {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      reject(new Error("La librairie Google Maps n'est pas chargée."));
      return;
    }
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const loc = results[0].geometry.location;
        resolve({ lat: loc.lat(), lng: loc.lng() });
      } else {
        reject(new Error("Adresse non trouvée (" + status + "). Veuillez vérifier l'adresse saisie."));
      }
    });
  });
}

// Composant principal
export default function AddService() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [hours, setHours] = useState({ ...emptyHours });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const handleInput = (e) =>
    setHours({ ...hours, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    if (!user) {
      alert("Vous devez être connecté.");
      setLoading(false);
      return;
    }
    try {
      // Géocode l'adresse avant d'ajouter
      const { lat, lng } = await geocodeAddress(address);

      await addDoc(collection(db, "activities"), {
        name,
        nameLowercase: name.toLowerCase(), // utile pour la recherche full-text
        address,
        website,
        phone,
        hours,
        ownerUid: user.uid,
        lat,
        lng
      });
      setSuccess(true);
      setName("");
      setAddress("");
      setWebsite("");
      setPhone("");
      setHours({ ...emptyHours });
    } catch (err) {
      alert("Erreur lors de l’ajout : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>
        Ajouter une activité professionnelle
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          background: "#f9f9fa",
          padding: "20px",
          borderRadius: "20px",
          boxShadow: "0 2px 8px #0001",
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: 10, color: "#000" }}>
            Nom*<br />
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "5px",
                outline: "none",
                padding: "10px",
                color: "#000",
              }}
            />
          </label>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 10, color: "#000" }}>
            Adresse*<br />
            <input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "5px",
                outline: "none",
                padding: "10px",
                color: "#000",
              }}
            />
          </label>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 10, color: "#000" }}>
            Site web<br />
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "5px",
                outline: "none",
                padding: "10px",
                color: "#000",
              }}
            />
          </label>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 10, color: "#000" }}>
            Téléphone*<br />
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "5px",
                outline: "none",
                padding: "10px",
                color: "#000",
              }}
            />
          </label>
        </div>
        <fieldset
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#fff",
          }}
        >
          <legend style={{ fontWeight: "bold", marginBottom: 10, color: "#000" }}>
            Horaires d’ouverture
          </legend>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {Object.keys(hours).map((day, index) => (
              <div
                key={day}
                style={{
                  flex: "1 1 calc(50% - 10px)",
                  maxWidth: index >= 4 ? "calc(33.33% - 10px)" : "calc(50% - 10px)",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "10px",
                  background: "#f9f9fa",
                  color: "#000",
                }}
              >
                <label>
                  {day.charAt(0).toUpperCase() + day.slice(1)}<br />
                  <input
                    name={day}
                    value={hours[day]}
                    placeholder="Exemple: 08:00 - 18:00 ou Fermé"
                    onChange={handleInput}
                    style={{
                      width: "90%",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      outline: "none",
                      padding: "5px",
                      textAlign: "center",
                      color: "#000",
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        </fieldset>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: "#2566F1",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Ajout en cours..." : "Ajouter l'activité"}
        </button>
        {success && (
          <div style={{ color: "green", marginTop: 10 }}>
            ✔️ Activité ajoutée avec succès !
          </div>
        )}
      </form>
      <Footer />
    </div>
  );
}

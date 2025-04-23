import React, { useEffect, useState } from "react";
const FAV_STORAGE_KEY = "a2msi_favs";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const favs = localStorage.getItem(FAV_STORAGE_KEY);
    setFavorites(favs ? JSON.parse(favs) : []);
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20, color: "#000" }}>
      <h2 style={{ color: "#f9f9fa" }}>Mes favoris</h2>
      {favorites.length ? (
        <ul style={{ listStyle: "none", padding: 0, fontSize: 18, color: "#000" }}>
          {favorites.map(place => (
            <li
              key={place.place_id}
              style={{
                margin: "12px 0",
                background: "#f9f9fa",
                borderRadius: 12,
                padding: "13px 16px",
                color: "#000"
              }}
            >
              <b style={{ color: "#000" }}>{place.name}</b>
              <div style={{ color: "#000" }}>{place.vicinity || place.formatted_address}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#000", fontStyle: "italic" }}>
          Aucun favori enregistré.
        </p>
      )}
    </div>
  );
}

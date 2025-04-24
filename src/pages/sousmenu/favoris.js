import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // <-- important, pour les liens SPA

const FAV_STORAGE_KEY = "a2msi_favs";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const favs = localStorage.getItem(FAV_STORAGE_KEY);
    setFavorites(favs ? JSON.parse(favs) : []);
  }, []);
  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h2>Mes favoris</h2>
      {favorites.length ? (
        <ul style={{ listStyle: "none", padding: 0, fontSize: 18 }}>
          {favorites.map(place => (
            <li key={place.place_id} style={{ margin: "12px 0", background: "#f9f9fa", borderRadius: 12, padding: "13px 16px" }}>
              <Link
                to={`/destination?placeId=${place.place_id}`}
                style={{ color: "#222", textDecoration: "none" }}
              >
                <b>{place.name}</b>
                <div style={{ fontSize: 14 }}>{place.vicinity || place.formatted_address}</div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#888", fontStyle: "italic" }}>
          Aucun favori enregistré.
        </p>
      )}
    </div>
  );
}

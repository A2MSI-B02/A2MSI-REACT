import React, { useEffect, useState } from "react";
import { Container, ListGroup, ListGroupItem, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const FAV_STORAGE_KEY = "a2msi_favs";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const favs = localStorage.getItem(FAV_STORAGE_KEY);
    setFavorites(favs ? JSON.parse(favs) : []);
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Mes favoris</h2>
      {favorites.length ? (
        <ListGroup>
          {favorites.map(place => (
            <ListGroupItem key={place.place_id} className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{place.name}</h5>
                  <p>{place.vicinity || place.formatted_address}</p>
                </div>
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      ) : (
        <Alert variant="info" className="text-center">
          Aucun favori enregistré.
        </Alert>
      )}
    </Container>
  );
}

import React, { useRef, useEffect, useState } from 'react';
import Footer from '../components/footer';
import HeartFav from '../components/HeartFav'; 

const FAV_STORAGE_KEY = "a2msi_favs";
const CENTER = { lat: 48.8566, lng: 2.3522 }; // Paris
const MAP_HEIGHT = "70vh";

// Helpers pour rendu étoile, prix, ouvert/fermé
function renderStars(rating) {
  if (!rating) return null;
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span style={{ color: "#fc0", fontSize: 17, marginRight: 5 }}>
      {Array(full).fill().map((_, i) => <span key={i}>★</span>)}
      {half === 1 && <span>☆</span>}
      {Array(empty).fill().map((_, i) => <span key={i + full + 1}>☆</span>)}
    </span>
  );
}

function getPriceLevel(level) {
  if (!level) return null;
  return '€'.repeat(level);
}

function renderOpenClosed(opening_hours) {
  if (!opening_hours) return null;
  return opening_hours.open_now
    ? <span style={{ color: "#05944F", fontWeight: 600 }}>Ouvert</span>
    : <span style={{ color: "#DC3D4B", fontWeight: 600 }}>Fermé</span>;
}

// Overlay panneau de détail lieu
function PlaceDetailsPanel({ place, onClose, isFavorite, toggleFav }) { // <--- AJOUT/EDITE
  if (!place) return null;
  const photoUrl = place.photos?.[0]?.getUrl
    ? place.photos[0].getUrl({ maxWidth: 320, maxHeight: 180 })
    : place.photos?.[0]?.photo_reference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=320&photoreference=${place.photos[0].photo_reference}&key=VOTRE_CLE_API`
      : null;
  return (
    <div style={{
      width: 340, background: '#fff', boxShadow: '0 4px 24px #0001',
      borderRadius: 17, padding: 18, zIndex: 120, position: "relative", color: "#000"
    }}>
      <button onClick={onClose}
        style={{
          position: 'absolute', right: 10, top: 10, fontSize: 23,
          border: 0, background: 'none', cursor: "pointer", color: "#666"
        }}>
        ✕
      </button>
      {photoUrl &&
        <img src={photoUrl} alt="" style={{ width: "100%", borderRadius: 11, marginBottom: 15, maxHeight: 160, objectFit: 'cover' }} />
      }
      <div style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
        <div style={{ fontWeight: 600, fontSize: 22, lineHeight: 1.25, color: "#000" }}>{place.name}</div>
        {/* -- COEUR SUR DETAIL -- */}
        <HeartFav
          isFav={isFavorite(place)}
          onClick={() => toggleFav(place)}
        />
      </div>
      <div style={{ fontSize: 15, color: "#000" }}>
        {renderStars(place.rating)}<span>({place.user_ratings_total ?? 0})</span>
        {place.price_level && <span> · {getPriceLevel(place.price_level)}</span>}
      </div>
      <div style={{ fontSize: 14, color: '#000', marginBottom: 6 }}>
        {place.types && place.types.length > 0 &&
          <span>{place.types[0].replace(/_/g, " ").replace(/^\w/, c => c.toUpperCase())} · </span>}
        <span>{place.vicinity || place.formatted_address}</span>
      </div>
      <div style={{ margin: "8px 0", fontSize: 13, color: "#000" }}>
        {renderOpenClosed(place.opening_hours)}
      </div>
      {place.website &&
        <div style={{ margin: "10px 0", color: "#000" }}>
          <a href={place.website} target="_blank" rel="noopener noreferrer" style={{ color: "#1677ff" }}>Site web</a>
        </div>
      }
      {place.formatted_phone_number &&
        <div style={{ fontSize: 13, color: '#000', margin: "3px 0" }}>
          📞 {place.formatted_phone_number}
        </div>
      }
      {place.opening_hours?.weekday_text &&
        <div style={{ fontSize: 12, color: '#000', margin: "6px 0" }}>
          <strong>Horaires:</strong>
          <ul style={{ margin: "3px 0", padding: 0, listStyle: "none" }}>
            {place.opening_hours.weekday_text.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      }
    </div>
  );
}

export default function MapPage() {
  const mapRef = useRef(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [map, setMap] = useState(null);

  const [query, setQuery] = useState(() => localStorage.getItem('searchQuery') || ''); // Récupère la recherche
  const [coordinates, setCoordinates] = useState(() => {
    const coords = localStorage.getItem('searchCoordinates');
    return coords ? JSON.parse(coords) : null;
  });
  const [places, setPlaces] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedPlaceDetail, setSelectedPlaceDetail] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query) {
      handleSearch({ preventDefault: () => {} }); // Effectue une recherche automatique si une ville est sélectionnée
    }
    localStorage.removeItem('searchQuery'); // Nettoie après récupération
  }, [query]);

  useEffect(() => {
    if (coordinates && map) {
      map.setCenter(coordinates); // Recentre la carte sur les coordonnées
      map.setZoom(12); // Ajuste le zoom
    }
    localStorage.removeItem('searchCoordinates'); // Nettoie après utilisation
  }, [coordinates, map]);

// FAVORIS: État local & synchronisation stockage
const [favorites, setFavorites] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem(FAV_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
});
function isFavorite(place) {
  return favorites.some(f => f.place_id === place.place_id);
}
function toggleFav(place) {
  let newFavs;
  if (isFavorite(place)) {
    newFavs = favorites.filter(f => f.place_id !== place.place_id);
  } else {
    // On stocke l'objet directement, mais on pourrait stocker juste l'id
    newFavs = [...favorites, place];
  }
  setFavorites(newFavs);
  localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(newFavs));
}
useEffect(() => {
  const syncFavs = e => {
    if (e.key === FAV_STORAGE_KEY) {
      setFavorites(JSON.parse(e.newValue || "[]"));
    }
  };
  window.addEventListener("storage", syncFavs);
  return () => window.removeEventListener("storage", syncFavs);
}, []);

  // Chargement dynamique Google Maps JS API
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      setGoogleReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCRXfz02kudZpFDr4ogAmdA7BVm5AnUMuc&libraries=places`;
    script.async = true;
    script.onload = () => setGoogleReady(true);
    document.body.appendChild(script);
    return () => { };
  }, []);

  // Initialisation carte une fois Google OK
  useEffect(() => {
    if (!googleReady) return;
    const m = new window.google.maps.Map(mapRef.current, {
      center: coordinates || CENTER,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // À chaque mouvement ou zoom, tu peux relancer la recherche (si un mot-clé est saisi)
  m.addListener('idle', () => {
    if (query) {
      // (optionnel: limiter la fréquence avec un debounce)
      handleSearch({ preventDefault: () => {} }); // fake event
    }
  });
    setMap(m);
  }, [googleReady, coordinates]);

  // Efface marqueurs anciennes recherches
  function clearMarkers() {
    markers.forEach(m => m.setMap(null));
    setMarkers([]);
  }

  // Recherche places (PlacesService.nearbySearch + filtrage)
  const handleSearch = (e) => {
    e.preventDefault();
    if (!map || !query) return;
    clearMarkers();
    setPlaces([]);
    setSelectedPlaceDetail(null);
    setShowResults(true);

    const service = new window.google.maps.places.PlacesService(map);
    const req = {
      bounds: map.getBounds(),
      keyword: query
    };
    service.nearbySearch(req, (results, status) => {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK || !results) {
        setPlaces([]);
        return;
      }
      const resultsOk = results.filter(p => !!p && !!p.place_id);
      setPlaces(resultsOk);
      // Marqueurs map
      const mList = resultsOk.map((place) => {
        const m = new window.google.maps.Marker({
          map,
          position: place.geometry?.location,
          title: place.name,
          optimized: true
        });
        m.addListener('click', () => {
          handleShowDetails(place.place_id);
        });
        return m;
      });
      setMarkers(mList);
      // Zoom sur les résultats
      if (resultsOk.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        resultsOk.forEach(p => p.geometry?.location && bounds.extend(p.geometry.location));
        map.fitBounds(bounds);
      }
    });
  };

  // Affiche détail d’un lieu
  function handleShowDetails(placeId) {
    if (!googleReady || !map || !placeId) return;
    const svc = new window.google.maps.places.PlacesService(map);
    svc.getDetails({ placeId }, (detail, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && detail) {
        setSelectedPlaceDetail(detail);
      }
    });
  }

  // Sur clic resultat : zoom sur marker, détail
  const handleItemClick = (idx) => {
    const place = places[idx];
    if (!googleReady || !map || !place || !place.place_id) return;
    map.panTo(place.geometry?.location);
    map.setZoom(17);
    handleShowDetails(place.place_id);
    setShowResults(false);
  };

  const handleCloseDetails = () => setSelectedPlaceDetail(null);
  const handleCloseResults = () => setShowResults(false);

  return (
    <div style={{ minHeight: '100vh', position: "relative", background: "#f6f8fa", color: "#000" }}>
      {/* Barre de recherche overlay, fixe */}
      <form
        onSubmit={handleSearch}
        style={{
          position: "absolute",
          top: 18, left: 24,
          zIndex: 99,
          background: "#fff",
          boxShadow: "0 4px 20px #0002",
          borderRadius: 14, padding: "12px 16px",
          display: "flex", gap: 8,
          alignItems: "center"
        }}
      >
        <input
          type="text"
          placeholder="Rechercher un lieu, ex: restaurant, pharmacie..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: 260,
            padding: 10,
            borderRadius: 10,
            fontSize: 16,
            border: "1.5px solid #ddd",
            color: "#000"
          }}
        />
        <button
          type="submit"
          style={{
            background: '#2566F1', color: '#fff', border: 0,
            borderRadius: 10, padding: '10px 16px', fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Chercher
        </button>
      </form>

      {/* Overlay résultats (menu flottant) */}
      {showResults && (
        <div
          style={{
            position: "absolute", top: 50, left: 10,
            zIndex: 90, width: 350, maxHeight: 540,
            overflowY: "auto", background: "#fff",
            borderRadius: 14, boxShadow: "0 8px 36px 1px #0003",
            padding: 0,
            transition: "opacity .18s", color: "#000"
          }}
        >
          <button
            onClick={handleCloseResults}
            style={{
              float: "right", background: "none", border: "none",
              fontSize: 22, color: "#999", padding: 6, margin: 5,
              cursor: "pointer"
            }}
            aria-label="Fermer le menu"
          >✕</button>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, clear: "both", color: "#000" }}>
            {places.length === 0 && (
              <li style={{ color: '#888', fontStyle: 'italic', padding: 22 }}>
                Aucun résultat à afficher.
              </li>
            )}
            {places.map((place, idx) =>
              (!place || !place.place_id) ? null : (
                <li key={place.place_id}
                  style={{
                    margin: 7, marginBottom: 10, borderRadius: 10,
                    cursor: 'pointer', display: 'flex', alignItems: 'start',
                    padding: 9, background: "#f6f8fa",
                    transition: "background .2s", color: "#000"
                  }}
                  onClick={() => handleItemClick(idx)}
                  onMouseOver={e => e.currentTarget.style.background = '#eef4fd'}
                  onMouseOut={e => e.currentTarget.style.background = '#f6f8fa'}
                >
                  {place.photos && place.photos[0] && (
                    <img src={
                      place.photos[0].getUrl
                        ? place.photos[0].getUrl({ maxWidth: 46, maxHeight: 46 })
                        : `https://maps.googleapis.com/maps/api/place/photo?maxwidth=46&photoreference=${place.photos[0].photo_reference}&key=VOTRE_CLE_API`
                    }
                      alt={place.name}
                      style={{
                        width: 46, height: 46, objectFit: 'cover',
                        borderRadius: 7, marginRight: 8, boxShadow: "0 2px 4px #0001"
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: "#000" }}>{place.name}</div>
                    <div style={{ fontSize: 13, color: "#000" }}>
                      {renderStars(place.rating)}
                      <span>({place.user_ratings_total ?? 0})</span>
                      {place.price_level && <span> · {getPriceLevel(place.price_level)}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#000', marginTop: 2 }}>
                      {(place.types && place.types.length)
                        ? (
                          <span>{place.types[0].replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}</span>
                        )
                        : null}
                      <span> · </span>
                      <span>{place.vicinity || place.formatted_address}</span>
                    </div>
                  </div>
                  {/* ------ LE COEUR FAVORI ICI ------ */}
                  <HeartFav
                    isFav={isFavorite(place)}
                    onClick={() => toggleFav(place)}
                  />
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {/* Overlay Détail */}
      {selectedPlaceDetail && (
        <div style={{ position: "absolute", top: 55, right: 45, zIndex: 100 }}>
          <PlaceDetailsPanel 
          place={selectedPlaceDetail} 
          onClose={handleCloseDetails} 
          isFavorite={isFavorite}
          toggleFav={toggleFav}
          />
        </div>
      )}

      {/* MAP toujours statique, pas "étirée" */}
      <div style={{
        width: "97vw", maxWidth: 1400, margin: "auto",
        height: MAP_HEIGHT, marginTop: 42, borderRadius: 18,
        position: "relative", boxShadow: "0 7px 32px 0 #0001"
      }}>
        <div
          ref={mapRef}
          id="map"
          style={{
            width: "100%", height: "100%",
            borderRadius: 18
          }}
        />
      </div>

      <Footer />
    </div>
  );
}
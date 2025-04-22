import React, { useRef, useEffect, useState } from 'react';
import Footer from '../components/footer';

// const Navbar = ...    // Ajoute ta Navbar ici si besoin

const CENTER = { lat: 48.8566, lng: 2.3522 };

function loadGoogleMaps(callback) {
  if (window.google && window.google.maps && window.google.maps.places) {
    callback();
    return;
  }
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCRXfz02kudZpFDr4ogAmdA7BVm5AnUMuc&libraries=places`;
  script.async = true;
  script.onload = callback;
  document.body.appendChild(script);
}

function renderStars(rating) {
  if (!rating) return null;
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span style={{ color: "#fc0", fontSize: 18, marginRight: 5 }}>
      {Array(full).fill().map((_, i) => <span key={i}>★</span>)}
      {half === 1 && <span>☆</span>}
      {Array(empty).fill().map((_, i) => <span key={i + full + 1}>☆</span>)}
    </span>
  );
}

function renderOpenClosed(opening_hours) {
  if (!opening_hours) return null;
  return opening_hours.open_now
    ? <span style={{ color: "#05944F", fontWeight: 600 }}>Open</span>
    : <span style={{ color: "#DC3D4B", fontWeight: 600 }}>Closed</span>;
}

function getPriceLevel(level) {
  if (!level) return null;
  return '€'.repeat(level);
}

// --------- Panneau de détails ---------
function PlaceDetailsPanel({ place, onClose }) {
  if (!place) return null;

  return (
    <div style={{
      width: 420,
      background: '#fff',
      height: '100%',
      overflowY: 'auto',
      borderRight: '1.5px solid #ececec',
      boxShadow: '2px 0 4px rgba(80,90,120,0.04)',
      position: 'relative',
      transition: 'all .25s'
    }}>
      {/* Fermer */}
      <button onClick={onClose}
        style={{ position: 'absolute', right: 8, top: 8, fontSize: 25, border: 0, borderRadius: '50%', padding: 3, background: '#f3f4f9', cursor: 'pointer', color: '#666', zIndex:10 }}>✕</button>
      {/* Cover */}
      {place.photos && place.photos[0] && (
        <img
          src={place.photos[0].getUrl({ maxWidth: 420, maxHeight: 160 })}
          alt={place.name}
          style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: '0 0 18px 18px' }}
        />
      )}
      <div style={{ padding: "25px 24px 18px 24px" }}>
        <div style={{ fontWeight: 600, fontSize: 23, marginBottom: 8, color: "#000" }}>{place.name}</div>
        <div style={{ fontSize: 18, color: "#000" }}>
          {renderStars(place.rating)}
          <span>({place.user_ratings_total})</span>
          {place.price_level && <span> · {getPriceLevel(place.price_level)}</span>}
        </div>
        <div style={{ fontSize: 17, margin: "8px 0", color: "#000" }}>
          {place.types && place.types.length > 0 ? (
            <span>{place.types[0].replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}</span>
          ) : null}
          <span> · </span>
          <span>{place.formatted_address || place.vicinity}</span>
        </div>
        <div style={{ marginBottom: 8, marginTop: 3, fontSize: 16, color: "#000" }}>
          {renderOpenClosed(place.opening_hours)}
        </div>
        {place.opening_hours && place.opening_hours.weekday_text && (
          <div style={{ fontSize: 15, color: "#000", marginBottom: 8 }}>
            <div><b>Horaires :</b></div>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {place.opening_hours.weekday_text.map((d, i) =>
                <li key={i}>{d}</li>
              )}
            </ul>
          </div>
        )}
        {place.formatted_phone_number && (
          <div style={{ fontSize: 16, marginBottom: 7, color: "#000" }}>
            ☎️ {place.formatted_phone_number}
          </div>
        )}
        {place.website && (
          <div style={{ fontSize: 16, marginBottom: 7, color: "#000" }}>
            🌐 <a href={place.website} target="_blank" rel="noopener noreferrer" style={{ color: "#1677ff" }}>{place.website.replace(/^https?:\/\//, '')}</a>
          </div>
        )}
        {place.reviews && (
          <div style={{marginTop: 15, color: "#000" }}>
            <b>Avis Google&nbsp;:</b>
            <ul style={{paddingLeft: 0, listStyle: 'none'}}>
              {place.reviews.slice(0,2).map((rev, idx) => (
                <li key={idx} style={{margin: "10px 0"}}>
                  <div style={{fontWeight: 600, color: "#000"}}>{rev.author_name} <span style={{fontSize:15}}>{renderStars(rev.rating)}</span></div>
                  <div style={{fontSize:14, fontStyle:'italic', color:'#444'}}>{rev.text}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div style={{ marginTop: 22 }}>
          <a href={place.url} target="_blank" rel="noopener noreferrer"
             style={{ color: "#1677ff", fontWeight: 600, fontSize: 17, textDecoration: "none" }}>
            Voir sur Google Maps&nbsp;↗
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Destination() {
  const mapRef = useRef();
  const [query, setQuery] = useState('');
  const [googleReady, setGoogleReady] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedPlaceDetail, setSelectedPlaceDetail] = useState(null);

  useEffect(() => {
    loadGoogleMaps(() => setGoogleReady(true));
  }, []);

  useEffect(() => {
    if (googleReady && mapRef.current && !mapRef.current.map) {
      mapRef.current.map = new window.google.maps.Map(mapRef.current, {
        center: CENTER,
        zoom: 13,
        mapTypeControl: false,
      });
    }
  }, [googleReady]);

  // Nettoyage des markers si besoin
  function clearMarkers() {
    markers.forEach(m => m.setMap(null));
    setMarkers([]);
  }

  const handleSearch = () => {
    if (!googleReady || !mapRef.current.map || !query) return;
    clearMarkers();
    setPlaces([]);
    setSelectedPlaceDetail(null);
    const service = new window.google.maps.places.PlacesService(mapRef.current.map);
    const bounds = mapRef.current.map.getBounds() || new window.google.maps.LatLngBounds(CENTER);
    const request = { bounds, keyword: query };
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces(results);
        const newMarkers = results.map((place, idx) => {
          if (!(place.geometry && place.geometry.location)) return null;
          const marker = new window.google.maps.Marker({
            map: mapRef.current.map,
            position: place.geometry.location,
            title: place.name,
          });
          marker.addListener('click', () => {
            handleItemClick(idx); // Affiche le panneau détails
          });
          return marker;
        }).filter(Boolean);
        setMarkers(newMarkers);
      }
    });
  };

  // Récupère les détails avancés via Place Details API
  const handleItemClick = (idx) => {
    const place = places[idx];
    if (!googleReady || !mapRef.current.map || !place.place_id) return;
    setSelectedPlaceDetail(null); // Panel loading (optionnel)
    const service = new window.google.maps.places.PlacesService(mapRef.current.map);
    service.getDetails({ 
      placeId: place.place_id, 
      fields: [
        'name', 'rating', 'user_ratings_total',
        'formatted_address', 'vicinity', 'formatted_phone_number', 'website', 'photos',
        'review', 'opening_hours', 'types', 'url', 'reviews'
      ]
    }, (result, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setSelectedPlaceDetail(result);
        if(result.geometry && result.geometry.location) {
          mapRef.current.map.panTo(result.geometry.location);
          mapRef.current.map.setZoom(16);
        }
      }
    });
  };

  const handlePanelClose = () => setSelectedPlaceDetail(null);

  // ---- UI
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      {/* <Navbar /> */}
      <div style={{ flex: 1, display: "flex", flexDirection: "row", minHeight:500 }}>
        {/* Barre latérale */}
        {selectedPlaceDetail ?
          <PlaceDetailsPanel place={selectedPlaceDetail} onClose={handlePanelClose} />
        : (
          <div style={{width:420, background:'#fff', borderRight: '1.5px solid #ececec', height:'100%', boxShadow:'2px 0 3px rgba(80,90,120,0.035)', display:'flex', flexDirection:'column'}}>
            <div style={{padding:"20px 15px 12px 18px", borderBottom:'1px solid #efefef', background:'#f9fafd'}}>
              <form onSubmit={e => { e.preventDefault(); handleSearch(); }}>
                <input
                  placeholder="Rechercher un lieu…" value={query}
                  style={{ fontSize: 18, border:'1px solid #dde0e7', borderRadius:10, padding:10, width:'90%', color: "#000" }}
                  onChange={e => setQuery(e.target.value)}
                />
                <button type="submit" style={{marginLeft:8, fontSize:16, background:'#0c75eb', border:0, borderRadius:7, color:'#fff', padding:'9px 20px', fontWeight:600, cursor:'pointer'}}>Rechercher</button>
              </form>
            </div>
            <div style={{overflowY:'auto', flex:1}}>
              <ul style={{padding:0,margin:0,listStyle:'none'}}>
                {places.map((place, idx) => (
                  <li
                    key={place.place_id}
                    onClick={() => handleItemClick(idx)}
                    style={{cursor:'pointer', display:'flex', alignItems:'center', padding:'18px 13px 18px 17px', borderBottom:'1px solid #f0f0f0', gap: 15, transition:'background 0.1s', background:'#fff', color: "#000"}}
                    onMouseOver={e=>e.currentTarget.style.background='#f7fbff'}
                    onMouseOut={e=>e.currentTarget.style.background='#fff'}
                  >
                    {/* Image */}
                    {place.photos && place.photos[0] && (
                      <img src={place.photos[0].getUrl({ maxWidth:66, maxHeight:66 })}
                        alt={place.name}
                        style={{
                          width:66, height:66, objectFit:'cover',
                          borderRadius: 10, marginRight: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
                        }}
                      />
                    )}
                    {/* Texte */}
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600, fontSize:18, marginBottom:1, color: "#000"}}>{place.name}</div>
                      <div style={{fontSize:15, color: "#000"}}>
                        {renderStars(place.rating)}
                        <span>({place.user_ratings_total ?? 0})</span>
                        {place.price_level && <span> · {getPriceLevel(place.price_level)}</span>}
                      </div>
                      <div style={{fontSize:14, color:'#678', marginTop:3}}>
                        {(place.types && place.types.length > 0) ? (
                          <span>{place.types[0].replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}</span>
                        ) : null}
                        <span> · </span>
                        <span>{place.vicinity || place.formatted_address}</span>
                      </div>
                      <div style={{marginTop:2, fontSize:13}}>
                        {renderOpenClosed(place.opening_hours)}
                      </div>
                    </div>
                  </li>
                ))}
                {places.length === 0 && (
                  <li style={{ color: '#888', fontStyle: 'italic', padding: 22 }}>
                    Aucun résultat à afficher.
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
        {/* Map */}
        <div style={{ flex: 1 }}>
          <div
            ref={mapRef}
            id="map"
            style={{ height: '100%', minHeight: 500, width: '100%' }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

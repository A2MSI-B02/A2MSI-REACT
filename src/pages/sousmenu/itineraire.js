import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import HeartFav from '../../components/HeartFav';
import Footer from '../../components/footer';
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
    closestCenter,
  } from '@dnd-kit/core';
  import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove as dndKitArrayMove,
  } from '@dnd-kit/sortable';
  import {CSS} from '@dnd-kit/utilities';

const GOOGLE_MAPS_API_KEY = "AIzaSyCRXfz02kudZpFDr4ogAmdA7BVm5AnUMuc";
const FAV_STORAGE_KEY = "a2msi_favs";

let googleMapsScriptLoadingPromise = null;

function loadGoogleMapsScript() {
  if (window.google && window.google.maps) {
    return Promise.resolve();
  }
  if (!googleMapsScriptLoadingPromise) {
    googleMapsScriptLoadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCRXfz02kudZpFDr4ogAmdA7BVm5AnUMuc&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  return googleMapsScriptLoadingPromise;
}

function arrayMove(arr, fromIndex, toIndex) {
    const newArr = arr.slice();
    const [element] = newArr.splice(fromIndex, 1);
    newArr.splice(toIndex, 0, element);
    return newArr;
  }

  function SortableItem({fav, idx, children}) {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
      useSortable({id: String(idx)});
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      background: isDragging ? 'lightgrey' : undefined,
    };
  
    return (
      <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
        {children}
      </div>
    );
  }
  
function loadScript(url) {
    return new Promise((resolve) => {
        if (document.querySelector(`script[src="${url}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = url;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });
}

function DirectionsMap({ origin, destination }) {
    const mapRef = useRef(null);
  
    useEffect(() => {
      let map;
      let directionsRenderer;
      let directionsService;
  
      async function initMap() {
        await loadGoogleMapsScript();
        if (window.google && origin && destination) {
          map = new window.google.maps.Map(mapRef.current, {
            center: origin,
            zoom: 10,
          });
          directionsService = new window.google.maps.DirectionsService();
          directionsRenderer = new window.google.maps.DirectionsRenderer();
          directionsRenderer.setMap(map);
  
          directionsService.route(
            {
              origin,
              destination,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === "OK") {
                directionsRenderer.setDirections(result);
              }
            }
          );
        }
      }
      initMap();
  
      // Clean up
      return () => {
        if (directionsRenderer) {
          directionsRenderer.setMap(null);
        }
      };
    }, [origin, destination]);
  
    return <div ref={mapRef} style={{ width: "50%", height: "250px", margin: "20px auto" }} />;
  }
  
export default function Itineraire() {
    
  const [favoris, setFavoris] = useState([]);

  const handleDragEnd = (event) => {
    const {active, over} = event;
    if (active.id !== over.id) {
      setFavoris((items) => {
        const oldIndex = items.findIndex((_, idx) => String(idx) === active.id);
        const newIndex = items.findIndex((_, idx) => String(idx) === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    const favs = localStorage.getItem(FAV_STORAGE_KEY);
    const parsedFavs = favs ? JSON.parse(favs) : [];
    setFavoris(parsedFavs);
  }, []);

  // Helper function to extract lat and lng
  const getLatLng = (fav) => {
    if (fav?.geometry?.location) {
        // Cas où on a geometry.location
        return {
          lat: typeof fav.geometry.location.lat === 'function' ? fav.geometry.location.lat() : fav.geometry.location.lat,
          lng: typeof fav.geometry.location.lng === 'function' ? fav.geometry.location.lng() : fav.geometry.location.lng,
        };
      } else if (fav?.latitude && fav?.longitude) {
        // Cas où on a directement latitude et longitude (à adapter selon ta structure)
        return {
          lat: fav.latitude,
          lng: fav.longitude,
        };
      }
      return null;
    };

    return (
        <div>
          <h2>Mon itinéraire</h2>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={favoris.map((_, idx) => String(idx))}
              strategy={verticalListSortingStrategy}
            >
              {favoris.map((fav, idx) => {
                const latLng = getLatLng(fav);
                const nextLatLng = getLatLng(favoris[idx + 1]);
                return (
                  <SortableItem key={idx} fav={fav} idx={idx}>
                    <div>
                      <strong>{fav.name}</strong> <br />
                      {fav.formatted_address || fav.address}
                    </div>
                    {latLng && nextLatLng && idx < favoris.length - 1 && (
                      <DirectionsMap
                        origin={{ lat: latLng.lat, lng: latLng.lng }}
                        destination={{ lat: nextLatLng.lat, lng: nextLatLng.lng }}
                      />
                    )}
                  </SortableItem>
                );
              })}
            </SortableContext>
          </DndContext>
          <Footer />
        </div>
    );
}
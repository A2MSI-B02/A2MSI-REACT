import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Footer from "../../components/footer";

export default function MesActivites() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) { setActivities([]); setLoading(false); return; }
      const q = query(
        collection(db, "activities"),
        where("ownerUid", "==", user.uid)
      );
      const snap = await getDocs(q);
      setActivities(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2>Mes activités</h2>
      {loading && <div>Chargement…</div>}
      {!loading && activities.length === 0 && <div>Aucune activité pour l’instant.</div>}
      <ul>
        {activities.map(act => (
          <li key={act.id} style={{ marginBottom: 20, padding: 12, border: "1px solid #eee", borderRadius: 8, boxShadow: "0 2px 8px #0001" }}>
            <strong>{act.name}</strong> — {act.address}<br/>
            {act.website && <a href={act.website} rel="noopener noreferrer" target="_blank">Site</a>} <br/>
            {act.phone && <>Tel.: {act.phone} <br/></>}
            <em>Horaires :</em>
            <ul>
              {act.hours && Object.entries(act.hours).map(([day, hours]) =>
                <li key={day}>{day.charAt(0).toUpperCase() + day.slice(1)} : {hours}</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
      <Footer />
    </div>
  );
}

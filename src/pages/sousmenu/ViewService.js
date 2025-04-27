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

  if (!service) {
    return <div>Chargement...</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{service.nom}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {service.lieux && service.lieux.map((lieu) => (
          <div key={lieu.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img
              src={lieu.imageUrl || '/placeholder.jpg'}
              alt={lieu.nom}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{lieu.nom}</h2>
              <p className="text-gray-600 text-sm">{lieu.description}</p>
              <div className="mt-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Voir plus
                </button>
              </div>
            </div>
          </div>
        ))}
  
        {service.activites && service.activites.map((activite) => (
          <div key={activite.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img
              src={activite.imageUrl || '/placeholder.jpg'}
              alt={activite.nom}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{activite.nom}</h2>
              <p className="text-gray-600 text-sm">{activite.description}</p>
              <div className="mt-4">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Voir plus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );  
}

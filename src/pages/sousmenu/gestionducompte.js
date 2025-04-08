import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../firebaseConfig'; // Importer les instances Firebase
import { updatePassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const GestionDuCompte = () => {
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [description, setDescription] = useState('');

  // Charger les données utilisateur au montage du composant
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser.uid; // Récupérer l'utilisateur connecté
      const docRef = doc(db, 'users', userId); // Remplace "users" par ta collection utilisateur
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUser(data);
        if (data.profilePicUrl) setProfilePicUrl(data.profilePicUrl);
        setDescription(data.description || ''); // Si la description n'existe pas, utilise une chaîne vide
      }
    };

    fetchUserData();
  }, []);

  // Mettre à jour le mot de passe
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(auth.currentUser, password);
      alert('Mot de passe mis à jour avec succès !');
      setPassword('');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe :', error.message);
      alert('Impossible de changer le mot de passe. Vérifiez votre saisie.');
    }
  };

  // Mettre à jour la photo de profil
  const handleProfilePicUpdate = async () => {
    if (!profilePic) {
      alert('Veuillez sélectionner une photo de profil.');
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const storageRef = ref(storage, `profilePictures/${userId}`); // Emplacement dans Firebase Storage
      await uploadBytes(storageRef, profilePic); // Upload de l'image
      const downloadUrl = await getDownloadURL(storageRef); // Récupérer l'URL de l'image

      // Mettre à jour dans Firestore
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { profilePicUrl: downloadUrl });

      // Mettre à jour l'état pour refléter les modifications
      setProfilePicUrl(downloadUrl);
      alert('Photo de profil mise à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo de profil :', error.message);
      alert('Impossible de mettre à jour la photo de profil.');
    }
  };

  // Mettre à jour la description
  const handleDescriptionUpdate = async () => {
    try {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { description });

      alert('Description mise à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la description :', error.message);
      alert('Impossible de mettre à jour la description.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Gestion du compte</h1>

      {user && (
        <div>
          <div>
            <h2>Changer le mot de passe</h2>
            <form onSubmit={handlePasswordUpdate}>
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Mettre à jour le mot de passe</button>
            </form>
          </div>

          <div>
            <h2>Photo de profil</h2>
            {profilePicUrl && (
              <img
                src={profilePicUrl}
                alt="Profile"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            )}
            <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} />
            <button onClick={handleProfilePicUpdate}>Mettre à jour la photo de profil</button>
          </div>

          <div>
            <h2>Description</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Ajoutez une description..."
            />
            <button onClick={handleDescriptionUpdate}>Mettre à jour la description</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionDuCompte;

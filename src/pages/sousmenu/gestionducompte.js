import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../firebaseConfig';
import { updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const GestionDuCompte = () => {
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser.uid;
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser(data);
          setProfilePicUrl(data.profilePicUrl || '');
          setDescription(data.description || '');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur :', error.message);
      }
    };

    fetchUserData();
  }, []);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!password) return alert('Veuillez entrer un mot de passe.');
    try {
      await updatePassword(auth.currentUser, password);
      alert('Mot de passe mis à jour avec succès !');
      setPassword('');
    } catch (error) {
      console.error('Erreur :', error.message);
      alert('Impossible de changer le mot de passe.');
    }
  };

  const handleProfilePicUpdate = async () => {
    if (!profilePic) return alert('Veuillez sélectionner une photo de profil.');
    try {
      const userId = auth.currentUser.uid;
      const storageRef = ref(storage, `profilePictures/${userId}`);
      await uploadBytes(storageRef, profilePic);
      const downloadUrl = await getDownloadURL(storageRef);

      await updateDoc(doc(db, 'users', userId), { profilePicUrl: downloadUrl });
      setProfilePicUrl(downloadUrl);
      alert('Photo de profil mise à jour avec succès !');
    } catch (error) {
      console.error('Erreur :', error.message);
      alert('Impossible de mettre à jour la photo de profil.');
    }
  };

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
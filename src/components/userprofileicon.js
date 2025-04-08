import React from "react";
import { auth } from "../firebaseConfig"; // Firebase Authentication
import { FaUserCircle } from "react-icons/fa"; // Icône par défaut si aucune image n'est définie

const UserProfileIcon = () => {
    const user = auth.currentUser; // Récupération de l'utilisateur actuellement connecté

    return (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
            {user?.photoURL ? (
                // Si une photo de profil est disponible
                <img
                    src={user.photoURL}
                    alt="Photo de profil"
                    style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #007bff",
                    }}
                />
            ) : (
                // Icône par défaut si aucune photo n'est définie dans Firebase
                <FaUserCircle size={80} color="#007bff" />
            )}
            <p style={{ marginTop: "10px", fontWeight: "bold" }}>
                {user?.displayName || "Professionnel"}
            </p>
        </div>
    );
};

export default UserProfileIcon;

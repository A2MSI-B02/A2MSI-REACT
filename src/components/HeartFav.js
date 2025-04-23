// components/HeartFav.js
import React from "react";

export default function HeartFav({ isFav, onClick = () => {} }) {
  return (
    <span
      style={{
        marginLeft: 10,
        cursor: "pointer",
        fontSize: 21,
        color: isFav ? "#DC143C" : "#BBB",
        userSelect: "none",
        verticalAlign: "middle",
        transition: "color .15s"
      }}
      title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
    >
      {isFav ? "❤️" : "🤍"}
    </span>
  );
}

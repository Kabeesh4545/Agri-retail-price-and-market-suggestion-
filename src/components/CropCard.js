import React from "react";

const CropCard = ({ name, image, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        textAlign: "center",
        cursor: "pointer",
        width: "140px",
        margin: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}
    >
      <img
        src={image}
        alt={name}
        style={{ width: "100px", height: "100px", objectFit: "cover" }}
      />
      <h3 style={{ marginTop: "10px" }}>{name}</h3>
    </div>
  );
};

export default CropCard;

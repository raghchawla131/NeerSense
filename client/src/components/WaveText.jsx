import React from "react";
import "./WaveText.css";

const WaveText = ({ text }) => {
  return (
    <div className="wave-content">
      <h2>{text}</h2>
      <h2>{text}</h2>
    </div>
  );
};

export default WaveText;

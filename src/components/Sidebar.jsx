/* cSpell:ignore USGS */
import React from 'react';

export default function Sidebar({ quake, onClose }) {
  if (!quake) return null;
  return (
    <div className="sidebar">
      <button className="close-btn" onClick={onClose}>✕</button>
      <h3>{quake.place}</h3>
      <p><strong>Magnitude:</strong> {quake.mag}</p>
      <p><strong>Depth:</strong> {quake.depth ?? 'N/A'} km</p>
      <p><strong>Time:</strong> {new Date(quake.time).toLocaleString()}</p>
      <p><strong>Coordinates:</strong> {quake.lat.toFixed(3)}, {quake.lon.toFixed(3)}</p>
      <a href={quake.link} target="_blank" rel="noreferrer">Open in USGS</a>
    </div>
  );
}

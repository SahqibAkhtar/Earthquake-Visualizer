import React from 'react';

export default function Legend({ categories, toggleCategory }) {
  const items = [
    { key: '6', label: '≥ 6.0' },
    { key: '5', label: '5.0–5.9' },
    { key: '4', label: '4.0–4.9' },
    { key: '3', label: '3.0–3.9' },
    { key: '2', label: '2.0–2.9' },
    { key: '0', label: '< 2.0' },
  ];

  return (
    <div className="legend" role="region" aria-label="Magnitude legend">
      <strong>Magnitude</strong>
      {items.map(i => {
        const color = {
          '6': '#d73027', '5': '#fc8d59', '4': '#fee08b', '3': '#d9ef8b', '2': '#91cf60', '0': '#1a9850'
        }[i.key] || '#ccc';
        return (
          <div key={i.key} className="legend-row" onClick={() => toggleCategory(i.key)} style={{ opacity: categories[i.key] ? 1 : 0.35, cursor: 'pointer' }}>
            <span style={{ width: 14, height: 12, background: color, display: 'inline-block', marginRight: 8 }} />
            <span>{i.label}</span>
          </div>
        );
      })}
      <div style={{ marginTop: 8, fontSize: 11, opacity: 0.9 }}>Click to toggle category</div>
    </div>
  );
}

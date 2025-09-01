export function colorForMag(m) {
if (m >= 6) return '#d73027';
if (m >= 5) return '#fc8d59';
if (m >= 4) return '#fee08b';
if (m >= 3) return '#d9ef8b';
if (m >= 2) return '#91cf60';
return '#1a9850';
}

export function radiusForMag(m) {
  return Math.max(3, (m || 0) * 3);
}

/* cSpell:ignore Nominatim USGS Basemap */
import React, { useEffect, useMemo, useState } from 'react';
import Controls from './components/Controls.jsx';
import MapView from './components/MapView.jsx';
import Legend from './components/Legend.jsx';
import Sidebar from './components/Sidebar.jsx';
import { urlForPeriod } from './utils/endpoints.js';
import './styles.css';

const initialCategories = {
  '6': true,  // >=6
  '5': true,  // 5.0-5.9
  '4': true,
  '3': true,
  '2': true,
  '0': true   // <2
};

export default function App() {
  const [quakes, setQuakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [period, setPeriod] = useState('day'); // hour | day | week
  const [minMag, setMinMag] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showHeat, setShowHeat] = useState(false);

  const [categories, setCategories] = useState(initialCategories);
  const [refreshTick, setRefreshTick] = useState(0);
  const [selectedQuake, setSelectedQuake] = useState(null);
  const [playTimeline, setPlayTimeline] = useState(false);

  

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);


  // Fetch quake data
  useEffect(() => {
    let cancelled = false;
    const url = urlForPeriod(period);

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url);
        const data = await res.json();
        const feats = (data.features || []).map(f => {
          const [lon, lat, depth] = f.geometry.coordinates;
          const { mag, place, time, url } = f.properties;
          return { id: f.id, lat, lon, depth, mag, place, time, link: url };
        });
        if (!cancelled) setQuakes(feats);
      } catch (e) {
        console.error('Fetch error:', e);
        if (!cancelled) setError('Failed to load earthquake data. Try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();


    // auto-refresh handling
    let id = null;
    if (autoRefresh) {
      id = setInterval(load, 5 * 60 * 1000);
    }
    return () => { cancelled = true; if (id) clearInterval(id); };
  }, [period, refreshTick, autoRefresh]);


  // Helpers
  function toggleCategory(key) {
    setCategories(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const filtered = useMemo(() => {
    return quakes.filter(q => {
      if (typeof q.mag !== 'number') return false;
      if (q.mag < minMag) return false;

      const mag = q.mag;
      // inline category checks using `categories` directly:
      if (mag >= 6 && !categories['6']) return false;
      if (mag >= 5 && mag < 6 && !categories['5']) return false;
      if (mag >= 4 && mag < 5 && !categories['4']) return false;
      if (mag >= 3 && mag < 4 && !categories['3']) return false;
      if (mag >= 2 && mag < 3 && !categories['2']) return false;
      if (mag < 2 && !categories['0']) return false;
      return true;

    }).sort((a,b) => a.time - b.time); // categories is now a direct dependency
  }, [quakes, minMag, categories]);


  // manual refresh
  function refreshNow() {
    setRefreshTick(t => t + 1);
  }
const [flyCoords, setFlyCoords] = useState(null);
const doSearch = async (query) => {
  
  const url = `https://api.geoapify.com/v1/geocode/search?text=${query}&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.features && data.features.length > 0) {
      const { lat, lon } = data.features[0].properties;
      console.log("Found location:", lat, lon);
       setFlyCoords([lat, lon]);   // ✅ trigger map to zoom
    } else {
        alert("No location found");
    }
  } catch (err) {
    console.error("Search error:", err);
  }
};


  // CSV export
  function exportCSV() {
    if (!filtered.length) return;
    const header = ['Time (ISO)','Magnitude','Place','Lat','Lon','Depth(km)','USGS URL'];
    const rows = filtered.map(q => [
      new Date(q.time).toISOString(),
      q.mag ?? '',
      (q.place ?? '').replace(/"/g,'""'),
      q.lat,
      q.lon,
      q.depth ?? '',
      q.link ?? ''
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earthquakes_${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    
    <div className="app">
      <header className="app-header">
  <h1>🌍 Earthquake Visualizer </h1>
        <p>Last updated: {new Date().toLocaleString()}</p>

</header>


      <Controls
        period={period}
        setPeriod={setPeriod}
        minMag={minMag}
        setMinMag={setMinMag}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        refreshNow={refreshNow}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        doSearch={doSearch}
        exportCSV={exportCSV}
        playTimeline={playTimeline}
        setPlayTimeline={setPlayTimeline}
        showHeat={showHeat}
        setShowHeat={setShowHeat}
      />

      <div className="map-wrap">
        <MapView
          quakes={filtered}
          rawQuakes={quakes}
          loading={loading}
          error={error}
          darkMode={darkMode}
          playTimeline={playTimeline}
          setSelectedQuake={setSelectedQuake}
          showHeat={showHeat}
          flyCoords={flyCoords}   // ✅ pass down
        />
        <Legend categories={categories} toggleCategory={toggleCategory} />
      </div>

      <footer>
        <small>Basemap: OpenStreetMap • Data: USGS • Built for Casey</small>

      </footer>

      <Sidebar quake={selectedQuake} onClose={() => setSelectedQuake(null)} />
    </div>
  );
}

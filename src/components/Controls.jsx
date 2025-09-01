import React, { useState } from 'react';

export default function Controls({
  period, setPeriod,
  minMag, setMinMag,
  autoRefresh, setAutoRefresh,
  refreshNow,
  darkMode, setDarkMode,
  doSearch,
  exportCSV,
  playTimeline, setPlayTimeline,
  showHeat, setShowHeat
}) {
  const [q, setQ] = useState('');

  function submitSearch(e) {
    e?.preventDefault();
    if (!q.trim()) return;
    doSearch(q.trim());
    setQ('');
  }

  return (
    <div className="controls">
      <div className="controls-left">
        <form onSubmit={submitSearch} className="search-form">
          <input placeholder="Search place (e.g. Japan, California)" value={q} onChange={e => setQ(e.target.value)} />
          <button type="submit">🔎</button>
        </form>

        <label>
          Time:
          <select value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="hour">Last 1 hour</option>
            <option value="day">Last 24 hours</option>
            <option value="week">Last 7 days</option>
          </select>
        </label>

        <label>
          Min magnitude: <span>{minMag.toFixed(1)}</span>
          <input type="range" min="0" max="7" step="0.1" value={minMag} onChange={e => setMinMag(parseFloat(e.target.value))} />
        </label>
      </div>

      <div className="controls-right">
        <label className="checkbox">
          <input type="checkbox" checked={autoRefresh} onChange={() => setAutoRefresh(v => !v)} />
          AutoRefresh
        </label>

        <button onClick={refreshNow} title="Manual refresh">🔄 Refresh</button>

        <button onClick={() => { setDarkMode(d => !d); }} title="Toggle dark mode">
          {darkMode ? '🌞 Light' : '🌙 Dark'}
        </button>

        <button onClick={() => { setPlayTimeline(p => !p); }}>
          {playTimeline ? '⏸ Pause' : '▶️ Play'}
        </button>

        <button onClick={() => setShowHeat(s => !s)}>{showHeat ? '🗺️ Markers' : '🔥 Heatmap'}</button>

        <button onClick={exportCSV}>⬇️ Export CSV</button>
      </div>
    </div>
  );
}

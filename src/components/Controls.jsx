// src/components/Controls.jsx
import React, { useState } from "react";

export default function Controls({
  period, setPeriod,
  minMag, setMinMag,
  autoRefresh, setAutoRefresh,
  refreshNow,
  darkMode, setDarkMode,
  doSearch,
  exportCSV,
  playTimeline, setPlayTimeline,
  showHeat, setShowHeat,
}) {
  const [q, setQ] = useState("");

  function submitSearch(e) {
    e.preventDefault();
    if (q?.trim()) doSearch(q.trim());
  }

  return (
    <div className="controls" role="region" aria-label="Map controls">
      {/* LEFT CLUSTER */}
      <div className="controls-left">
        <form className="search-form" onSubmit={submitSearch}>
          <input
            aria-label="Search place"
            placeholder="Search place…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" className="btn btn--primary">
            <span className="btn__icon">🔎</span>
            <span className="btn__text">Search</span>
          </button>
        </form>

        <label className="select-wrap" title="Time window">
          <span className="label">Period</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            aria-label="Time period"
          >
            <option value="hour">Past Hour</option>
            <option value="day">Past Day</option>
            <option value="week">Past Week</option>
          </select>
        </label>

        <label className="range-wrap" title="Minimum magnitude">
          <span className="label">Min Mag</span>
          <input
            type="range"
            min="0"
            max="7"
            step="0.1"
            value={minMag}
            onChange={(e) => setMinMag(Number(e.target.value))}
            aria-label="Minimum magnitude"
          />
          <span className="range-value">{minMag.toFixed(1)}</span>
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          <span>Auto refresh</span>
        </label>
      </div>

      {/* RIGHT CLUSTER */}
      <div className="controls-right">
        <button
          className="btn"
          onClick={refreshNow}
          aria-label="Refresh data"
          title="Refresh"
        >
          <span className="btn__icon">🔄</span>
          <span className="btn__text">Refresh</span>
        </button>

        <button
          className="btn"
          onClick={() => setPlayTimeline((p) => !p)}
          aria-label={playTimeline ? "Pause" : "Play"}
          title={playTimeline ? "Pause" : "Play"}
        >
          <span className="btn__icon">{playTimeline ? "⏸" : "▶️"}</span>
          <span className="btn__text">{playTimeline ? "Pause" : "Play"}</span>
        </button>

        <button
          className="btn"
          onClick={() => setDarkMode((d) => !d)}
          aria-label={darkMode ? "Light mode" : "Dark mode"}
          title={darkMode ? "Light mode" : "Dark mode"}
        >
          <span className="btn__icon">{darkMode ? "🌞" : "🌙"}</span>
          <span className="btn__text">{darkMode ? "Light" : "Dark"}</span>
        </button>

        <button
          className="btn"
          onClick={() => setShowHeat((s) => !s)}
          aria-label={showHeat ? "Show markers" : "Show heatmap"}
          title={showHeat ? "Show markers" : "Show heatmap"}
        >
          <span className="btn__icon">{showHeat ? "🗺️" : "🔥"}</span>
          <span className="btn__text">{showHeat ? "Markers" : "Heatmap"}</span>
        </button>

        <button
          className="btn btn--primary"
          onClick={exportCSV}
          aria-label="Export CSV"
          title="Export CSV"
        >
          <span className="btn__icon">⬇️</span>
          <span className="btn__text">Export CSV</span>
        </button>
      </div>
    </div>
  );
}

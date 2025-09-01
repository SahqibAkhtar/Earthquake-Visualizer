import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { colorForMag, radiusForMag } from '../utils/colors.js';

function HeatmapLayer({ points, options }) {
const map = useMap();
const layerRef = useRef(null);

useEffect(() => {
if (layerRef.current) {
    // layerRef.current = null;
    try { 
        map.removeLayer(layerRef.current); 
    } catch (e) {
        console.warn('Failed to remove heat layer:', e);
    }
    layerRef.current = null;
}
if (!points || points.length === 0) return;
const heatPoints = points.map(p => [p.lat, p.lon, Math.max(1, p.mag || 1)]);
layerRef.current = L.heatLayer(heatPoints, options).addTo(map);
return () => {
    if (layerRef.current) { 
        try { 
            map.removeLayer(layerRef.current); 
        } catch (e) {
            console.warn('Failed to remove heat layer on cleanup:', e);
        }

    }
    layerRef.current = null;
};
}, [map, points, options]);

return null;
}

export default function MapView({ quakes, loading, error, darkMode, playTimeline, setSelectedQuake, searchLocation, showHeat }) {    const mapRef = useRef(null);
    const [displayCount, setDisplayCount] = useState(0);
    
    // when searchLocation changes, set view
    useEffect(() => {
        if (mapRef.current && searchLocation) {
            try {
                mapRef.current.setView(searchLocation, 6, { animate: true });
            } catch (e) { console.warn(e); }
        }
    }, [searchLocation]);
    
    // timeline animation: incrementally reveal quakes (oldest -> newest)
    useEffect(() => {
        if (!playTimeline) {
            setDisplayCount(quakes.length);
            return;
        }
        // start from 1 and grow
        setDisplayCount(0);
        let i = 0;
        const interval = setInterval(() => {
            i += 1;
            setDisplayCount(i);
            if (i >= quakes.length) clearInterval(interval);
        }, 150); // 150ms per quake (adjust speed)
        return () => clearInterval(interval);
    }, [playTimeline, quakes]);
    
    // default show all if not playing
    useEffect(() => {
        if (!playTimeline) setDisplayCount(quakes.length);
    }, [playTimeline, quakes.length]);
    
    const displayed = useMemo(() => {
        return quakes.slice(0, displayCount || quakes.length);
    }, [quakes, displayCount]);
    
    const tileUrl = darkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    
    return (
        <MapContainer
        className="map"
        center={[20, 0]}
        zoom={2}
        whenCreated={m => (mapRef.current = m)}
        zoomControl={false}
        style={{ height: 'calc(100vh - 220px)', width: '100%' }}
        >
        <ZoomControl position="topright" />
        <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url={tileUrl}
        />

        {showHeat ? (
        <HeatmapLayer points={displayed} options={{ radius: 25, blur: 20, maxZoom: 7 }} />
        ) : (
            displayed.map(q => (
                <CircleMarker
                key={q.id}
                center={[q.lat, q.lon]}
                radius={radiusForMag(q.mag)}
                pathOptions={{ color: colorForMag(q.mag), fillOpacity: 0.7 }}
                eventHandlers={{
                    click: () => setSelectedQuake(q)
                }}
                >
            <Popup>
            <div>
                <strong>{q.place}</strong><br />
                Magnitude: {q.mag}<br />
                {/* Depth: {q.depth?.toFixed ? q.depth.toFixed(1) : q.depth} km<br /> */}
                {/* Time: {new Date(q.time).toLocaleString()}<br /> */}
                <a href={q.link} target="_blank" rel="noreferrer">Details</a>
            </div>
            </Popup>
            </CircleMarker>
        ))
    )}

    {loading && <div className="loading">Loading…</div>}
    {error && <div className="error">{error}</div>}
    {!loading && !displayed.length && <div className="no-data">No earthquakes for this filter</div>}
    </MapContainer>
);
}

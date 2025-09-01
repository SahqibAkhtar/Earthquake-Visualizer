import React, { useEffect, useState, } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./styles.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// 🔹 FlyTo component (helper to move map on search)
const FlyTo = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 5, { duration: 2 });
    }
  }, [coords, map]);
  return null;
};

// Main Component
const EarthquakeMap = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [flyCoords, setFlyCoords] = useState(null);

  // 🔹 Fetch earthquake data from USGS
  useEffect(() => {
    fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")
      .then((res) => res.json())
      .then((data) => setEarthquakes(data.features))
      .catch((err) => console.error("Error fetching earthquake data:", err));
  }, []);

  // 🔹 Geoapify Search API
  const doSearch = async () => {
    if (!searchTerm) return;
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          searchTerm
        )}&apiKey=YOUR_API_KEY`
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const { lat, lon } = data.features[0].properties;
        setFlyCoords([lat, lon]);
      } else {
        alert("No results found");
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // 🔹 Filter earthquakes by text (place name)
  const filteredQuakes = earthquakes.filter((quake) =>
    quake.properties.place.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="map-container" style={{ height: "100vh", width: "100%" }}>
      {/* 🔍 Search UI */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSearch()} // hit Enter to search
        />
        <button onClick={doSearch}>Search</button>
      </div>

      {/* 🌍 Map */}
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* 🔹 Fly to search result */}
        {flyCoords && <FlyTo coords={flyCoords} />}

        {/* 🔹 Plot earthquakes */}
        {filteredQuakes.map((quake) => {
          const [lng, lat, depth] = quake.geometry.coordinates;
          const magnitude = quake.properties.mag;

          return (
            <CircleMarker
              key={quake.id}
              center={[lat, lng]}
              radius={magnitude * 2}
              fillColor={magnitude >= 5 ? "red" : magnitude >= 3 ? "orange" : "yellow"}
              color="black"
              weight={1}
              fillOpacity={0.7}
            >
              <Popup>
                <strong>{quake.properties.place}</strong>
                <br />
                Magnitude: {magnitude}
                <br />
                Depth: {depth} km
                <br />
                Time: {new Date(quake.properties.time).toLocaleString()}
              </Popup>
            </CircleMarker>
          );
        })}

      </MapContainer>
    </div>
  );
};

export default EarthquakeMap;



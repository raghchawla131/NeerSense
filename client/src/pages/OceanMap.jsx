import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";
import { Link as RouterLink } from "react-router-dom";

const OceanMap = () => {
  // Approximate center of India
  const indiaCenter = [22.3511148, 78.6677428];

  const [points, setPoints] = useState([]);

  const formatDateTime = (value) => {
    if (value === undefined || value === null || value === "") return undefined;
    // If numeric, treat as ARGO JULD (days since 1950-01-01 UTC)
    const num = Number(value);
    let d;
    if (Number.isFinite(num)) {
      const base = Date.UTC(1950, 0, 1, 0, 0, 0);
      const ms = base + num * 24 * 60 * 60 * 1000;
      d = new Date(ms);
      if (isNaN(d.getTime())) d = undefined;
    } else {
      const parsed = Date.parse(String(value));
      if (!Number.isNaN(parsed)) d = new Date(parsed);
    }
    if (!d) return String(value);
    try {
      return d.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });
    } catch (e) {
      return d.toISOString();
    }
  };

  useEffect(() => {
    // Fetch CSV from public folder
    const csvUrl = "/argo_profiles_combined.csv";
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = Array.isArray(results.data) ? results.data : [];
        const valid = rows
          .map((row) => ({
            lat: Number(row.LATITUDE),
            lon: Number(row.LONGITUDE),
            id: row.float_id ?? row.FLOAT_ID ?? row.floatID ?? row.id,
            nProf: row.N_PROF,
            pres: row.PRES,
            temp: row.TEMP,
            psal: row.PSAL,
            juld: row.JULD,
            file: row.file ?? row.FILE,
          }))
          .filter(
            (r) =>
              Number.isFinite(r.lat) &&
              Number.isFinite(r.lon) &&
              Math.abs(r.lat) <= 90 &&
              Math.abs(r.lon) <= 180
          );
        setPoints(valid);
      },
      error: (err) => {
        // eslint-disable-next-line no-console
        console.error("CSV parse error", err);
      },
    });
  }, []);

  const memoizedPoints = useMemo(() => points, [points]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <MapContainer
        center={indiaCenter}
        zoom={5}
        minZoom={2}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
        preferCanvas
        worldCopyJump
      >
        {/* English-only labels via CartoDB Positron */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {memoizedPoints.map((p, idx) => (
          <CircleMarker
            key={`${p.id ?? "pt"}-${idx}`}
            center={[p.lat, p.lon]}
            radius={3}
            pathOptions={{ color: "#1976d2", weight: 0.5, fillOpacity: 0.5 }}
          >
            <Popup>
              <div style={{ minWidth: 200 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>
                  Float {String(p.id ?? "Unknown")}
                </div>
                <div style={{ marginBottom: 4 }}>
                  Near {p.lat?.toFixed ? p.lat.toFixed(3) : p.lat}°, {p.lon?.toFixed ? p.lon.toFixed(3) : p.lon}°
                </div>
                {p.temp !== undefined && (
                  <div style={{ color: "#444" }}>Water temp: {String(p.temp)}</div>
                )}
                {p.psal !== undefined && (
                  <div style={{ color: "#444" }}>Salinity: {String(p.psal)}</div>
                )}
                {p.pres !== undefined && (
                  <div style={{ color: "#444" }}>Depth/pressure: {String(p.pres)}</div>
                )}
                {p.juld !== undefined && (
                  <div style={{ color: "#666", marginTop: 2 }}>
                    Observed: {formatDateTime(p.juld)}
                  </div>
                )}
                <RouterLink
                  to={`/argodetails?float_id=${encodeURIComponent(p.id ?? "")}`}
                  style={{
                    display: "inline-block",
                    marginTop: 8,
                    textDecoration: "none",
                    color: "#1976d2",
                    fontWeight: 600,
                  }}
                >
                  Get more details →
                </RouterLink>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default OceanMap;



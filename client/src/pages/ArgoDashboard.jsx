import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
} from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Plot from "react-plotly.js";
import WavesIcon from "@mui/icons-material/Waves";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import OpacityIcon from "@mui/icons-material/Opacity";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature"; // fixed
import Papa from "papaparse";
import { useSearch } from "../context/SearchContext.jsx";

const ArgoDashboard = () => {
  const { lastQuery, neerBotResult, geminiData, setGeminiData } = useSearch();
  const [csvData, setCsvData] = useState([]);
  const [enriched, setEnriched] = useState(null);

  useEffect(() => {
    // Load CSV from public
    Papa.parse("/argo_profiles_combined.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        setCsvData(results.data.filter(Boolean));
      },
    });
  }, []);

  useEffect(() => {
    // When we have a NeerBot result or lastQuery, optionally enrich with Gemini if not present
    if (lastQuery && !geminiData) {
      // Try to enrich via server (non-blocking)
      fetch("http://localhost:5000/api/gemini/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `Provide a concise oceanographic context for: ${lastQuery}` }),
      })
        .then((r) => r.json())
        .then((d) => setGeminiData(d))
        .catch(() => {});
    }
  }, [lastQuery, geminiData, setGeminiData]);

  useEffect(() => {
    setEnriched({
      query: lastQuery,
      neerBot: neerBotResult,
      gemini: geminiData,
    });
  }, [lastQuery, neerBotResult, geminiData]);

  // Extract simple tokens from query to filter CSV (e.g., float id, profile id)
  const queryTokens = useMemo(() => {
    if (!lastQuery) return [];
    const raw = String(lastQuery).toLowerCase();
    const tokens = raw
      .split(/[^a-z0-9_.-]+/i)
      .map((t) => t.trim())
      .filter(Boolean);
    return tokens;
  }, [lastQuery]);

  const filteredCsv = useMemo(() => {
    if (!csvData?.length || !queryTokens.length) return csvData;
    try {
      // If any token appears in any stringified value of the row, keep it
      return csvData.filter((row) => {
        const hay = Object.values(row)
          .map((v) => (v == null ? "" : String(v).toLowerCase()))
          .join(" ");
        return queryTokens.every((tok) => hay.includes(tok));
      });
    } catch {
      return csvData;
    }
  }, [csvData, queryTokens]);

  // Derive dynamic chart datasets from CSV when available; fallback to demo data
  const tempSeries = useMemo(() => {
    const hasDepth = filteredCsv.some((r) => r.depth != null);
    const hasTemp = filteredCsv.some((r) => r.temperature != null || r.temp != null);
    if (hasDepth && hasTemp) {
      return filteredCsv
        .map((r) => ({
          depth: Number(r.depth),
          temp: Number(r.temperature ?? r.temp),
        }))
        .filter((d) => Number.isFinite(d.depth) && Number.isFinite(d.temp))
        .sort((a, b) => a.depth - b.depth);
    }
    return [
      { depth: 0, temp: 25 },
      { depth: 200, temp: 24 },
      { depth: 400, temp: 23 },
      { depth: 600, temp: 22 },
      { depth: 800, temp: 21 },
      { depth: 1000, temp: 20 },
      { depth: 1200, temp: 19 },
      { depth: 1400, temp: 18 },
      { depth: 1500, temp: 17.5 },
    ];
  }, [filteredCsv]);

  const salinitySeries = useMemo(() => {
    const hasDepth = filteredCsv.some((r) => r.depth != null);
    const hasSal = filteredCsv.some((r) => r.salinity != null || r.psu != null);
    if (hasDepth && hasSal) {
      return filteredCsv
        .map((r) => ({
          depth: Number(r.depth),
          salinity: Number(r.salinity ?? r.psu),
        }))
        .filter((d) => Number.isFinite(d.depth) && Number.isFinite(d.salinity))
        .sort((a, b) => a.depth - b.depth);
    }
    return tempSeries.map((d) => ({ depth: d.depth, salinity: 35 + Math.random() }));
  }, [filteredCsv, tempSeries]);
  // Gemini JSON to metrics/overlays if present
  const gemJson = geminiData?.json || neerBotResult?.json || null;
  // Note: charts are currently driven by CSV; overlays based on Gemini are disabled per user request
  
  const [planktonRange, setPlanktonRange] = useState(() => {
    // Generate a realistic random range in cells/mL (≈ cells/cm³)
    // Oligotrophic: 1–20, mesotrophic: 20–100, eutrophic/upwelling: 100–500
    const buckets = [
      { min: 1, max: 20, weight: 0.4 },
      { min: 20, max: 100, weight: 0.4 },
      { min: 100, max: 500, weight: 0.2 },
    ];
    const r = Math.random();
    let acc = 0;
    let chosen = buckets[0];
    for (const b of buckets) {
      acc += b.weight;
      if (r <= acc) { chosen = b; break; }
    }
    const a = chosen.min + Math.random() * (chosen.max - chosen.min);
    const b = chosen.min + Math.random() * (chosen.max - chosen.min);
    const min = Math.max(1, Math.round(Math.min(a, b)));
    const max = Math.round(Math.max(a, b));
    return { min, max };
  });
  const safeNumberOrRange = (val) => {
    if (val == null) return undefined;
    if (typeof val === "object") {
      const min = Number(val.min);
      const max = Number(val.max);
      if (Number.isFinite(min) && Number.isFinite(max)) return { min, max };
      return undefined;
    }
    const num = Number(val);
    return Number.isFinite(num) ? num : undefined;
  };
  const metrics = useMemo(() => {
    const formatRange = (val, unit) => {
      if (val == null) return undefined;
      if (typeof val === "object" && val.min != null && val.max != null) {
        return `${val.min}–${val.max} ${unit}`;
      }
      if (typeof val === "number") return `${val} ${unit}`;
      return undefined;
    };
    const tVal = safeNumberOrRange(gemJson?.temp_c);
    const sVal = safeNumberOrRange(gemJson?.salinity_psu);
    const dVal = safeNumberOrRange(gemJson?.depth_m);
    // Use hardcoded random plankton density range per requirements, ignoring model output
    const pVal = planktonRange;
    const t = formatRange(tVal, "°C") || "—";
    const s = formatRange(sVal, "PSU") || "—";
    const d = formatRange(dVal, "m") || "—";
    const p = formatRange(pVal, "cells/mL") || "—";
    return [
      { label: "Temperature", value: t, icon: <ThermostatIcon sx={{ fontSize: 40, color: "#00bcd4" }} /> },
      { label: "Salinity", value: s, icon: <OpacityIcon sx={{ fontSize: 40, color: "#00bcd4" }} /> },
      { label: "Depth", value: d, icon: <WavesIcon sx={{ fontSize: 40, color: "#00bcd4" }} /> },
      { label: "Plankton Density", value: p, icon: <EmojiNatureIcon sx={{ fontSize: 40, color: "#00bcd4" }} /> },
    ];
  }, [gemJson, planktonRange]);

  const tempData = tempSeries;
  const salinityData = salinitySeries;

  const planktonData = [
    { type: "Diatoms", density: 80 },
    { type: "Dinoflagellates", density: 50 },
    { type: "Coccolithophores", density: 30 },
    { type: "Other", density: 40 },
  ];

  const seabedData = [
    { distance: 0, depth: 1500 },
    { distance: 50, depth: 1550 },
    { distance: 100, depth: 1600 },
    { distance: 150, depth: 1580 },
    { distance: 200, depth: 1620 },
    { distance: 250, depth: 1590 },
    { distance: 300, depth: 1600 },
  ];

  return (
    <Box sx={{ bgcolor: "#0f1115", minHeight: "100vh", py: 6, color: "#e6e9ef" }}>
      <Container maxWidth="lg">
        {/* Title */}
        <Typography variant="h3" sx={{ mb: 4, textAlign: "center", fontWeight: 700, letterSpacing: 0.5 }}>
          NeerSense Dashboard
        </Typography>

        {/* Search context summary */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#151923", border: "1px solid #222a3a" }} elevation={0}>
              <Typography variant="h6" sx={{ mb: 1 }}>Latest Query</Typography>
              <Typography variant="body1" sx={{ color: "#b8c1d1" }}>{lastQuery || "No query yet."}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#151923", border: "1px solid #222a3a", height: "100%" }} elevation={0}>
              <Typography variant="h6" sx={{ mb: 1 }}>Expert Summary</Typography>
              <Typography variant="body2" sx={{ color: "#a7b1c2", maxHeight: 140, overflow: "auto" }}>
                {geminiData?.text || "—"}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        {/* Filter indicator */}
        {queryTokens.length > 0 && (
          <Typography variant="body2" sx={{ mb: 2, color: "#9ad" }}>
            Filtering data by query tokens: {queryTokens.join(", ")} ({filteredCsv.length} rows)
          </Typography>
        )}

        {/* Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {metrics.map((m, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: 3,
                  bgcolor: "#1e1e1e",
                }}
                elevation={3}
              >
                {m.icon}
                <Typography variant="h6">{m.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {m.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */
        }
        <Grid container spacing={4}>
          {/* Temperature Line Chart */}
          <Grid item xs={12} md={12}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#151923", border: "1px solid #222a3a" }} elevation={0}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Temperature vs Depth
              </Typography>
              <ResponsiveContainer width="100%" height={380}>
                <LineChart data={tempData}>
                  <CartesianGrid stroke="#263248" />
                  <XAxis dataKey="depth" reversed label={{ value: "Depth (m)", position: "insideBottom", offset: -5 }} />
                  <YAxis label={{ value: "Temp (°C)", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="temp" stroke="#3dd6d0" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Salinity Line Chart */}
          <Grid item xs={12} md={12}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#151923", border: "1px solid #222a3a" }} elevation={0}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Salinity vs Depth
              </Typography>
              <ResponsiveContainer width="100%" height={380}>
                <LineChart data={salinityData}>
                  <CartesianGrid stroke="#263248" />
                  <XAxis dataKey="depth" reversed label={{ value: "Depth (m)", position: "insideBottom", offset: -5 }} />
                  <YAxis label={{ value: "Salinity (PSU)", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="salinity" stroke="#9ccc65" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Plankton Bar Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#151923", border: "1px solid #222a3a" }} elevation={0}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Plankton Density
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={planktonData}>
                  <CartesianGrid stroke="#263248" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="density" fill="#3dd6d0" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Seafloor Area Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#151923", border: "1px solid #222a3a" }} elevation={0}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Seafloor Topography
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={seabedData}>
                  <CartesianGrid stroke="#263248" />
                  <XAxis dataKey="distance" label={{ value: "Distance (km)", position: "insideBottom", offset: -5 }} />
                  <YAxis label={{ value: "Depth (m)", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="depth" stroke="#3dd6d0" fill="#3dd6d044" />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Plotly: CSV-driven visualization */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#151923", border: "1px solid #222a3a" }} elevation={0}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Argo Profiles (from CSV)
              </Typography>
              <Plot
                data={[
                  {
                    x: filteredCsv.map((d) => d.profile_id || d.cycle || d.time || 0),
                    y: filteredCsv.map((d) => d.temperature ?? d.temp ?? 0),
                    type: "scatter",
                    mode: "lines+markers",
                    marker: { color: "#3dd6d0" },
                    name: "Temperature",
                  },
                ]}
                layout={{
                  paper_bgcolor: "#151923",
                  plot_bgcolor: "#151923",
                  font: { color: "#e6e9ef" },
                  xaxis: { title: "Profile / Time" },
                  yaxis: { title: "Temperature" },
                  autosize: true,
                  height: 440,
                  margin: { l: 40, r: 20, t: 20, b: 40 },
                }}
                style={{ width: "100%" }}
                useResizeHandler
                config={{ displayModeBar: false }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ArgoDashboard;

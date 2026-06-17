"use client";

import { useCallback, useMemo, useState } from "react";
import { MapPin, Thermometer, CloudRain, Droplets, Wind } from "lucide-react";

/* ───────────────────────────────────────────────────────
   Mock climate data per state – replace with real API
   ─────────────────────────────────────────────────────── */
interface StateClimateData {
  name: string;
  temperature: number;
  rainfall: number;
  humidity: number;
  aqi: number;
  floodRisk: number;
  droughtRisk: number;
}

const stateClimateData: Record<string, StateClimateData> = {
  "jammu-kashmir": { name: "Jammu & Kashmir", temperature: 18, rainfall: 55, humidity: 62, aqi: 45, floodRisk: 35, droughtRisk: 15 },
  "himachal-pradesh": { name: "Himachal Pradesh", temperature: 22, rainfall: 120, humidity: 70, aqi: 52, floodRisk: 45, droughtRisk: 10 },
  "punjab": { name: "Punjab", temperature: 34, rainfall: 40, humidity: 55, aqi: 120, floodRisk: 30, droughtRisk: 35 },
  "uttarakhand": { name: "Uttarakhand", temperature: 20, rainfall: 180, humidity: 75, aqi: 58, floodRisk: 65, droughtRisk: 8 },
  "haryana": { name: "Haryana", temperature: 36, rainfall: 30, humidity: 50, aqi: 145, floodRisk: 20, droughtRisk: 45 },
  "delhi": { name: "Delhi", temperature: 38, rainfall: 25, humidity: 48, aqi: 180, floodRisk: 25, droughtRisk: 40 },
  "rajasthan": { name: "Rajasthan", temperature: 42, rainfall: 15, humidity: 30, aqi: 95, floodRisk: 10, droughtRisk: 85 },
  "uttar-pradesh": { name: "Uttar Pradesh", temperature: 36, rainfall: 65, humidity: 60, aqi: 155, floodRisk: 40, droughtRisk: 30 },
  "bihar": { name: "Bihar", temperature: 34, rainfall: 110, humidity: 72, aqi: 130, floodRisk: 75, droughtRisk: 12 },
  "sikkim": { name: "Sikkim", temperature: 16, rainfall: 200, humidity: 82, aqi: 30, floodRisk: 50, droughtRisk: 5 },
  "arunachal-pradesh": { name: "Arunachal Pradesh", temperature: 18, rainfall: 250, humidity: 85, aqi: 25, floodRisk: 55, droughtRisk: 5 },
  "nagaland": { name: "Nagaland", temperature: 22, rainfall: 180, humidity: 80, aqi: 32, floodRisk: 40, droughtRisk: 8 },
  "manipur": { name: "Manipur", temperature: 24, rainfall: 170, humidity: 78, aqi: 35, floodRisk: 45, droughtRisk: 10 },
  "mizoram": { name: "Mizoram", temperature: 24, rainfall: 190, humidity: 80, aqi: 28, floodRisk: 42, droughtRisk: 8 },
  "tripura": { name: "Tripura", temperature: 28, rainfall: 160, humidity: 78, aqi: 40, floodRisk: 48, droughtRisk: 12 },
  "meghalaya": { name: "Meghalaya", temperature: 20, rainfall: 300, humidity: 88, aqi: 30, floodRisk: 55, droughtRisk: 5 },
  "assam": { name: "Assam", temperature: 28, rainfall: 220, humidity: 82, aqi: 45, floodRisk: 80, droughtRisk: 5 },
  "west-bengal": { name: "West Bengal", temperature: 32, rainfall: 140, humidity: 78, aqi: 110, floodRisk: 60, droughtRisk: 15 },
  "jharkhand": { name: "Jharkhand", temperature: 33, rainfall: 95, humidity: 65, aqi: 105, floodRisk: 35, droughtRisk: 25 },
  "odisha": { name: "Odisha", temperature: 34, rainfall: 130, humidity: 75, aqi: 80, floodRisk: 70, droughtRisk: 15 },
  "chhattisgarh": { name: "Chhattisgarh", temperature: 33, rainfall: 100, humidity: 68, aqi: 75, floodRisk: 30, droughtRisk: 22 },
  "madhya-pradesh": { name: "Madhya Pradesh", temperature: 37, rainfall: 70, humidity: 55, aqi: 90, floodRisk: 25, droughtRisk: 40 },
  "gujarat": { name: "Gujarat", temperature: 38, rainfall: 45, humidity: 55, aqi: 100, floodRisk: 35, droughtRisk: 50 },
  "maharashtra": { name: "Maharashtra", temperature: 34, rainfall: 110, humidity: 65, aqi: 115, floodRisk: 45, droughtRisk: 30 },
  "goa": { name: "Goa", temperature: 30, rainfall: 250, humidity: 82, aqi: 42, floodRisk: 40, droughtRisk: 8 },
  "karnataka": { name: "Karnataka", temperature: 32, rainfall: 90, humidity: 62, aqi: 70, floodRisk: 35, droughtRisk: 28 },
  "telangana": { name: "Telangana", temperature: 36, rainfall: 75, humidity: 58, aqi: 95, floodRisk: 30, droughtRisk: 35 },
  "andhra-pradesh": { name: "Andhra Pradesh", temperature: 35, rainfall: 80, humidity: 65, aqi: 78, floodRisk: 50, droughtRisk: 30 },
  "tamil-nadu": { name: "Tamil Nadu", temperature: 33, rainfall: 60, humidity: 70, aqi: 65, floodRisk: 55, droughtRisk: 25 },
  "kerala": { name: "Kerala", temperature: 30, rainfall: 280, humidity: 85, aqi: 38, floodRisk: 65, droughtRisk: 5 },
  "ladakh": { name: "Ladakh", temperature: 8, rainfall: 10, humidity: 25, aqi: 20, floodRisk: 15, droughtRisk: 60 },
  "chandigarh": { name: "Chandigarh", temperature: 35, rainfall: 50, humidity: 55, aqi: 110, floodRisk: 20, droughtRisk: 30 },
  "puducherry": { name: "Puducherry", temperature: 32, rainfall: 70, humidity: 75, aqi: 55, floodRisk: 40, droughtRisk: 18 },
  "andaman-nicobar": { name: "Andaman & Nicobar", temperature: 28, rainfall: 300, humidity: 88, aqi: 22, floodRisk: 45, droughtRisk: 3 },
  "lakshadweep": { name: "Lakshadweep", temperature: 28, rainfall: 180, humidity: 82, aqi: 18, floodRisk: 30, droughtRisk: 5 },
};

/* ───────────────────────────────────────────────────────
   Simplified SVG paths for Indian states/UTs
   viewBox calibrated to ~68-97 lon, ~8-37 lat
   ─────────────────────────────────────────────────────── */
interface StatePath {
  id: string;
  d: string;
  labelX: number;
  labelY: number;
}

const statePaths: StatePath[] = [
  // Jammu & Kashmir
  { id: "jammu-kashmir", d: "M220,30 L240,20 L270,22 L285,35 L290,55 L275,70 L260,72 L240,65 L225,55 L215,45 Z", labelX: 252, labelY: 48 },
  // Ladakh
  { id: "ladakh", d: "M285,15 L320,10 L340,18 L345,35 L335,50 L310,55 L290,55 L285,35 L290,20 Z", labelX: 312, labelY: 35 },
  // Himachal Pradesh
  { id: "himachal-pradesh", d: "M240,65 L260,72 L275,70 L278,82 L268,95 L250,92 L235,85 L232,75 Z", labelX: 255, labelY: 80 },
  // Punjab
  { id: "punjab", d: "M215,75 L232,75 L235,85 L250,92 L245,105 L228,108 L212,100 L208,88 Z", labelX: 228, labelY: 92 },
  // Chandigarh
  { id: "chandigarh", d: "M244,96 L248,94 L250,98 L246,100 Z", labelX: 247, labelY: 97 },
  // Uttarakhand
  { id: "uttarakhand", d: "M268,95 L290,88 L310,92 L315,105 L300,115 L280,112 L265,108 Z", labelX: 290, labelY: 102 },
  // Haryana
  { id: "haryana", d: "M212,100 L228,108 L245,105 L248,118 L240,130 L222,128 L210,118 L205,108 Z", labelX: 225, labelY: 115 },
  // Delhi
  { id: "delhi", d: "M240,118 L248,118 L250,126 L242,128 Z", labelX: 244, labelY: 122 },
  // Rajasthan
  { id: "rajasthan", d: "M135,115 L180,108 L205,108 L210,118 L222,128 L225,150 L218,178 L200,200 L170,210 L142,205 L120,185 L118,155 L125,130 Z", labelX: 168, labelY: 162 },
  // Uttar Pradesh
  { id: "uttar-pradesh", d: "M240,130 L280,112 L300,115 L330,120 L345,135 L340,155 L320,168 L295,172 L270,168 L250,160 L235,155 L230,145 Z", labelX: 288, labelY: 145 },
  // Bihar
  { id: "bihar", d: "M345,135 L370,130 L395,138 L400,155 L385,168 L360,170 L340,165 L340,155 Z", labelX: 368, labelY: 152 },
  // Sikkim
  { id: "sikkim", d: "M385,120 L395,115 L402,120 L400,132 L392,135 L385,130 Z", labelX: 393, labelY: 125 },
  // Arunachal Pradesh
  { id: "arunachal-pradesh", d: "M430,95 L465,85 L500,90 L510,105 L498,118 L470,122 L445,118 L430,110 Z", labelX: 470, labelY: 105 },
  // Nagaland
  { id: "nagaland", d: "M478,122 L498,118 L505,128 L500,140 L485,142 L475,135 Z", labelX: 490, labelY: 132 },
  // Manipur
  { id: "manipur", d: "M475,140 L490,142 L498,152 L492,165 L478,165 L470,155 Z", labelX: 483, labelY: 153 },
  // Mizoram
  { id: "mizoram", d: "M462,168 L478,165 L485,178 L480,195 L468,198 L458,188 L455,175 Z", labelX: 470, labelY: 182 },
  // Tripura
  { id: "tripura", d: "M448,170 L462,168 L458,188 L448,190 L442,180 Z", labelX: 452, labelY: 180 },
  // Meghalaya
  { id: "meghalaya", d: "M420,142 L450,138 L470,142 L465,155 L445,158 L425,155 L418,148 Z", labelX: 442, labelY: 148 },
  // Assam
  { id: "assam", d: "M400,125 L430,110 L445,118 L470,122 L475,135 L470,142 L450,138 L420,142 L425,155 L445,158 L462,168 L448,170 L435,168 L420,160 L405,155 L395,145 L395,138 Z", labelX: 430, labelY: 135 },
  // West Bengal
  { id: "west-bengal", d: "M385,168 L400,165 L410,172 L415,195 L420,220 L415,245 L400,258 L390,248 L385,228 L378,210 L370,195 L365,178 L370,170 Z", labelX: 398, labelY: 215 },
  // Jharkhand
  { id: "jharkhand", d: "M340,165 L360,170 L370,170 L365,178 L370,195 L355,205 L335,200 L325,185 L328,172 Z", labelX: 348, labelY: 185 },
  // Odisha
  { id: "odisha", d: "M325,200 L355,205 L370,195 L378,210 L385,228 L375,248 L355,258 L330,252 L310,240 L305,220 L312,208 Z", labelX: 342, labelY: 228 },
  // Chhattisgarh
  { id: "chhattisgarh", d: "M270,185 L295,172 L320,175 L325,200 L312,208 L305,220 L290,225 L268,218 L258,205 L262,192 Z", labelX: 290, labelY: 200 },
  // Madhya Pradesh
  { id: "madhya-pradesh", d: "M190,165 L225,150 L250,160 L270,168 L270,185 L262,192 L258,205 L240,218 L218,225 L195,218 L172,215 L170,210 L178,190 L185,175 Z", labelX: 222, labelY: 195 },
  // Gujarat
  { id: "gujarat", d: "M100,195 L120,185 L142,205 L170,210 L172,215 L168,235 L148,255 L128,268 L108,260 L95,242 L85,225 L82,218 L90,210 L88,200 L95,195 Z", labelX: 125, labelY: 228 },
  // Maharashtra
  { id: "maharashtra", d: "M148,255 L168,235 L195,218 L218,225 L240,218 L258,225 L262,245 L255,268 L238,285 L215,292 L192,290 L170,285 L155,275 L148,262 Z", labelX: 205, labelY: 265 },
  // Goa
  { id: "goa", d: "M162,290 L170,285 L175,295 L170,305 L162,302 Z", labelX: 168, labelY: 296 },
  // Telangana
  { id: "telangana", d: "M238,245 L262,245 L280,252 L288,270 L278,288 L258,295 L242,290 L232,275 L228,258 Z", labelX: 258, labelY: 270 },
  // Karnataka
  { id: "karnataka", d: "M155,290 L175,295 L192,290 L215,292 L232,295 L242,315 L238,342 L225,358 L205,365 L180,360 L165,345 L155,325 L148,305 Z", labelX: 195, labelY: 330 },
  // Andhra Pradesh
  { id: "andhra-pradesh", d: "M242,290 L258,295 L278,288 L300,295 L320,305 L330,325 L325,348 L308,358 L285,362 L265,358 L250,345 L242,330 L242,315 Z", labelX: 285, labelY: 328 },
  // Tamil Nadu
  { id: "tamil-nadu", d: "M225,358 L250,345 L265,358 L285,362 L298,375 L295,400 L285,425 L270,440 L252,445 L238,435 L225,415 L218,395 L215,375 Z", labelX: 255, labelY: 400 },
  // Kerala
  { id: "kerala", d: "M188,368 L205,365 L215,375 L218,395 L225,415 L220,435 L210,445 L200,440 L192,418 L185,395 L182,380 Z", labelX: 202, labelY: 410 },
  // Puducherry
  { id: "puducherry", d: "M270,385 L278,382 L280,390 L274,393 Z", labelX: 275, labelY: 388 },
  // Andaman & Nicobar (positioned to the right)
  { id: "andaman-nicobar", d: "M440,295 L448,290 L455,300 L458,320 L455,345 L450,365 L445,380 L438,375 L435,355 L432,330 L435,310 Z", labelX: 448, labelY: 340 },
  // Lakshadweep (positioned to the left in the sea)
  { id: "lakshadweep", d: "M130,365 L138,362 L142,370 L140,380 L135,385 L128,378 Z", labelX: 135, labelY: 374 },
];

/* ───────────────────────────────────────────────────────
   Color logic based on layer selection
   ─────────────────────────────────────────────────────── */
type LayerType = "temperature" | "rainfall" | "flood_risk" | "drought_risk" | "aqi";

function getStateColor(stateId: string, layer: LayerType): string {
  const data = stateClimateData[stateId];
  if (!data) return "rgba(34, 211, 238, 0.15)";

  switch (layer) {
    case "temperature": {
      if (data.temperature >= 40) return "#dc2626";
      if (data.temperature >= 35) return "#f97316";
      if (data.temperature >= 28) return "#eab308";
      if (data.temperature >= 20) return "#22d3ee";
      return "#3b82f6";
    }
    case "rainfall": {
      if (data.rainfall >= 250) return "#1d4ed8";
      if (data.rainfall >= 150) return "#3b82f6";
      if (data.rainfall >= 80) return "#60a5fa";
      if (data.rainfall >= 40) return "#93c5fd";
      return "#dbeafe";
    }
    case "flood_risk": {
      if (data.floodRisk >= 70) return "#dc2626";
      if (data.floodRisk >= 50) return "#f97316";
      if (data.floodRisk >= 30) return "#eab308";
      return "#22c55e";
    }
    case "drought_risk": {
      if (data.droughtRisk >= 60) return "#dc2626";
      if (data.droughtRisk >= 40) return "#f97316";
      if (data.droughtRisk >= 20) return "#eab308";
      return "#22c55e";
    }
    case "aqi": {
      if (data.aqi >= 150) return "#dc2626";
      if (data.aqi >= 100) return "#f97316";
      if (data.aqi >= 50) return "#eab308";
      return "#22c55e";
    }
    default:
      return "rgba(34, 211, 238, 0.25)";
  }
}

/* ───────────────────────────────────────────────────────
   Main Component
   ─────────────────────────────────────────────────────── */
export function IndiaMapSVG({ compact = false }: { compact?: boolean }) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<LayerType>("temperature");
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const layers: { key: LayerType; label: string; icon: typeof Thermometer }[] = useMemo(() => [
    { key: "temperature", label: "Temperature", icon: Thermometer },
    { key: "rainfall", label: "Rainfall", icon: CloudRain },
    { key: "flood_risk", label: "Flood Risk", icon: Droplets },
    { key: "drought_risk", label: "Drought Risk", icon: Wind },
    { key: "aqi", label: "Air Quality", icon: Wind },
  ], []);

  const activeStateData = useMemo(() => {
    const id = selectedState ?? hoveredState;
    return id ? stateClimateData[id] ?? null : null;
  }, [hoveredState, selectedState]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const legendItems = useMemo(() => {
    switch (activeLayer) {
      case "temperature":
        return [
          { color: "#3b82f6", label: "< 20°C" },
          { color: "#22d3ee", label: "20-28°C" },
          { color: "#eab308", label: "28-35°C" },
          { color: "#f97316", label: "35-40°C" },
          { color: "#dc2626", label: "> 40°C" },
        ];
      case "rainfall":
        return [
          { color: "#dbeafe", label: "< 40mm" },
          { color: "#93c5fd", label: "40-80mm" },
          { color: "#60a5fa", label: "80-150mm" },
          { color: "#3b82f6", label: "150-250mm" },
          { color: "#1d4ed8", label: "> 250mm" },
        ];
      case "flood_risk":
      case "drought_risk":
        return [
          { color: "#22c55e", label: "Low" },
          { color: "#eab308", label: "Moderate" },
          { color: "#f97316", label: "High" },
          { color: "#dc2626", label: "Severe" },
        ];
      case "aqi":
        return [
          { color: "#22c55e", label: "Good (<50)" },
          { color: "#eab308", label: "Moderate" },
          { color: "#f97316", label: "Poor" },
          { color: "#dc2626", label: "Hazardous" },
        ];
      default:
        return [];
    }
  }, [activeLayer]);

  return (
    <div className={compact ? "relative" : "relative min-h-[600px]"}>
      {/* Layer Selector */}
      <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-1.5">
        {layers.map((l) => {
          const Icon = l.icon;
          return (
            <button
              key={l.key}
              onClick={() => setActiveLayer(l.key)}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeLayer === l.key
                  ? "bg-cyan-300 text-slate-950 shadow-glow"
                  : "bg-slate-950/80 text-slate-300 border border-cyan-300/20 hover:bg-white/10 hover:text-white backdrop-blur"
              }`}
            >
              <Icon className="h-3 w-3" />
              {l.label}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-20 rounded-md border border-cyan-300/20 bg-slate-950/85 p-2.5 backdrop-blur">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-200">Legend</p>
        <div className="grid gap-1">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-[10px] text-slate-300">
              <span
                className="inline-block h-2.5 w-5 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredState && activeStateData && !selectedState && (
        <div
          className="pointer-events-none absolute z-30 rounded-lg border border-cyan-300/30 bg-slate-950/92 px-3.5 py-2.5 shadow-glow backdrop-blur-xl"
          style={{
            left: Math.min(tooltipPos.x + 16, compact ? 200 : 400),
            top: tooltipPos.y - 8,
          }}
        >
          <p className="text-sm font-semibold text-white">{activeStateData.name}</p>
          <div className="mt-1.5 grid gap-0.5 text-[11px] text-slate-300">
            <span>🌡 {activeStateData.temperature}°C</span>
            <span>🌧 {activeStateData.rainfall} mm</span>
            <span>💧 Humidity: {activeStateData.humidity}%</span>
            <span>💨 AQI: {activeStateData.aqi}</span>
          </div>
        </div>
      )}

      {/* SVG Map */}
      <svg
        viewBox="60 0 480 470"
        className={`w-full ${compact ? "h-[420px]" : "h-[580px]"} cursor-crosshair`}
        onMouseMove={handleMouseMove}
        style={{ filter: "drop-shadow(0 0 20px rgba(34, 211, 238, 0.12))" }}
      >
        <defs>
          {/* Glow filter */}
          <filter id="state-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Hover glow */}
          <filter id="hover-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Animated gradient for selected state */}
          <linearGradient id="selected-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee">
              <animate attributeName="stop-color" values="#22d3ee;#06b6d4;#22d3ee" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#34d399">
              <animate attributeName="stop-color" values="#34d399;#10b981;#34d399" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          {/* Grid pattern for sea area */}
          <pattern id="sea-grid" patternUnits="userSpaceOnUse" width="12" height="12">
            <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(34, 211, 238, 0.06)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Background sea */}
        <rect x="60" y="0" width="480" height="470" fill="url(#sea-grid)" />

        {/* Render states */}
        {statePaths.map((state) => {
          const isHovered = hoveredState === state.id;
          const isSelected = selectedState === state.id;
          const fillColor = isSelected
            ? "url(#selected-gradient)"
            : getStateColor(state.id, activeLayer);

          return (
            <g key={state.id}>
              <path
                d={state.d}
                fill={fillColor}
                fillOpacity={isHovered || isSelected ? 0.85 : 0.55}
                stroke={isSelected ? "#22d3ee" : isHovered ? "#67e8f9" : "rgba(103, 232, 249, 0.5)"}
                strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 0.8}
                filter={isSelected ? "url(#hover-glow)" : isHovered ? "url(#state-glow)" : undefined}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredState(state.id)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => setSelectedState(isSelected ? null : state.id)}
              />
              {/* State label (only in non-compact or on hover/select) */}
              {(!compact || isHovered || isSelected) && (
                <text
                  x={state.labelX}
                  y={state.labelY}
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                  fill={isHovered || isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.6)"}
                  fontSize={isHovered || isSelected ? "7" : "5.5"}
                  fontWeight={isSelected ? "700" : "500"}
                  fontFamily="system-ui, sans-serif"
                >
                  {(stateClimateData[state.id]?.name ?? state.id).length > 12
                    ? (stateClimateData[state.id]?.name ?? state.id).substring(0, 11) + "…"
                    : (stateClimateData[state.id]?.name ?? state.id)}
                </text>
              )}
              {/* Pulse dot for selected state */}
              {isSelected && (
                <circle cx={state.labelX} cy={state.labelY + 8} r="3" fill="#22d3ee" opacity="0.8">
                  <animate attributeName="r" values="2;5;2" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}

        {/* Title watermark */}
        <text x="310" y="460" textAnchor="middle" fill="rgba(34, 211, 238, 0.3)" fontSize="8" fontFamily="system-ui, sans-serif" fontWeight="600">
          BHARAT CLIMATE DIGITAL TWIN — INTERACTIVE MAP
        </text>
      </svg>

      {/* Selected State Detail Panel */}
      {selectedState && activeStateData && (
        <div className="absolute right-3 top-3 z-20 w-64 rounded-lg border border-cyan-300/25 bg-slate-950/90 p-4 shadow-glow backdrop-blur-xl animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-300" />
              <h3 className="text-sm font-semibold text-white">{activeStateData.name}</h3>
            </div>
            <button
              onClick={() => setSelectedState(null)}
              className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 grid gap-2.5">
            {[
              { label: "Temperature", value: `${activeStateData.temperature}°C`, color: activeStateData.temperature >= 35 ? "#f97316" : "#22d3ee", pct: (activeStateData.temperature / 50) * 100 },
              { label: "Rainfall", value: `${activeStateData.rainfall} mm`, color: "#38bdf8", pct: (activeStateData.rainfall / 350) * 100 },
              { label: "Humidity", value: `${activeStateData.humidity}%`, color: "#34d399", pct: activeStateData.humidity },
              { label: "Air Quality", value: `AQI ${activeStateData.aqi}`, color: activeStateData.aqi >= 100 ? "#f97316" : "#22c55e", pct: (activeStateData.aqi / 200) * 100 },
              { label: "Flood Risk", value: `${activeStateData.floodRisk}%`, color: activeStateData.floodRisk >= 50 ? "#dc2626" : "#eab308", pct: activeStateData.floodRisk },
              { label: "Drought Risk", value: `${activeStateData.droughtRisk}%`, color: activeStateData.droughtRisk >= 40 ? "#dc2626" : "#eab308", pct: activeStateData.droughtRisk },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className="text-slate-400">{metric.label}</span>
                  <span className="font-semibold text-white">{metric.value}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(metric.pct, 100)}%`,
                      backgroundColor: metric.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

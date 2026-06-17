"use client";

import { useCallback, useEffect, useState } from "react";
import { MapPin, X } from "lucide-react";

export interface SelectedPlace {
  id: string;
  name: string;
}

/* ── Simple Mercator projection for India ── */
function projectPoint(
  lon: number,
  lat: number,
  width: number,
  height: number,
  bounds: { minLon: number; maxLon: number; minLat: number; maxLat: number }
): [number, number] {
  const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * width;
  const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * height;
  return [x, y];
}

function coordsToPath(
  coords: number[][],
  width: number,
  height: number,
  bounds: { minLon: number; maxLon: number; minLat: number; maxLat: number }
): string {
  return coords
    .map((c, i) => {
      const [x, y] = projectPoint(c[0], c[1], width, height, bounds);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ") + " Z";
}

function featureToPath(
  feature: GeoJSON.Feature,
  width: number,
  height: number,
  bounds: { minLon: number; maxLon: number; minLat: number; maxLat: number }
): string {
  const geom = feature.geometry;
  if (geom.type === "Polygon") {
    return (geom as GeoJSON.Polygon).coordinates
      .map((ring) => coordsToPath(ring, width, height, bounds))
      .join(" ");
  }
  if (geom.type === "MultiPolygon") {
    return (geom as GeoJSON.MultiPolygon).coordinates
      .flatMap((polygon) =>
        polygon.map((ring) => coordsToPath(ring, width, height, bounds))
      )
      .join(" ");
  }
  return "";
}

function featureCentroid(
  feature: GeoJSON.Feature,
  width: number,
  height: number,
  bounds: { minLon: number; maxLon: number; minLat: number; maxLat: number }
): [number, number] {
  let coords: number[][] = [];
  const geom = feature.geometry;
  if (geom.type === "Polygon") {
    coords = (geom as GeoJSON.Polygon).coordinates[0];
  } else if (geom.type === "MultiPolygon") {
    // Use the largest polygon
    const polys = (geom as GeoJSON.MultiPolygon).coordinates;
    let maxLen = 0;
    for (const poly of polys) {
      if (poly[0].length > maxLen) {
        maxLen = poly[0].length;
        coords = poly[0];
      }
    }
  }
  if (coords.length === 0) return [width / 2, height / 2];

  let sumX = 0,
    sumY = 0;
  for (const c of coords) {
    const [px, py] = projectPoint(c[0], c[1], width, height, bounds);
    sumX += px;
    sumY += py;
  }
  return [sumX / coords.length, sumY / coords.length];
}

/* ── Component ── */
interface IndiaMapModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (place: SelectedPlace) => void;
}

const MAP_W = 500;
const MAP_H = 560;
const BOUNDS = { minLon: 68, maxLon: 98, minLat: 6, maxLat: 37 };

export function IndiaMapModal({ open, onClose, onSelect }: IndiaMapModalProps) {
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || geoData) return;
    setLoading(true);
    fetch("/india_states.geojson")
      .then((r) => r.json())
      .then((data) => {
        setGeoData(data as GeoJSON.FeatureCollection);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [open, geoData]);

  const handleSelect = useCallback(
    (feature: GeoJSON.Feature) => {
      const name =
        (feature.properties as Record<string, string>)?.NAME_1 ??
        (feature.properties as Record<string, string>)?.name ??
        (feature.properties as Record<string, string>)?.ST_NM ??
        "Unknown";
      const id = name.toLowerCase().replace(/\s+/g, "-");
      onSelect({ id, name });
      onClose();
    },
    [onSelect, onClose]
  );

  const getStateName = (feature: GeoJSON.Feature): string => {
    const p = feature.properties as Record<string, string> | null;
    return p?.NAME_1 ?? p?.name ?? p?.ST_NM ?? "Unknown";
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-xl rounded-xl border border-cyan-300/20 bg-[#0a1929] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">Select a State / Region</span>
          </div>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Map body */}
        <div className="relative p-3">
          {loading ? (
            <div className="flex h-[480px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            </div>
          ) : !geoData ? (
            <div className="flex h-[480px] items-center justify-center text-sm text-slate-400">
              Failed to load map data
            </div>
          ) : (
            <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="mx-auto h-[480px] w-full">
              {geoData.features.map((feature, idx) => {
                const name = getStateName(feature);
                const isHovered = hovered === name;
                const pathD = featureToPath(feature, MAP_W, MAP_H, BOUNDS);
                const [cx, cy] = featureCentroid(feature, MAP_W, MAP_H, BOUNDS);

                return (
                  <g
                    key={`${name}-${idx}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHovered(name)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleSelect(feature)}
                  >
                    <path
                      d={pathD}
                      fill={isHovered ? "rgba(34, 211, 238, 0.35)" : "rgba(34, 211, 238, 0.10)"}
                      stroke={isHovered ? "#22d3ee" : "rgba(103, 232, 249, 0.40)"}
                      strokeWidth={isHovered ? 1.5 : 0.6}
                      className="transition-all duration-150"
                    />
                    {/* State name label — show on hover */}
                    {isHovered && (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="600"
                        fontFamily="system-ui, sans-serif"
                        className="pointer-events-none"
                        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
                      >
                        {name}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

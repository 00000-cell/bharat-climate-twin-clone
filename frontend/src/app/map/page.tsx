"use client";

import { useState } from "react";
import { Map, X } from "lucide-react";

import { DigitalTwinMap } from "@/components/climate/DigitalTwinMap";
import type { SelectedPlace } from "@/components/climate/IndiaMapModal";
import { Badge } from "@/components/ui/badge";

export default function MapPage() {
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(null);

  return (
    <div className="grid gap-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <Badge>Full-screen GIS dashboard</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white">Interactive Digital Twin Map</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">
            Toggle temperature, rainfall, NDVI, air quality, soil moisture, reservoirs, flood, and drought overlays.
            Use the locate button (⊕) to pick a state from the India map.
          </p>
        </div>
      </div>

      {/* Selected state banner */}
      {selectedPlace && (
        <div className="flex items-center gap-3 rounded-lg border border-cyan-300/20 bg-cyan-400/8 px-4 py-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
          <Map className="h-4 w-4 text-cyan-300" />
          <p className="text-sm text-white">
            Selected: <span className="font-semibold text-cyan-200">{selectedPlace.name}</span>
          </p>
          <button
            onClick={() => setSelectedPlace(null)}
            className="ml-auto grid h-6 w-6 place-items-center rounded-full bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <DigitalTwinMap onPlaceSelect={setSelectedPlace} />
    </div>
  );
}

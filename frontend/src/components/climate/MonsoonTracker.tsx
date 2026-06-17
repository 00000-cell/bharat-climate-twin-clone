"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CloudRain, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Monsoon progression data (approximate historical advance dates) ── */
const monsoonStages = [
  {
    month: "May 25 – Jun 1",
    label: "Onset — Kerala",
    description: "Southwest monsoon arrives at Kerala coast. Arabian Sea branch begins.",
    statesReached: ["Kerala", "Lakshadweep", "Andaman and Nicobar"],
    coveragePct: 5,
    rainfallIntensity: "Moderate",
  },
  {
    month: "Jun 1 – Jun 10",
    label: "Advance — Southwest Coast",
    description: "Monsoon covers Karnataka, Goa, and parts of Maharashtra. Northeast also receives early rains.",
    statesReached: ["Kerala", "Lakshadweep", "Karnataka", "Goa", "Andaman and Nicobar", "Mizoram", "Tripura", "Nagaland", "Manipur"],
    coveragePct: 18,
    rainfallIntensity: "Moderate-Heavy",
  },
  {
    month: "Jun 10 – Jun 20",
    label: "Advance — Western & Northeast",
    description: "Covers entire western coast, central India begins receiving rainfall. Assam and NE India fully covered.",
    statesReached: ["Kerala", "Lakshadweep", "Karnataka", "Goa", "Maharashtra", "Andaman and Nicobar", "Mizoram", "Tripura", "Nagaland", "Manipur", "Meghalaya", "Assam", "Arunachal Pradesh", "Sikkim", "West Bengal", "Tamil Nadu", "Andhra Pradesh", "Chhattisgarh", "Orissa"],
    coveragePct: 40,
    rainfallIntensity: "Heavy",
  },
  {
    month: "Jun 20 – Jul 1",
    label: "Advance — Central India",
    description: "Monsoon covers Maharashtra, Madhya Pradesh, and moves into the Gangetic plains. Most of southern and eastern India covered.",
    statesReached: ["Kerala", "Lakshadweep", "Karnataka", "Goa", "Maharashtra", "Andaman and Nicobar", "Mizoram", "Tripura", "Nagaland", "Manipur", "Meghalaya", "Assam", "Arunachal Pradesh", "Sikkim", "West Bengal", "Tamil Nadu", "Andhra Pradesh", "Telangana", "Chhattisgarh", "Orissa", "Jharkhand", "Bihar", "Madhya Pradesh", "Gujarat", "Dadra and Nagar Haveli", "Daman and Diu"],
    coveragePct: 60,
    rainfallIntensity: "Heavy",
  },
  {
    month: "Jul 1 – Jul 15",
    label: "Full Coverage — North India",
    description: "Monsoon reaches UP, Rajasthan, Punjab, Haryana. Entire country receives rainfall.",
    statesReached: ["Kerala", "Lakshadweep", "Karnataka", "Goa", "Maharashtra", "Andaman and Nicobar", "Mizoram", "Tripura", "Nagaland", "Manipur", "Meghalaya", "Assam", "Arunachal Pradesh", "Sikkim", "West Bengal", "Tamil Nadu", "Andhra Pradesh", "Telangana", "Chhattisgarh", "Orissa", "Jharkhand", "Bihar", "Madhya Pradesh", "Gujarat", "Dadra and Nagar Haveli", "Daman and Diu", "Uttar Pradesh", "Uttaranchal", "Rajasthan", "Punjab", "Haryana", "Delhi", "Chandigarh", "Himachal Pradesh", "Jammu and Kashmir", "Puducherry"],
    coveragePct: 100,
    rainfallIntensity: "Heavy-Extreme",
  },
  {
    month: "Jul 15 – Sep 1",
    label: "Peak Monsoon",
    description: "Full monsoon activity across India. Maximum rainfall, flood risks peak in Assam, Bihar, UP, and coastal regions.",
    statesReached: ["Kerala", "Lakshadweep", "Karnataka", "Goa", "Maharashtra", "Andaman and Nicobar", "Mizoram", "Tripura", "Nagaland", "Manipur", "Meghalaya", "Assam", "Arunachal Pradesh", "Sikkim", "West Bengal", "Tamil Nadu", "Andhra Pradesh", "Telangana", "Chhattisgarh", "Orissa", "Jharkhand", "Bihar", "Madhya Pradesh", "Gujarat", "Dadra and Nagar Haveli", "Daman and Diu", "Uttar Pradesh", "Uttaranchal", "Rajasthan", "Punjab", "Haryana", "Delhi", "Chandigarh", "Himachal Pradesh", "Jammu and Kashmir", "Puducherry"],
    coveragePct: 100,
    rainfallIntensity: "Extreme",
  },
  {
    month: "Sep 1 – Oct 1",
    label: "Withdrawal — Northwest",
    description: "Monsoon begins retreating from Rajasthan and northwest India. Northeast monsoon season starts for Tamil Nadu.",
    statesReached: ["Kerala", "Karnataka", "Goa", "Maharashtra", "Andaman and Nicobar", "Mizoram", "Tripura", "Nagaland", "Manipur", "Meghalaya", "Assam", "Arunachal Pradesh", "Sikkim", "West Bengal", "Tamil Nadu", "Andhra Pradesh", "Telangana", "Chhattisgarh", "Orissa", "Jharkhand", "Bihar", "Madhya Pradesh", "Gujarat", "Uttar Pradesh", "Uttaranchal"],
    coveragePct: 65,
    rainfallIntensity: "Moderate",
  },
  {
    month: "Oct 1 – Oct 15",
    label: "Withdrawal — Complete",
    description: "Southwest monsoon fully withdraws from India. Post-monsoon cyclone season begins in Bay of Bengal.",
    statesReached: ["Tamil Nadu", "Andhra Pradesh", "Kerala", "Puducherry", "Andaman and Nicobar"],
    coveragePct: 12,
    rainfallIntensity: "Light-Moderate",
  },
];

const intensityColor: Record<string, string> = {
  "Light-Moderate": "#93c5fd",
  "Moderate": "#38bdf8",
  "Moderate-Heavy": "#0ea5e9",
  "Heavy": "#2563eb",
  "Heavy-Extreme": "#7c3aed",
  "Extreme": "#dc2626",
};

export function MonsoonTracker() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => {
        if (prev >= monsoonStages.length - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [playing]);

  const stage = monsoonStages[activeIdx];
  const iColor = intensityColor[stage.rainfallIntensity] ?? "#38bdf8";

  const togglePlay = useCallback(() => {
    if (activeIdx >= monsoonStages.length - 1) {
      setActiveIdx(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  }, [activeIdx]);

  return (
    <div className="grid gap-4">
      {/* Timeline */}
      <div className="flex items-center gap-2">
        <Button size="icon" variant="outline" onClick={togglePlay} className="h-8 w-8 shrink-0">
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </Button>
        <div className="flex flex-1 items-center gap-0.5">
          {monsoonStages.map((s, i) => (
            <button
              key={i}
              onClick={() => { setActiveIdx(i); setPlaying(false); }}
              className="group relative flex-1"
              title={s.month}
            >
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  background: i <= activeIdx
                    ? (intensityColor[s.rainfallIntensity] ?? "#38bdf8")
                    : "rgba(255,255,255,0.08)",
                }}
              />
              {i === activeIdx && (
                <div
                  className="absolute -top-1 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white shadow-lg"
                  style={{ background: intensityColor[s.rainfallIntensity] ?? "#38bdf8" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stage info */}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <div className="flex items-center gap-2">
            <CloudRain className="h-4 w-4" style={{ color: iColor }} />
            <span className="text-xs text-slate-400">{stage.month}</span>
          </div>
          <h4 className="mt-1 text-sm font-semibold text-white">{stage.label}</h4>
          <p className="mt-1 text-xs leading-5 text-slate-300">{stage.description}</p>
        </div>
        <div className="flex gap-3 sm:flex-col sm:items-end sm:gap-1.5">
          <div className="rounded-md border border-cyan-300/15 bg-cyan-400/8 px-2.5 py-1 text-center">
            <p className="text-lg font-bold text-white">{stage.coveragePct}%</p>
            <p className="text-[9px] text-slate-400">Coverage</p>
          </div>
          <div className="rounded-md border px-2.5 py-1 text-center" style={{ borderColor: `${iColor}40`, background: `${iColor}12` }}>
            <p className="text-xs font-semibold" style={{ color: iColor }}>{stage.rainfallIntensity}</p>
            <p className="text-[9px] text-slate-400">Intensity</p>
          </div>
        </div>
      </div>

      {/* State tags */}
      <div className="flex flex-wrap gap-1">
        {stage.statesReached.slice(0, 12).map((s) => (
          <span key={s} className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] text-cyan-200 border border-cyan-300/15">
            {s}
          </span>
        ))}
        {stage.statesReached.length > 12 && (
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
            +{stage.statesReached.length - 12} more
          </span>
        )}
      </div>
    </div>
  );
}

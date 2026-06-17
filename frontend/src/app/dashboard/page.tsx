"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CloudRain,
  Droplets,
  Flame,
  Gauge,
  Map,
  RadioTower,
  X,
} from "lucide-react";

import { DigitalTwinMap } from "@/components/climate/DigitalTwinMap";
import type { SelectedPlace } from "@/components/climate/IndiaMapModal";
import { MetricCard } from "@/components/climate/MetricCard";
import { MonsoonTracker } from "@/components/climate/MonsoonTracker";
import { RankingBarChart, TrendAreaChart } from "@/components/climate/Charts";
import { Badge } from "@/components/ui/badge";
import { MetricCardSkeleton, ChartSkeleton, AlertSkeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { Analytics, ClimateAlert, Ranking } from "@/lib/types";

/* Mock state-level climate data used when a state is selected */
const stateClimate: Record<string, { temp: number; rain: number; reservoir: number; aqi: number }> = {
  "andhra-pradesh": { temp: 35, rain: 80, reservoir: 58, aqi: 78 },
  "arunachal-pradesh": { temp: 18, rain: 250, reservoir: 82, aqi: 25 },
  "assam": { temp: 28, rain: 220, reservoir: 75, aqi: 45 },
  "bihar": { temp: 34, rain: 110, reservoir: 52, aqi: 130 },
  "chhattisgarh": { temp: 33, rain: 100, reservoir: 62, aqi: 75 },
  "goa": { temp: 30, rain: 250, reservoir: 78, aqi: 42 },
  "gujarat": { temp: 38, rain: 45, reservoir: 40, aqi: 100 },
  "haryana": { temp: 36, rain: 30, reservoir: 48, aqi: 145 },
  "himachal-pradesh": { temp: 22, rain: 120, reservoir: 72, aqi: 52 },
  "jharkhand": { temp: 33, rain: 95, reservoir: 55, aqi: 105 },
  "karnataka": { temp: 32, rain: 90, reservoir: 54, aqi: 70 },
  "kerala": { temp: 30, rain: 280, reservoir: 85, aqi: 38 },
  "madhya-pradesh": { temp: 37, rain: 70, reservoir: 45, aqi: 90 },
  "maharashtra": { temp: 34, rain: 110, reservoir: 50, aqi: 115 },
  "manipur": { temp: 24, rain: 170, reservoir: 68, aqi: 35 },
  "meghalaya": { temp: 20, rain: 300, reservoir: 80, aqi: 30 },
  "mizoram": { temp: 24, rain: 190, reservoir: 72, aqi: 28 },
  "nagaland": { temp: 22, rain: 180, reservoir: 70, aqi: 32 },
  "orissa": { temp: 34, rain: 130, reservoir: 58, aqi: 80 },
  "punjab": { temp: 34, rain: 40, reservoir: 55, aqi: 120 },
  "rajasthan": { temp: 42, rain: 15, reservoir: 25, aqi: 95 },
  "sikkim": { temp: 16, rain: 200, reservoir: 88, aqi: 30 },
  "tamil-nadu": { temp: 33, rain: 60, reservoir: 42, aqi: 65 },
  "telangana": { temp: 36, rain: 75, reservoir: 48, aqi: 95 },
  "tripura": { temp: 28, rain: 160, reservoir: 65, aqi: 40 },
  "uttar-pradesh": { temp: 36, rain: 65, reservoir: 50, aqi: 155 },
  "uttaranchal": { temp: 20, rain: 180, reservoir: 78, aqi: 58 },
  "west-bengal": { temp: 32, rain: 140, reservoir: 60, aqi: 110 },
  "delhi": { temp: 38, rain: 25, reservoir: 35, aqi: 180 },
  "jammu-and-kashmir": { temp: 18, rain: 55, reservoir: 70, aqi: 45 },
  "chandigarh": { temp: 35, rain: 50, reservoir: 52, aqi: 110 },
  "puducherry": { temp: 32, rain: 70, reservoir: 60, aqi: 55 },
  "andaman-and-nicobar": { temp: 28, rain: 300, reservoir: 90, aqi: 22 },
  "lakshadweep": { temp: 28, rain: 180, reservoir: 85, aqi: 18 },
  "dadra-and-nagar-haveli": { temp: 33, rain: 110, reservoir: 55, aqi: 68 },
  "daman-and-diu": { temp: 32, rain: 95, reservoir: 52, aqi: 72 },
};

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [alerts, setAlerts] = useState<ClimateAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.analytics(), api.rankings(8), api.alerts()])
      .then(([analyticsResponse, rankingResponse, alertResponse]) => {
        setAnalytics(analyticsResponse);
        setRankings(rankingResponse);
        setAlerts(alertResponse);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const summary = analytics?.summary;
  const chartData = analytics?.national_trends ?? [];

  /* If a state is selected from the map, use state-level data */
  const stateData = selectedPlace ? stateClimate[selectedPlace.id] : null;
  const displayTemp = stateData?.temp ?? summary?.avg_temperature_c ?? "--";
  const displayRain = stateData?.rain ?? summary?.avg_rainfall_mm ?? "--";
  const displayReservoir = stateData?.reservoir ?? summary?.avg_reservoir_level_pct ?? "--";
  const displayAqi = stateData?.aqi ?? summary?.avg_aqi ?? "--";

  return (
    <div className="grid gap-5">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <Badge>National command dashboard</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white">Climate Operations Overview</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">
            Live mock feeds, district vulnerability rankings, disaster forecast summaries, and command actions.
          </p>
        </div>
        <div className="rounded-md border border-emerald-300/25 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
          {summary?.districts_monitored ?? 0} districts monitored
        </div>
      </div>

      {/* Selected state banner */}
      {selectedPlace && (
        <div className="flex items-center gap-3 rounded-lg border border-cyan-300/20 bg-cyan-400/8 px-4 py-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
          <Map className="h-4 w-4 text-cyan-300" />
          <p className="text-sm text-white">
            Showing data for <span className="font-semibold text-cyan-200">{selectedPlace.name}</span>
          </p>
          <button
            onClick={() => setSelectedPlace(null)}
            className="ml-auto grid h-6 w-6 place-items-center rounded-full bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Metric Cards */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title={selectedPlace ? `${selectedPlace.name} Temp` : "National Temperature"}
            value={`${displayTemp} °C`}
            detail={selectedPlace ? "State average" : "Latest monthly average"}
            icon={Flame}
            tone="red"
          />
          <MetricCard
            title={selectedPlace ? `${selectedPlace.name} Rainfall` : "Rainfall"}
            value={`${displayRain} mm`}
            detail={selectedPlace ? "State average" : "Observed district mean"}
            icon={CloudRain}
            tone="cyan"
          />
          <MetricCard
            title={selectedPlace ? "State Reservoir" : "Reservoir Status"}
            value={`${displayReservoir}%`}
            detail={selectedPlace ? "State aggregate" : "India-WRIS mock aggregate"}
            icon={Droplets}
            tone="emerald"
          />
          <MetricCard
            title={selectedPlace ? `${selectedPlace.name} AQI` : "Air Quality"}
            value={`${displayAqi} AQI`}
            detail={selectedPlace ? "State average" : "CPCB mock average"}
            icon={RadioTower}
            tone="amber"
          />
        </div>
      )}

      {/* Map + Alerts */}
      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>Digital Twin Snapshot</CardTitle>
            <CardDescription>
              Click the locate button (⊕) to select a state and filter dashboard data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DigitalTwinMap compact onPlaceSelect={setSelectedPlace} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-time Alerts</CardTitle>
            <CardDescription>District warnings for emergency operation centers.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {loading ? (
              <>
                <AlertSkeleton />
                <AlertSkeleton />
                <AlertSkeleton />
              </>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="rounded-md border border-cyan-300/15 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Badge tone={alert.severity}>{alert.severity}</Badge>
                    <AlertTriangle className="h-4 w-4 text-amber-200" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-white">{alert.title}</h3>
                  <p className="mt-1 text-xs text-cyan-100">
                    {alert.district}, {alert.state}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{alert.message}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monsoon Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-blue-400" />
            Monsoon Progression Tracker
          </CardTitle>
          <CardDescription>
            Animated timeline of India&apos;s southwest monsoon from onset to withdrawal. Press play or click a stage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MonsoonTracker />
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-5 xl:grid-cols-2">
        {loading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Rainfall Trend</CardTitle>
                <CardDescription>National district average, latest 36 observations.</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendAreaChart data={chartData} dataKey="rainfall_mm" color="#38bdf8" unit=" mm" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Vulnerability Leaderboard</CardTitle>
                <CardDescription>District-wise composite climate risk ranking.</CardDescription>
              </CardHeader>
              <CardContent>
                <RankingBarChart data={rankings.map((row) => ({ district: row.district_name, risk: row.composite_risk }))} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

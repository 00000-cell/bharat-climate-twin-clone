"use client";

import { useEffect, useState } from "react";
import { CloudRain, Droplets, Flame, RadioTower, Sprout, Sun, Waves } from "lucide-react";

import { TrendAreaChart } from "@/components/climate/Charts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { Analytics } from "@/lib/types";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    api.analytics().then(setAnalytics).catch(() => undefined);
  }, []);

  const data = analytics?.national_trends ?? [];
  const summary = analytics?.summary;

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div>
        <Badge>Climate Analytics Dashboard</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white">
          National Climate Analytics
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Trends for temperature, rainfall, reservoir storage, air quality, and disaster forecast
          readiness with district-level aggregate telemetry.
        </p>
      </div>

      {/* Glow Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="group relative overflow-hidden">
          <div className="absolute right-0 top-0 p-3 opacity-10 transition-opacity group-hover:opacity-20">
            <Flame className="h-12 w-12 text-rose-400" />
          </div>
          <CardHeader className="pb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Temperature</span>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-bold text-rose-400" style={{ textShadow: "0 0 10px rgba(248,113,113,0.5)" }}>
              {summary?.avg_temperature_c ?? "--"}°C
            </h2>
            <p className="mt-1 text-xs text-slate-400">Latest national average</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden">
          <div className="absolute right-0 top-0 p-3 opacity-10 transition-opacity group-hover:opacity-20">
            <CloudRain className="h-12 w-12 text-cyan-400" />
          </div>
          <CardHeader className="pb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Rainfall</span>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-bold text-cyan-400" style={{ textShadow: "0 0 10px rgba(6,182,212,0.5)" }}>
              {summary?.avg_rainfall_mm ?? "--"} mm
            </h2>
            <p className="mt-1 text-xs text-slate-400">Latest national average</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden">
          <div className="absolute right-0 top-0 p-3 opacity-10 transition-opacity group-hover:opacity-20">
            <Droplets className="h-12 w-12 text-emerald-400" />
          </div>
          <CardHeader className="pb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Reservoir</span>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-bold text-emerald-400" style={{ textShadow: "0 0 10px rgba(16,185,129,0.5)" }}>
              {summary?.avg_reservoir_level_pct ?? "--"}%
            </h2>
            <p className="mt-1 text-xs text-slate-400">Current storage status</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden">
          <div className="absolute right-0 top-0 p-3 opacity-10 transition-opacity group-hover:opacity-20">
            <RadioTower className="h-12 w-12 text-amber-400" />
          </div>
          <CardHeader className="pb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">AQI</span>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-bold text-amber-400" style={{ textShadow: "0 0 10px rgba(251,191,36,0.5)" }}>
              {summary?.avg_aqi ?? "--"}
            </h2>
            <p className="mt-1 text-xs text-slate-400">Air quality index</p>
          </CardContent>
        </Card>
      </div>

      {/* 2×2 Chart Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>National Temperature Trends</CardTitle>
                <CardDescription>Monthly district average, latest 36 points.</CardDescription>
              </div>
              <Flame className="h-5 w-5 text-rose-400" />
            </div>
          </CardHeader>
          <CardContent>
            <TrendAreaChart data={data} dataKey="temperature_c" color="#f87171" unit="°C" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Rainfall Trends</CardTitle>
                <CardDescription>IMD-style precipitation aggregate (mm).</CardDescription>
              </div>
              <CloudRain className="h-5 w-5 text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <TrendAreaChart data={data} dataKey="rainfall_mm" color="#22d3ee" unit=" mm" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Reservoir Status</CardTitle>
                <CardDescription>India-WRIS compatible storage feed (%).</CardDescription>
              </div>
              <Droplets className="h-5 w-5 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <TrendAreaChart data={data} dataKey="reservoir_level_pct" color="#10b981" unit="%" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Air Quality Index</CardTitle>
                <CardDescription>CPCB-style district AQI aggregate.</CardDescription>
              </div>
              <RadioTower className="h-5 w-5 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <TrendAreaChart data={data} dataKey="aqi" color="#fbbf24" />
          </CardContent>
        </Card>
      </div>

      {/* Disaster Forecast Summary */}
      <Card className="scanline relative">
        <CardHeader className="border-b border-cyan-400/10 pb-4">
          <CardTitle className="text-xl">Disaster Forecast Summary</CardTitle>
          <CardDescription>
            Model facades prepared for AI integration and scikit-learn pipelines.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6 md:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-slate-900/40 p-6 transition-all hover:border-cyan-400/20">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                <Waves className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-white">Flood Forecast</h4>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              Analyzing rainfall patterns, river levels, and soil saturation for early inundation warnings.
            </p>
            <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              RandomForestFlood-v1
            </span>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-900/40 p-6 transition-all hover:border-emerald-400/20">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                <Sprout className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-white">Drought Forecast</h4>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              Predictive modeling of rainfall deficit, heat anomalies, and vegetation health conditions.
            </p>
            <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              XGBoostDrought-v1
            </span>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-900/40 p-6 transition-all hover:border-rose-400/20">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-rose-400/20 bg-rose-400/10 text-rose-400">
                <Sun className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-white">Heatwave Forecast</h4>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              Trend analysis for extreme temperature events and atmospheric humidity stress levels.
            </p>
            <span className="inline-flex items-center rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-300">
              SklearnHeatAlert-v1
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

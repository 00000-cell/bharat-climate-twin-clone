"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { ClimateAlert } from "@/lib/types";
import { AlertTriangle, BellRing, ShieldAlert, Send, MapPin, Clock } from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<ClimateAlert[]>([]);

  useEffect(() => {
    api.alerts().then(setAlerts).catch(() => undefined);
  }, []);

  const getSeverityStyle = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "CRITICAL":
        return "border-rose-500/30 bg-rose-500/10 text-rose-300";
      case "HIGH":
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
      case "MEDIUM":
        return "border-cyan-500/30 bg-cyan-400/10 text-cyan-200";
      default:
        return "border-emerald-500/30 bg-emerald-400/10 text-emerald-200";
    }
  };

  const getSeverityAccent = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "CRITICAL":
        return "border-l-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.15)]";
      case "HIGH":
        return "border-l-amber-500";
      default:
        return "border-l-cyan-500";
    }
  };

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-sm font-medium text-rose-300 backdrop-blur-sm">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            {alerts.length} Active Alert{alerts.length !== 1 ? "s" : ""}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white">Climate Alert Command</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">
            Centralized monitoring and early warning dispatch for national climate hazards.
            Prioritized by severity and district vulnerability.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="glass-panel flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800">
            <ShieldAlert className="h-4 w-4 text-cyan-400" />
            Filter Hazards
          </button>
          <button className="glass-panel flex items-center gap-2 rounded-lg border-rose-500/20 px-4 py-2 text-sm font-medium text-rose-300 transition hover:bg-slate-800">
            <AlertTriangle className="h-4 w-4" />
            Critical Only
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Alerts List */}
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className={`relative overflow-hidden border-l-4 transition duration-300 hover:border-cyan-400/30 ${getSeverityAccent(alert.severity)}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`grid h-12 w-12 place-items-center rounded-lg border ${
                      alert.severity === "CRITICAL" || alert.severity === "critical"
                        ? "border-rose-500/20 bg-rose-500/10 text-rose-500"
                        : alert.severity === "HIGH" || alert.severity === "high"
                        ? "border-amber-500/20 bg-amber-500/10 text-amber-500"
                        : "border-cyan-500/20 bg-cyan-500/10 text-cyan-500"
                    }`}>
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        {alert.alert_type}
                      </span>
                      <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest ${getSeverityStyle(alert.severity)}`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="rounded-xl border border-white/5 bg-slate-900/40 p-3">
                    <span className="text-[10px] font-medium uppercase tracking-tight text-slate-500">District</span>
                    <p className="text-sm font-semibold text-white">{alert.district}, {alert.state}</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-slate-900/40 p-3">
                    <span className="text-[10px] font-medium uppercase tracking-tight text-slate-500">Type</span>
                    <p className="text-sm font-semibold text-white">{alert.alert_type}</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-slate-900/40 p-3">
                    <span className="text-[10px] font-medium uppercase tracking-tight text-slate-500">Issued</span>
                    <p className="text-sm font-semibold text-white">{alert.issued_at}</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-slate-900/40 p-3">
                    <span className="text-[10px] font-medium uppercase tracking-tight text-slate-500">Severity</span>
                    <p className={`text-sm font-semibold ${
                      alert.severity === "CRITICAL" || alert.severity === "critical" ? "text-rose-400" : "text-amber-400"
                    }`}>{alert.severity}</p>
                  </div>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-slate-300">
                  {alert.message}
                </p>
                <div className="flex gap-3">
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-500 py-2.5 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition hover:bg-cyan-600">
                    <Send className="h-3.5 w-3.5" />
                    Dispatch Response Team
                  </button>
                  <button className="rounded-lg border border-slate-700 bg-slate-900/50 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
                    Acknowledge &amp; Mute
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar: Distribution & Guidelines */}
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hazard Exposure Breakdown</CardTitle>
              <CardDescription>Regional alert metrics categorized by severity layers.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between rounded bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-300">
                <span className="font-semibold">Critical Active Alerts</span>
                <span className="text-lg font-bold">
                  {alerts.filter((a) => a.severity.toUpperCase() === "CRITICAL").length}
                </span>
              </div>
              <div className="flex items-center justify-between rounded bg-amber-500/10 border border-amber-500/20 p-3 text-sm text-amber-300">
                <span className="font-semibold">High Active Alerts</span>
                <span className="text-lg font-bold">
                  {alerts.filter((a) => a.severity.toUpperCase() === "HIGH").length}
                </span>
              </div>
              <div className="flex items-center justify-between rounded bg-cyan-500/10 border border-cyan-500/20 p-3 text-sm text-cyan-200">
                <span className="font-semibold">Moderate Active Alerts</span>
                <span className="text-lg font-bold">
                  {alerts.filter((a) => !["CRITICAL", "HIGH"].includes(a.severity.toUpperCase())).length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="scanline relative">
            <CardHeader>
              <CardTitle>Operations Standard Guidelines</CardTitle>
              <CardDescription>Emergency workflow protocol for active warning centers.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-xs leading-relaxed text-slate-400">
              <p>
                <strong className="mb-1 block text-white">1. Level CRITICAL Warnings</strong>
                Evacuation procedures and emergency services must be mobilized within 3 hours.
                Local broadcast systems active.
              </p>
              <p>
                <strong className="mb-1 block text-white">2. Level HIGH Warnings</strong>
                EOC managers must prepare mitigation strategies and alert local regional commands
                for quick deployment.
              </p>
              <p>
                <strong className="mb-1 block text-white">3. Monitoring Level</strong>
                Continuous observation via satellite feeds. Status reports every 6 hours
                to central command.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

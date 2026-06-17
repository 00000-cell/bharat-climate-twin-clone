"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  CloudRain,
  DatabaseZap,
  Droplets,
  Gauge,
  Globe,
  Layers,
  Map,
  Satellite,
  ShieldAlert,
  Thermometer,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ── Data ── */
const capabilities = [
  { title: "Satellite + Weather Fusion", icon: Satellite, detail: "INSAT, Bhuvan, IMD, India-WRIS, and CPCB multi-source data fusion.", color: "#22d3ee" },
  { title: "District Risk Engine", icon: Gauge, detail: "Flood, drought, heatwave, and water-stress composite risk scoring.", color: "#34d399" },
  { title: "Scenario Simulator", icon: Activity, detail: "What-if analysis for rainfall, temperature, and reservoir changes.", color: "#fbbf24" },
  { title: "AI Climate Copilot", icon: DatabaseZap, detail: "Natural language queries with chart responses and interventions.", color: "#a78bfa" },
];

const stats = [
  { label: "States Monitored", value: "28+", icon: Map },
  { label: "Data Sources", value: "6", icon: Layers },
  { label: "Risk Parameters", value: "9", icon: BarChart3 },
  { label: "Update Frequency", value: "Real-time", icon: Zap },
];

const dataSources = [
  { name: "INSAT Satellite", type: "LST, SST, Rainfall", org: "ISRO/MOSDAC" },
  { name: "IMD Ground Stations", type: "Gridded Rainfall & Temperature", org: "India Met Dept" },
  { name: "Bhuvan Geoportal", type: "Land Use, NDVI", org: "NRSC/ISRO" },
  { name: "India-WRIS", type: "Reservoir & Water Bodies", org: "CWC" },
  { name: "CPCB Monitoring", type: "Air Quality Index", org: "MoEFCC" },
  { name: "Soil Moisture Grid", type: "Agricultural Drought", org: "ICAR" },
];

/* ── Component ── */
export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.15 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Parallax Earth background */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0003})` }}
        >
          <Image
            src="/images/bharat-climate-hero.png"
            alt="Satellite digital twin of India with climate overlays"
            fill
            priority
            className="object-cover"
            quality={90}
          />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950" />

        {/* Floating data particles (deterministic to avoid hydration mismatch) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { w: 3, l: 15, t: 12, o: 0.2, d: 10, dl: 0 },
            { w: 4, l: 72, t: 25, o: 0.3, d: 14, dl: 2 },
            { w: 2, l: 30, t: 55, o: 0.18, d: 9, dl: 4 },
            { w: 3, l: 85, t: 18, o: 0.25, d: 16, dl: 1 },
            { w: 5, l: 50, t: 70, o: 0.15, d: 11, dl: 6 },
            { w: 2, l: 22, t: 82, o: 0.22, d: 18, dl: 3 },
            { w: 4, l: 65, t: 40, o: 0.28, d: 12, dl: 5 },
            { w: 3, l: 40, t: 30, o: 0.2, d: 15, dl: 7 },
            { w: 2, l: 78, t: 65, o: 0.35, d: 10, dl: 2 },
            { w: 4, l: 18, t: 45, o: 0.17, d: 13, dl: 4 },
            { w: 3, l: 55, t: 15, o: 0.22, d: 17, dl: 1 },
            { w: 2, l: 88, t: 50, o: 0.3, d: 9, dl: 6 },
            { w: 5, l: 35, t: 78, o: 0.2, d: 14, dl: 3 },
            { w: 3, l: 60, t: 85, o: 0.25, d: 11, dl: 5 },
            { w: 2, l: 45, t: 22, o: 0.18, d: 19, dl: 7 },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-cyan-400"
              style={{
                width: `${p.w}px`,
                height: `${p.w}px`,
                left: `${p.l}%`,
                top: `${p.t}%`,
                opacity: p.o,
                animation: `float ${p.d}s ease-in-out infinite`,
                animationDelay: `${p.dl}s`,
              }}
            />
          ))}
        </div>

        {/* Hero content */}
        <div
          className="relative z-10 flex min-h-screen items-center px-5 py-24 sm:px-8 lg:px-16"
          style={{ opacity: Math.max(0, 1 - scrollY / 600), transform: `translateY(${scrollY * 0.15}px)` }}
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 backdrop-blur-xl">
              <Globe className="h-4 w-4 animate-spin" style={{ animationDuration: "8s" }} />
              AI-Powered National Climate Intelligence
            </div>
            <h1 className="mt-8 max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl">
              Bharat
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Climate Twin
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              A high-fidelity digital replica of India&apos;s climate system — fusing satellite, ground station,
              and AI data for real-time monitoring, prediction, and scenario simulation.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="default" className="group gap-2 px-6 py-3 text-base">
                <Link href="/dashboard">
                  Open Command Center
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2 px-6 py-3 text-base backdrop-blur">
                <Link href="/map">
                  <Map className="h-4 w-4" />
                  Launch Digital Twin Map
                </Link>
              </Button>
            </div>

            {/* Mini stat pills */}
            <div className="mt-12 flex flex-wrap gap-3">
              {["ISRO Data", "IMD Feeds", "Real-time AI", "28+ States"].map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400 backdrop-blur">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2" style={{ opacity: Math.max(0, 1 - scrollY / 200) }}>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-slate-500">Scroll to explore</span>
            <div className="h-8 w-5 rounded-full border border-slate-500/40 p-1">
              <div className="h-2 w-full animate-bounce rounded-full bg-cyan-400/60" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section
        id="stats"
        ref={(el) => { sectionRefs.current["stats"] = el; }}
        className="relative z-20 border-y border-cyan-300/10 bg-slate-950/80 backdrop-blur-xl"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-0 md:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`flex items-center gap-4 px-6 py-8 transition-all duration-700 ${
                  isVisible("stats") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                } ${i < 3 ? "border-r border-cyan-300/10" : ""}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <Icon className="h-6 w-6 text-cyan-400 shrink-0" />
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ CAPABILITIES ═══ */}
      <section
        id="capabilities"
        ref={(el) => { sectionRefs.current["capabilities"] = el; }}
        className="px-5 py-20 sm:px-8 lg:px-16"
      >
        <div className="mx-auto max-w-6xl">
          <div className={`transition-all duration-700 ${isVisible("capabilities") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Core Capabilities</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              End-to-end climate intelligence
            </h2>
            <p className="mt-3 max-w-2xl text-slate-400">
              From satellite ingestion to actionable district-level insights, every layer is designed for operational decision-making.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {capabilities.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`group rounded-xl border border-cyan-300/10 bg-slate-950/50 p-6 backdrop-blur transition-all duration-700 hover:border-cyan-300/25 hover:bg-white/[0.04] hover:shadow-glow ${
                    isVisible("capabilities") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${200 + i * 100}ms` }}
                >
                  <div
                    className="grid h-12 w-12 place-items-center rounded-lg border transition-colors duration-300"
                    style={{ borderColor: `${item.color}40`, background: `${item.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CLIMATE RISKS ═══ */}
      <section
        id="risks"
        ref={(el) => { sectionRefs.current["risks"] = el; }}
        className="px-5 py-20 sm:px-8 lg:px-16"
      >
        <div className="mx-auto max-w-6xl">
          <div className={`transition-all duration-700 ${isVisible("risks") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">Climate Risk Domains</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Multi-hazard monitoring
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              { title: "Flood Risk", detail: "Brahmaputra, coastal, and urban drainage exposure. Real-time river level monitoring and AI-based inundation forecasting.", icon: Droplets, color: "#38bdf8" },
              { title: "Drought Watch", detail: "Rainfall deficit tracking, vegetation health (NDVI), soil moisture, and reservoir drawdown analysis.", icon: Thermometer, color: "#fbbf24" },
              { title: "Heatwave & AQI", detail: "Temperature anomaly detection, heat stress mapping, and air quality monitoring across 200+ CPCB stations.", icon: CloudRain, color: "#f87171" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition-all duration-700 hover:border-white/10 ${
                    isVisible("risks") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${200 + i * 150}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" style={{ color: item.color }} />
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.detail}</p>
                  <div className="mt-4 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: isVisible("risks") ? "100%" : "0%",
                        background: item.color,
                        transitionDelay: `${500 + i * 200}ms`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ DATA SOURCES ═══ */}
      <section
        id="datasources"
        ref={(el) => { sectionRefs.current["datasources"] = el; }}
        className="px-5 py-20 sm:px-8 lg:px-16"
      >
        <div className="mx-auto max-w-6xl">
          <div className={`transition-all duration-700 ${isVisible("datasources") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">National Data Integration</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Indigenous data sources
            </h2>
            <p className="mt-3 max-w-2xl text-slate-400">
              Built on India&apos;s own satellite, meteorological, and environmental monitoring infrastructure.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dataSources.map((src, i) => (
              <div
                key={src.name}
                className={`flex items-start gap-4 rounded-lg border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition-all duration-500 ${
                  isVisible("datasources") ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <Satellite className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <div>
                  <p className="text-sm font-semibold text-white">{src.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{src.type}</p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-cyan-400/70">{src.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section
        id="cta"
        ref={(el) => { sectionRefs.current["cta"] = el; }}
        className="px-5 py-24 sm:px-8 lg:px-16"
      >
        <div
          className={`mx-auto max-w-4xl rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-cyan-950/40 via-slate-950/60 to-emerald-950/30 p-10 text-center backdrop-blur transition-all duration-700 sm:p-14 ${
            isVisible("cta") ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <Bot className="mx-auto h-10 w-10 text-cyan-400" />
          <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
            Ready to explore India&apos;s climate data?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Access the command center, run what-if simulations, or ask the AI copilot about any district&apos;s climate risk.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="default" className="group gap-2 px-8 py-3 text-base">
              <Link href="/dashboard">
                Enter Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2 px-8 py-3 text-base">
              <Link href="/copilot">
                <Bot className="h-4 w-4" />
                Talk to AI Copilot
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/[0.06] px-5 py-8 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">Bharat Climate Twin</span>
          </div>
          <p className="text-xs text-slate-500">
            AI-Powered Digital Twin of India&apos;s Climate using National Datasets — ISRO Challenge
          </p>
        </div>
      </footer>

      {/* Keyframe styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-15px) translateX(8px); }
          50% { transform: translateY(-5px) translateX(-5px); }
          75% { transform: translateY(-20px) translateX(3px); }
        }
      `}</style>
    </main>
  );
}

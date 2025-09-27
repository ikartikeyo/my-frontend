import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import StatusCards from "./components/StatusCards";
import HeatmapPlaceholder from "./components/HeatmapPlaceholder";
import LiveMapPlaceholder from "./components/LiveMapPlaceholder";
import ControlPanel from "./components/ControlPanel";
import "./AppLayout.css";

export default function App() {
  const [health, setHealth] = useState(null);
  const [trains, setTrains] = useState([]);
  const [stats, setStats] = useState({});
  const [selected, setSelected] = useState(null);
  const [plan, setPlan] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  

  // ✅ Use env var or fallback
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
fetch(`${API_BASE}/api/trains`)



  // fetch health + trains
  async function loadAll() {
    try {
      const h = await fetch(`${API_URL}/api/health`)
        .then(r => r.json())
        .catch(() => ({ ok: false }));
      setHealth(h);

      const t = await fetch(`${API_URL}/api/trains`)
        .then(r => r.json())
        .catch(() => []);
      setTrains(t);

      // derive simple stats
      const delayed = t.filter(x => (x.delay || 0) > 0).length;
      const avgDelay = t.length
        ? Math.round(t.reduce((s, x) => s + (x.delay || 0), 0) / t.length)
        : 0;

      const signals = {
        green: t.filter(x => x.signalStatus === "GREEN").length,
        yellow: t.filter(x => x.signalStatus === "YELLOW").length,
        red: t.filter(x => x.signalStatus === "RED").length,
      };

      setStats({
        active: t.length,
        delayed,
        avgDelay,
        trackAvail: 95,
        signals,
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 8000); // refresh every 8s
    return () => clearInterval(interval);
  }, []);

  // get realtime plan on demand
  async function runOptimize() {
    try {
      const res = await fetch(`${API_URL}/api/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trains }),
      });
      const data = await res.json();
      setPlan(data);
    } catch (err) {
      console.error("optimize err", err);
    }
  }

  // quick manual actions
  async function handleQuickAction(train, action) {
    if (!train) return;
    if (action === "HOLD") {
      alert(`Manual action: Hold ${train.id} (demo only)`);
    } else if (action === "PROCEED") {
      alert(`Manual action: Proceed ${train.id} (demo only)`);
    }
  }

  // inject delay simulation
  async function handleInjectDelay(train, minutes) {
    if (!train) return alert("Select train first");
    try {
      const updated = { ...train, delay: (train.delay || 0) + minutes };
      await fetch(`${API_URL}/api/trains`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      await loadAll();
      alert("Injected delay (demo).");
    } catch (err) {
      console.error(err);
      alert("Failed to inject delay");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header health={health} lastUpdated={lastUpdated} />

      <div className="flex flex-1">
        <Sidebar trains={trains} selectedTrain={selected} onSelect={setSelected} />

        <main className="flex-1 p-6 overflow-auto space-y-6">
          <div className="space-y-4">
            <StatusCards stats={stats} />

            <div className="grid grid-cols-3 gap-4">
              {/* Heatmap + LiveMap */}
              <div className="col-span-2 space-y-4">
                <HeatmapPlaceholder />
                <LiveMapPlaceholder />
              </div>

              {/* Right-hand column: AI box + Train list */}
              <div className="space-y-4">
                {/* AI Recommendations */}
                <div className="rounded-lg border border-slate-800 p-4 bg-white/5">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">AI Recommendation Summary</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {plan?.recommendation_summary || "No recommendations yet. Run optimize."}
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={runOptimize}
                        className="px-3 py-2 bg-sky-600 rounded text-sm"
                      >
                        Run Optimize
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    {plan?.actions?.map((a, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded mb-2 ${
                          a.action === "HOLD"
                            ? "bg-red-800/30"
                            : "bg-green-800/20"
                        }`}
                      >
                        <div className="text-sm">
                          🚆 <b>{a.train}</b> — {a.action} at <b>{a.location}</b>{" "}
                          {a.minutes ? `for ${a.minutes}m` : ""}
                        </div>
                        <div className="text-xs text-slate-300 mt-1">{a.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Trains */}
                <div className="rounded-lg border border-slate-800 p-4 bg-white/5">
                  <div className="text-sm font-medium">Active Trains</div>
                  <div className="mt-3 space-y-2">
                    {trains.slice(0, 6).map((t) => (
                      <div key={t.id} className="p-2 border-b border-slate-700">
                        <div className="flex justify-between items-center">
                          <div className="text-sm">{t.id} — {t.name}</div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              t.signalStatus === "RED"
                                ? "bg-red-600 text-white"
                                : t.signalStatus === "YELLOW"
                                ? "bg-yellow-400 text-black"
                                : "bg-green-500 text-white"
                            }`}
                          >
                            {t.signalStatus}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          ETA: {t.scheduledETA ? new Date(t.scheduledETA).toLocaleTimeString() : "—"} | 
                          ETD: {t.scheduledETD ? new Date(t.scheduledETD).toLocaleTimeString() : "—"}
                        </div>
                        <div className={`text-xs mt-1 ${t.delay > 0 ? "text-red-400" : "text-green-400"}`}>
                          {t.delay > 0 ? `Delayed by ${t.delay} min` : "On Time"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <ControlPanel
          selected={selected}
          onInjectDelay={handleInjectDelay}
          onActionQuick={handleQuickAction}
        />
      </div>
    </div>
  );
}

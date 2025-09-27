import React from "react";

export default function Header({ health, lastUpdated }) {
  return (
    <header className="w-full flex items-center justify-between px-6 py-3 bg-white/5 border-b border-slate-800">
      <div className="flex items-center gap-4">
        <div className="text-xl font-semibold">RTPXO Console</div>
        <div className="text-sm text-slate-400">New Delhi - Ghaziabad Section</div>
        <div className="ml-4 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs">LIVE</div>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-300">
        <div className="px-3 py-1 rounded bg-green-600/10 text-green-300">All systems operational</div>
        <div>Connected</div>
        <div>Online</div>
        <div>Updated: {lastUpdated || "—"}</div>
        <button className="px-3 py-1 rounded bg-slate-800">Settings</button>
      </div>
    </header>
  );
}

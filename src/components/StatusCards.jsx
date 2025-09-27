import React from "react";

export default function StatusCards({ stats }) {
  const cards = [
    { label: "Active Trains", value: stats.active || 0 },
    { label: "Delayed Trains", value: stats.delayed || 0 },
    { label: "Avg Delay (min)", value: stats.avgDelay || 0 },
    { label: "Track Availability (%)", value: stats.trackAvail || 100 },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className="bg-slate-900 border border-slate-800 rounded-lg p-4"
        >
          <div className="text-xs text-slate-400">{c.label}</div>
          <div className="text-lg font-bold">{c.value}</div>
        </div>
      ))}
    </div>
  );
}

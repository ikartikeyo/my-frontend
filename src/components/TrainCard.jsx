import React from "react";

export default function TrainCard({ train, onSelect }) {
  const statusColor = train.delay > 10 ? "bg-red-200 text-red-800" : train.delay > 0 ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800";
  return (
    <div className="p-3 rounded-lg border border-slate-800 bg-white/5 flex flex-col gap-2 cursor-pointer" onClick={()=>onSelect && onSelect(train)}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-mono font-semibold">{train.id}</div>
          <div className="text-xs text-slate-400">{train.name}</div>
        </div>
        <div className={`text-xs px-2 py-1 rounded ${statusColor}`}>{train.delay > 0 ? `${train.delay}m delayed` : "On time"}</div>
      </div>

      <div className="text-xs text-slate-300">
        <div>Block: <span className="font-medium">{train.currentBlock || "—"}</span></div>
        <div>At: <span className="font-medium">{train.currentStation || "—"}</span></div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <div>Speed: <span className="font-medium text-slate-200">{train.speed ?? "—"} km/h</span></div>
        <div>Priority: <span className="font-medium text-slate-200">{train.priority ?? "—"}</span></div>
      </div>

      <div className="flex gap-2 mt-2">
        <button className="flex-1 px-2 py-1 rounded bg-slate-700 text-xs">Track</button>
        <button className="flex-1 px-2 py-1 rounded bg-sky-600 text-xs text-white">Control</button>
      </div>
    </div>
  );
}

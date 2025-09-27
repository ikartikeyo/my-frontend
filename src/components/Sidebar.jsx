import React from "react";
import TrainCard from "./TrainCard";

export default function Sidebar({ trains = [], selectedTrain, onSelect }) {
  return (
    <aside className="w-80 bg-slate-900/40 border-r border-slate-800 p-4 flex flex-col gap-4 overflow-auto">
      <div className="text-sm font-semibold">Active Trains</div>
      <div className="text-xs text-slate-400">On Time · Delayed · Critical</div>

      <div className="mt-3 space-y-2">
        {trains.length === 0 ? (
          <div className="text-slate-500 text-sm">No active trains</div>
        ) : (
          trains.map(t => (
            <TrainCard
              key={t.id}
              train={t}
              onSelect={onSelect}
              isSelected={selectedTrain?.id === t.id}  // ✅ highlight selected train
            />
          ))
        )}
      </div>
    </aside>
  );
}

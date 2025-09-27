import React, { useState } from "react";

export default function ControlPanel({ selected, onInjectDelay, onActionQuick }) {
  const [delayMin, setDelayMin] = useState(5);
  return (
    <div className="w-96 bg-slate-900/40 border-l border-slate-800 p-4 flex flex-col gap-4">
      <div className="text-lg font-semibold">Control Center</div>

      <div className="bg-white/5 p-3 rounded border border-slate-800">
        <div className="text-sm font-medium">AI Recommendations</div>
        <div className="text-xs text-slate-400">Auto update</div>
      </div>

      <div className="bg-white/5 p-3 rounded border border-slate-800">
        <div className="text-sm font-medium">Manual Controls</div>
        {selected ? (
          <>
            <div className="text-xs mt-2">Selected: <b>{selected.id} - {selected.name}</b></div>
            <div className="flex gap-2 mt-3">
              <button onClick={()=>onActionQuick(selected,'HOLD')} className="flex-1 px-2 py-1 rounded bg-red-600 text-xs text-white">Hold 5m</button>
              <button onClick={()=>onActionQuick(selected,'PROCEED')} className="flex-1 px-2 py-1 rounded bg-green-600 text-xs text-white">Proceed</button>
            </div>
          </>
        ) : <div className="text-xs text-slate-500">Select a train to control</div>}
      </div>

      <div className="bg-white/5 p-3 rounded border border-slate-800">
        <div className="text-sm font-medium">Inject Delay (Simulation)</div>
        <div className="mt-2 text-xs">Selected train</div>
        <input type="number" value={delayMin} onChange={(e)=>setDelayMin(Number(e.target.value))} className="w-full mt-1 p-2 rounded bg-slate-800 text-xs" />
        <button onClick={()=>onInjectDelay(selected, delayMin)} className="mt-2 w-full bg-yellow-600 px-3 py-2 rounded text-xs">Inject Delay</button>
      </div>
    </div>
  );
}

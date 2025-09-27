export function generateSmartAlerts(trains, infra={}){
  const alerts = [];
  // collision
  for (let i=0;i<trains.length;i++){
    for (let j=i+1;j<trains.length;j++){
      if (trains[i].currentBlock && trains[i].currentBlock === trains[j].currentBlock){
        alerts.push({ type: 'collision', severity: 'critical', message: `Potential collision: ${trains[i].id} & ${trains[j].id} in ${trains[i].currentBlock}` });
      }
    }
  }
  // unexpected delay
  trains.forEach(t=>{
    if (t.eta && t.expectedEta){
      const delay = (new Date(t.eta) - new Date(t.expectedEta))/60000;
      if (delay > 5) alerts.push({ type:'delay', severity:'warning', message: `Delay: ${t.id} is ${delay.toFixed(1)} min late` });
    }
  });
  // maintenance
  (infra.maintenanceBlocks||[]).forEach(block=>{
    trains.forEach(t=>{ if (t.currentBlock===block) alerts.push({type:'maintenance', severity:'warning', message:`Block ${block} under maintenance; train ${t.id} affected`}); });
  });
  // platform overload
  const stationCounts = {};
  trains.forEach(t=>{ if (t.currentStation) stationCounts[t.currentStation] = (stationCounts[t.currentStation]||0)+1; });
  Object.entries(infra.platforms||{}).forEach(([station,cap])=>{
    const assigned = stationCounts[station]||0;
    if (assigned > cap) alerts.push({ type:'platform', severity:'info', message:`Platform overload: ${assigned} trains at ${station} (cap ${cap})` });
  });
  // tsr
  (infra.speedRestrictions||[]).forEach(r=>{
    trains.forEach(t=>{ if (t.currentBlock===r.block && t.speed>r.maxSpeed) alerts.push({type:'tsr', severity:'warning', message:`TSR violation: ${t.id} at ${t.speed} km/h > ${r.maxSpeed} in ${r.block}`}); });
  });
  return alerts;
}

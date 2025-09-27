export function generatePerformanceReport(trains=[], conflictsResolved=0){
  const totalDelay = trains.reduce((sum,t)=>{
    if (t.eta && t.expectedEta) return sum + Math.max(0,(new Date(t.eta)-new Date(t.expectedEta))/60000);
    return sum;
  },0);
  const avgDelay = trains.length ? (totalDelay / trains.length).toFixed(1) : 0;
  const onTime = trains.filter(t=> t.eta && t.expectedEta ? new Date(t.eta) <= new Date(t.expectedEta) : true).length;
  return { avgDelay, throughput: trains.length, onTimePercent: trains.length? ((onTime/trains.length)*100).toFixed(1):0, conflictsResolved };
}

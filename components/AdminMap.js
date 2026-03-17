function AdminMap({ vehicles }) {
  const [selectedRouteId, setSelectedRouteId] = React.useState(null);

  const getMapTransform = () => {
      if (!selectedRouteId) return 'scale(1) translate(0%, 0%)';
      const route = ROUTES.find(r => r.id === selectedRouteId);
      if (!route || !route.pathPoints || route.pathPoints.length === 0) return 'scale(1) translate(0%, 0%)';
      
      let minX = 1000, minY = 600, maxX = 0, maxY = 0;
      route.pathPoints.forEach(p => {
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
      });
      
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      
      const translateX = ((500 - centerX) / 1000) * 100;
      const translateY = ((300 - centerY) / 600) * 100;
      
      return `scale(2.5) translate(${translateX}%, ${translateY}%)`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col min-h-[800px] animate-fade-in transition-colors duration-500 relative">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 transition-colors z-10 relative">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white transition-colors">Global Fleet Tracking</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Live positions of all active vehicles across the network</p>
        </div>
        <div className="flex gap-4">
          {typeof ROUTES !== 'undefined' && ROUTES.map(r => (
            <div key={r.id} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 transition-colors cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => setSelectedRouteId(selectedRouteId === r.id ? null : r.id)}>
              <span className={`w-3 h-3 rounded-full ${r.color}`}></span> Route {r.number || r.id}
            </div>
          ))}
        </div>
      </div>

      <div className="h-[500px] relative bg-slate-50 dark:bg-slate-950 p-8 overflow-hidden border-b border-slate-100 dark:border-slate-800 transition-colors">
        {/* Simplified City Map Grid */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none transition-opacity"
          style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center">
          <div className="absolute inset-0 w-full h-full origin-center transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" style={{ transform: getMapTransform() }}>
          {/* Visualizing Routes */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
            {/* Route paths */}
            {typeof ROUTES !== 'undefined' && ROUTES.map(route => {
                if (!route.pathPoints || route.pathPoints.length < 2) return null;
                const d = `M ${route.pathPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`;
                const isSelected = selectedRouteId === route.id;
                const opacity = selectedRouteId ? (isSelected ? 1 : 0.1) : 0.2;
                return (
                    <path 
                        key={route.id} 
                        d={d} 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth={isSelected ? 12 : 8} 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className={`${route.textColor} transition-all duration-500 cursor-pointer hover:opacity-100 hover:stroke-[12px] dark:hover:opacity-100`} 
                        style={{ opacity }}
                        onClick={() => setSelectedRouteId(route.id)}
                    />
                );
            })}

            {/* Rendering Vehicles */}
            {vehicles.map(v => {
              let x, y;
              const route = ROUTES.find(r => r.id === v.routeId);
              
              if (!route || !route.pathPoints || route.pathPoints.length < 2) {
                  x = 500; y = 300;
              } else {
                  let totalLength = 0;
                  const segments = [];
                  for (let i = 0; i < route.pathPoints.length - 1; i++) {
                      const p1 = route.pathPoints[i];
                      const p2 = route.pathPoints[i + 1];
                      const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
                      totalLength += len;
                      segments.push({ p1, p2, len, accum: totalLength });
                  }
                  
                  let ratio = (v.currentStopIndex + (v.progress || 0)) / Math.max(1, route.stops.length);
                  if (ratio > 1) ratio = ratio % 1;
                  
                  const targetLength = ratio * totalLength;
                  let seg = segments.find(s => s.accum >= targetLength) || segments[segments.length - 1];
                  
                  const segStart = seg.accum - seg.len;
                  const segRatio = (targetLength - segStart) / Math.max(0.1, seg.len);
                  
                  x = seg.p1.x + (seg.p2.x - seg.p1.x) * segRatio;
                  y = seg.p1.y + (seg.p2.y - seg.p1.y) * segRatio;
              }

              const isSelected = !selectedRouteId || selectedRouteId === v.routeId;
              const opacity = isSelected ? 1 : 0;
              
              return (
                <g key={v.id} className="transition-all duration-1000" style={{ opacity, pointerEvents: isSelected ? 'auto' : 'none' }}>
                  <circle cx={x} cy={y} r="12" className={`${route?.textColor || 'text-slate-500'} fill-current transition-colors`} />
                  <circle cx={x} cy={y} r="20" className={`${route?.textColor || 'text-slate-500'} fill-current opacity-20 ${v.status === 'Delayed' ? 'animate-pulse' : ''} transition-colors`} />
                  <text x={x} y={y - 20} textAnchor="middle" className="text-[14px] font-black fill-slate-700 dark:fill-slate-300 transition-colors">{v.id}</text>
                  <circle cx={x} cy={y} r="4" fill="white" />
                </g>
              );
            })}
          </svg>
          </div>

          {/* Landmarks Labeling */}
          <div className="absolute top-10 left-[200px] text-[10px] font-bold text-slate-400 uppercase tracking-widest transition-colors pointer-events-none">Central Station</div>
          <div className="absolute bottom-10 right-[200px] text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right transition-colors pointer-events-none">Riverfront</div>
          <div className="absolute top-1/2 left-[100px] -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-widest transition-colors pointer-events-none">West Terminal</div>
          
          {selectedRouteId && (
              <button 
                  onClick={() => setSelectedRouteId(null)}
                  className="absolute bottom-6 right-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all z-20"
              >
                  <Icon name="arrow-left" className="text-slate-700 dark:text-slate-300" size="text-sm" />
                  <span className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Reset View</span>
              </button>
          )}
        </div>
      </div>

      {/* Integrated Status Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#1E3A8A] dark:bg-blue-900/50 text-white transition-colors">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Vehicle ID</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Current Route</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Last Checkpoint</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Operational Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Logistics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
            {vehicles.map(v => {
              const route = ROUTES.find(r => r.id === v.routeId);
              const lastStop = route?.stops[v.currentStopIndex]?.name || 'Transit';

              // Status Styling
              const statusStyles = {
                'On Time': 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
                'Delayed': 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30',
                'En Route': 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-900/30'
              };

              const currentStatusStyle = statusStyles[v.status] || 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-700';

              return (
                <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-slate-900 dark:text-white transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#1E3A8A] dark:text-blue-400 font-black text-xs transition-colors">#{v.id}</div>
                      <span className="font-bold">Unit {v.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black text-white ${route?.color || 'bg-slate-500'} transition-colors`}>
                      RT-{v.routeId}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 italic transition-colors">
                    {lastStop}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-colors ${currentStatusStyle}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 transition-colors">
                    Cap: {v.capacity}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-900 dark:bg-black text-white flex justify-between items-center px-8 border-t border-white/5 transition-colors">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] text-blue-300 dark:text-blue-400 font-bold uppercase tracking-wider transition-colors">Active Fleet</span>
            <span className="text-xl font-bold transition-colors">{vehicles.length} Units</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-emerald-300 dark:text-emerald-400 font-bold uppercase tracking-wider transition-colors">Network Health</span>
            <span className="text-xl font-bold text-emerald-400 flex items-center gap-2 transition-colors">
              98% Reliable
            </span>
          </div>
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 font-mono tracking-widest transition-colors">
          LIVE FEED: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

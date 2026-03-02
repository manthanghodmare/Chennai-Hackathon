function AdminMap({ vehicles }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden flex flex-col min-h-[800px] animate-fade-in">
      {/* Header remain same */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Global Fleet Tracking</h3>
          <p className="text-xs text-slate-500">Live positions of all active vehicles across the network</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span> Route 101
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Route 202
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span> Route 305
          </div>
        </div>
      </div>

      <div className="h-[500px] relative bg-slate-50 p-8 overflow-hidden border-b border-slate-100">
        {/* Simplified City Map Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center">
          {/* Visualizing Routes */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
            {/* Route paths remain same */}
            <path d="M200 100 L800 100 L800 500 L200 500 Z" fill="none" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="opacity-20" />
            <path d="M100 300 L900 300" fill="none" stroke="#10B981" strokeWidth="8" strokeLinecap="round" className="opacity-20" />
            <path d="M500 50 L500 550" fill="none" stroke="#A855F7" strokeWidth="8" strokeLinecap="round" className="opacity-20" />

            {/* Rendering Vehicles */}
            {vehicles.map(v => {
              let x, y;
              const route = ROUTES.find(r => r.id === v.routeId);
              const progressTotal = (v.currentStopIndex + v.progress) / (route?.stops.length || 1);

              if (v.routeId === '101') {
                const p = progressTotal * 4;
                if (p < 1) { x = 200 + p * 600; y = 100; }
                else if (p < 2) { x = 800; y = 100 + (p - 1) * 400; }
                else if (p < 3) { x = 800 - (p - 2) * 600; y = 500; }
                else { x = 200; y = 500 - (p - 3) * 400; }
              } else if (v.routeId === '202') {
                x = 100 + progressTotal * 800; y = 300;
              } else {
                x = 500; y = 50 + progressTotal * 500;
              }

              return (
                <g key={v.id} className="transition-all duration-1000">
                  <circle cx={x} cy={y} r="12" className={v.routeId === '101' ? 'fill-blue-500' : v.routeId === '202' ? 'fill-emerald-500' : 'fill-purple-500'} />
                  <circle cx={x} cy={y} r="20" className={`${v.routeId === '101' ? 'fill-blue-500/20' : v.routeId === '202' ? 'fill-emerald-500/20' : 'fill-purple-500/20'} ${v.status === 'Delayed' ? 'animate-pulse' : ''}`} />
                  <text x={x} y={y - 20} textAnchor="middle" className="text-[14px] font-black fill-slate-700">{v.id}</text>
                  <circle cx={x} cy={y} r="4" fill="white" />
                </g>
              );
            })}
          </svg>

          {/* Landmarks Labeling */}
          <div className="absolute top-10 left-[200px] text-[10px] font-bold text-slate-400 uppercase tracking-widest">Central Station</div>
          <div className="absolute bottom-10 right-[200px] text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Riverfront</div>
          <div className="absolute top-1/2 left-[100px] -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">West Terminal</div>
        </div>
      </div>

      {/* Integrated Status Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#1E3A8A] text-white">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Vehicle ID</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Current Route</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Last Checkpoint</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Operational Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Logistics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vehicles.map(v => {
              const route = ROUTES.find(r => r.id === v.routeId);
              const lastStop = route?.stops[v.currentStopIndex]?.name || 'Transit';

              // Status Styling
              const statusStyles = {
                'On Time': 'bg-emerald-50 text-emerald-700 border-emerald-100',
                'Delayed': 'bg-red-50 text-red-700 border-red-100',
                'En Route': 'bg-orange-50 text-orange-700 border-orange-100'
              };

              const currentStatusStyle = statusStyles[v.status] || 'bg-slate-50 text-slate-700 border-slate-100';

              return (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#1E3A8A] font-black text-xs">#{v.id}</div>
                      <span className="font-bold text-slate-900">Unit {v.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black text-white ${v.routeId === '101' ? 'bg-blue-500' : v.routeId === '202' ? 'bg-emerald-500' : 'bg-purple-500'}`}>
                      RT-{v.routeId}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-600 italic">
                    {lastStop}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${currentStatusStyle}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">
                    Cap: {v.capacity}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-900 text-white flex justify-between items-center px-8 border-t border-white/5">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Active Fleet</span>
            <span className="text-xl font-bold">{vehicles.length} Units</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Network Health</span>
            <span className="text-xl font-bold text-emerald-400 flex items-center gap-2">
              98% Reliable
            </span>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-mono tracking-widest">
          LIVE FEED: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

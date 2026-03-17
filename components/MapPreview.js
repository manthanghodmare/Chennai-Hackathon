function MapPreview() {
  return (
    <div className="relative w-full h-48 sm:h-64 bg-[#f4f5f6] rounded-2xl overflow-hidden border border-slate-200 shadow-2xl group/map cursor-crosshair">
      <div className="absolute inset-0 w-full h-full origin-center transition-transform duration-[10s] ease-in-out group-hover/map:scale-110">
      {/* Realistic City Map SVG (Matches AdminMap & MockMap) */}
      <svg className="absolute inset-0 w-full h-full opacity-100" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
        {/* Background Base */}
        <rect width="1000" height="600" fill="#f4f5f6" />

        {/* Water Bodies (Coastal City feel) */}
        <path d="M850 0 C 900 150, 800 450, 950 600 H 1000 V 0 Z" fill="#91d5eb" />
        <path d="M0 250 Q 150 230, 300 280 T 600 260 T 900 300 L 1000 320" stroke="#91d5eb" strokeWidth="30" fill="none" />
        <circle cx="150" cy="120" r="40" fill="#91d5eb" />

        {/* Parks / Green Zones */}
        <rect x="50" y="50" width="120" height="80" rx="20" fill="#cde6c7" />
        <rect x="700" y="400" width="180" height="120" rx="30" fill="#cde6c7" />
        <circle cx="450" cy="500" r="60" fill="#cde6c7" />

        {/* Major Arterial Roads (Highways) */}
        <g stroke="#ffffff" strokeWidth="15" fill="none" strokeLinecap="round">
            <path d="M0 300 H 1000" />
            <path d="M350 0 V 600" />
            <path d="M750 0 V 600" />
            <path d="M0 100 Q 500 150, 1000 50" stroke="#ffffff" strokeWidth="8" strokeDasharray="15,10" />
        </g>

        {/* Urban Grid - Secondary Streets */}
        <g stroke="#ffffff" strokeWidth="6" fill="none">
            {[100, 200, 400, 500, 700, 800, 900].map(x => <path key={`v-${x}`} d={`M${x} 0 V 600`} />)}
            {[50, 150, 350, 450, 550].map(y => <path key={`h-${y}`} d={`M0 ${y} H 1000`} />)}
        </g>

        {/* Building Density Simulation */}
        <g fill="#e8eaed" stroke="#d5d7d8" strokeWidth="1">
            {Array.from({ length: 15 }).map((_, i) => (
                <rect
                    key={`b-${i}`}
                    x={100 + (i * 60) % 800}
                    y={100 + (i * 80) % 400}
                    width={30 + (i % 3) * 10}
                    height={30 + (i % 2) * 10}
                    rx="4"
                />
            ))}
        </g>

        {/* Route Lines */}
        {typeof window !== 'undefined' && window.ROUTES && window.ROUTES.map(route => {
            if (!route.pathPoints || route.pathPoints.length < 2) return null;
            const d = `M ${route.pathPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`;
            return (
                <path 
                    key={`preview-route-${route.id}`} 
                    d={d} 
                    fill="none" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`${route.textColor} opacity-80`}
                    style={{ stroke: 'currentColor' }}
                />
            );
        })}
      </svg>

      {/* Glowing Bus Markers */}
      <div className="absolute top-[48%] left-[25%] group/bus">
        <div className="relative">
          <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-sm animate-pulse"></div>
          <div className="relative w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center border border-blue-400/50 shadow-lg text-white">
            <Icon name="bus" size="text-[10px]" />
          </div>
        </div>
      </div>

      <div className="absolute top-[18%] left-[73%] group/bus">
        <div className="relative">
          <div className="absolute -inset-2 bg-emerald-500/20 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="relative w-5 h-5 bg-emerald-600 rounded-lg flex items-center justify-center border border-emerald-400/50 shadow-lg text-white">
            <Icon name="bus" size="text-[10px]" />
          </div>
        </div>
      </div>

      <div className="absolute top-[78%] left-[53%] group/bus">
        <div className="relative">
          <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-sm animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="relative w-5 h-5 bg-amber-600 rounded-lg flex items-center justify-center border border-amber-400/50 shadow-lg text-white">
            <Icon name="bus" size="text-[10px]" />
          </div>
        </div>
      </div>

      </div>

      {/* High-Tech Overlay Elements */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 shadow-xl">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
          <span className="text-[10px] font-black text-white uppercase tracking-tighter">HD Rendering</span>
        </div>
      </div>

      {/* Data Scanning Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay">
        <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full animate-[scan_4s_linear_infinite]"></div>
      </div>

      <style>{`
                @keyframes scan {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(100%); }
                }
            `}</style>
    </div>
  );
}

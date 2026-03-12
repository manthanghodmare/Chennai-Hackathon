function MapPreview() {
  return (
    <div className="relative w-full h-48 sm:h-64 bg-[#0F172A] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group/map cursor-crosshair">
      {/* Realistic City Map SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-40 transition-transform duration-[10s] ease-in-out group-hover/map:scale-110" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
        {/* Background / Base Ground */}
        <rect width="400" height="200" fill="#1e293b" />

        {/* Water Bodies (Chennai Coastline feel) */}
        <path d="M340 0 C 350 50, 330 150, 360 200 H 400 V 0 Z" fill="#334155" />
        <path d="M0 80 Q 50 75, 120 90 T 250 85 T 400 95" stroke="#334155" strokeWidth="12" fill="none" /> {/* River */}

        {/* Parks / Greenery */}
        <circle cx="50" cy="40" r="30" fill="#064e3b" opacity="0.4" />
        <rect x="200" y="140" width="60" height="40" rx="10" fill="#064e3b" opacity="0.3" />
        <path d="M280 40 Q 300 10, 320 50 Z" fill="#064e3b" opacity="0.3" />

        {/* Road Network - Main Arterials */}
        <g stroke="#475569" strokeWidth="4" fill="none">
          <path d="M0 100 H 400" />
          <path d="M150 0 V 200" />
          <path d="M300 0 V 200" />
          <path d="M0 40 Q 150 120, 400 30" stroke="#64748b" strokeWidth="2.5" strokeDasharray="4,2" />
        </g>

        {/* Secondary Streets */}
        <g stroke="#334155" strokeWidth="1" fill="none">
          <path d="M0 20 H 400" />
          <path d="M0 160 H 400" />
          <path d="M50 0 V 200" />
          <path d="M220 0 V 200" />
          <path d="M350 0 V 200" />
        </g>

        {/* Building Blocks */}
        <g fill="#1e293b" stroke="#334155" strokeWidth="0.5">
          <rect x="60" y="50" width="20" height="20" rx="2" />
          <rect x="90" y="50" width="15" height="15" rx="2" />
          <rect x="160" y="20" width="30" height="40" rx="2" />
          <rect x="230" y="60" width="40" height="25" rx="2" />
          <rect x="20" y="120" width="25" height="25" rx="2" />
          <rect x="240" y="110" width="15" height="15" rx="2" />
        </g>
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

      {/* High-Tech Overlay Elements */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 shadow-xl">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
          <span className="text-[10px] font-black text-white uppercase tracking-tighter">HD Rendering</span>
        </div>
      </div>

      {/* Data Scanning Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full animate-[scan_4s_linear_infinite]"></div>
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

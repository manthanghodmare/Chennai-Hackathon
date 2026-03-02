function MapPreview() {
  return (
    <div className="relative w-full h-48 sm:h-64 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shadow-inner group/map">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(#1E3A8A 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* Stylized Routes */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path d="M-20 40 Q 100 20, 200 80 T 400 60" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray="8,8" className="opacity-30" />
        <path d="M-20 120 Q 150 150, 300 100 T 500 140" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="8,8" className="opacity-30" />
        <path d="M100 -20 Q 120 100, 80 200 T 140 400" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="8,8" className="opacity-30" />
      </svg>

      {/* Moving "Bus" dots */}
      <div className="absolute top-[30%] left-[20%] w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></div>
      <div className="absolute top-[70%] left-[60%] w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse" style={{ animationDelay: '500ms' }}></div>
      <div className="absolute top-[50%] left-[85%] w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" style={{ animationDelay: '1000ms' }}></div>

      {/* Map Overlay Logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover/map:opacity-10 transition-opacity">
        <div className="text-6xl font-black tracking-tighter text-slate-900 rotate-[-10deg]">NEXUS</div>
      </div>

      {/* Map UI Elements */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <div className="w-8 h-8 rounded-lg bg-white shadow-md flex items-center justify-center border border-slate-100">
          <div className="w-4 h-4 bg-slate-200 rounded-sm"></div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-white shadow-md flex items-center justify-center border border-slate-100 text-slate-400 text-[10px] font-bold">
          GPS
        </div>
      </div>

      {/* Scanner Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/5 to-transparent w-full h-full -translate-x-full animate-[shimmer_3s_infinite]" style={{ animationDuration: '3s' }}></div>

      <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
    </div>
  );
}

function MapPreview() {
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    if (!mapRef.current) return;

    const selectedCity = localStorage.getItem('selectedCity') || 'chennai';
    const cityData = window.CITY_DATA[selectedCity] || window.CITY_DATA['chennai'];
    const center = cityData.mapCenter || [13.0827, 80.2707];
    const zoom = cityData.mapZoom || 13;

    const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false
    }).setView(center, zoom);

    L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);

    // Add a few dummy markers for preview visualization
    const dummyPositions = [
        [center[0] + 0.015, center[1] + 0.01],
        [center[0] - 0.01, center[1] + 0.025],
        [center[0] + 0.02, center[1] - 0.015]
    ];
    const colors = ['#1E3A8A', '#10B981', '#F59E0B'];

    dummyPositions.forEach((pos, i) => {
        const nexusLogoSvg = `<svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 85C50 85 80 60 80 40C80 23.4 66.6 10 50 10C33.4 10 20 23.4 20 40C20 60 50 85 50 85Z" fill="${colors[i]}"/>
            <circle cx="50" cy="40" r="21" fill="white" />
            <g transform="translate(32, 30) scale(0.36)">
                <path d="M8 10h84c2.2 0 4 1.8 4 4v30c0 4.4-3.6 8-8 8H12c-4.4 0-8-3.6-8-8V14c0-2.2 1.8-4 4-4z" fill="${colors[i]}"/>
                <rect x="12" y="16" width="14" height="20" rx="2" fill="white" />
                <rect x="30" y="16" width="14" height="20" rx="2" fill="white" />
                <rect x="48" y="16" width="14" height="20" rx="2" fill="white" />
                <rect x="66" y="16" width="14" height="20" rx="2" fill="white" />
                <rect x="84" y="16" width="8" height="28" rx="2" fill="white" />
                <circle cx="28" cy="52" r="8" fill="${colors[i]}" stroke="white" stroke-width="3" />
                <circle cx="72" cy="52" r="8" fill="${colors[i]}" stroke="white" stroke-width="3" />
            </g>
            <path d="M38 75C38 75 42 85 50 85s12-10 12-10" fill="none" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round" transform="translate(0, 8)"/>
        </svg>`;

        const icon = L.divIcon({
            className: 'custom-preview-marker border-0 bg-transparent',
            html: `
                <div class="relative group w-8 h-8 flex items-center justify-center mt-[-8px]">
                  <div class="absolute -inset-1 rounded-full blur-md opacity-20 animate-pulse" style="background-color: ${colors[i]}"></div>
                  ${nexusLogoSvg}
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32]
        });
        L.marker(pos, { icon }).addTo(map);
    });

    // Fix for Leaflet sizing issues in dynamic containers
    setTimeout(() => {
        map.invalidateSize();
    }, 300);

    const observer = new ResizeObserver(() => {
        map.invalidateSize();
    });
    if (mapRef.current) {
        observer.observe(mapRef.current);
    }

    return () => {
        if (mapRef.current) observer.unobserve(mapRef.current);
        observer.disconnect();
        map.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-48 sm:h-64 bg-[#f4f5f6] rounded-2xl overflow-hidden border border-slate-200 shadow-2xl group/map cursor-crosshair" data-map-type="leaflet">
      <div className="absolute inset-0 w-full h-full origin-center transition-transform duration-[10s] ease-in-out group-hover/map:scale-[1.05] z-0" ref={mapRef}>
      </div>

      {/* High-Tech Overlay Elements */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 shadow-xl">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
          <span className="text-[10px] font-black text-white uppercase tracking-tighter">HD Rendering</span>
        </div>
      </div>

      {/* Data Scanning Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay z-20">
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

function MockMap({ vehicles }) {
    return (
        <div className="w-full h-full bg-[#0F172A] relative overflow-hidden flex items-center justify-center cursor-default group/mockmap">
            {/* Detailed City Infrastructure SVG */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.15] transition-transform duration-[20s] ease-in-out group-hover/mockmap:scale-105" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
                {/* Background Base */}
                <rect width="1000" height="600" fill="#020617" />

                {/* Water Bodies (Coastal City feel) */}
                <path d="M850 0 C 900 150, 800 450, 950 600 H 1000 V 0 Z" fill="#1e293b" />
                <path d="M0 250 Q 150 230, 300 280 T 600 260 T 900 300 L 1000 320" stroke="#1e293b" strokeWidth="30" fill="none" />
                <circle cx="150" cy="120" r="40" fill="#1e293b" />

                {/* Parks / Green Zones */}
                <rect x="50" y="50" width="120" height="80" rx="20" fill="#064e3b" opacity="0.4" />
                <rect x="700" y="400" width="180" height="120" rx="30" fill="#064e3b" opacity="0.3" />
                <circle cx="450" cy="500" r="60" fill="#064e3b" opacity="0.2" />

                {/* Major Arterial Roads (Highways) */}
                <g stroke="#334155" strokeWidth="15" fill="none" strokeLinecap="round">
                    <path d="M0 300 H 1000" />
                    <path d="M350 0 V 600" />
                    <path d="M750 0 V 600" />
                    <path d="M0 100 Q 500 150, 1000 50" stroke="#4a5568" strokeWidth="8" strokeDasharray="15,10" />
                </g>

                {/* Urban Grid - Secondary Streets */}
                <g stroke="#1e293b" strokeWidth="4" fill="none">
                    {[100, 200, 400, 500, 700, 800, 900].map(x => <path key={`v-${x}`} d={`M${x} 0 V 600`} />)}
                    {[50, 150, 350, 450, 550].map(y => <path key={`h-${y}`} d={`M0 ${y} H 1000`} />)}
                </g>

                {/* Building Density Simulation */}
                <g fill="#0f172a" stroke="#1e293b" strokeWidth="1">
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
            </svg>

            {/* Scanning Laser Beam */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/10 blur-xl animate-[sweep_8s_linear_infinite]"></div>
            </div>

            {/* Vehicle Markers */}
            <div className="relative w-full h-full">
                {vehicles.map((v, i) => {
                    let x, y;
                    if (v.latitude && v.longitude) {
                        const latDiff = v.latitude - 13.0827;
                        const lngDiff = v.longitude - 80.2707;
                        x = 50 + (lngDiff * 4000);
                        y = 50 - (latDiff * 4000);
                        x = Math.max(5, Math.min(95, x));
                        y = Math.max(5, Math.min(95, y));
                    } else {
                        x = 20 + (parseInt(v.id.replace(/\D/g, '') || i) * 17) % 60;
                        y = 20 + (parseInt(v.id.replace(/\D/g, '') || i) * 23) % 60;
                    }

                    return (
                        <div
                            key={v.id}
                            className="absolute transition-all duration-1000 ease-linear"
                            style={{ left: `${x}%`, top: `${y}%` }}
                        >
                            <div className="relative group cursor-pointer">
                                {/* Beacon Glow */}
                                <div className={`absolute -inset-4 rounded-full blur-xl opacity-20 animate-pulse ${v.status === 'delayed' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>

                                {/* Marker Body */}
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-2xl border-2 transition-all group-hover:scale-110 active:scale-95 ${v.status === 'delayed' ? 'bg-amber-600 border-amber-400/50 shadow-amber-900/40' : 'bg-blue-600 border-blue-400/50 shadow-blue-900/40'}`}>
                                    <Icon name="bus" size="text-sm" />
                                </div>

                                {/* Detailed Tooltip */}
                                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-[#0F172A]/95 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all z-[100] scale-90 group-hover:scale-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-2 h-2 rounded-full animate-ping ${v.status === 'delayed' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                        <p className="text-xs font-black text-white uppercase tracking-[0.2em]">{v.id}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 font-bold flex justify-between gap-4">SPEED: <span className="text-white">{v.speed || 0} km/h</span></p>
                                        <p className="text-[10px] text-slate-400 font-bold flex justify-between gap-4">CAPACITY: <span className="text-white">{v.capacity || '0/40'}</span></p>
                                        <p className="text-[10px] text-slate-400 font-bold flex justify-between gap-4">STATUS: <span className={v.status === 'delayed' ? 'text-amber-400' : 'text-emerald-400'}>{v.status?.toUpperCase()}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="absolute bottom-6 right-6 bg-[#0F172A]/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-2xl cursor-default z-10">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]"></div>
                <span className="text-xs font-black text-white uppercase tracking-widest">Global Telemetry Active</span>
            </div>

            <style>{`
                @keyframes sweep {
                    0% { left: -10%; }
                    100% { left: 110%; }
                }
            `}</style>
        </div>
    );
}

function GoogleMap({ route, vehicles, fullScreen }) {
    const mapRef = React.useRef(null);
    const googleMapRef = React.useRef(null);
    const markersRef = React.useRef({});
    const polylineRef = React.useRef(null);
    const [mapError, setMapError] = React.useState(false);

    // Detect if we should use the mock map (placeholder keys or explicit mock mode)
    const isPlaceholderKey = document.querySelector('script[src*="YOUR_MAPS_API_KEY"]');
    const isMockMode = window.firebaseApp?.isMockMode || isPlaceholderKey;
    const hasGoogleMaps = typeof google !== 'undefined' && google.maps && !mapError && !isMockMode;

    // Initialize Map
    React.useEffect(() => {
        if (!hasGoogleMaps || !mapRef.current) return;

        try {
            googleMapRef.current = new google.maps.Map(mapRef.current, {
                center: { lat: 13.0827, lng: 80.2707 }, // Chennai center
                zoom: 13,
                styles: [
                    {
                        "featureType": "all",
                        "elementType": "labels.text.fill",
                        "stylers": [{ "color": "#1e293b" }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [{ "color": "#e2e8f0" }]
                    }
                ],
                disableDefaultUI: true,
                zoomControl: true
            });
        } catch (e) {
            console.warn("Google Maps initialization failed:", e);
            setMapError(true);
        }

        return () => {
            // Cleanup markers
            Object.values(markersRef.current).forEach(m => m.setMap(null));
        };
    }, []);

    // Update Route Polyline & Stop Markers
    React.useEffect(() => {
        if (!hasGoogleMaps || !googleMapRef.current || !route) return;

        try {
            const path = route.stops.map(stop => ({
                lat: stop.lat || 13.0827 + (Math.random() - 0.5) * 0.05,
                lng: stop.lng || 80.2707 + (Math.random() - 0.5) * 0.05
            }));

            if (polylineRef.current) polylineRef.current.setMap(null);

            polylineRef.current = new google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: route.color.includes('blue') ? '#3B82F6' : '#EF4444',
                strokeOpacity: 1.0,
                strokeWeight: 4,
                map: googleMapRef.current
            });

            // Fit bounds
            const bounds = new google.maps.LatLngBounds();
            path.forEach(p => bounds.extend(p));
            googleMapRef.current.fitBounds(bounds);
        } catch (e) {
            console.warn("Polyline update failed:", e);
        }

    }, [route]);

    // Update Vehicle Markers
    React.useEffect(() => {
        if (!hasGoogleMaps || !googleMapRef.current) return;

        try {
            vehicles.forEach(v => {
                if (markersRef.current[v.id]) {
                    // Update existing marker
                    if (v.latitude && v.longitude) {
                        markersRef.current[v.id].setPosition({ lat: v.latitude, lng: v.longitude });
                    }
                } else {
                    // Create new marker
                    const marker = new google.maps.Marker({
                        position: { lat: v.latitude || 13.0827, lng: v.longitude || 80.2707 },
                        map: googleMapRef.current,
                        title: `Vehicle ${v.id}`,
                        icon: {
                            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            scale: 5,
                            fillColor: "#1E3A8A",
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: "#FFFFFF"
                        }
                    });

                    const infoWindow = new google.maps.InfoWindow({
                        content: `<div><strong>Vehicle ${v.id}</strong><p>Status: ${v.status}</p><p>Capacity: ${v.capacity}</p></div>`
                    });

                    marker.addListener("click", () => {
                        infoWindow.open(googleMapRef.current, marker);
                    });

                    markersRef.current[v.id] = marker;
                }
            });

            // Remove markers for vehicles no longer in list
            const currentIds = vehicles.map(v => v.id);
            Object.keys(markersRef.current).forEach(id => {
                if (!currentIds.includes(id)) {
                    markersRef.current[id].setMap(null);
                    delete markersRef.current[id];
                }
            });
        } catch (e) {
            console.warn("Marker update failed:", e);
        }

    }, [vehicles]);

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner border border-slate-200 bg-slate-100">
            {hasGoogleMaps ? (
                <div ref={mapRef} className="w-full h-full"></div>
            ) : (
                <MockMap vehicles={vehicles} />
            )}

            {/* Map Overlay Controls */}
            <div className="absolute top-4 left-4 z-10 space-y-2">
                <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Active Fleet</p>
                    <p className="text-xl font-black text-slate-900">{vehicles.length} Vehicles</p>
                </div>
            </div>
        </div>
    );
}

window.GoogleMap = GoogleMap;

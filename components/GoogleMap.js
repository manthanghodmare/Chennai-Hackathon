function MockMap({ vehicles }) {
    return (
        <div className="w-full h-full bg-slate-50 relative overflow-hidden flex items-center justify-center">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            {/* Roads Simulation */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 100 Q 250 150 500 100 T 1000 100" stroke="#1e293b" strokeWidth="40" fill="none" />
                <path d="M200 0 V 1000" stroke="#1e293b" strokeWidth="40" fill="none" />
                <path d="M600 0 V 1000" stroke="#1e293b" strokeWidth="40" fill="none" />
                <path d="M0 400 H 1000" stroke="#1e293b" strokeWidth="40" fill="none" />
            </svg>

            {/* Vehicle Markers */}
            <div className="relative w-full h-full">
                {vehicles.map((v, i) => {
                    // Update: Use actual realtime GPS coordinates if available, fallback to mock stable position
                    let x, y;
                    if (v.latitude && v.longitude) {
                        // The driver-console simulates around lat 13.0827 and lng 80.2707 +/- 0.01
                        // Map these coordinates directly to the 0-100% bounds of the map container
                        const latDiff = v.latitude - 13.0827;
                        const lngDiff = v.longitude - 80.2707;

                        // Scale up the differences so they fit optimally on our mock grid map
                        x = 50 + (lngDiff * 4000);
                        y = 50 - (latDiff * 4000);

                        // Clamp to prevent going off-screen (keep a safe 5% bounds)
                        x = Math.max(5, Math.min(95, x));
                        y = Math.max(5, Math.min(95, y));
                    } else {
                        // Random but stable position for mock fallback if no GPS
                        x = 20 + (parseInt(v.id.replace(/\D/g, '') || i) * 17) % 60;
                        y = 20 + (parseInt(v.id.replace(/\D/g, '') || i) * 23) % 60;
                    }

                    return (
                        <div
                            key={v.id}
                            className="absolute transition-all duration-1000 ease-linear"
                            style={{ left: `${x}%`, top: `${y}%` }}
                        >
                            <div className="relative group cursor-pointer hover:scale-110 transition-transform">
                                <div className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border-2 border-white animate-pulse">
                                    <Icon name="bus" size="text-[10px]" />
                                </div>
                                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md border border-slate-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">{v.id}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Spd: {v.speed || 0}km/h</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="absolute bottom-4 right-4 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm animate-fade-in group hover:bg-emerald-100 transition-colors cursor-default z-10">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Live GPS Telemetry</span>
            </div>
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

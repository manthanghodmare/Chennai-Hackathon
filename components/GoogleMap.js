function GoogleMap({ route, vehicles, fullScreen }) {
    const mapRef = React.useRef(null);
    const mapInstanceRef = React.useRef(null);
    const markersRef = React.useRef({});
    const stopMarkersRef = React.useRef([]);
    const routeLayerRef = React.useRef(null);

    React.useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const selectedCity = localStorage.getItem('selectedCity') || 'chennai';
        const cityData = window.CITY_DATA[selectedCity] || window.CITY_DATA['chennai'];
        const center = cityData.mapCenter || [13.0827, 80.2707];
        const zoom = cityData.mapZoom || 13;

        // Initialize Native Leaflet Map
        const map = L.map(mapRef.current, {
            zoomControl: false,
            attributionControl: false
        }).setView(center, zoom);
        mapInstanceRef.current = map;

        // Base Layer: Google Maps Road/Standard (like AgriSync without satellite if requested, but let's use m for standard road, s for satellite)
        // using standard roads to look like original tracker
        L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Fix for Leaflet sizing issues in dynamic containers
        setTimeout(() => {
            if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
        }, 300);

        const observer = new ResizeObserver(() => {
            if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
        });
        if (mapRef.current) {
            observer.observe(mapRef.current);
        }

        return () => {
            if (mapRef.current) observer.unobserve(mapRef.current);
            observer.disconnect();
            if (mapInstanceRef.current) mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Update Route
    React.useEffect(() => {
        if (!mapInstanceRef.current || !route) return;

        const map = mapInstanceRef.current;
        
        if (routeLayerRef.current) {
            map.removeLayer(routeLayerRef.current);
        }

        // Clear existing stop markers
        stopMarkersRef.current.forEach(m => map.removeLayer(m));
        stopMarkersRef.current = [];

        if (route && route.stops && route.stops.length > 0) {
            const selectedCity = localStorage.getItem('selectedCity') || 'chennai';
            const cityData = window.CITY_DATA[selectedCity] || window.CITY_DATA['chennai'];
            const cityCenter = cityData.mapCenter || [13.0827, 80.2707];

            const pathCoords = route.stops.map(stop => [stop.lat || cityCenter[0], stop.lng || cityCenter[1]]);
            
            const routeColor = route.color?.includes('blue') ? '#3B82F6' : (route.color?.includes('emerald') ? '#10B981' : '#8B5CF6');
            const baseColor = route.color?.includes('blue') ? '#1E3A8A' : (route.color?.includes('emerald') ? '#065F46' : '#5B21B6');

            routeLayerRef.current = L.polyline(pathCoords, {
                color: routeColor,
                weight: 6,
                opacity: 0.9,
                lineJoin: 'round'
            }).addTo(map);

            // Add Stop Markers with smaller Nexus logo
            route.stops.forEach((stop, idx) => {
                const stopLogoSvg = `<svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 85C50 85 80 60 80 40C80 23.4 66.6 10 50 10C33.4 10 20 23.4 20 40C20 60 50 85 50 85Z" fill="${baseColor}"/>
                    <circle cx="50" cy="40" r="15" fill="white" />
                    <text x="50" y="45" text-anchor="middle" font-size="20" font-weight="black" fill="${baseColor}">${idx + 1}</text>
                </svg>`;

                const stopIcon = L.divIcon({
                    className: 'custom-stop-marker bg-transparent border-0',
                    html: `
                        <div class="relative group cursor-help w-10 min-w-[40px] h-10 flex items-center justify-center mt-[-10px]">
                            ${stopLogoSvg}
                            <div class="absolute bottom-[42px] left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-2xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[600]">
                                <div class="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Bus Stop ${idx + 1}</div>
                                <div class="text-xs font-bold text-white">${stop.name}</div>
                            </div>
                        </div>
                    `,
                    iconSize: [40, 40],
                    iconAnchor: [20, 40]
                });

                const marker = L.marker([stop.lat || cityCenter[0], stop.lng || cityCenter[1]], { icon: stopIcon }).addTo(map);
                stopMarkersRef.current.push(marker);
            });

            map.fitBounds(routeLayerRef.current.getBounds(), { padding: [50, 50] });
        }

    }, [route]);

    // Update Vehicles
    React.useEffect(() => {
        if (!mapInstanceRef.current) return;
        const map = mapInstanceRef.current;

        const currentIds = (vehicles || []).map(v => v.id);

        // Remove old markers
        Object.keys(markersRef.current).forEach(id => {
            if (!currentIds.includes(id)) {
                map.removeLayer(markersRef.current[id]);
                delete markersRef.current[id];
            }
        });

        const busIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`;

        // Add/Update markers
        const selectedCity = localStorage.getItem('selectedCity') || 'chennai';
        const cityData = window.CITY_DATA[selectedCity] || window.CITY_DATA['chennai'];
        const cityCenter = cityData.mapCenter || [13.0827, 80.2707];

        // Filter vehicles to only show those belonging to the current city's routes
        const cityRouteIds = cityData.routes.map(r => r.id);
        const filteredVehicles = (vehicles || []).filter(v => cityRouteIds.includes(v.routeId));

        filteredVehicles.forEach(v => {
            const lat = v.latitude || cityCenter[0];
            const lng = v.longitude || cityCenter[1];
            
            const markerColor = v.status === 'delayed' ? 'text-amber-500' : 'text-blue-600';
            const baseColor = v.status === 'delayed' ? '#F59E0B' : '#1E3A8A';

            if (markersRef.current[v.id]) {
                const marker = markersRef.current[v.id];
                // basic animation to new latlng
                marker.setLatLng([lat, lng]);
            } else {
                const nexusLogoSvg = `<svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-lg group-hover:scale-110 transition-transform duration-300 origin-bottom" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 85C50 85 80 60 80 40C80 23.4 66.6 10 50 10C33.4 10 20 23.4 20 40C20 60 50 85 50 85Z" fill="${baseColor}"/>
                    <circle cx="50" cy="40" r="21" fill="white" />
                    <g transform="translate(32, 30) scale(0.36)">
                        <path d="M8 10h84c2.2 0 4 1.8 4 4v30c0 4.4-3.6 8-8 8H12c-4.4 0-8-3.6-8-8V14c0-2.2 1.8-4 4-4z" fill="${baseColor}"/>
                        <rect x="12" y="16" width="14" height="20" rx="2" fill="white" />
                        <rect x="30" y="16" width="14" height="20" rx="2" fill="white" />
                        <rect x="48" y="16" width="14" height="20" rx="2" fill="white" />
                        <rect x="66" y="16" width="14" height="20" rx="2" fill="white" />
                        <rect x="84" y="16" width="8" height="28" rx="2" fill="white" />
                        <circle cx="28" cy="52" r="8" fill="${baseColor}" stroke="white" stroke-width="3" />
                        <circle cx="72" cy="52" r="8" fill="${baseColor}" stroke="white" stroke-width="3" />
                    </g>
                    <path d="M38 75C38 75 42 85 50 85s12-10 12-10" fill="none" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round" transform="translate(0, 8)"/>
                </svg>`;

                // Custom Icon rendering as HTML
                const icon = L.divIcon({
                    className: 'custom-bus-marker bg-transparent border-0',
                    html: `
                        <div class="relative group cursor-pointer w-14 h-14 flex items-center justify-center mt-[-14px]">
                            ${nexusLogoSvg}
                            <div class="absolute bottom-[60px] left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                <div class="font-bold text-slate-900 text-xs mb-1">Vehicle ${v.id}</div>
                                <div class="text-[10px] text-slate-500 font-bold uppercase">Status: <span class="${markerColor}">${v.status || 'Active'}</span></div>
                                <div class="text-[10px] text-slate-500 font-bold uppercase mt-1">Speed: <span class="text-slate-900">${v.speed || 0} km/h</span></div>
                                <div class="text-[10px] text-slate-500 font-bold uppercase mt-1">Capacity: <span class="text-slate-900">${v.capacity || '0'}</span></div>
                            </div>
                        </div>
                    `,
                    iconSize: [56, 56],
                    iconAnchor: [28, 56] // Center horizontally, anchor to bottom
                });

                const marker = L.marker([lat, lng], { icon }).addTo(map);
                markersRef.current[v.id] = marker;
            }
        });

    }, [vehicles]);

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner border border-slate-200 bg-slate-100" data-map-type="leaflet">
            {/* The Real Mount Point */}
            <div ref={mapRef} className="w-full h-full z-0 font-sans"></div>

            {/* Map Overlay Controls */}
            <div className="absolute top-4 left-4 z-[400] space-y-2 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 pointer-events-auto transition-all hover:shadow-xl">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Active Fleet</p>
                    <p className="text-xl font-black text-slate-900">{(vehicles || []).length} Vehicles</p>
                </div>
            </div>

            <div className="absolute top-4 right-4 z-[400] pointer-events-none">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (mapInstanceRef.current) {
                            if (routeLayerRef.current) {
                                mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [50, 50] });
                            } else {
                                const selectedCity = localStorage.getItem('selectedCity') || 'chennai';
                                const cityData = window.CITY_DATA[selectedCity] || window.CITY_DATA['chennai'];
                                const center = cityData.mapCenter || [13.0827, 80.2707];
                                const zoom = cityData.mapZoom || 13;
                                mapInstanceRef.current.setView(center, zoom);
                            }
                        }
                    }}
                    className="flex items-center gap-2 bg-white/90 hover:bg-white backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200 shadow-lg transition-all hover:scale-105 active:scale-95 text-slate-700 hover:text-blue-600 pointer-events-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                    <span className="text-xs font-bold uppercase tracking-wide">Recenter</span>
                </button>
            </div>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 shadow-2xl flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    <span className="text-slate-900 text-xs font-black tracking-widest uppercase truncate whitespace-nowrap">Live GPS Tracking</span>
                </div>
            </div>
        </div>
    );
}

window.GoogleMap = GoogleMap;

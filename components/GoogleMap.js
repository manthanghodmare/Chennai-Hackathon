function MockMap({ vehicles }) {
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

    const getVehiclePosition = (v) => {
        const route = ROUTES.find(r => r.id === v.routeId);
        if (!route || !route.pathPoints || route.pathPoints.length < 2) {
            return { x: 50, y: 50 };
        }
        
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
        
        const vx = seg.p1.x + (seg.p2.x - seg.p1.x) * segRatio;
        const vy = seg.p1.y + (seg.p2.y - seg.p1.y) * segRatio;
        
        return {
            x: (vx / 1000) * 100,
            y: (vy / 600) * 100
        };
    };

    return (
        <div className="w-full h-full bg-[#f4f5f6] relative overflow-hidden flex items-center justify-center cursor-default bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950">
            <div className="absolute inset-0 w-full h-full origin-center transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" style={{ transform: getMapTransform() }}>
            {/* Detailed City Infrastructure SVG (Light Theme) */}
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
                {typeof ROUTES !== 'undefined' && ROUTES.map(route => {
                    if (!route.pathPoints || route.pathPoints.length < 2) return null;
                    const d = `M ${route.pathPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`;
                    const isSelected = selectedRouteId === route.id;
                    const opacity = selectedRouteId ? (isSelected ? 1 : 0.2) : 0.8;
                    const isHoverable = !selectedRouteId;
                    
                    return (
                        <path 
                            key={`route-${route.id}`} 
                            d={d} 
                            fill="none" 
                            strokeWidth={isSelected ? 12 : 8} 
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`${route.textColor} transition-all duration-500 cursor-pointer ${isHoverable ? 'hover:stroke-[14px] hover:opacity-100' : ''}`}
                            style={{ opacity, stroke: 'currentColor' }}
                            onClick={() => setSelectedRouteId(route.id)}
                        />
                    );
                })}
            </svg>

            {/* Vehicle Markers */}
            <div className="relative w-full h-full">
                {vehicles.map((v, i) => {
                    let pos;
                    if (v.latitude && v.longitude) {
                        const latDiff = v.latitude - 13.0827;
                        const lngDiff = v.longitude - 80.2707;
                        let px = 50 + (lngDiff * 4000);
                        let py = 50 - (latDiff * 4000);
                        pos = { 
                            x: Math.max(5, Math.min(95, px)), 
                            y: Math.max(5, Math.min(95, py)) 
                        };
                    } else {
                        pos = getVehiclePosition(v);
                    }
                    
                    // Fade out vehicles not on the selected route
                    const isSelected = !selectedRouteId || selectedRouteId === v.routeId;
                    const opacity = isSelected ? 1 : 0;
                    const pointerEvents = isSelected ? 'auto' : 'none';

                    return (
                        <div
                            key={v.id}
                            className="absolute transition-all duration-1000 ease-linear"
                            style={{ left: `${pos.x}%`, top: `${pos.y}%`, opacity, pointerEvents }}
                        >
                            <div className="relative group cursor-pointer">
                                {/* Beacon Glow */}
                                <div className={`absolute -inset-2 rounded-full blur-md opacity-30 animate-pulse ${v.status === 'delayed' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>

                                {/* Marker Body */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white transition-all group-hover:scale-110 active:scale-95 ${v.status === 'delayed' ? 'bg-amber-500' : 'bg-blue-600'}`}>
                                    <Icon name="bus-front" size="text-[12px]" />
                                </div>

                                {/* Detailed Tooltip */}
                                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl p-3 rounded-2xl shadow-xl border border-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all z-[100] scale-90 group-hover:scale-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-2 h-2 rounded-full animate-ping ${v.status === 'delayed' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">{v.id}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 font-bold flex justify-between gap-4">SPEED: <span className="text-slate-900">{v.speed || 0} km/h</span></p>
                                        <p className="text-[10px] text-slate-500 font-bold flex justify-between gap-4">CAPACITY: <span className="text-slate-900">{v.capacity || '0/40'}</span></p>
                                        <p className="text-[10px] text-slate-500 font-bold flex justify-between gap-4">STATUS: <span className={v.status === 'delayed' ? 'text-amber-500' : 'text-emerald-500'}>{v.status?.toUpperCase()}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-lg cursor-default z-10">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Mock Telemetry Active</span>
            </div>

            {selectedRouteId && (
                <button 
                    onClick={() => setSelectedRouteId(null)}
                    className="absolute top-6 left-6 bg-white/95 backdrop-blur-md border border-slate-200 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all z-20"
                >
                    <Icon name="arrow-left" className="text-slate-700" size="text-sm" />
                    <span className="font-black text-slate-900 uppercase tracking-widest text-xs">Reset View</span>
                </button>
            )}
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

    // Helper to calculate bearing between two coordinates
    const calculateBearing = (lat1, lng1, lat2, lng2) => {
        const dLon = (lng2 - lng1);
        const y = Math.sin(dLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        const brng = Math.atan2(y, x);
        const degrees = (brng * 180 / Math.PI + 360) % 360;
        return degrees;
    };

    // Helper to animate marker position smoothly
    const animateMarker = (marker, startPos, endPos, duration = 1500) => {
        const startTime = Date.now();

        // Prevent concurrent animations on the same marker
        if (marker.animationFrameId) {
            cancelAnimationFrame(marker.animationFrameId);
        }

        const step = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (easeOutQuad)
            const easeOutProgress = progress * (2 - progress);

            const currentLat = startPos.lat + (endPos.lat - startPos.lat) * easeOutProgress;
            const currentLng = startPos.lng + (endPos.lng - startPos.lng) * easeOutProgress;

            marker.setPosition({ lat: currentLat, lng: currentLng });

            if (progress < 1) {
                marker.animationFrameId = requestAnimationFrame(step);
            }
        };

        marker.animationFrameId = requestAnimationFrame(step);
    };


    // Initialize Map
    React.useEffect(() => {
        if (!hasGoogleMaps || !mapRef.current) return;

        try {
            googleMapRef.current = new google.maps.Map(mapRef.current, {
                center: { lat: 13.0827, lng: 80.2707 }, // Chennai center
                zoom: 14,
                styles: [
                    {
                        "featureType": "all",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "weight": "2.00"
                            }
                        ]
                    },
                    {
                        "featureType": "all",
                        "elementType": "geometry.stroke",
                        "stylers": [
                            {
                                "color": "#9c9c9c"
                            }
                        ]
                    },
                    {
                        "featureType": "all",
                        "elementType": "labels.text",
                        "stylers": [
                            {
                                "visibility": "on"
                            }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "all",
                        "stylers": [
                            {
                                "color": "#f2f2f2"
                            }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#f4f5f6"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "simplified"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.business",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.medical",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "all",
                        "stylers": [
                            {
                                "saturation": -100
                            },
                            {
                                "lightness": 45
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#eeeeee"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#7b7b7b"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.text.stroke",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "simplified"
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "transit.line",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "on"
                            }
                        ]
                    },
                    {
                        "featureType": "transit.station.bus",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "on"
                            }
                        ]
                    },
                    {
                        "featureType": "transit.station.bus",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "on"
                            },
                            {
                                "hue": "#3B82F6"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": [
                            {
                                "color": "#91d5eb" // Light blue from reference
                            },
                            {
                                "visibility": "on"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#8fdbef"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#070707"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels.text.stroke",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            }
                        ]
                    }
                ],
                disableDefaultUI: true,
                zoomControl: true
                // Remove tilt for 2D look
            });
        } catch (e) {
            console.warn("Google Maps initialization failed:", e);
            setMapError(true);
        }

        return () => {
             // Cleanup animations and markers
             Object.values(markersRef.current).forEach(m => {
                 if (m.animationFrameId) cancelAnimationFrame(m.animationFrameId);
                 m.setMap(null);
             });
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
                strokeOpacity: 0.8,
                strokeWeight: 4, // Reduce back to 4 for light map
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
                const marker = markersRef.current[v.id];
                const newPos = { lat: v.latitude || 13.0827, lng: v.longitude || 80.2707 };

                if (marker) {
                    // Marker exists, Animate to new position
                    if (v.latitude && v.longitude) {
                        const oldPos = { lat: marker.getPosition().lat(), lng: marker.getPosition().lng() };
                        
                        // Don't animate if position hasn't changed
                        if (oldPos.lat !== newPos.lat || oldPos.lng !== newPos.lng) {
                             // Calculate Rotation
                             const bearing = calculateBearing(oldPos.lat, oldPos.lng, newPos.lat, newPos.lng);
                             
                             // Update icon with new rotation
                             let icon = marker.getIcon();
                             icon.rotation = bearing;
                             marker.setIcon(icon);

                             // Animate position
                             animateMarker(marker, oldPos, newPos, 2000); // 2 seconds animation
                        }
                    }
                } else {
                    // Create new marker
                    const newMarker = new google.maps.Marker({
                        position: newPos,
                        map: googleMapRef.current,
                        title: `Vehicle ${v.id}`,
                        icon: {
                            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            scale: 5, // Back to normal size
                            fillColor: "#1E3A8A", // Original dark blue
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: "#FFFFFF",
                            rotation: 0 // Default rotation
                        }
                    });

                    const infoWindow = new google.maps.InfoWindow({
                        content: `<div><strong>Vehicle ${v.id}</strong><p>Status: ${v.status}</p><p>Capacity: ${v.capacity}</p></div>`
                    });

                    newMarker.addListener("click", () => {
                        infoWindow.open(googleMapRef.current, newMarker);
                    });

                    markersRef.current[v.id] = newMarker;
                }
            });

            // Remove markers for vehicles no longer in list
            const currentIds = vehicles.map(v => v.id);
            Object.keys(markersRef.current).forEach(id => {
                if (!currentIds.includes(id)) {
                    const m = markersRef.current[id];
                    if (m.animationFrameId) cancelAnimationFrame(m.animationFrameId);
                    m.setMap(null);
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
                <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 pointer-events-auto">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Active Fleet</p>
                    <p className="text-xl font-black text-slate-900">{vehicles.length} Vehicles</p>
                </div>
            </div>

            {/* Google Maps Redirection Button */}
            <div className="absolute top-4 right-4 z-10">
                <a 
                    href={route ? `https://www.google.com/maps/dir/?api=1&origin=${route.stops[0]?.lat},${route.stops[0]?.lng}&destination=${route.stops[route.stops.length-1]?.lat},${route.stops[route.stops.length-1]?.lng}` : `https://www.google.com/maps/@13.0827,80.2707,14z`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/90 hover:bg-white backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200 shadow-lg transition-all hover:scale-105 active:scale-95 text-slate-700 hover:text-[#3B82F6] group pointer-events-auto"
                >
                    <Icon name="external-link" size="text-sm" />
                    <span className="text-xs font-bold uppercase tracking-wide">Open in Maps</span>
                </a>
            </div>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
                <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 shadow-2xl flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    <span className="text-slate-900 text-xs font-black tracking-widest uppercase truncate whitespace-nowrap">Live Fleet Tracking</span>
                </div>
            </div>
        </div>
    );
}

window.GoogleMap = GoogleMap;

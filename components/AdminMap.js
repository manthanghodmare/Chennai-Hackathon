function AdminMap({ vehicles }) {
  const [selectedRouteId, setSelectedRouteId] = React.useState(null);
  
  const mapRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);
  const markersRef = React.useRef({});
  const routesLayerRef = React.useRef({});

  // Initialize Map
  React.useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, {
            zoomControl: false,
            attributionControl: false
        }).setView([13.0827, 80.2707], 12);
        mapInstanceRef.current = map;

        // Base Layer: Google Maps Road
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

  // Sync Routes
  React.useEffect(() => {
        if (!mapInstanceRef.current || typeof ROUTES === 'undefined') return;
        const map = mapInstanceRef.current;

        ROUTES.forEach(route => {
            if (!route.stops || route.stops.length < 2) return;
            
            const pathCoords = route.stops.map(stop => [stop.lat || 13.0827, stop.lng || 80.2707]);
            const isSelected = selectedRouteId === route.id;
            const opacity = selectedRouteId ? (isSelected ? 1 : 0.2) : 0.6;
            const weight = isSelected ? 8 : 5;
            const routeColor = route.color?.includes('blue') ? '#3B82F6' : (route.color?.includes('emerald') ? '#10B981' : '#8B5CF6');

            if (routesLayerRef.current[route.id]) {
                routesLayerRef.current[route.id].setStyle({ opacity, weight });
            } else {
                const polyline = L.polyline(pathCoords, {
                    color: routeColor,
                    weight: weight,
                    opacity: opacity,
                    lineJoin: 'round'
                }).addTo(map);
                
                polyline.on('click', () => {
                    setSelectedRouteId(route.id);
                });
                
                routesLayerRef.current[route.id] = polyline;
            }
        });

        // Fit bounds only when a new route is explicitly selected
        // To prevent constant zooming, we just jump to it once
        if (selectedRouteId && routesLayerRef.current[selectedRouteId]) {
            map.fitBounds(routesLayerRef.current[selectedRouteId].getBounds(), { padding: [50, 50], animate: true });
        } else if (selectedRouteId === null) {
            // Reset to full view
            map.setView([13.0827, 80.2707], 12);
        }

  }, [selectedRouteId]);

  // Sync Vehicles
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

        // Add/Update markers
        (vehicles || []).forEach(v => {
            const lat = v.latitude || 13.0827 + (Math.random() - 0.5) * 0.05;
            const lng = v.longitude || 80.2707 + (Math.random() - 0.5) * 0.05;
            
            const isSelected = !selectedRouteId || selectedRouteId === v.routeId;
            const opacityClass = isSelected ? 'opacity-100' : 'opacity-20 pointer-events-none';
            
            const markerColor = v.status === 'delayed' ? 'text-amber-500' : 'text-slate-700';
            const baseColor = v.status === 'delayed' ? '#F59E0B' : '#1E3A8A';

            if (markersRef.current[v.id]) {
                const marker = markersRef.current[v.id];
                marker.setLatLng([lat, lng]);
                // update opacity if needed
                if (marker._icon) {
                    marker._icon.style.opacity = isSelected ? '1' : '0.2';
                    marker._icon.style.pointerEvents = isSelected ? 'auto' : 'none';
                }
            } else {
                const nexusLogoSvg = `<svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md transition-transform duration-300 origin-bottom" xmlns="http://www.w3.org/2000/svg">
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

                // Admin Map has simpler, numbered markers but now uses Nexus Pin
                const icon = L.divIcon({
                    className: 'custom-admin-vehicle border-0 bg-transparent',
                    html: `
                        <div class="relative group cursor-pointer w-12 h-12 flex items-center justify-center transition-all duration-500 ${opacityClass} mt-[-12px]">
                            <div class="absolute -inset-1 rounded-full blur-sm opacity-20 animate-pulse bg-current"></div>
                            ${nexusLogoSvg}
                            <div class="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-white border-2 border-slate-200 shadow-lg flex items-center justify-center text-[#1E3A8A] font-black text-[10px] z-10">
                                ${v.id}
                            </div>
                            <div class="absolute bottom-[50px] left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                <div class="font-bold text-slate-900 text-xs mb-1">Route RT-${v.routeId}</div>
                                <div class="text-[10px] text-slate-500 font-bold uppercase mt-1">Status: <span class="${markerColor}">${v.status || 'Active'}</span></div>
                                <div class="text-[10px] text-slate-500 font-bold uppercase mt-1">Speed: <span class="text-slate-900">${v.speed || 0} km/h</span></div>
                            </div>
                        </div>
                    `,
                    iconSize: [48, 48],
                    iconAnchor: [24, 48]
                });

                const marker = L.marker([lat, lng], { icon }).addTo(map);
                markersRef.current[v.id] = marker;
            }
        });

  }, [vehicles, selectedRouteId]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col min-h-[800px] animate-fade-in transition-colors duration-500 relative" data-map-type="leaflet">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 transition-colors z-[400] relative">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white transition-colors">Global Fleet Tracking</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Live standard map tracking across the network</p>
        </div>
        <div className="flex gap-4">
          {typeof ROUTES !== 'undefined' && ROUTES.map(r => (
            <div key={r.id} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 transition-colors cursor-pointer hover:text-slate-900 dark:hover:text-white pointer-events-auto" onClick={() => { setSelectedRouteId(selectedRouteId === r.id ? null : r.id) }}>
              <span className={`w-3 h-3 rounded-full ${r.color}`}></span> Route {r.number || r.id}
            </div>
          ))}
        </div>
      </div>

      {/* Leaflet Map Mount Point */}
      <div className="h-[500px] relative bg-slate-100 dark:bg-slate-950 overflow-hidden border-b border-slate-100 dark:border-slate-800 transition-colors z-0" ref={mapRef}>
          {selectedRouteId && (
              <button 
                  onClick={() => { setSelectedRouteId(null); }}
                  className="absolute bottom-6 left-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all z-[400] pointer-events-auto cursor-pointer"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700 dark:text-slate-300"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                  <span className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Reset View</span>
              </button>
          )}
      </div>

      {/* Integrated Status Table */}
      <div className="flex-1 overflow-x-auto relative z-10">
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
                <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => setSelectedRouteId(v.routeId)}>
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

      <div className="p-4 bg-slate-900 dark:bg-black text-white flex justify-between items-center px-8 border-t border-white/5 transition-colors relative z-10">
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

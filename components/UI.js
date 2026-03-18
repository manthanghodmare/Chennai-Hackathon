function ToastContainer({ toasts }) {
    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`bg-[#0F172A]/90 backdrop-blur-xl text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-fade-in pointer-events-auto min-w-[320px] border border-white/5 transition-all ${toast.type === 'success' ? 'border-l-4 border-l-emerald-500' :
                        toast.type === 'error' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-blue-500'
                        }`}
                >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                        toast.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                        <Icon name={toast.type === 'success' ? 'check' : toast.type === 'error' ? 'circle-alert' : 'info'} size="text-sm" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-black uppercase tracking-[0.2em] mb-0.5 opacity-50">{toast.type}</p>
                        <p className="text-sm font-bold text-white">{toast.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 lg:p-8">
            <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-[#0F172A] border border-white/5 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] w-full max-w-xl max-h-[90vh] flex flex-col animate-fade-in relative z-10 overflow-hidden transition-all duration-500">
                <div className="p-8 pb-4 flex justify-between items-center bg-white/5">
                    <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">System Interface</p>
                        <h3 className="font-black text-2xl text-white tracking-tighter">{title}</h3>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 rounded-2xl transition-all active:scale-90">
                        <Icon name="x" size="text-xl" />
                    </button>
                </div>
                <div className="p-8 pt-6 overflow-y-auto custom-scrollbar flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}

function ScheduleModal({ route, onClose }) {
    return (
        <Modal isOpen={true} onClose={onClose} title={`Schedule: ${route.number} ${route.name}`}>
            <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl border border-blue-100 dark:border-blue-800/50 transition-colors">
                    <Icon name="info" />
                    <p className="text-sm">Buses run every <strong>{route.frequency}</strong> on weekdays.</p>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800 transition-colors">
                        <tr>
                            <th className="py-2 pl-2">Stop Name</th>
                            <th className="py-2">First Bus</th>
                            <th className="py-2">Last Bus</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {route.stops.map((stop, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <td className="py-3 pl-2 font-medium text-slate-700 dark:text-slate-300">{stop.name}</td>
                                <td className="py-3 text-slate-500 dark:text-slate-400">06:{15 + (i * 5)} AM</td>
                                <td className="py-3 text-slate-500 dark:text-slate-400">11:{30 + (i * 5)} PM</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="text-center">
                    <button className="text-[var(--primary)] font-bold text-sm hover:underline transition-all">Download PDF Schedule</button>
                </div>
            </div>
        </Modal>
    );
}

function SearchModal({ onClose, routes, vehicles }) {
    const defaultCity = localStorage.getItem('selectedCity') || 'chennai';
    const [city, setCity] = React.useState(defaultCity);
    const [query, setQuery] = React.useState('');
    const [source, setSource] = React.useState('');
    const [destination, setDestination] = React.useState('');

    const handleCityChange = (e) => {
        const newCity = e.target.value;
        setCity(newCity);
        localStorage.setItem('selectedCity', newCity);
        window.location.reload(); // Reload to refresh global routes & vehicles
    };

    // Get all unique stops for the dropdowns
    const allStops = React.useMemo(() => {
        const stops = new Set();
        routes.forEach(r => r.stops.forEach(s => stops.add(s.name)));
        return Array.from(stops).sort();
    }, [routes]);

    const filteredRoutes = routes.filter(r => {
        // Only show routes that currently have live active buses
        const hasLiveBus = vehicles && vehicles.some(v => v.routeId === r.id);
        if (!hasLiveBus) return false;

        const matchesQuery = r.name.toLowerCase().includes(query.toLowerCase()) || r.number.includes(query);

        if (!source && !destination) return matchesQuery;

        const sourceIndex = r.stops.findIndex(s => s.name === source);
        const destIndex = r.stops.findIndex(s => s.name === destination);

        if (source && destination) {
            return matchesQuery && sourceIndex !== -1 && destIndex !== -1 && sourceIndex < destIndex;
        } else if (source) {
            return matchesQuery && sourceIndex !== -1;
        } else if (destination) {
            return matchesQuery && destIndex !== -1;
        }

        return matchesQuery;
    });

    return (
        <Modal isOpen={true} onClose={onClose} title="Where is my Bus?">
            <div className="space-y-6 mb-8">
                {/* City Selection Dropdown */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Select City</label>
                    <div className="relative group">
                        <select
                            className="w-full pl-4 pr-10 py-4 bg-white/5 border border-white/5 text-white rounded-2xl outline-none text-sm appearance-none transition-all focus:border-blue-500/50 focus:bg-white/10 font-bold"
                            value={city}
                            onChange={handleCityChange}
                        >
                            {window.CITY_DATA ? Object.keys(window.CITY_DATA).map(c => (
                                <option key={c} value={c} className="bg-slate-900">{window.CITY_DATA[c].name}</option>
                            )) : <option value="chennai" className="bg-slate-900">Chennai</option>}
                        </select>
                        <Icon name="chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-blue-400 transition-colors" size="text-xs" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Departure Station</label>
                        <div className="relative group">
                            <select
                                className="w-full pl-4 pr-10 py-4 bg-white/5 border border-white/5 text-white rounded-2xl outline-none text-sm appearance-none transition-all focus:border-blue-500/50 focus:bg-white/10"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                            >
                                <option value="" className="bg-slate-900">All Stations</option>
                                {allStops.map(stop => <option key={stop} value={stop} className="bg-slate-900">{stop}</option>)}
                            </select>
                            <Icon name="chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-blue-400 transition-colors" size="text-xs" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Destination Station</label>
                        <div className="relative group">
                            <select
                                className="w-full pl-4 pr-10 py-4 bg-white/5 border border-white/5 text-white rounded-2xl outline-none text-sm appearance-none transition-all focus:border-blue-500/50 focus:bg-white/10"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            >
                                <option value="" className="bg-slate-900">All Stations</option>
                                {allStops.map(stop => <option key={stop} value={stop} className="bg-slate-900">{stop}</option>)}
                            </select>
                            <Icon name="chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-blue-400 transition-colors" size="text-xs" />
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by Bus Name or Number..."
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 text-white rounded-2xl focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-sm font-medium placeholder:text-slate-600"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Available Buses</p>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">{filteredRoutes.length} found</span>
                </div>

                {filteredRoutes.length > 0 ? filteredRoutes.map(route => {
                    // Calculate quick ETA if source is selected
                    let etaText = route.type;
                    if (source) {
                        const stop = route.stops.find(s => s.name === source);
                        if (stop) etaText = `Passing through ${source}`;
                    }

                    return (
                        <button
                            key={route.id}
                            onClick={() => {
                                window.dispatchEvent(new CustomEvent('set-route', { detail: route.id }));
                                onClose();
                            }}
                            className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all border border-slate-100 dark:border-slate-800 text-left active:scale-[0.98] group"
                        >
                            <span className={`w-12 h-10 flex items-center justify-center rounded-xl text-xs font-black text-white shadow-lg ${route.color} group-hover:scale-110 transition-transform`}>
                                {route.number}
                            </span>
                            <div className="flex-1">
                                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{route.name}</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{etaText}</p>
                            </div>
                            <Icon name="chevron-right" size="text-xs" className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </button>
                    );
                }) : (
                    <div className="text-center py-12 text-slate-400 dark:text-slate-600">
                        <Icon name="search-x" size="text-4xl" className="mx-auto mb-4 opacity-50" />
                        <p className="font-medium">No buses found for this trip.</p>
                        <button
                            onClick={() => { setSource(''); setDestination(''); setQuery(''); }}
                            className="mt-4 text-xs font-bold text-blue-500 hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
}
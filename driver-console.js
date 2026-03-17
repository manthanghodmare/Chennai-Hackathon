function DriverConsole() {
    const { user, logout } = Auth.useAuth();
    const [selectedBus, setSelectedBus] = React.useState('v1');
    const [selectedRoute, setSelectedRoute] = React.useState(null);
    const [isOnTrip, setIsOnTrip] = React.useState(false);
    const [showSOS, setShowSOS] = React.useState(false);
    const [showDropdown, setShowDropdown] = React.useState(false);
    const [currentSpeed, setCurrentSpeed] = React.useState(0);
    const [lastPosition, setLastPosition] = React.useState(null);
    const [tripProgress, setTripProgress] = React.useState(0);
    const [occupancy, setOccupancy] = React.useState('Low'); // Low, Medium, High
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const updateOccupancy = async (level) => {
        setOccupancy(level);
        if (!isOnTrip) return;

        const { db } = window.firebaseApp;
        try {
            await db.collection('vehicles').doc(selectedBus).update({
                capacity: level,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (err) {
            console.error("Occupancy Update Error:", err);
        }
    };

    const toggleTrip = async () => {
        if (!isOnTrip && !selectedRoute) {
            alert("Please select a route before starting the trip.");
            return;
        }

        const { db } = window.firebaseApp;
        const newStatus = !isOnTrip;

        try {
            await db.collection('vehicles').doc(selectedBus).set({
                status: newStatus ? 'On Time' : 'Idle',
                onTrip: newStatus,
                routeId: selectedRoute?.id || null,
                capacity: occupancy,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            setIsOnTrip(newStatus);
            if (!newStatus) {
                await db.collection('vehicles').doc(selectedBus).delete();
                setCurrentSpeed(0);
                setTripProgress(0);
            }
        } catch (err) {
            console.error("Firestore Update Error:", err);
        }
    };

    // Location Simulation for Driver
    React.useEffect(() => {
        if (!isOnTrip) return;

        const { db } = window.firebaseApp;
        let index = 0;

        const interval = setInterval(async () => {
            const lat = 13.0827 + (Math.sin(index / 10) * 0.01);
            const lng = 80.2707 + (Math.cos(index / 10) * 0.01);
            const now = Date.now();

            if (lastPosition) {
                const dist = Math.sqrt(Math.pow(lat - lastPosition.lat, 2) + Math.pow(lng - lastPosition.lng, 2)) * 111320;
                const timeDiff = (now - lastPosition.time) / 1000;
                if (timeDiff > 0) {
                    const speedKmh = (dist / timeDiff) * 3.6;
                    setCurrentSpeed(Math.round(speedKmh));
                }
            }

            setLastPosition({ lat, lng, time: now });
            setTripProgress(prev => (prev + 0.005) % 1);

            try {
                await db.collection('vehicles').doc(selectedBus).update({
                    latitude: lat,
                    longitude: lng,
                    speed: Math.round(currentSpeed),
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                });
            } catch (err) {
                console.error("Location Update Error:", err);
            }
            index++;
        }, 3000);

        return () => clearInterval(interval);
    }, [isOnTrip, lastPosition, currentSpeed, selectedBus]);

    const currentRouteData = selectedRoute || (ROUTES.length > 0 ? ROUTES[0] : null);
    const nextStopIndex = currentRouteData ? Math.min(Math.floor(tripProgress * currentRouteData.stops.length) + 1, currentRouteData.stops.length - 1) : 0;
    const nextStop = currentRouteData?.stops[nextStopIndex];

    return (
        <AccessGuard role="driver">
            <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 overflow-hidden" data-name="driver-console" data-file="driver-console.js">

                {/* HUD Top Bar */}
                <div className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5 w-full">
                    <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Logo size="lg" />
                            <div className="h-10 w-px bg-white/10 hidden md:block"></div>
                            <div className="hidden md:flex flex-col">
                                <span className="text-[10px] text-blue-400 uppercase tracking-[0.3em] font-black">Control Station</span>
                                <span className="font-mono text-xl font-black text-white leading-none tracking-tighter">{selectedBus.toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden lg:flex flex-col items-end">
                                <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black mb-1">Shift Adherence</span>
                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black text-emerald-400 uppercase">On Time</span>
                                </div>
                            </div>

                            <div className="hidden sm:flex items-center bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10 shadow-sm transition-all duration-500 mr-2">
                                <select
                                    className="bg-transparent text-white text-[10px] font-black rounded-lg py-1 px-1.5 outline-none cursor-pointer uppercase tracking-tight"
                                    value={localStorage.getItem('selectedCity') || 'chennai'}
                                    onChange={(e) => {
                                        localStorage.setItem('selectedCity', e.target.value);
                                        window.location.reload();
                                    }}
                                >
                                    <option className="bg-slate-900" value="chennai">CHN</option>
                                    <option className="bg-slate-900" value="mumbai">MUM</option>
                                    <option className="bg-slate-900" value="pune">PUN</option>
                                    <option className="bg-slate-900" value="nagpur">NAG</option>
                                    <option className="bg-slate-900" value="wardha">WAR</option>
                                </select>
                            </div>

                            <div className="relative group" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-3 p-1.5 pr-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all active:scale-95"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
                                        <Icon name="user" size="text-lg" className="text-white" />
                                    </div>
                                    <div className="text-left hidden sm:block">
                                        <p className="text-xs font-black text-white leading-none mb-0.5">{user?.name || 'Commander'}</p>
                                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest leading-none">Driver Rank</p>
                                    </div>
                                    <Icon name="chevron-down" size="text-[10px]" className="text-slate-500 group-hover:text-white transition-colors ml-1" />
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 top-full mt-3 w-64 bg-[#0F172A] border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-2 overflow-hidden animate-fade-in z-[60]">
                                        <div className="px-6 py-4 border-b border-white/5 bg-white/5 mb-1">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Authentication</p>
                                            <p className="text-sm font-black text-white truncate">{user?.name || 'Driver Console'}</p>
                                        </div>
                                        <button
                                            onClick={() => { logout(); window.location.href = 'index.html'; }}
                                            className="w-full text-left px-6 py-4 text-[10px] text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors font-black uppercase tracking-[0.3em]"
                                        >
                                            <Icon name="log-out" size="text-xs" /> Terminate Session
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <main className="flex-grow p-6 sm:p-8 flex flex-col gap-8 max-w-4xl mx-auto w-full relative z-10">

                    {/* Background Ambient Glow */}
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

                    {!isOnTrip ? (
                        /* Selection Screen - Improved */
                        <div className="bg-[#0F172A]/60 backdrop-blur-xl rounded-[3rem] p-10 border border-white/5 shadow-2xl animate-fade-in relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-blue-600/10 transition-colors duration-1000"></div>

                            <div className="relative z-10">
                                <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4 tracking-tighter">
                                    <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30">
                                        <Icon name="terminal" size="text-2xl" />
                                    </div>
                                    Deployment Config
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] block ml-1">Fleet Selection</label>
                                        <div className="relative group">
                                            <select
                                                value={selectedBus}
                                                onChange={(e) => setSelectedBus(e.target.value)}
                                                className="w-full p-5 bg-[#1E293B]/50 border border-white/5 rounded-2xl font-black text-white outline-none focus:border-blue-500 focus:bg-[#1E293B] transition-all appearance-none cursor-pointer text-lg tracking-tight"
                                            >
                                                <option value="v1">NEXUS LINER (V1)</option>
                                                <option value="v2">URBAN TRANSIT (V2)</option>
                                                <option value="v3">EXPRESS SHUTTLE (V3)</option>
                                            </select>
                                            <Icon name="chevron-down" className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-blue-400 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] block ml-1">Route Assignment</label>
                                        <div className="space-y-3">
                                            {ROUTES.map(route => (
                                                <button
                                                    key={route.id}
                                                    onClick={() => setSelectedRoute(route)}
                                                    className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${selectedRoute?.id === route.id
                                                        ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.1)]'
                                                        : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-lg ${route.color}`}>
                                                            {route.number}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="font-black text-white tracking-tight">{route.name}</p>
                                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{route.stops.length} Nodes • Online</p>
                                                        </div>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedRoute?.id === route.id ? 'border-blue-500 bg-blue-500' : 'border-white/10'
                                                        }`}>
                                                        {selectedRoute?.id === route.id && <Icon name="check" className="text-white text-[10px] stroke-[4px]" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={toggleTrip}
                                    disabled={!selectedRoute}
                                    className={`w-full py-8 rounded-3xl font-black text-2xl uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 group ${selectedRoute
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                                        : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                                        }`}
                                >
                                    <span className="flex items-center justify-center gap-4">
                                        Initialize Mission
                                        <Icon name="arrow-right" className="group-hover:translate-x-2 transition-transform" />
                                    </span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Live Trip Cockpit - High Tech */
                        <div className="space-y-8 animate-fade-in pb-12">

                            {/* Primary Instrument Cluster */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Speedometer */}
                                <div className="bg-[#0F172A]/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4 relative">Telemetry: Velocity</span>
                                    <div className="flex items-baseline gap-2 relative">
                                        <span className="text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                            {currentSpeed}
                                        </span>
                                        <span className="text-sm font-black text-slate-500 uppercase">KM/H</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 mt-6 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300" style={{ width: `${(currentSpeed / 80) * 100}%` }}></div>
                                    </div>
                                </div>

                                {/* Live Occupancy Control - NEW */}
                                <div className="md:col-span-2 bg-[#0F172A]/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                                    <div className="flex flex-col h-full">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Occupancy Commander</span>
                                            <div className="flex gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${occupancy === 'Low' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`}></div>
                                                <div className={`w-2 h-2 rounded-full ${occupancy === 'Medium' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-white/10'}`}></div>
                                                <div className={`w-2 h-2 rounded-full ${occupancy === 'High' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-white/10'}`}></div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 flex-1">
                                            <button
                                                onClick={() => updateOccupancy('Low')}
                                                className={`flex flex-col items-center justify-center gap-3 rounded-[1.5rem] border transition-all ${occupancy === 'Low' ? 'bg-emerald-500/20 border-emerald-500/50 text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                                            >
                                                <Icon name="user" size="text-2xl" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Minimal</span>
                                            </button>
                                            <button
                                                onClick={() => updateOccupancy('Medium')}
                                                className={`flex flex-col items-center justify-center gap-3 rounded-[1.5rem] border transition-all ${occupancy === 'Medium' ? 'bg-amber-500/20 border-amber-500/50 text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                                            >
                                                <Icon name="users" size="text-2xl" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Balanced</span>
                                            </button>
                                            <button
                                                onClick={() => updateOccupancy('High')}
                                                className={`flex flex-col items-center justify-center gap-3 rounded-[1.5rem] border transition-all ${occupancy === 'High' ? 'bg-red-500/20 border-red-500/50 text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                                            >
                                                <Icon name="users-round" size="text-2xl" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Peak</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mission Navigation Panel */}
                            <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-[3rem] p-10 text-white shadow-[0_30px_60px_rgba(2,6,23,0.4)] relative overflow-hidden group">
                                {/* Sci-fi animated scanner lines */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-10">
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="px-4 py-1.5 bg-white/10 border border-white/10 rounded-full text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md">Active Sector {selectedRoute.number}</span>
                                                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 font-mono">Real-time Adherence</span>
                                                </div>
                                            </div>
                                            <h3 className="text-5xl font-black tracking-tighter leading-none mb-2">{selectedRoute.name}</h3>
                                            <p className="text-blue-200/60 font-medium font-mono text-sm tracking-widest uppercase">Transit Node Cluster B-12</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200/50 mb-1">Impact Tracker</p>
                                            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
                                                <div className="flex items-center gap-3 text-emerald-400">
                                                    <Icon name="leaf" />
                                                    <span className="text-2xl font-black">42.5</span>
                                                    <span className="text-[10px] font-black opacity-60">KG/CO2</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="flex items-start gap-10">
                                            <div className="flex flex-col items-center gap-3 pt-2">
                                                <div className="w-4 h-4 rounded-full bg-white/20 border border-white/40"></div>
                                                <div className="w-1.5 h-20 bg-gradient-to-b from-white/20 via-white/60 to-white rounded-full"></div>
                                                <div className="w-8 h-8 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center">
                                                    <div className="w-3.5 h-3.5 rounded-full bg-blue-700 animate-pulse"></div>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="mb-8 opacity-40">
                                                    <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-2 text-blue-100">Retreated Node</p>
                                                    <p className="text-xl font-black">{selectedRoute.stops[Math.max(0, nextStopIndex - 1)].name}</p>
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full animate-ping opacity-20"></div>
                                                    <div className="flex justify-between items-end mb-2">
                                                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-300">Terminal Sequence</p>
                                                        <div className="flex items-center gap-2 text-blue-100 font-mono font-bold text-lg">
                                                            <Icon name="clock-3" size="text-sm" />
                                                            04:52
                                                        </div>
                                                    </div>
                                                    <p className="text-5xl font-black tracking-tighter drop-shadow-lg">{nextStop?.name || 'End of Mission'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group/progress">
                                            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Node Sync Status</span>
                                                    <span className="text-sm font-black text-blue-600 font-mono">{Math.round(tripProgress * 100)}%</span>
                                                </div>
                                                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                                                    <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000 shadow-lg" style={{ width: `${tripProgress * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cockpit HUD Controls */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button className="bg-[#0F172A]/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col items-center gap-4 active:scale-95 transition-all text-amber-500 group overflow-hidden relative">
                                    <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 group-hover:scale-110 transition-transform">
                                        <Icon name="clock-alert" size="text-3xl" />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-1">Schedule Log</span>
                                        <p className="font-black text-lg text-white">Report Anomaly</p>
                                    </div>
                                </button>
                                <button
                                    onClick={toggleTrip}
                                    className="bg-red-500 p-8 rounded-[2.5rem] border-b-8 border-red-700 shadow-[0_20px_40px_rgba(239,68,68,0.2)] flex flex-col items-center gap-4 active:scale-95 transition-all text-white group"
                                >
                                    <div className="p-4 bg-white/20 rounded-2xl border border-white/20 group-hover:scale-110 transition-transform shadow-lg">
                                        <Icon name="octagon-pause" size="text-3xl" />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-1 opacity-60">Mission State</span>
                                        <p className="font-black text-lg uppercase tracking-widest">End Trip Sequence</p>
                                    </div>
                                </button>
                            </div>

                            <button
                                onClick={() => setShowSOS(true)}
                                className="w-full bg-[#7F1D1D]/20 hover:bg-[#7F1D1D]/40 text-red-400 p-6 rounded-[2rem] font-black flex items-center justify-center gap-4 border border-red-500/20 transition-all uppercase tracking-[0.3em] text-sm group"
                            >
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                                <Icon name="siren" className="group-hover:rotate-12 transition-transform" />
                                Critical SOS Transmission
                            </button>
                        </div>
                    )}
                </main>

                {/* Cyber SOS Interface */}
                {showSOS && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020617]/95 backdrop-blur-3xl animate-fade-in">
                        <div className="bg-[#0F172A] rounded-[3.5rem] p-12 max-w-md w-full text-center shadow-[0_0_100px_rgba(239,68,68,0.3)] border border-red-500/20 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
                            <div className="w-28 h-28 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                                <Icon name="siren" size="text-5xl" />
                            </div>
                            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Emergency?</h2>
                            <p className="text-slate-500 font-medium mb-10 text-lg leading-relaxed px-4">Instant broadcast to central command and emergency responders with your precise telemetry data.</p>
                            <div className="flex flex-col gap-4">
                                <button className="w-full py-6 bg-red-600 text-white rounded-3xl font-black uppercase tracking-[0.3em] shadow-2xl shadow-red-600/40 hover:bg-red-700 transition-all active:scale-95 text-xl">Confirm Alert</button>
                                <button onClick={() => setShowSOS(false)} className="w-full py-5 bg-white/5 text-slate-400 rounded-3xl font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all text-xs">Abort Signal</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AccessGuard>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DriverConsole />);

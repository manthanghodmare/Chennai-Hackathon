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
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            setIsOnTrip(newStatus);
            if (!newStatus) {
                // Delete tracking record from Firestore when trip ends
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
                const dist = Math.sqrt(Math.pow(lat - lastPosition.lat, 2) + Math.pow(lng - lastPosition.lng, 2)) * 111320; // in meters
                const timeDiff = (now - lastPosition.time) / 1000; // in seconds
                if (timeDiff > 0) {
                    const speedKmh = (dist / timeDiff) * 3.6;
                    setCurrentSpeed(Math.round(speedKmh));
                }
            }

            setLastPosition({ lat, lng, time: now });
            setTripProgress(prev => (prev + 0.01) % 1);

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
            <div className="min-h-screen flex flex-col bg-slate-50" data-name="driver-console" data-file="driver-console.js">

                {/* Top Bar */}
                <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-md w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Logo size="md" />
                            <div className="h-8 w-px bg-slate-200"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Vehicle</span>
                                <span className="font-mono font-bold text-emerald-600 leading-none">{selectedBus.toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:flex flex-col items-end">
                                <span className="text-sm font-black text-slate-900 leading-tight">{user?.name || 'Driver'}</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">On Duty</span>
                            </div>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-[#1E3A8A] hover:bg-slate-200 transition-all shadow-sm"
                                >
                                    <Icon name="user" size="text-lg" />
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden animate-fade-in z-[60]">
                                        <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50 mb-1">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Signed in as</p>
                                            <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Driver'}</p>
                                        </div>
                                        <button
                                            onClick={() => { logout(); window.location.href = 'index.html'; }}
                                            className="w-full text-left px-4 py-3 text-[10px] text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-black uppercase tracking-[0.2em]"
                                        >
                                            <Icon name="log-out" size="text-xs" /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Areas */}
                <main className="flex-grow p-4 flex flex-col gap-6 max-w-2xl mx-auto w-full">

                    {!isOnTrip ? (
                        /* Selection Screen */
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/40 animate-fade-in">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                    <Icon name="check-check" size="text-xl" />
                                </div>
                                Pre-Trip Setup
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Assigned Vehicle</label>
                                    <select
                                        value={selectedBus}
                                        onChange={(e) => setSelectedBus(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none"
                                    >
                                        <option value="v1">BUS-V1 (Nexus Liner)</option>
                                        <option value="v2">BUS-V2 (Urban Transit)</option>
                                        <option value="v3">BUS-V3 (Express Shuttle)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Select Assigned Route</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {ROUTES.map(route => (
                                            <button
                                                key={route.id}
                                                onClick={() => setSelectedRoute(route)}
                                                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${selectedRoute?.id === route.id
                                                    ? 'border-blue-500 bg-blue-50/50 shadow-md'
                                                    : 'border-slate-100 bg-white hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white ${route.color}`}>
                                                        {route.number}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-bold text-slate-900 leading-tight">{route.name}</p>
                                                        <p className="text-xs text-slate-500">{route.stops.length} Stops • {route.frequency} frequency</p>
                                                    </div>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedRoute?.id === route.id ? 'border-blue-500 bg-blue-500' : 'border-slate-200'
                                                    }`}>
                                                    {selectedRoute?.id === route.id && <Icon name="check" className="text-white text-[10px]" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={toggleTrip}
                                    disabled={!selectedRoute}
                                    className={`w-full py-6 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-xl active:scale-95 border-b-4 ${selectedRoute
                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 border-emerald-700'
                                        : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                                        }`}
                                >
                                    START TRIP
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Live Trip Screen */
                        <div className="space-y-6 animate-fade-in">
                            {/* Stats Bar */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Current Speed</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black text-slate-900">{currentSpeed}</span>
                                        <span className="text-sm font-bold text-slate-400">km/h</span>
                                    </div>
                                </div>
                                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Occupancy</span>
                                    <div className="flex items-center gap-2">
                                        <Icon name="users" className="text-blue-500" />
                                        <span className="text-2xl font-black text-slate-800">42%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Active Trip Dashboard */}
                            <div className="bg-[#1E3A8A] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transform scale-150"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold tracking-widest uppercase backdrop-blur-sm">Active Route {selectedRoute.number}</span>
                                            <h3 className="text-3xl font-black mt-3 leading-tight">{selectedRoute.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1.5 rounded-full border border-green-500/50">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] font-black uppercase">GPS Active</span>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex items-start gap-6">
                                            <div className="flex flex-col items-center gap-1.5 pt-1">
                                                <div className="w-3 h-3 rounded-full bg-white/40"></div>
                                                <div className="w-1 h-12 bg-gradient-to-b from-white/40 to-white"></div>
                                                <div className="w-5 h-5 rounded-full bg-white shadow-lg shadow-white/20 flex items-center justify-center">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#1E3A8A]"></div>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="mb-6 opacity-60">
                                                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Last Stop</p>
                                                    <p className="text-lg font-bold">{selectedRoute.stops[Math.max(0, nextStopIndex - 1)].name}</p>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between items-end mb-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Next Destination</p>
                                                        <span className="text-xs font-bold text-blue-200">5 min</span>
                                                    </div>
                                                    <p className="text-4xl font-black">{nextStop?.name || 'End of Line'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/5">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Trip Progress</span>
                                                <span className="text-xs font-bold">{Math.round(tripProgress * 100)}%</span>
                                            </div>
                                            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${tripProgress * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trip Controls */}
                            <div className="grid grid-cols-2 gap-4">
                                <button className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all text-amber-600 font-bold">
                                    <div className="p-3 bg-amber-50 rounded-2xl">
                                        <Icon name="clock-alert" size="text-2xl" />
                                    </div>
                                    Report Delay
                                </button>
                                <button
                                    onClick={toggleTrip}
                                    className="bg-red-500 p-6 rounded-3xl border-b-4 border-red-700 shadow-xl shadow-red-500/20 flex flex-col items-center gap-3 active:scale-95 transition-all text-white font-black uppercase tracking-widest"
                                >
                                    <div className="p-3 bg-white/20 rounded-2xl">
                                        <Icon name="octagon-pause" size="text-2xl" />
                                    </div>
                                    End Trip
                                </button>
                            </div>

                            <button
                                onClick={() => setShowSOS(true)}
                                className="w-full bg-red-50 text-red-600 p-5 rounded-2xl font-black flex items-center justify-center gap-3 border border-red-100 hover:bg-red-100 transition-colors uppercase tracking-widest text-sm"
                            >
                                <Icon name="siren" /> EMERGENCY SOS
                            </button>
                        </div>
                    )}
                </main>

                {/* SOS Dialog */}
                {showSOS && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-red-100">
                            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                <Icon name="siren" size="text-4xl" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Confirm SOS?</h2>
                            <p className="text-slate-500 mb-8">This will immediately alert central dispatch and emergency services to your GPS location.</p>
                            <div className="flex flex-col gap-3">
                                <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-red-600/30 hover:bg-red-700 transition-all">Send Alert Now</button>
                                <button onClick={() => setShowSOS(false)} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
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

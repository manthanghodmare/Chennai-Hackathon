function DriverConsole() {
    const { user, logout } = Auth.useAuth();
    const [isOnTrip, setIsOnTrip] = React.useState(false);
    const [showSOS, setShowSOS] = React.useState(false);
    const [showDropdown, setShowDropdown] = React.useState(false);
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
        const { db } = window.firebaseApp;
        const newStatus = !isOnTrip;
        setIsOnTrip(newStatus);

        try {
            await db.collection('vehicles').doc('BUS-V1').set({
                status: newStatus ? 'On Time' : 'Idle',
                onTrip: newStatus,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } catch (err) {
            console.error("Firestore Update Error:", err);
        }
    };

    // Location Simulation for Driver
    React.useEffect(() => {
        if (!isOnTrip) return;

        const { db } = window.firebaseApp;
        let index = 0;

        // Use coordinates from mockData if available, or just mock some path
        const interval = setInterval(async () => {
            const lat = 13.0827 + (Math.sin(index / 10) * 0.01);
            const lng = 80.2707 + (Math.cos(index / 10) * 0.01);

            try {
                await db.collection('vehicles').doc('BUS-V1').update({
                    latitude: lat,
                    longitude: lng,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                });
            } catch (err) {
                console.error("Location Update Error:", err);
            }
            index++;
        }, 3000);

        return () => clearInterval(interval);
    }, [isOnTrip]);

    return (
        <AccessGuard role="driver">
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-500" data-name="driver-console" data-file="driver-console.js">

                {/* Top Bar */}
                <div className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 shadow-md w-full transition-colors duration-500">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Logo size="lg" />
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Settings Group */}
                            <div className="hidden sm:flex items-center bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl p-1 border border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-all duration-500">
                                <ThemeToggle />
                                <div className="w-px h-3 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                <select
                                    className="bg-transparent text-slate-600 dark:text-slate-300 text-[10px] font-black rounded-lg py-1 px-1.5 outline-none cursor-pointer uppercase tracking-tight transition-colors"
                                    defaultValue="en"
                                >
                                    <option value="en">ENG</option>
                                    <option value="hi">HIN</option>
                                    <option value="mr">MAR</option>
                                    <option value="ta">TAM</option>
                                </select>
                            </div>

                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Assigned Vehicle</p>
                                <p className="font-bold text-emerald-600 dark:text-emerald-400 font-mono tracking-wider transition-colors">BUS-V1</p>
                            </div>
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block transition-colors"></div>

                            <div className="flex items-center gap-4">
                                <div className="text-right flex flex-col items-end hidden sm:flex">
                                    <span className="text-base font-black text-slate-900 dark:text-white leading-tight transition-colors">{user?.name || 'Driver'}</span>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] font-bold">Operator</span>
                                </div>

                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-slate-200 dark:border-slate-700 text-[#1E3A8A] dark:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105 shadow-sm"
                                    >
                                        <Icon name="user" size="text-xl" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showDropdown && (
                                        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 overflow-hidden animate-fade-in z-[60]">
                                            <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 mb-1">
                                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Signed in as</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Driver'}</p>
                                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mt-1">Vehicle: BUS-V1</p>
                                            </div>
                                            <button className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors">
                                                <Icon name="settings" size="text-xs" className="text-slate-400" /> Console Settings
                                            </button>
                                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2"></div>
                                            <button
                                                onClick={() => { logout(); window.location.href = 'index.html'; }}
                                                className="w-full text-left px-4 py-3 text-[10px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors font-black uppercase tracking-[0.2em]"
                                            >
                                                <Icon name="log-out" size="text-xs" /> Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Control Area */}
                <main className="flex-grow p-4 flex flex-col gap-6 max-w-lg mx-auto w-full animate-fade-in">

                    {/* Route Info Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Route</span>
                                <h1 className="text-4xl font-black mt-1 text-slate-900 dark:text-white transition-colors">101</h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Downtown Loop</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${isOnTrip ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                                {isOnTrip ? 'LIVE' : 'IDLE'}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 transition-colors">
                            <div className="flex-1">
                                <p className="text-xs text-slate-400 dark:text-slate-500 mb-1 font-bold uppercase tracking-wider">Next Stop</p>
                                <p className="font-black text-xl text-slate-800 dark:text-white transition-colors">Market Square</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 dark:text-slate-500 mb-1 font-bold uppercase tracking-wider">Sched. Arr</p>
                                <p className="font-black text-xl text-slate-800 dark:text-white transition-colors">10:42 AM</p>
                            </div>
                        </div>
                    </div>

                    {/* Primary Action Button */}
                    <button
                        onClick={toggleTrip}
                        className={`w-full py-6 rounded-2xl font-black text-2xl uppercase tracking-widest shadow-xl transform transition-all active:scale-95 border-b-4 ${isOnTrip
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30 border-red-700'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 border-emerald-700'
                            }`}
                    >
                        {isOnTrip ? 'End Trip' : 'Start Trip'}
                    </button>

                    {/* Secondary Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center gap-3 transition-colors group">
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400 rounded-full group-hover:scale-110 transition-transform shadow-sm">
                                <Icon name="clock-alert" size="text-2xl" />
                            </div>
                            <span className="font-bold text-slate-600 dark:text-slate-300">Report Delay</span>
                        </button>
                        <button className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center gap-3 transition-colors group">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 rounded-full group-hover:scale-110 transition-transform shadow-sm">
                                <Icon name="wrench" size="text-2xl" />
                            </div>
                            <span className="font-bold text-slate-600 dark:text-slate-300">Maintenance</span>
                        </button>
                    </div>

                    {/* SOS Button */}
                    <div className="mt-auto pt-4">
                        <button
                            onClick={() => setShowSOS(!showSOS)}
                            className="w-full bg-white dark:bg-slate-900 border-2 border-red-100 dark:border-red-900/30 text-red-500 dark:text-red-400 p-4 rounded-xl font-black hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-800 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                        >
                            <Icon name="siren" /> EMERGENCY SOS
                        </button>
                        {showSOS && (
                            <div className="mt-4 p-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-center animate-fade-in shadow-xl">
                                <p className="text-red-700 dark:text-red-400 font-black mb-4 uppercase tracking-tight">Confirm Emergency Signal?</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowSOS(false)} className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                                    <button className="flex-1 bg-red-600 text-white py-3 rounded-xl text-sm font-black shadow-lg shadow-red-500/30 hover:bg-red-700 active:scale-95 transition-all">CONFIRM</button>
                                </div>
                            </div>
                        )}
                    </div>

                </main>
            </div>
        </AccessGuard>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DriverConsole />);
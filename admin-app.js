function AdminHeader({ currentView, setView, onOpenSettings }) {
    const { user, logout } = Auth.useAuth();
    const [showDropdown, setShowDropdown] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);
    const lang = localStorage.getItem('preferredLanguage') || 'en';
    const t = (key) => window.t(key, lang);

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navItems = [
        { id: 'overview', label: t('dashboard') },
        { id: 'fleet', label: t('live_map') },
        { id: 'alerts', label: t('alerts') },
        { id: 'reports', label: 'Reports' }
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 shadow-md w-full transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Icon name={isMobileMenuOpen ? "x" : "menu"} size="text-2xl" />
                    </button>
                    <Logo size="lg" />
                </div>
                <nav className="hidden md:flex items-center gap-3">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id)}
                            className={`px-6 py-3 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 ${currentView === item.id
                                ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1E3A8A] dark:hover:text-blue-400'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-24 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg py-4 px-4 flex flex-col gap-2 z-50 animate-fade-in">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setView(item.id);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`px-4 py-3 rounded-xl font-bold text-left transition-colors ${currentView === item.id
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {/* Settings Group */}
                    <div className="hidden sm:flex items-center bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl p-1 border border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-all duration-500">
                        <ThemeToggle />
                        <div className="w-px h-3 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <select
                            className="bg-transparent text-slate-600 dark:text-slate-300 text-[10px] font-black rounded-lg py-1 px-1.5 outline-none cursor-pointer uppercase tracking-tight transition-colors"
                            value={localStorage.getItem('selectedCity') || 'chennai'}
                            onChange={(e) => {
                                localStorage.setItem('selectedCity', e.target.value);
                                window.location.reload();
                            }}
                        >
                            <option value="chennai">CHN</option>
                            <option value="mumbai">MUM</option>
                            <option value="pune">PUN</option>
                            <option value="nagpur">NAG</option>
                            <option value="wardha">WAR</option>
                        </select>
                        <div className="w-px h-3 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <select
                            className="bg-transparent text-slate-600 dark:text-slate-300 text-[10px] font-black rounded-lg py-1 px-1.5 outline-none cursor-pointer uppercase tracking-tight transition-colors"
                            value={localStorage.getItem('preferredLanguage') || 'en'}
                            onChange={(e) => {
                                localStorage.setItem('preferredLanguage', e.target.value);
                                window.location.reload();
                            }}
                        >
                            <option value="en">ENG</option>
                            <option value="hi">HIN</option>
                            <option value="mr">MAR</option>
                            <option value="ta">TAM</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                        <div className="flex flex-col items-end">
                            <p className="text-base font-black text-slate-900 dark:text-white leading-tight transition-colors">{user?.name || 'Admin'}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] font-bold">Administrator</p>
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
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 overflow-hidden animate-fade-in z-[60]">
                                    <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 mb-1">
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Signed in as</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Admin'}</p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            if (onOpenSettings) onOpenSettings();
                                            setShowDropdown(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
                                    >
                                        <Icon name="settings" size="text-xs" className="text-slate-400" /> Settings
                                    </button>
                                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2"></div>
                                    <button
                                        onClick={() => { logout(); window.location.href = 'index.html'; }}
                                        className="w-full text-left px-4 py-2.5 text-[10px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors font-black uppercase tracking-[0.2em]"
                                    >
                                        <Icon name="log-out" size="text-xs" /> {t('sign_out')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function AnalyticsChart({ timeframe = 'day' }) {
    const canvasRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    React.useEffect(() => {
        if (!canvasRef.current) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const dataSets = {
            day: {
                labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
                load: [120, 850, 400, 350, 450, 900, 750, 300],
                fleet: [5, 12, 10, 8, 9, 12, 11, 6]
            },
            week: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                load: [4500, 4800, 4600, 5100, 5800, 2200, 1800],
                fleet: [12, 12, 12, 14, 15, 8, 6]
            }
        };

        const currentData = dataSets[timeframe] || dataSets['day'];

        const ctx = canvasRef.current.getContext('2d');
        const chart = new ChartJS(ctx, {
            type: 'line',
            data: {
                labels: currentData.labels,
                datasets: [{
                    label: 'Passenger Load',
                    data: currentData.load,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Fleet Active',
                    data: currentData.fleet,
                    borderColor: '#10b981',
                    borderDash: [5, 5],
                    tension: 0.1,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                scales: {
                    y: { beginAtZero: true, grid: { display: false } },
                    y1: { position: 'right', grid: { display: false }, min: 0 }
                }
            }
        });
        
        chartInstance.current = chart;

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [timeframe]);

    return <div className="h-64"><canvas ref={canvasRef}></canvas></div>;
}

function AdminApp() {
    const [vehicles, setVehicles] = React.useState(VEHICLES);
    const [currentView, setCurrentView] = React.useState('overview'); // overview, fleet, alerts, reports
    const [showMap, setShowMap] = React.useState(false);
    const [alertText, setAlertText] = React.useState('');
    const [alertTarget, setAlertTarget] = React.useState('All Passengers');
    const [chartTimeframe, setChartTimeframe] = React.useState('day');
    const [showSettings, setShowSettings] = React.useState(false);
    const [showSchedule, setShowSchedule] = React.useState(false);
    const [emergencies, setEmergencies] = React.useState([]);
    const [toastMessage, setToastMessage] = React.useState(null);

    const broadcastInputRef = React.useRef(null);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Real-time Firestore Sync for Vehicles and Emergencies
    React.useEffect(() => {
        const { db } = window.firebaseApp;
        
        const unsubVehicles = db.collection('vehicles').onSnapshot((snapshot) => {
            const updatedVehicles = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            if (updatedVehicles.length > 0) {
                setVehicles(updatedVehicles);
            }
        });

        const unsubEmergencies = db.collection('emergencies').where('status', '==', 'active').onSnapshot((snapshot) => {
            const activeEmergencies = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEmergencies(activeEmergencies);
        });

        return () => {
            unsubVehicles();
            unsubEmergencies();
        };
    }, []);

    const handleResolveEmergency = async (id) => {
        const { db } = window.firebaseApp;
        try {
            await db.collection('emergencies').doc(id).update({
                status: 'resolved',
                resolvedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            showToast('Emergency marked as resolved.');
        } catch (err) {
            console.error("Resolution Error:", err);
        }
    };

    const handleBroadcast = async () => {
        if (!alertText.trim()) return;

        const { db } = window.firebaseApp;
        try {
            await db.collection('alerts').add({
                type: 'warning',
                message: alertText,
                target: alertTarget,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                active: true
            });
            setAlertText('');
            showToast('Alert broadcasted successfully!');
        } catch (error) {
            console.error("Error broadcasting alert:", error);
            showToast('Failed to send broadcast.');
        }
    };

    const handleClearAllTracking = async () => {
        if (!confirm("Are you sure you want to clear ALL live tracking data? This action cannot be undone.")) return;

        const { db } = window.firebaseApp;
        try {
            const snapshot = await db.collection('vehicles').get();
            const docs = [];
            snapshot.forEach(doc => docs.push(doc));

            for (const doc of docs) {
                await db.collection('vehicles').doc(doc.id).delete();
            }

            showToast('All live tracking data has been cleared.');
            setVehicles([]);
        } catch (error) {
            console.error("Error clearing tracking data:", error);
            showToast('Failed to clear data. Please check console for details.');
        }
    };

    const handleSeedCity = async () => {
        if (!confirm("This will overwrite current tracking data with demo vehicles. Proceed?")) return;

        const { db } = window.firebaseApp;
        try {
            // Clear existing first
            const snapshot = await db.collection('vehicles').get();
            for (const doc of snapshot.docs) {
                await db.collection('vehicles').doc(doc.id).delete();
            }

            const seedVehicles = [
                { id: 'v1', routeId: '101', latitude: 13.0827, longitude: 80.2707, speed: 45, status: 'On Time', capacity: 'Low', onTrip: true },
                { id: 'v2', routeId: '101', latitude: 13.0850, longitude: 80.2750, speed: 30, status: 'Delayed', capacity: 'High', onTrip: true },
                { id: 'v3', routeId: '202', latitude: 13.0900, longitude: 80.2800, speed: 55, status: 'On Time', capacity: 'Medium', onTrip: true },
                { id: 'v4', routeId: '305', latitude: 13.0750, longitude: 80.2600, speed: 40, status: 'Early', capacity: 'Low', onTrip: true },
                { id: 'v5', routeId: '202', latitude: 13.0800, longitude: 80.2650, speed: 0, status: 'Idle', capacity: 'Minimal', onTrip: false }
            ];

            for (const v of seedVehicles) {
                await db.collection('vehicles').doc(v.id).set({
                    ...v,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            showToast('City successfully seeded with demo vehicles!');
        } catch (error) {
            console.error("Seeding Error:", error);
            showToast('Failed to seed city.');
        }
    };

    return (
        <AccessGuard role="admin">
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12 transition-colors duration-500" data-name="admin-app" data-file="admin-app.js">
                <AdminHeader currentView={currentView} setView={setCurrentView} onOpenSettings={() => setShowSettings(true)} />

                <main className="max-w-7xl mx-auto px-4 mt-8 space-y-8 animate-fade-in">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                        <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4 border-l-4 border-l-[#3B82F6] hover:scale-105 transition-all cursor-pointer shadow-sm group" onClick={() => setCurrentView('fleet')}>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-[#3B82F6] dark:text-blue-400 group-hover:bg-[#3B82F6] group-hover:text-white transition-colors"><Icon name="bus" /></div>
                            <div><p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Buses Running</p><p className="text-2xl font-black text-slate-900 dark:text-white transition-colors">{vehicles.length}</p></div>
                        </div>

                        <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4 border-l-4 border-l-amber-500 hover:scale-105 transition-all cursor-pointer shadow-sm group" onClick={() => setCurrentView('overview')}>
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors"><Icon name="clock-alert" /></div>
                            <div><p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Delayed Buses</p><p className="text-2xl font-black text-slate-900 dark:text-white transition-colors">{vehicles.filter(v => v.status === 'Delayed').length}</p></div>
                        </div>

                        <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4 border-l-4 border-l-slate-400 hover:scale-105 transition-all cursor-pointer shadow-sm group">
                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 group-hover:bg-slate-400 group-hover:text-white transition-colors"><Icon name="power-off" /></div>
                            <div><p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Offline Units</p><p className="text-2xl font-black text-slate-900 dark:text-white transition-colors">0</p></div>
                        </div>

                        <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4 border-l-4 border-l-green-500 shadow-sm">
                            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400"><Icon name="activity" /></div>
                            <div><p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">On Time %</p><p className="text-2xl font-black text-slate-900 dark:text-white transition-colors">87%</p></div>
                        </div>

                        <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4 border-l-4 border-l-[#F59E0B] shadow-sm">
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-[#F59E0B] dark:text-amber-500"><Icon name="users" /></div>
                            <div><p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">System Load</p><p className="text-2xl font-black text-slate-900 dark:text-white transition-colors">Low</p></div>
                        </div>

                        <div className={`card bg-white dark:bg-slate-900 border flex items-center gap-4 border-l-4 transition-all hover:scale-105 cursor-pointer shadow-sm group ${emergencies.length > 0 ? 'border-l-red-600 animate-pulse ring-2 ring-red-500/20' : 'border-l-red-500'}`} onClick={() => setCurrentView('alerts')}>
                            <div className={`p-3 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors ${emergencies.length > 0 ? 'bg-red-600 text-white' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                                <Icon name="triangle-alert" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Active SOS</p>
                                <p className={`text-2xl font-black transition-colors ${emergencies.length > 0 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>{emergencies.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* View Switcher/Main Content */}
                    {currentView === 'overview' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Critical Monitoring Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Delay Monitor */}
                                <div className="lg:col-span-2 card border-l-4 border-l-red-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                            </div>
                                            <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-sm">Real-time Delay Monitor</h3>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Scanning</span>
                                    </div>
                                    <div className="space-y-4">
                                        {vehicles.filter(v => v.status === 'Delayed').map(v => (
                                            <div key={v.id} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30 group transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-sm text-red-600 dark:text-red-400">
                                                        <Icon name="bus" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 dark:text-white">Vehicle {v.id}</p>
                                                        <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase">Delayed • Route {v.routeId}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setCurrentView('fleet')} className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                                                        Track on Map
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setAlertTarget('By Route Type');
                                                            setAlertText(`Delay Alert: Bus ${v.id} on Route ${v.routeId} is delayed. Expect increased wait times.`);
                                                            showToast("Alert pre-filled. Please review and broadcast.");
                                                            setTimeout(() => {
                                                                if (broadcastInputRef.current) {
                                                                    broadcastInputRef.current.focus();
                                                                    broadcastInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                                }
                                                            }, 100);
                                                        }} 
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-all shadow-md shadow-red-500/20"
                                                    >
                                                        Notify Users
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {vehicles.filter(v => v.status === 'Delayed').length === 0 && (
                                            <div className="text-center py-8">
                                                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Icon name="check" />
                                                </div>
                                                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm text-center">No major delays detected. System running smoothly.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Schedule Card */}
                                <div className="card bg-slate-900 dark:bg-black text-white border-none shadow-2xl relative overflow-hidden group transition-colors duration-500">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                                    <h3 className="font-black text-[#F59E0B] mb-6 flex items-center gap-2 uppercase tracking-wider text-sm">
                                        <Icon name="calendar" size="text-xs" />
                                        Schedule Management
                                    </h3>
                                    <div className="space-y-6 relative z-10">
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Upcoming Maintenance</p>
                                            <p className="text-sm font-bold text-blue-300">Tram #T12 - Tomorrow 02:00 AM</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Next Shift Change</p>
                                            <p className="text-sm font-bold text-emerald-300">All Routes - 06:00 AM</p>
                                        </div>
                                        <button 
                                            onClick={() => setShowSchedule(true)}
                                            className="w-full py-4 bg-white text-slate-900 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                                        >
                                            Manage Full Schedule
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Broadcast Alert Center */}
                            <div className="card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-colors">
                                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-sm mb-6">Nexus Broadcast Center</h3>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <input
                                            ref={broadcastInputRef}
                                            type="text"
                                            value={alertText}
                                            onChange={(e) => setAlertText(e.target.value)}
                                            placeholder="Emergency broadcast message..."
                                            className="w-full h-14 pl-4 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:text-white transition-all"
                                        />
                                        <div className="absolute right-4 top-4 text-red-500"><Icon name="mic" /></div>
                                    </div>
                                    <select
                                        value={alertTarget}
                                        onChange={(e) => setAlertTarget(e.target.value)}
                                        className="h-14 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-slate-400 transition-colors"
                                    >
                                        <option>All Passengers</option>
                                        <option>Active Riders Only</option>
                                        <option>By Route Type</option>
                                    </select>
                                    <button
                                        onClick={handleBroadcast}
                                        className="h-14 px-8 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-500/20"
                                    >
                                        Broadcast Alert
                                    </button>
                                </div>
                            </div>

                            {/* Middle Row: Route Status & Analytical charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Route Status Grid */}
                                <div className="card lg:col-span-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-colors">
                                    <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-sm mb-6">Route Operations</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {ROUTES.map(route => {
                                            const routeVehicles = vehicles.filter(v => v.routeId === route.id);
                                            const hasDelay = routeVehicles.some(v => v.status === 'Delayed');
                                            return (
                                                <div key={route.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer group bg-slate-50/30 dark:bg-slate-800/20" onClick={() => setCurrentView('fleet')}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg ${route.color} flex items-center justify-center text-white text-[10px] font-black shadow-sm group-hover:scale-110 transition-transform`}>
                                                            {route.number}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors">{route.name}</p>
                                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{route.type} • {routeVehicles.length} Active</p>
                                                        </div>
                                                    </div>
                                                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-colors ${hasDelay ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`}>
                                                        {hasDelay ? 'Attention' : 'Optimal'}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Main Analytics Chart */}
                                <div className="card lg:col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-colors">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-sm">Fleet Performance Analytics</h3>
                                        <div className="flex flex-wrap gap-2 justify-end">
                                            <button 
                                                onClick={() => setChartTimeframe('day')}
                                                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors ${chartTimeframe === 'day' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                            >
                                                Day
                                            </button>
                                            <button 
                                                onClick={() => setChartTimeframe('week')}
                                                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors ${chartTimeframe === 'week' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                            >
                                                Week
                                            </button>
                                            <button
                                                onClick={handleSeedCity}
                                                className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all border border-emerald-100 dark:border-emerald-900/30"
                                            >
                                                <Icon name="database" size="text-xs" className="mr-1" />
                                                Seed City Demo
                                            </button>
                                            <button
                                                onClick={handleClearAllTracking}
                                                className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-all border border-red-100 dark:border-red-900/30"
                                            >
                                                <Icon name="trash-2" size="text-xs" className="mr-1" />
                                                Clear All Tracking
                                            </button>
                                            <button onClick={() => setCurrentView('fleet')} className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-xs font-bold hover:bg-[#2563EB] transition-all shadow-md shadow-blue-500/20">Analyze All</button>
                                        </div>
                                    </div>
                                    <AnalyticsChart timeframe={chartTimeframe} />
                                </div>
                            </div>
                            
                            {/* Demand Hotspots Widget (X-Factor Feature) */}
                            <div className="mt-8 card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-colors">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2">
                                        <Icon name="users" className="text-emerald-500" />
                                        Live Demand Hotspots
                                    </h3>
                                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 rounded-full animate-pulse">
                                        Real-Time Passenger Aggregation Active
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {(() => {
                                        // Aggregate all stops and sort by waitingCount
                                        let allStops = [];
                                        ROUTES.forEach(r => {
                                            r.stops.forEach(s => {
                                                allStops.push({ ...s, routeName: r.name, routeColor: r.color, routeNumber: r.number });
                                            });
                                        });
                                        allStops.sort((a, b) => (b.waitingCount || 0) - (a.waitingCount || 0));
                                        
                                        // Take top 4 hotspots
                                        return allStops.slice(0, 4).map((stop, i) => (
                                            <div key={`${stop.id}-${i}`} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between group hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all cursor-pointer">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <p className="font-black text-slate-800 dark:text-white mb-1 line-clamp-1">{stop.name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`w-2 h-2 rounded-full ${stop.routeColor}`}></span>
                                                            <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Route {stop.routeNumber}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                                        <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 leading-none">{stop.waitingCount || 0}</span>
                                                        <span className="text-[8px] font-black uppercase text-slate-400 mt-0.5">Waiting</span>
                                                    </div>
                                                </div>
                                                <button className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-1">
                                                    Dispatch Extra Unit
                                                </button>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                            
                            {/* Vision AI Recovery Logs (Hackathon Demo Feature) */}
                            <div className="mt-8 rounded-[1.5rem] bg-[#0A0F1E] border border-blue-500/20 relative overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.07)]">
                                {/* Glowing top accent */}
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>

                                {/* Header */}
                                <div className="flex justify-between items-center px-6 pt-5 pb-4 border-b border-white/5 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                            <Icon name="scan-face" size="text-base" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-white text-sm uppercase tracking-widest">Vision AI Recovery Logs</h3>
                                            <p className="text-[10px] text-blue-400/60 font-bold">Gemini Vision • End-of-Shift Cabin Scan</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Scan Network Active</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-3 relative z-10">
                                    {/* Recovered Item — success row */}
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white/[0.03] border-l-4 border-l-emerald-500 border border-emerald-500/20 rounded-xl hover:bg-white/[0.05] transition-colors">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                                <Icon name="check-circle-2" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-widest rounded border border-blue-500/30">Bus 12B</span>
                                                    <span className="text-[10px] text-slate-500 font-mono">ID: #RX-782</span>
                                                    <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 text-[10px] font-black uppercase rounded border border-emerald-500/20">Match 98.4%</span>
                                                </div>
                                                <p className="text-white font-black">Red Tupperware Box</p>
                                                <p className="text-xs text-slate-400 truncate">Detected on Seat 4 • Matched with active passenger report.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mt-3 md:mt-0 md:ml-4 shrink-0">
                                            <div className="text-right hidden md:block">
                                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Status</p>
                                                <p className="text-sm text-white font-bold">Secured at Depot</p>
                                            </div>
                                            <button className="px-5 py-2 bg-white text-slate-900 font-black text-xs uppercase tracking-widest rounded-lg hover:bg-slate-100 transition-colors shadow-lg">
                                                View Item
                                            </button>
                                        </div>
                                    </div>

                                    {/* Empty scan — dimmed row */}
                                    <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl opacity-50">
                                        <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center text-slate-500 shrink-0">
                                            <Icon name="search" size="text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-slate-300 font-bold text-sm">Routine Cabin Scan</p>
                                            <p className="text-xs text-slate-500">Bus 101 • No lost items detected.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentView === 'fleet' && (
                        <div className="animate-fade-in">
                            <AdminMap vehicles={vehicles} />
                        </div>
                    )}

                    {currentView === 'alerts' && (
                        <AdminAlerts alerts={ALERTS} />
                    )}

                    {currentView === 'reports' && (
                        <div className="animate-fade-in flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4"><Icon name="file-text" size="text-3xl" /></div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2 transition-colors">Reports Dashboard</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-center max-w-md transition-colors">Detailed analytical reports are generated weekly. Enhanced reporting tools are coming in the next update.</p>
                            <button onClick={() => showToast('Report generation queued.')} className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl font-black tracking-widest text-xs uppercase hover:bg-blue-500 transition-all shadow-lg active:scale-95">Generate Now</button>
                        </div>
                    )}

                </main>

                {/* Modals and Overlays */}
                {showSettings && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in p-4">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl relative">
                            <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Icon name="x" /></button>
                            <h2 className="text-xl font-black text-slate-800 dark:text-white mb-6 uppercase tracking-wider">Admin Settings</h2>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <p className="font-bold text-slate-800 dark:text-white mb-1">Theme Preferences</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Toggle dark mode from the top navigation bar.</p>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <p className="font-bold text-slate-800 dark:text-white mb-1">Notification Thresholds</p>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Delay Alert Limit</span>
                                        <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded block px-2 py-1 text-sm outline-none dark:text-white">
                                            <option>10 mins</option>
                                            <option>15 mins</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => { showToast('Settings saved successfully'); setShowSettings(false); }} className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-blue-700 transition-all">Save Changes</button>
                        </div>
                    </div>
                )}

                {showSchedule && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in p-4">
                        <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 w-full max-w-lg border border-slate-800 shadow-2xl relative">
                            <button onClick={() => setShowSchedule(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><Icon name="x" /></button>
                            <h2 className="text-xl font-black text-[#F59E0B] mb-6 uppercase tracking-wider flex items-center gap-2"><Icon name="calendar" size="text-lg" /> Schedule Management</h2>
                            <p className="text-slate-400 mb-6">Manage overall fleet assignments and driver schedules.</p>
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold">Shift {i} - Area East</p>
                                            <p className="text-xs text-slate-400">12 Routes Active</p>
                                        </div>
                                        <button className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-bold hover:bg-white/20 transition-all">Edit</button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setShowSchedule(false)} className="w-full mt-6 py-3 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">Done</button>
                        </div>
                    </div>
                )}

                {/* Toast Notification */}
                {toastMessage && (
                    <div className="fixed bottom-6 right-6 md:left-1/2 md:-translate-x-1/2 md:right-auto bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in z-[110] border border-slate-800">
                        <Icon name="info" className="text-blue-400" size="text-sm" />
                        <span className="font-bold text-sm tracking-wide">{toastMessage}</span>
                    </div>
                )}

                {/* Critical Emergency Overlay */}
                {emergencies.length > 0 && (
                    <div className="fixed bottom-8 left-8 right-8 md:left-auto md:w-96 z-[120] animate-bounce">
                        <div className="bg-red-600 text-white rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(220,38,38,0.5)] border border-white/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-lg">
                                    <Icon name="siren" size="text-2xl" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Urgent Dispatch Required</p>
                                    <h4 className="text-xl font-black uppercase italic tracking-tighter">{emergencies[0].type} REPORTED</h4>
                                </div>
                            </div>
                            <div className="bg-black/20 rounded-2xl p-4 mb-6 backdrop-blur-md">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-black">VESSEL: {emergencies[0].busId.toUpperCase()}</span>
                                    <span className="font-mono">{emergencies[0].routeId}</span>
                                </div>
                                <p className="text-[10px] opacity-70 font-bold">DRIVER: {emergencies[0].driverName}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentView('fleet')}
                                    className="flex-1 py-3 bg-white text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all shadow-lg active:scale-95"
                                >
                                    Intercept on Map
                                </button>
                                <button
                                    onClick={() => handleResolveEmergency(emergencies[0].id)}
                                    className="px-6 py-3 bg-red-700 text-white border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-800 transition-all active:scale-95"
                                >
                                    Resolve
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AccessGuard>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminApp />);
function AdminHeader({ currentView, setView }) {
    const { user, logout } = Auth.useAuth();
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

    const navItems = [
        { id: 'overview', label: 'Overview' },
        { id: 'fleet', label: 'Fleet Map' },
        { id: 'alerts', label: 'Alerts' },
        { id: 'reports', label: 'Reports' }
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-md w-full">
            <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Logo size="lg" />
                </div>
                <nav className="hidden md:flex items-center gap-3">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id)}
                            className={`px-6 py-3 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 ${currentView === item.id
                                ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-[#1E3A8A]'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="flex items-center gap-4">
                    {/* Language Selector */}
                    <div className="hidden sm:block">
                        <select
                            className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg py-2 px-2 outline-none focus:border-blue-500 cursor-pointer uppercase tracking-wider"
                            defaultValue="en"
                        >
                            <option value="en">Eng</option>
                            <option value="hi">Hin</option>
                            <option value="mr">Mar</option>
                            <option value="ta">Tam</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                        <div className="flex flex-col items-end">
                            <p className="text-base font-black text-slate-900 leading-tight">{user?.name || 'Admin'}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Administrator</p>
                        </div>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200 text-[#1E3A8A] hover:bg-slate-200 transition-all hover:scale-105 shadow-sm"
                            >
                                <Icon name="user" size="text-xl" />
                            </button>

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden animate-fade-in z-[60]">
                                    <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50 mb-1">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Signed in as</p>
                                        <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Admin'}</p>
                                    </div>
                                    <button className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                                        <Icon name="settings" size="text-xs" className="text-slate-400" /> Settings
                                    </button>
                                    <div className="h-px bg-slate-100 my-1 mx-2"></div>
                                    <button
                                        onClick={() => { logout(); window.location.href = 'index.html'; }}
                                        className="w-full text-left px-4 py-2.5 text-[10px] text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-black uppercase tracking-[0.2em]"
                                    >
                                        <Icon name="log-out" size="text-xs" /> Sign Out
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

function AnalyticsChart() {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        const chart = new ChartJS(ctx, {
            type: 'line',
            data: {
                labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
                datasets: [{
                    label: 'Passenger Load',
                    data: [120, 850, 400, 350, 450, 900, 750, 300],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Fleet Active',
                    data: [5, 12, 10, 8, 9, 12, 11, 6],
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
                    y1: { position: 'right', grid: { display: false }, min: 0, max: 20 }
                }
            }
        });

        return () => chart.destroy();
    }, []);

    return <div className="h-64"><canvas ref={canvasRef}></canvas></div>;
}

function AdminApp() {
    const [vehicles, setVehicles] = React.useState(VEHICLES);
    const [currentView, setCurrentView] = React.useState('overview'); // overview, fleet, alerts

    // Simulation
    React.useEffect(() => {
        const interval = setInterval(() => {
            setVehicles(prev => simulateMovement(prev));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AccessGuard role="admin">
            <div className="min-h-screen bg-slate-50 pb-12" data-name="admin-app" data-file="admin-app.js">
                <AdminHeader currentView={currentView} setView={setCurrentView} />

                <main className="max-w-7xl mx-auto px-4 mt-8 space-y-8">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                        <div className="card flex items-center gap-4 border-l-4 border-l-[#3B82F6] hover:scale-105 transition-all cursor-pointer" onClick={() => setCurrentView('fleet')}>
                            <div className="p-3 bg-blue-50 rounded-lg text-[#3B82F6]"><Icon name="bus" /></div>
                            <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Buses Running</p><p className="text-2xl font-black text-slate-900">{vehicles.length}</p></div>
                        </div>

                        <div className="card flex items-center gap-4 border-l-4 border-l-amber-500 hover:scale-105 transition-all cursor-pointer" onClick={() => setCurrentView('overview')}>
                            <div className="p-3 bg-amber-50 rounded-lg text-amber-600"><Icon name="clock-alert" /></div>
                            <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Delayed Buses</p><p className="text-2xl font-black text-slate-900">{vehicles.filter(v => v.status === 'Delayed').length}</p></div>
                        </div>

                        <div className="card flex items-center gap-4 border-l-4 border-l-slate-400 hover:scale-105 transition-all cursor-pointer">
                            <div className="p-3 bg-slate-100 rounded-lg text-slate-600"><Icon name="power-off" /></div>
                            <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Offline Units</p><p className="text-2xl font-black text-slate-900">0</p></div>
                        </div>

                        <div className="card flex items-center gap-4 border-l-4 border-l-green-500">
                            <div className="p-3 bg-green-50 rounded-lg text-green-600"><Icon name="activity" /></div>
                            <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">On Time %</p><p className="text-2xl font-black text-slate-900">87%</p></div>
                        </div>

                        <div className="card flex items-center gap-4 border-l-4 border-l-[#F59E0B]">
                            <div className="p-3 bg-amber-50 rounded-lg text-[#F59E0B]"><Icon name="users" /></div>
                            <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">System Load</p><p className="text-2xl font-black text-slate-900">Low</p></div>
                        </div>

                        <div className="card flex items-center gap-4 border-l-4 border-l-red-500 transition-all hover:scale-105 cursor-pointer" onClick={() => setCurrentView('alerts')}>
                            <div className="p-3 bg-red-50 rounded-lg text-red-600"><Icon name="triangle-alert" /></div>
                            <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Critical Alerts</p><p className="text-2xl font-black text-slate-900">{ALERTS.length}</p></div>
                        </div>
                    </div>

                    {/* View Switcher */}
                    {currentView === 'overview' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Critical Monitoring Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Delay Monitor */}
                                <div className="lg:col-span-2 card border-l-4 border-l-red-500 bg-white">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                            </div>
                                            <h3 className="font-black text-slate-800 uppercase tracking-wider text-sm">Real-time Delay Monitor</h3>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Scanning</span>
                                    </div>
                                    <div className="space-y-4">
                                        {vehicles.filter(v => v.status === 'Delayed').map(v => (
                                            <div key={v.id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100 group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm text-red-600">
                                                        <Icon name="bus" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900">Vehicle {v.id}</p>
                                                        <p className="text-xs text-red-600 font-bold uppercase">Delayed • Route {v.routeId}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setCurrentView('fleet')} className="px-4 py-2 bg-white text-slate-700 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                                                        Track on Map
                                                    </button>
                                                    <button onClick={() => setCurrentView('alerts')} className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-all shadow-md shadow-red-500/20">
                                                        Notify Users
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {vehicles.filter(v => v.status === 'Delayed').length === 0 && (
                                            <div className="text-center py-8">
                                                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Icon name="check" />
                                                </div>
                                                <p className="text-slate-500 font-bold text-sm text-center">No major delays detected. System running smoothly.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Schedule Card */}
                                <div className="card bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden group">
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
                                        <button className="w-full py-4 bg-white text-slate-900 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95">
                                            Manage Full Schedule
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Middle Row: Route Status & Fleet table */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Route Status Grid */}
                                <div className="card lg:col-span-1">
                                    <h3 className="font-black text-slate-800 uppercase tracking-wider text-sm mb-6">Route Operations</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {ROUTES.map(route => {
                                            const routeVehicles = vehicles.filter(v => v.routeId === route.id);
                                            const hasDelay = routeVehicles.some(v => v.status === 'Delayed');
                                            return (
                                                <div key={route.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-all cursor-pointer group" onClick={() => setCurrentView('fleet')}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg ${route.color} flex items-center justify-center text-white text-[10px] font-black shadow-sm group-hover:scale-110 transition-transform`}>
                                                            {route.number}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">{route.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{route.type} • {routeVehicles.length} Active</p>
                                                        </div>
                                                    </div>
                                                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${hasDelay ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                        {hasDelay ? 'Attention' : 'Optimal'}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Main Fleet Status Table */}
                                <div className="card lg:col-span-2 p-0 overflow-hidden flex flex-col">
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <h3 className="font-black text-slate-800 uppercase tracking-wider text-sm">System Performance & Analytics</h3>
                                        <div className="flex gap-2">
                                            <button onClick={() => setCurrentView('fleet')} className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-xs font-bold hover:bg-[#2563EB] transition-all shadow-md shadow-blue-500/20">Analyze All</button>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-[#1E3A8A] text-white font-bold text-[10px] uppercase tracking-widest">
                                                <tr>
                                                    <th className="px-6 py-4">Fleet ID</th>
                                                    <th className="px-6 py-4">Deployment</th>
                                                    <th className="px-6 py-4">Health Status</th>
                                                    <th className="px-6 py-4">Load Factor</th>
                                                    <th className="px-6 py-4 text-right">Monitoring</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {vehicles.map(v => (
                                                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4 font-black text-slate-900">#{v.id}</td>
                                                        <td className="px-6 py-4 font-bold text-slate-600">RT-{v.routeId}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${v.status === 'On Time' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                                v.status === 'Delayed' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                                                                }`}>{v.status}</span>
                                                        </td>
                                                        <td className="px-6 py-4 font-bold text-slate-500">{v.capacity}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button onClick={() => setCurrentView('fleet')} className="text-[#3B82F6] hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                                                                <Icon name="search" size="text-sm" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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

                </main>
            </div>
        </AccessGuard>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminApp />);
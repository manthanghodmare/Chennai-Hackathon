function DriverApp() {
    const { user, logout } = Auth.useAuth();
    const [vehicles, setVehicles] = React.useState(VEHICLES);
    const [currentTime, setCurrentTime] = React.useState(new Date());
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

    // Simulate live updates
    React.useEffect(() => {
        const interval = setInterval(() => {
            setVehicles(prev => simulateMovement(prev));
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'On Time': return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    <Icon name="check" size="text-xs" /> On Time
                </span>
            );
            case 'Delayed': return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                    <Icon name="clock-alert" size="text-xs" /> Delayed
                </span>
            );
            case 'Early': return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    <Icon name="check-check" size="text-xs" /> Early
                </span>
            );
            default: return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {status}
                </span>
            );
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50" data-name="driver-app" data-file="driver-app.js">
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-md w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Logo size="lg" />
                        <span className="text-slate-400 font-bold border-l border-slate-200 pl-5 ml-1 uppercase text-xs tracking-[0.3em]">Mobility Portal</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                            <p className="text-xs text-slate-500">System Time</p>
                            <p className="text-sm font-mono font-bold text-slate-900">{currentTime.toLocaleTimeString()}</p>
                        </div>
                        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
                        <div className="flex items-center gap-4">
                            <div className="text-right flex flex-col items-end">
                                <span className="text-base font-black text-slate-900 leading-tight">{user?.name || 'Dispatcher #42'}</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Driver</span>
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
                                            <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Dispatcher #42'}</p>
                                        </div>
                                        <button className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                                            <Icon name="layout-dashboard" size="text-xs" className="text-slate-400" /> Dashboard
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
            </nav>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium uppercase">Total Fleet</p>
                        <p className="text-2xl font-bold text-slate-900">{vehicles.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium uppercase">On Time</p>
                        <p className="text-2xl font-bold text-green-600">
                            {vehicles.filter(v => v.status === 'On Time').length}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium uppercase">Delayed</p>
                        <p className="text-2xl font-bold text-red-600">
                            {vehicles.filter(v => v.status === 'Delayed').length}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium uppercase">Avg. Delay</p>
                        <p className="text-2xl font-bold text-slate-700">2.5m</p>
                    </div>
                </div>

                <div className="mb-6 flex flex-col sm:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Live Fleet Monitor</h1>
                        <p className="text-slate-500">Real-time tracking of schedule adherence and capacity.</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Icon name="search" size="text-sm" className="absolute left-3 top-2.5 text-slate-400" />
                            <input type="text" placeholder="Search vehicle or route..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none bg-white" />
                        </div>
                        <button className="flex items-center gap-2 bg-[#3B82F6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1E3A8A] transition-colors whitespace-nowrap shadow-sm">
                            <Icon name="file-down" size="text-sm" />
                            Export
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Unit ID</th>
                                    <th className="px-6 py-4 font-semibold">Route Info</th>
                                    <th className="px-6 py-4 font-semibold">Current Location</th>
                                    <th className="px-6 py-4 font-semibold">Schedule Adherence</th>
                                    <th className="px-6 py-4 font-semibold">Occupancy</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {vehicles.map(vehicle => {
                                    const route = ROUTES.find(r => r.id === vehicle.routeId);
                                    const currentStop = route.stops[vehicle.currentStopIndex];

                                    // Mocking detailed schedule data
                                    const delayMinutes = vehicle.status === 'Delayed' ? Math.floor(Math.random() * 5) + 3 :
                                        vehicle.status === 'Early' ? Math.floor(Math.random() * 2) + 1 : 0;

                                    return (
                                        <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-[var(--primary)] group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-200">
                                                        <Icon name="bus-front" size="text-sm" />
                                                    </div>
                                                    {vehicle.id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800">{route.number}</span>
                                                    <span className="text-xs text-slate-500">{route.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Icon name="map-pin" size="text-xs" className="text-slate-400" />
                                                    Near {currentStop.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {getStatusBadge(vehicle.status)}
                                                    {delayMinutes > 0 && (
                                                        <span className={`text-xs font-mono font-medium ${vehicle.status === 'Delayed' ? 'text-red-600' : 'text-blue-600'
                                                            }`}>
                                                            {vehicle.status === 'Delayed' ? '+' : '-'}{delayMinutes}m
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full transition-all duration-500 ${vehicle.capacity === 'High' ? 'bg-red-500 w-[90%]' :
                                                            vehicle.capacity === 'Medium' ? 'bg-yellow-500 w-[60%]' : 'bg-green-500 w-[30%]'
                                                            }`}></div>
                                                    </div>
                                                    <span className="text-xs text-slate-500 font-medium">{vehicle.capacity}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-400 hover:text-[var(--primary)] transition-colors p-2 hover:bg-slate-100 rounded-lg">
                                                    <Icon name="ellipsis" size="text-sm" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
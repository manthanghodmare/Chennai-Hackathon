function DriverApp() {
    const { user, logout } = Auth.useAuth();
    const [vehicles, setVehicles] = React.useState(VEHICLES);
    const [currentTime, setCurrentTime] = React.useState(new Date());

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
            <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Logo size="sm" className="text-white" />
                        <span className="text-slate-400 font-normal border-l border-slate-700 pl-3 ml-1 uppercase text-[10px] tracking-widest">Mobility Portal</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                            <p className="text-xs text-slate-400">System Time</p>
                            <p className="text-sm font-mono font-bold">{currentTime.toLocaleTimeString()}</p>
                        </div>
                        <div className="h-8 w-px bg-slate-700 hidden md:block"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right flex flex-col items-end">
                                <span className="text-sm font-bold text-white leading-none">{user?.name || 'Dispatcher #42'}</span>
                                <button
                                    onClick={() => { logout(); window.location.href = 'index.html'; }}
                                    className="text-[10px] text-red-400 font-bold uppercase tracking-wider hover:text-red-300 transition-colors"
                                >
                                    Log Out
                                </button>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-inner">
                                <Icon name="user" size="text-sm" className="text-slate-400" />
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
                            <input type="text" placeholder="Search vehicle or route..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none" />
                        </div>
                        <button className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--primary-dark)] whitespace-nowrap">
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
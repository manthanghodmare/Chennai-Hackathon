function AdminHeader() {
    const { user, logout } = Auth.useAuth();

    return (
        <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Logo size="sm" className="text-white" />
                    <span className="text-slate-400 font-normal border-l border-slate-700 pl-3 ml-1">Admin Hub</span>
                </div>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <a href="#" className="text-white">Overview</a>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors">Fleet</a>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors">Routes</a>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors">Reports</a>
                </nav>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-right">
                        <div className="flex flex-col items-end">
                            <p className="text-sm font-bold leading-none text-white">{user?.name || 'Admin'}</p>
                            <button
                                onClick={() => { logout(); window.location.href = 'index.html'; }}
                                className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors mt-1"
                            >
                                Sign Out
                            </button>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-inner">
                            <Icon name="user" className="text-slate-400" />
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
                <AdminHeader />

                <main className="max-w-7xl mx-auto px-4 mt-8 space-y-8">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="card flex items-center gap-4 border-l-4 border-l-blue-500">
                            <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><Icon name="bus" /></div>
                            <div><p className="text-slate-500 text-xs font-bold uppercase">Total Fleet</p><p className="text-2xl font-bold">{vehicles.length}</p></div>
                        </div>
                        <div className="card flex items-center gap-4 border-l-4 border-l-green-500">
                            <div className="p-3 bg-green-50 rounded-lg text-green-600"><Icon name="activity" /></div>
                            <div><p className="text-slate-500 text-xs font-bold uppercase">On Time %</p><p className="text-2xl font-bold">87%</p></div>
                        </div>
                        <div className="card flex items-center gap-4 border-l-4 border-l-amber-500">
                            <div className="p-3 bg-amber-50 rounded-lg text-amber-600"><Icon name="users" /></div>
                            <div><p className="text-slate-500 text-xs font-bold uppercase">Current Load</p><p className="text-2xl font-bold">High</p></div>
                        </div>
                        <div className="card flex items-center gap-4 border-l-4 border-l-red-500">
                            <div className="p-3 bg-red-50 rounded-lg text-red-600"><Icon name="triangle-alert" /></div>
                            <div><p className="text-slate-500 text-xs font-bold uppercase">Critical Alerts</p><p className="text-2xl font-bold">1</p></div>
                        </div>
                    </div>

                    {/* Main Content Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left: Analytics */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="card">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-slate-800">System Performance</h3>
                                    <select className="text-xs border rounded px-2 py-1 bg-slate-50"><option>Today</option><option>Yesterday</option></select>
                                </div>
                                <AnalyticsChart />
                            </div>

                            <div className="card p-0 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <h3 className="font-bold text-slate-800">Live Fleet Status</h3>
                                    <button className="text-blue-600 text-sm font-medium hover:underline">View Map</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                                            <tr>
                                                <th className="px-6 py-3">Vehicle</th>
                                                <th className="px-6 py-3">Route</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3">Capacity</th>
                                                <th className="px-6 py-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {vehicles.map(v => (
                                                <tr key={v.id} className="hover:bg-slate-50">
                                                    <td className="px-6 py-4 font-medium">{v.id}</td>
                                                    <td className="px-6 py-4">{v.routeId}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${v.status === 'On Time' ? 'bg-green-100 text-green-700' :
                                                            v.status === 'Delayed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                            }`}>{v.status}</span>
                                                    </td>
                                                    <td className="px-6 py-4">{v.capacity}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-slate-400 hover:text-blue-600"><Icon name="settings" size="text-sm" /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Right: Quick Actions & Alerts */}
                        <div className="space-y-8">
                            <div className="card bg-slate-800 text-white border-none">
                                <h3 className="font-bold mb-4 flex items-center gap-2"><Icon name="megaphone" /> Broadcast Alert</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-1">Target</label>
                                        <select className="w-full bg-slate-700 border-none rounded p-2 text-sm text-white">
                                            <option>All Passengers</option>
                                            <option>Route 101 Only</option>
                                            <option>Drivers Only</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-1">Message</label>
                                        <textarea className="w-full bg-slate-700 border-none rounded p-2 text-sm text-white h-20" placeholder="Type alert message..."></textarea>
                                    </div>
                                    <button className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-bold text-sm transition-colors">Send Broadcast</button>
                                </div>
                            </div>

                            <div className="card">
                                <h3 className="font-bold text-slate-800 mb-4">Delay Reports</h3>
                                <div className="space-y-3">
                                    <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-sm">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-red-800">Bus #V2</span>
                                            <span className="text-xs text-red-500">2m ago</span>
                                        </div>
                                        <p className="text-red-700">Reporting heavy traffic at Market Square. Est delay +10m.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </AccessGuard>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminApp />);
function DriverConsole() {
    const { user, logout } = Auth.useAuth();
    const [isOnTrip, setIsOnTrip] = React.useState(false);
    const [showSOS, setShowSOS] = React.useState(false);

    const toggleTrip = () => {
        setIsOnTrip(!isOnTrip);
    };

    return (
        <AccessGuard role="driver">
            <div className="min-h-screen flex flex-col" data-name="driver-console" data-file="driver-console.js">

                {/* Top Bar */}
                <div className="bg-slate-800 p-4 flex justify-between items-center shadow-lg z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                            <Icon name="user" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">Logged in as</p>
                            <p className="font-bold">{user?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-slate-400">Assigned Vehicle</p>
                            <p className="font-bold text-emerald-400">BUS-V1</p>
                        </div>
                        <button
                            onClick={() => { logout(); window.location.href = 'index.html'; }}
                            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border border-red-500/20"
                        >
                            <Icon name="log-out" size="text-sm" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* Main Control Area */}
                <main className="flex-grow p-4 flex flex-col gap-6 max-w-lg mx-auto w-full">

                    {/* Route Info Card */}
                    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Route</span>
                                <h1 className="text-4xl font-black mt-1">101</h1>
                                <p className="text-slate-300">Downtown Loop</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${isOnTrip ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-slate-600 text-slate-300'}`}>
                                {isOnTrip ? 'LIVE' : 'IDLE'}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-700">
                            <div className="flex-1">
                                <p className="text-xs text-slate-400 mb-1">Next Stop</p>
                                <p className="font-bold text-lg text-white">Market Square</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 mb-1">Sched. Arr</p>
                                <p className="font-bold text-lg text-white">10:42 AM</p>
                            </div>
                        </div>
                    </div>

                    {/* Primary Action Button */}
                    <button
                        onClick={toggleTrip}
                        className={`w-full py-8 rounded-2xl font-black text-2xl uppercase tracking-widest shadow-lg transform transition-all active:scale-95 ${isOnTrip
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/50'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/50'
                            }`}
                    >
                        {isOnTrip ? 'End Trip' : 'Start Trip'}
                    </button>

                    {/* Secondary Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="bg-slate-700 hover:bg-slate-600 p-6 rounded-xl flex flex-col items-center gap-3 transition-colors">
                            <Icon name="clock-alert" size="text-3xl" className="text-amber-400" />
                            <span className="font-bold text-slate-200">Report Delay</span>
                        </button>
                        <button className="bg-slate-700 hover:bg-slate-600 p-6 rounded-xl flex flex-col items-center gap-3 transition-colors">
                            <Icon name="wrench" size="text-3xl" className="text-slate-400" />
                            <span className="font-bold text-slate-200">Maintenance</span>
                        </button>
                    </div>

                    {/* SOS Button */}
                    <div className="mt-auto pt-4">
                        <button
                            onClick={() => setShowSOS(!showSOS)}
                            className="w-full bg-slate-900 border-2 border-slate-800 text-slate-500 p-4 rounded-xl font-bold hover:bg-red-950 hover:text-red-500 hover:border-red-900 transition-all flex items-center justify-center gap-3"
                        >
                            <Icon name="siren" /> EMERGENCY SOS
                        </button>
                        {showSOS && (
                            <div className="mt-4 p-4 bg-red-600/20 border border-red-500/50 rounded-xl text-center animate-fade-in">
                                <p className="text-red-400 font-bold mb-3">Confirm Emergency Signal?</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowSOS(false)} className="flex-1 bg-slate-800 py-2 rounded-lg text-sm font-bold">Cancel</button>
                                    <button className="flex-1 bg-red-600 py-2 rounded-lg text-sm font-bold">CONFIRM</button>
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
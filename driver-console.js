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

    const toggleTrip = () => {
        setIsOnTrip(!isOnTrip);
    };

    return (
        <AccessGuard role="driver">
            <div className="min-h-screen flex flex-col" data-name="driver-console" data-file="driver-console.js">

                {/* Top Bar */}
                {/* Top Bar */}
                <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-md w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Logo size="lg" />
                        </div>

                        <div className="flex items-center gap-6">
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

                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-slate-500">Assigned Vehicle</p>
                                <p className="font-bold text-emerald-600 font-mono tracking-wider">BUS-V1</p>
                            </div>
                            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                            <div className="flex items-center gap-4">
                                <div className="text-right flex flex-col items-end hidden sm:flex">
                                    <span className="text-base font-black text-slate-900 leading-tight">{user?.name || 'Driver'}</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Operator</span>
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
                                        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden animate-fade-in z-[60]">
                                            <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50 mb-1">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Signed in as</p>
                                                <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Driver'}</p>
                                                <p className="text-xs text-emerald-600 font-mono mt-1">Vehicle: BUS-V1</p>
                                            </div>
                                            <button className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                                                <Icon name="settings" size="text-xs" className="text-slate-400" /> Console Settings
                                            </button>
                                            <div className="h-px bg-slate-100 my-1 mx-2"></div>
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
                </div>

                {/* Main Control Area */}
                <main className="flex-grow p-4 flex flex-col gap-6 max-w-lg mx-auto w-full">

                    {/* Route Info Card */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl shadow-slate-200/50">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Route</span>
                                <h1 className="text-4xl font-black mt-1 text-slate-900">101</h1>
                                <p className="text-slate-500 font-medium">Downtown Loop</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${isOnTrip ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                {isOnTrip ? 'LIVE' : 'IDLE'}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-100">
                            <div className="flex-1">
                                <p className="text-xs text-slate-400 mb-1 font-bold uppercase">Next Stop</p>
                                <p className="font-black text-xl text-slate-800">Market Square</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 mb-1 font-bold uppercase">Sched. Arr</p>
                                <p className="font-black text-xl text-slate-800">10:42 AM</p>
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
                        <button className="bg-white hover:bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-3 transition-colors group">
                            <div className="p-3 bg-amber-50 text-amber-500 rounded-full group-hover:scale-110 transition-transform">
                                <Icon name="clock-alert" size="text-2xl" />
                            </div>
                            <span className="font-bold text-slate-600">Report Delay</span>
                        </button>
                        <button className="bg-white hover:bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-3 transition-colors group">
                            <div className="p-3 bg-blue-50 text-blue-500 rounded-full group-hover:scale-110 transition-transform">
                                <Icon name="wrench" size="text-2xl" />
                            </div>
                            <span className="font-bold text-slate-600">Maintenance</span>
                        </button>
                    </div>

                    {/* SOS Button */}
                    <div className="mt-auto pt-4">
                        <button
                            onClick={() => setShowSOS(!showSOS)}
                            className="w-full bg-white border-2 border-red-100 text-red-500 p-4 rounded-xl font-black hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                        >
                            <Icon name="siren" /> EMERGENCY SOS
                        </button>
                        {showSOS && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-center animate-fade-in">
                                <p className="text-red-700 font-bold mb-3">Confirm Emergency Signal?</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowSOS(false)} className="flex-1 bg-white border border-slate-200 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                                    <button className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-bold shadow-lg shadow-red-500/30 hover:bg-red-700">CONFIRM</button>
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
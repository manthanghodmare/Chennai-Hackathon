function LoginApp() {
    const [userId, setUserId] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [role, setRole] = React.useState('passenger');
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [greeting, setGreeting] = React.useState('');

    React.useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 17) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const handleLogin = (e) => {
        if (e) e.preventDefault();

        if (!userId || !password) {
            setError('Please enter both User ID and Password.');
            return;
        }

        // Mock validation
        if (password.length < 4) {
            setError('Password must be at least 4 characters long.');
            return;
        }

        setIsLoading(true);
        setError('');

        // Simulate network delay for interactivity
        setTimeout(() => {
            Auth.login(role, userId);
            // Redirect based on role
            if (role === 'admin') window.location.href = 'admin.html';
            else if (role === 'driver') window.location.href = 'driver.html';
            else window.location.href = 'tracker.html';
        }, 1500);
    };

    const roleData = {
        passenger: {
            label: 'Citizen',
            description: 'Access live bus tracking, ticket bookings, and personal transport history.',
            icon: 'user'
        },
        admin: {
            label: 'Authority',
            description: 'Full access to fleet management, driver dispatch, and network analytics.',
            icon: 'shield-check'
        },
        driver: {
            label: 'Driver',
            description: 'Open the console to manage your assigned route and passenger capacity.',
            icon: 'bus-front'
        }
    };



    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans" data-name="login-page" data-file="login-app.js">



            {/* Main Portal Section */}
            <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-[#002147]/5 pointer-events-none"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gplay.png')] opacity-10 pointer-events-none"></div>

                {/* Modern Floating Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl shadow-blue-900/20 border border-slate-200 overflow-hidden relative z-10 transition-all hover:shadow-blue-900/30">

                    {/* Portal Info Column */}
                    <div className="lg:col-span-5 bg-[#002147] p-10 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                        <div className="relative z-10">
                            <Logo size="lg" className="mb-10 text-white" />
                            <h3 className="text-3xl font-extrabold mb-6 leading-tight">Unified Transit Management & Citizen Information Portal</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-1.5 h-auto bg-teal-500 rounded-full"></div>
                                    <p className="text-blue-100/80 text-sm leading-relaxed"> Real-time positioning of public transport fleet across metropolitan and tier-2 corridors.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-1.5 h-auto bg-teal-500 rounded-full"></div>
                                    <p className="text-blue-100/80 text-sm leading-relaxed">Integrated ticketing and schedule management system for seamless urban connectivity.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 pt-10 border-t border-white/10 mt-10">
                            <div className="flex items-center gap-3 text-sm font-medium text-teal-300 mb-2">
                                <Icon name="shield-check" size="text-lg" />
                                <span>Advanced Threat Protection</span>
                            </div>
                            <p className="text-[11px] text-blue-100/50 uppercase tracking-widest font-bold">Standardized National Portal Protocol v4.2</p>
                        </div>
                    </div>

                    {/* Login Form Column */}
                    <div className="lg:col-span-7 p-10 lg:p-14 bg-white relative">
                        <div className="mb-10 transition-all duration-500">
                            <span className="text-teal-600 font-bold text-sm tracking-widest uppercase mb-2 block">{greeting},</span>
                            <h2 className="text-3xl font-black text-[#002147] mb-2">Sign In to Dashboard</h2>
                            <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
                                {roleData[role].description}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-3 rounded-r-lg animate-shake">
                                <Icon name="alert-circle" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('passenger')}
                                    className={`py-3 px-2 rounded-xl text-[11px] font-bold border-2 transition-all ${role === 'passenger' ? 'border-[#002147] bg-blue-50 text-[#002147]' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                >
                                    Citizen
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('admin')}
                                    className={`py-3 px-2 rounded-xl text-[11px] font-bold border-2 transition-all ${role === 'admin' ? 'border-[#002147] bg-blue-50 text-[#002147]' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                >
                                    Authority
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('driver')}
                                    className={`py-3 px-2 rounded-xl text-[11px] font-bold border-2 transition-all ${role === 'driver' ? 'border-[#002147] bg-blue-50 text-[#002147]' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                >
                                    Driver
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block ml-1">User ID / Registered Mobile</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#002147] transition-colors">
                                        <Icon name="user" size="text-sm" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter your ID or Mobile number"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#002147] focus:bg-white outline-none transition-all font-medium placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Password</label>
                                    <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">Forgot Password?</a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#002147] transition-colors">
                                        <Icon name="lock" size="text-sm" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter secure password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#002147] focus:bg-white outline-none transition-all font-medium placeholder:text-slate-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <Icon name={showPassword ? "eye-off" : "eye"} size="text-lg" />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full bg-[#002147] hover:bg-[#003366] text-white py-5 rounded-xl font-bold text-lg shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group ${isLoading ? 'opacity-90 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Accessing Dashboard...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Access Dashboard</span>
                                            <Icon name="arrow-right" className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center gap-4 py-4 px-6 bg-slate-50 rounded-xl border border-slate-100 mt-6 group">
                                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg group-hover:scale-110 transition-transform">
                                    <Icon name="shield-alert" size="text-lg" />
                                </div>
                                <p className="text-[11px] text-slate-600 leading-tight font-semibold">
                                    WARNING: This is a secure Government System. Authorized users only. Activity is monitored and logged.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            {/* Statutory Footer */}
            <footer className="bg-[#001529] text-white pt-16 pb-10 px-6 sm:px-10 border-t-8 border-teal-600 shadow-2xl relative z-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12 pb-12 border-b border-blue-900/30">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <Icon name="bus-front" className="text-teal-400" />
                                <h4 className="font-black text-xl tracking-tight">NEXUS Mobility Group</h4>
                            </div>
                            <p className="text-sm text-blue-100/40 leading-relaxed max-w-sm font-medium">
                                A flagship initiative of the Ministry of Housing and Urban Affairs to revolutionize metropolitan connectivity through AI-driven transit intelligence and sustainable infrastructure development.
                            </p>
                            <div className="flex gap-4 mt-8">
                                <div className="p-2 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"><Icon name="twitter" size="text-xs" /></div>
                                <div className="p-2 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"><Icon name="facebook" size="text-xs" /></div>
                                <div className="p-2 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"><Icon name="github" size="text-xs" /></div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-teal-400">Policy & Legal</h4>
                            <ul className="text-sm space-y-4 text-blue-100/60 font-medium">
                                <li className="hover:text-teal-300 cursor-pointer transition-colors flex items-center gap-2"><span>&rsaquo;</span> Privacy Policy</li>
                                <li className="hover:text-teal-300 cursor-pointer transition-colors flex items-center gap-2"><span>&rsaquo;</span> Terms of Use</li>
                                <li className="hover:text-teal-300 cursor-pointer transition-colors flex items-center gap-2"><span>&rsaquo;</span> Hyperlink Policy</li>
                                <li className="hover:text-teal-300 cursor-pointer transition-colors flex items-center gap-2"><span>&rsaquo;</span> Data Protection Bill</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-teal-400">Institutional</h4>
                            <ul className="text-sm space-y-4 text-blue-100/60 font-medium">
                                <li className="hover:text-teal-300 cursor-pointer transition-colors flex items-center gap-2"><span>&rsaquo;</span> PM India</li>
                                <li className="hover:text-teal-300 cursor-pointer transition-colors flex items-center gap-2"><span>&rsaquo;</span> NIC Global</li>
                                <li className="hover:text-teal-300 cursor-pointer transition-colors flex items-center gap-2"><span>&rsaquo;</span> MyGov Portal</li>
                                <li className="hover:text-teal-300 cursor-pointer transition-colors flex items-center gap-2"><span>&rsaquo;</span> Digital India</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-teal-400">Helpdesk</h4>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-[10px] text-teal-400 font-bold uppercase mb-1">National Toll-Free</p>
                                    <p className="text-lg font-black text-white">1800-245-8888</p>
                                </div>
                                <p className="text-sm text-blue-100/60 font-medium pl-2">support@nexusmobility.gov.in</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] text-blue-100/20 font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-6">
                            <p>Designed across National Informatics Centre (NIC)</p>
                            <span className="hidden md:block">|</span>
                            <p>Host: Data Centre Bangalore</p>
                        </div>
                        <div className="flex gap-8">
                            <span className="text-teal-500/50">v4.2.0-STABLE</span>
                            <span>Visitors: 2,45,102</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LoginApp />);
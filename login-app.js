function LoginApp() {
    const [userId, setUserId] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [role, setRole] = React.useState('passenger');
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [greeting, setGreeting] = React.useState('');
    const [language, setLanguage] = React.useState(localStorage.getItem('preferredLanguage') || 'en');

    const handleSetLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('preferredLanguage', lang);
    };

    const translate = (key) => t(key, language);

    React.useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting(translate('good_morning'));
        else if (hour < 17) setGreeting(translate('good_afternoon'));
        else setGreeting(translate('good_evening'));
    }, []);

    const validatePassword = (pass) => {
        const requirements = [
            { id: 'length', text: 'At least 8 characters', test: (p) => p.length >= 8 },
            { id: 'upper', text: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
            { id: 'lower', text: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
            { id: 'number', text: 'One number', test: (p) => /\d/.test(p) },
            { id: 'symbol', text: 'One special symbol (@$!%*?&)', test: (p) => /[@$!%*?&]/.test(p) }
        ];
        return requirements.map(r => ({ ...r, met: r.test(pass) }));
    };

    const passwordRequirements = validatePassword(password);
    const isPasswordValid = passwordRequirements.every(r => r.met);

    const handleLogin = async (e) => {
        if (e) e.preventDefault();

        if (!userId || !password) {
            setError('Please enter both Email/ID and Password.');
            return;
        }

        if (!isPasswordValid) {
            setError('Please fulfill all password security requirements.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Attempt login with Firebase
            await Auth.login(role, userId, password);

            // Success! Redirect based on role
            if (role === 'admin') window.location.href = 'admin.html';
            else if (role === 'driver') window.location.href = 'driver.html';
            else window.location.href = 'tracker.html';
        } catch (err) {
            console.error(err);
            const { isMockMode } = window.firebaseApp;
            if (isMockMode) {
                setError("Demo Mode: Using mock authentication. Credentials are not required to be real.");
            } else {
                setError(err.message || 'Authentication failed. Please check your credentials.');
            }
            setIsLoading(false);
        }
    };

    const roleData = {
        passenger: {
            label: translate('citizen'),
            description: translate('citizen_desc'),
            icon: 'user'
        },
        admin: {
            label: translate('authority'),
            description: translate('authority_desc'),
            icon: 'shield-check'
        },
        driver: {
            label: translate('driver'),
            description: translate('driver_desc'),
            icon: 'bus-front'
        }
    };



    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500" data-name="login-page" data-file="login-app.js">
            {/* Main Portal Section */}
            <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
                {/* Theme and Language Controls - Moved Outside for better visibility */}
                <div className="absolute top-8 right-8 z-50 flex items-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-2 border border-white/20 dark:border-slate-800/20 shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/60 dark:hover:bg-slate-800/60">
                    <ThemeToggle />
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-2"></div>
                    <select
                        className="bg-transparent text-slate-700 dark:text-slate-200 text-xs font-black rounded-lg py-1.5 px-2 outline-none cursor-pointer uppercase tracking-widest transition-colors"
                        value={language}
                        onChange={(e) => handleSetLanguage(e.target.value)}
                    >
                        <option value="en" className="bg-white dark:bg-slate-900">ENG</option>
                        <option value="hi" className="bg-white dark:bg-slate-900">HIN</option>
                        <option value="mr" className="bg-white dark:bg-slate-900">MAR</option>
                        <option value="ta" className="bg-white dark:bg-slate-900">TAM</option>
                    </select>
                </div>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-[#1E3A8A]/5 dark:bg-[#1E3A8A]/10 pointer-events-none"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gplay.png')] opacity-10 pointer-events-none dark:invert"></div>

                {/* Modern Floating Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 dark:bg-teal-400/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-blue-900/20 dark:shadow-black/40 border border-slate-200 dark:border-slate-800 overflow-hidden relative z-10 transition-all hover:shadow-blue-900/30 p-10 lg:p-14">
                    {/* Centered Logo */}
                    <div className="flex justify-center mb-12 relative">
                        <Logo size="lg" />
                    </div>

                    <div className="mb-10 transition-all duration-500">
                        <span className="text-[#F59E0B] font-bold text-sm tracking-widest uppercase mb-2 block">{greeting},</span>
                        <h2 className="text-3xl font-black text-[#1E3A8A] dark:text-blue-400 mb-2">{translate('sign_in_title')}</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping"></span>
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
                                className={`py-3 px-2 rounded-xl text-[11px] font-bold border-2 transition-all ${role === 'passenger' ? 'border-[#1E3A8A] dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-[#1E3A8A] dark:text-blue-400' : 'border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:border-slate-200 dark:hover:border-slate-700'}`}
                            >
                                {translate('citizen')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                className={`py-3 px-2 rounded-xl text-[11px] font-bold border-2 transition-all ${role === 'admin' ? 'border-[#1E3A8A] dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-[#1E3A8A] dark:text-blue-400' : 'border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:border-slate-200 dark:hover:border-slate-700'}`}
                            >
                                {translate('authority')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('driver')}
                                className={`py-3 px-2 rounded-xl text-[11px] font-bold border-2 transition-all ${role === 'driver' ? 'border-[#1E3A8A] dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-[#1E3A8A] dark:text-blue-400' : 'border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:border-slate-200 dark:hover:border-slate-700'}`}
                            >
                                {translate('driver')}
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block ml-1">{translate('user_id_label')}</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-600 group-focus-within:text-[#1E3A8A] dark:group-focus-within:text-blue-400 transition-colors">
                                    <Icon name="user" size="text-sm" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter your ID or Mobile number"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-[#1E3A8A] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">{translate('password_label')}</label>
                                <a href="#" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">{translate('forgot_password')}</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-600 group-focus-within:text-[#1E3A8A] dark:group-focus-within:text-blue-400 transition-colors">
                                    <Icon name="lock" size="text-sm" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter secure password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-[#1E3A8A] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
                                >
                                    <Icon name={showPassword ? "eye-off" : "eye"} size="text-lg" />
                                </button>
                            </div>

                            {/* Password Requirements List */}
                            {password.length > 0 && (
                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                    {passwordRequirements.map(req => (
                                        <div key={req.id} className="flex items-center gap-2 transition-all duration-300">
                                            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${req.met ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                                                {req.met ? <Icon name="check" size="text-[10px]" /> : <div className="w-1 h-1 bg-current rounded-full"></div>}
                                            </div>
                                            <span className={`text-[10px] font-bold tracking-tight transition-colors ${req.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-500'}`}>
                                                {req.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-[#3B82F6] dark:bg-blue-600 hover:bg-[#1E3A8A] dark:hover:bg-blue-700 text-white py-5 rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 dark:shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group ${isLoading ? 'opacity-90 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Accessing Dashboard...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{translate('access_dashboard')}</span>
                                        <Icon name="arrow-right" className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-center mt-6">
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                {translate('no_account')}{' '}
                                <a href="#" className="text-[#3B82F6] dark:text-blue-400 font-bold hover:text-[#1E3A8A] dark:hover:text-blue-300 transition-colors">
                                    {translate('create_account')}
                                </a>
                            </p>
                        </div>

                        <div className="flex items-center gap-4 py-4 px-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 mt-6 group">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg group-hover:scale-110 transition-transform">
                                <Icon name="shield-alert" size="text-lg" />
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight font-semibold">
                                {translate('secure_gov_warning')}
                            </p>
                        </div>
                    </form>
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
                            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-teal-400">{translate('policy_legal')}</h4>
                            <ul className="text-sm space-y-4 text-blue-100/60 font-medium">
                                <li className="hover:text-teal-300 cursor-pointer transition-colors flex items-center gap-2"><span>&rsaquo;</span> {translate('privacy_policy_legal')}</li>
                                <li className="hover:text-teal-300 cursor-pointer transition-colors flex items-center gap-2"><span>&rsaquo;</span> {translate('terms_of_use')}</li>
                                <li className="hover:text-teal-300 cursor-pointer transition-colors flex items-center gap-2"><span>&rsaquo;</span> {translate('hyperlink_policy')}</li>
                                <li className="hover:text-teal-300 cursor-pointer transition-colors flex items-center gap-2"><span>&rsaquo;</span> {translate('data_protection_bill')}</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-teal-400">{translate('institutional')}</h4>
                            <ul className="text-sm space-y-4 text-blue-100/60 font-medium">
                                <li className="hover:text-teal-300 cursor-pointer transition-colors flex items-center gap-2"><span>&rsaquo;</span> PM India</li>
                                <li className="hover:text-teal-300 cursor-pointer transition-colors flex items-center gap-2"><span>&rsaquo;</span> NIC Global</li>
                                <li className="hover:text-teal-300 cursor-pointer transition-colors flex items-center gap-2"><span>&rsaquo;</span> MyGov Portal</li>
                                <li className="hover:text-teal-300 cursor-pointer transition-colors flex items-center gap-2"><span>&rsaquo;</span> Digital India</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-teal-400">{translate('helpdesk')}</h4>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-[10px] text-teal-400 font-bold uppercase mb-1">{translate('national_toll_free')}</p>
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
            </footer >
        </div >
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LoginApp />);
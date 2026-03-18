function Header() {
    const { currentView, setView, scrollTo, openModal, showToast, language, setLanguage, t } = useAppContext();
    const { user, logout } = Auth.useAuth();

    return (
        <header className="sticky top-0 z-50 bg-[#0F172A]/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl w-full transition-all duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20 md:h-24">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollTo('home')}>
                        <Logo size="lg" />
                    </div>

                    <div className="hidden md:flex items-center bg-white/5 dark:bg-slate-900/40 rounded-full p-1 border border-white/10 backdrop-blur-md shadow-inner">
                        <button
                            onClick={() => setView('home')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 ${currentView === 'home' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Icon name="home" size="text-xs" />
                            {t('home')}
                        </button>
                        <button
                            onClick={() => setView('routes')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 ${currentView === 'routes' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Icon name="route" size="text-xs" />
                            {t('routes')}
                        </button>
                        <button
                            onClick={() => setView('map')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 ${currentView === 'map' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Icon name="map" size="text-xs" />
                            {t('live_map')}
                        </button>
                        <button
                            onClick={() => setView('alerts')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 ${currentView === 'alerts' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Icon name="bell" size="text-xs" />
                            {t('alerts')}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <button onClick={() => openModal('search')} className="p-2.5 text-slate-400 hover:text-white transition-all hover:bg-white/10 rounded-full active:scale-90">
                            <Icon name="search" />
                        </button>

                        <div className="hidden sm:flex items-center bg-white/5 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-1 border border-white/10 shadow-xl transition-all">
                            <ThemeToggle />
                            <div className="w-px h-3 bg-white/10 mx-1"></div>
                            <select
                                className="bg-transparent text-slate-400 hover:text-white text-[10px] font-black rounded-lg py-1 px-2 outline-none cursor-pointer uppercase tracking-widest transition-colors"
                                value={localStorage.getItem('selectedCity') || 'chennai'}
                                onChange={(e) => {
                                    localStorage.setItem('selectedCity', e.target.value);
                                    window.location.reload();
                                }}
                            >
                                <option className="bg-slate-900" value="chennai">CHN</option>
                                <option className="bg-slate-900" value="mumbai">MUM</option>
                                <option className="bg-slate-900" value="pune">PUN</option>
                                <option className="bg-slate-900" value="nagpur">NAG</option>
                                <option className="bg-slate-900" value="wardha">WAR</option>
                            </select>
                            <div className="w-px h-3 bg-white/10 mx-1"></div>
                            <select
                                className="bg-transparent text-slate-400 hover:text-white text-[10px] font-black rounded-lg py-1 px-2 outline-none cursor-pointer uppercase tracking-widest transition-colors"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <option className="bg-slate-900" value="en">ENG</option>
                                <option className="bg-slate-900" value="hi">HIN</option>
                                <option className="bg-slate-900" value="mr">MAR</option>
                                <option className="bg-slate-900" value="ta">TAM</option>
                            </select>
                        </div>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden lg:flex flex-col items-end mr-1">
                                    <span className="text-sm font-black text-white leading-tight uppercase tracking-wider">{user.name}</span>
                                    <span className="text-[9px] text-blue-400 uppercase tracking-[0.3em] font-black">{user.role}</span>
                                </div>
                                <div className="relative group">
                                    <button
                                        className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/10 text-blue-400 hover:border-blue-500/50 transition-all hover:scale-105 shadow-xl shadow-black/40"
                                    >
                                        <Icon name="user" size="text-lg" />
                                    </button>
                                    <div className="absolute right-0 top-full pt-3 w-60 hidden group-hover:block animate-fade-in z-[60]">
                                        <div className="bg-[#0F172A] rounded-2xl shadow-2xl border border-white/5 py-2 overflow-hidden backdrop-blur-2xl">
                                            <div className="px-5 py-4 border-b border-white/5 bg-white/5 mb-1">
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">{t('authenticated_account')}</p>
                                                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                            </div>
                                            <button onClick={() => {
                                                if (user.role === 'admin') window.location.href = 'admin.html';
                                                else if (user.role === 'driver') window.location.href = 'driver.html';
                                                else setView('profile');
                                            }} className="w-full text-left px-5 py-3 text-xs font-bold text-slate-300 hover:bg-white/5 flex items-center gap-3 transition-colors uppercase tracking-widest">
                                                <Icon name="layout-dashboard" size="text-xs" className="text-blue-500" /> {t('dashboard')}
                                            </button>
                                            <div className="h-px bg-white/5 my-1 mx-3"></div>
                                            <button
                                                onClick={() => { logout(); window.location.href = 'index.html'; }}
                                                className="w-full text-left px-5 py-3 text-[10px] text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors font-black uppercase tracking-[0.3em]"
                                            >
                                                <Icon name="log-out" size="text-xs" /> {t('sign_out')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <a
                                href="index.html"
                                className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
                            >
                                {t('login')}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
function Header() {
    const { currentView, setView, scrollTo, openModal, showToast } = useAppContext();
    const { user, logout } = Auth.useAuth();

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('home')}>
                        <Logo size="sm" />
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <button
                            onClick={() => setView('home')}
                            className={`font-semibold text-base transition-colors ${currentView === 'home' ? 'text-[var(--primary)]' : 'text-slate-500 hover:text-[var(--primary)]'}`}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => setView('routes')}
                            className={`font-semibold text-base transition-colors ${currentView === 'routes' ? 'text-[var(--primary)]' : 'text-slate-500 hover:text-[var(--primary)]'}`}
                        >
                            Routes
                        </button>
                        <button
                            onClick={() => setView('map')}
                            className={`font-semibold text-base transition-colors ${currentView === 'map' ? 'text-[var(--primary)]' : 'text-slate-500 hover:text-[var(--primary)]'}`}
                        >
                            Live Map
                        </button>
                        <button
                            onClick={() => setView('alerts')}
                            className={`font-semibold text-base transition-colors ${currentView === 'alerts' ? 'text-[var(--primary)]' : 'text-slate-500 hover:text-[var(--primary)]'}`}
                        >
                            Alerts
                        </button>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <button onClick={() => openModal('search')} className="p-2 text-slate-400 hover:text-slate-600 transition-colors hover:bg-slate-100 rounded-full">
                            <Icon name="search" />
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-sm font-bold text-slate-900">{user.name}</span>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{user.role}</span>
                                </div>
                                <div className="relative group">
                                    <button
                                        className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-[var(--primary)] hover:bg-slate-200 transition-colors shadow-inner"
                                    >
                                        <Icon name="user" size="text-lg" />
                                    </button>
                                    {/* Dropdown with Hover Bridge */}
                                    <div className="absolute right-0 top-full pt-2 w-56 hidden group-hover:block animate-fade-in z-[60]">
                                        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50 mb-1">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Signed in as</p>
                                                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                                            </div>
                                            <button onClick={() => {
                                                if (user.role === 'admin') window.location.href = 'admin.html';
                                                else if (user.role === 'driver') window.location.href = 'driver.html';
                                                else showToast('Profile settings coming soon');
                                            }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                                                <Icon name="layout-dashboard" size="text-xs" className="text-slate-400" /> Dashboard
                                            </button>
                                            <div className="h-px bg-slate-100 my-1 mx-2"></div>
                                            <button
                                                onClick={() => { logout(); window.location.href = 'index.html'; }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-bold"
                                            >
                                                <Icon name="log-out" size="text-xs" /> Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <a
                                href="index.html"
                                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 whitespace-nowrap"
                            >
                                Login
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
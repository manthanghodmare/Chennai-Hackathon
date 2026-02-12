function Header() {
    const { currentView, setView, scrollTo, openModal, showToast } = useAppContext();
    const { user, logout } = Auth.useAuth();

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-md w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-24">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('home')}>
                        <Logo size="lg" />
                    </div>

                    <div className="hidden md:flex items-center space-x-3">
                        <button
                            onClick={() => setView('home')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full font-black text-lg transition-all duration-300 hover:scale-110 ${currentView === 'home' ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-100 hover:text-[#1E3A8A]'}`}
                        >
                            <Icon name="home" size="text-xl" />
                            Home
                        </button>
                        <button
                            onClick={() => setView('routes')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full font-black text-lg transition-all duration-300 hover:scale-110 ${currentView === 'routes' ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-100 hover:text-[#1E3A8A]'}`}
                        >
                            <Icon name="route" size="text-xl" />
                            Routes
                        </button>
                        <button
                            onClick={() => setView('map')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full font-black text-lg transition-all duration-300 hover:scale-110 ${currentView === 'map' ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-100 hover:text-[#1E3A8A]'}`}
                        >
                            <Icon name="map" size="text-xl" />
                            Live Map
                        </button>
                        <button
                            onClick={() => setView('alerts')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full font-black text-lg transition-all duration-300 hover:scale-110 ${currentView === 'alerts' ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-100 hover:text-[#1E3A8A]'}`}
                        >
                            <Icon name="bell" size="text-xl" />
                            Alerts
                        </button>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <button onClick={() => openModal('search')} className="p-2 text-slate-400 hover:text-slate-600 transition-colors hover:bg-slate-100 rounded-full">
                            <Icon name="search" />
                        </button>

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

                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-base font-black text-slate-900 leading-tight">{user.name}</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">{user.role}</span>
                                </div>
                                <div className="relative group">
                                    <button
                                        className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200 text-[#1E3A8A] hover:bg-slate-200 transition-all hover:scale-105 shadow-sm"
                                    >
                                        <Icon name="user" size="text-xl" />
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
                                                className="w-full text-left px-4 py-2.5 text-[10px] text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-black uppercase tracking-[0.2em]"
                                            >
                                                <Icon name="log-out" size="text-xs" /> Sign Out
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
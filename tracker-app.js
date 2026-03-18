// Important: DO NOT remove this `ErrorBoundary` component.
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
                        <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-slate-900 text-white px-4 py-2 rounded-lg"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

function App() {
    const [activeRouteId, setActiveRouteId] = React.useState(ROUTES[0].id);
    const [vehicles, setVehicles] = React.useState(VEHICLES);
    const [activeModal, setActiveModal] = React.useState(null); // 'schedule', 'search'
    const [toasts, setToasts] = React.useState([]);
    const [currentView, setCurrentView] = React.useState('home'); // 'home', 'routes', 'map', 'alerts'
    const [isAIChatOpen, setIsAIChatOpen] = React.useState(false);
    const [language, setLanguage] = React.useState(localStorage.getItem('preferredLanguage') || 'en');
    
    // Favorites State
    const [favorites, setFavorites] = React.useState(() => {
        const saved = localStorage.getItem('nexus_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    const toggleFavorite = (routeId) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(routeId)
                ? prev.filter(id => id !== routeId)
                : [...prev, routeId];
            localStorage.setItem('nexus_favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
        showToast(favorites.includes(routeId) ? 'Route removed from favorites' : 'Route added to favorites', 'success');
    };

    const handleSetLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('preferredLanguage', lang);
    };

    // Toast Helper
    const showToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const openModal = (type, data = null) => {
        setActiveModal({ type, data });
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    const handleScrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            showToast(`Navigating to ${id}...`);
        }
    };

    // Real-time Firestore Sync
    React.useEffect(() => {
        const { db } = window.firebaseApp;

        // Listen to the 'vehicles' collection for real-world updates
        const unsubscribe = db.collection('vehicles').onSnapshot((snapshot) => {
            const updatedVehicles = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            if (updatedVehicles.length > 0) {
                setVehicles(updatedVehicles);
            }
        }, (error) => {
            console.error("Firestore Sync Error:", error);
            showToast("Failed to sync live data. Using offline mode.", "warning");
        });

        return () => unsubscribe();
    }, []);

    const activeRoute = ROUTES.find(r => r.id === activeRouteId);
    const heroImage = "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80";

    // Context Value
    const contextValue = {
        activeRouteId,
        setActiveRouteId,
        showToast,
        openModal,
        scrollTo: handleScrollTo,
        currentView,
        setView: setCurrentView,
        language,
        setLanguage: handleSetLanguage,
        t: (key) => t(key, language),
        favorites,
        toggleFavorite
    };

    // Global View Switcher
    React.useEffect(() => {
        const handleSetView = (e) => setCurrentView(e.detail);
        window.addEventListener('set-view', handleSetView);
        return () => window.removeEventListener('set-view', handleSetView);
    }, []);

    return (
        <AppContext.Provider value={contextValue}>
            <AccessGuard role="passenger" redirectUrl="index.html">
                <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500" data-name="app" data-file="tracker-app.js">
                    <Header />

                    {/* Hero Section */}
                    <div id="home" className="relative bg-slate-950 text-white overflow-hidden h-[500px] lg:h-[650px] group transition-all duration-700">
                        <div className="absolute inset-0">
                            <img
                                src={heroImage}
                                alt="City Transit Background"
                                className="w-full h-full object-cover opacity-60 dark:opacity-40 transition-transform duration-[30s] ease-out transform scale-100 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] to-transparent opacity-60"></div>
                        </div>
                        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 h-full flex flex-col justify-center animate-fade-in z-10">
                            <div className="max-w-3xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 backdrop-blur-md">
                                    <Icon name="globe" size="text-[10px]" />
                                    {contextValue.t('hero_tagline')}
                                </div>
                                <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.9] text-white">
                                    {contextValue.t('hero_title_1')} <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{contextValue.t('hero_title_2')}</span>
                                </h1>
                                <p className="text-lg md:text-xl text-slate-300 max-w-xl mb-10 leading-relaxed font-medium">
                                    {contextValue.t('hero_desc')}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button onClick={() => setCurrentView('map')} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-600/40 active:scale-95 transition-all flex items-center gap-3">
                                        {contextValue.t('start_tracking')}
                                        <Icon name="arrow-right" size="text-xs" />
                                    </button>
                                    <button onClick={() => openModal('search')} className="px-8 py-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-full font-black uppercase tracking-widest text-xs backdrop-blur-md active:scale-95 transition-all flex items-center gap-3">
                                        <Icon name="search" size="text-xs" />
                                        {contextValue.t('find_route')}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Elegant Scroll Indicator */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
                            <Icon name="chevron-down" size="text-2xl" />
                        </div>
                    </div>

                    <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full -mt-6 lg:-mt-12 relative z-10">

                        {/* View Layering */}
                        {currentView === 'home' && (
                            <div className="space-y-8 animate-fade-in">
                                <DashboardStats
                                    activeRoutes={ROUTES.length}
                                    vehiclesOnRoad={vehicles.length}
                                    alertsCount={ALERTS.length}
                                />

                                {/* New Live Tracking Section */}
                                <div className="bg-[#0F172A] rounded-[2rem] shadow-2xl overflow-hidden border border-white/5 mb-12 animate-fade-in group transition-all duration-500 hover:border-blue-500/30">
                                    <div className="grid grid-cols-1 lg:grid-cols-2">
                                        <div className="p-4 h-full min-h-[300px] lg:min-h-[400px]">
                                            <div className="h-full rounded-2xl overflow-hidden border border-white/5">
                                                <MapPreview />
                                            </div>
                                        </div>
                                        <div className="p-10 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-[#1E293B] to-[#0F172A]">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black mb-6 w-fit border border-blue-500/20 tracking-widest">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                                </span>
                                                {contextValue.t('live_connected')}
                                            </div>
                                            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight leading-none">{contextValue.t('track_ride_title')} <br /><span className="text-slate-500 opacity-50 underline decoration-blue-500 underline-offset-8">{contextValue.t('track_ride_subtitle')}</span></h2>
                                            <p className="text-slate-400 mb-10 max-w-md text-lg leading-relaxed font-medium">{contextValue.t('track_ride_desc')}</p>
                                            <button
                                                onClick={() => setCurrentView('map')}
                                                className="group/btn relative px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] active:scale-95 self-start"
                                            >
                                                <span className="relative z-10 flex items-center gap-3">
                                                    <Icon name="map-pin" />
                                                    {contextValue.t('explore_map')}
                                                </span>
                                                <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="card group cursor-pointer bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-300" onClick={() => setCurrentView('routes')}>
                                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                    <Icon name="route" />
                                                </div>
                                                <h3 className="font-bold text-slate-800 dark:text-white mb-1 transition-colors">{contextValue.t('browse_routes')}</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">{contextValue.t('browse_routes_desc')}</p>
                                            </div>
                                            <div className="card group cursor-pointer bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900 transition-all duration-300" onClick={() => setCurrentView('alerts')}>
                                                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                                    <Icon name="bell" />
                                                </div>
                                                <h3 className="font-bold text-slate-800 dark:text-white mb-1 transition-colors">{contextValue.t('service_alerts')}</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">{contextValue.t('service_alerts_desc')}</p>
                                            </div>
                                        </div>

                                        {/* Live Activity Feed */}
                                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-800 transition-colors">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2 transition-colors">
                                                    <span className="relative flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                                    </span>
                                                    {contextValue.t('live_activity_feed')}
                                                </h3>
                                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">{contextValue.t('real_time')}</span>
                                            </div>
                                            <div className="space-y-4">
                                                {[
                                                    { id: 1, type: 'status', msg: contextValue.t('feed_msg_1'), time: contextValue.t('feed_time_1'), icon: 'bus-front', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
                                                    { id: 2, type: 'delay', msg: contextValue.t('feed_msg_2'), time: contextValue.t('feed_time_2'), icon: 'clock', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20' },
                                                    { id: 3, type: 'success', msg: contextValue.t('feed_msg_3'), time: contextValue.t('feed_time_3'), icon: 'calendar-check', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' },
                                                    { id: 4, type: 'info', msg: contextValue.t('feed_msg_4'), time: contextValue.t('feed_time_4'), icon: 'users', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' }
                                                ].map(item => (
                                                    <div key={item.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-default">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${item.color} transition-colors`}>
                                                            <Icon name={item.icon} size="text-sm" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-base font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.msg}</p>
                                                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5 transition-colors">{item.time}</p>
                                                        </div>
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button className="p-1.5 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-md border border-slate-200 dark:border-slate-600 shadow-sm transition-all" title="View Details">
                                                                <Icon name="chevron-right" size="text-xs" className="text-slate-400 dark:text-slate-500" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <EcoWidget />
                                        
                                        {/* Favorited Routes Box */}
                                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-800 transition-colors">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                                    <Icon name="star" className="text-amber-400 fill-amber-400" size="text-lg" />
                                                    Favorite Routes
                                                </h3>
                                                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{favorites.length} saved</span>
                                            </div>
                                            
                                            {favorites.length > 0 ? (
                                                <div className="space-y-3">
                                                    {favorites.map(routeId => {
                                                        const route = ROUTES.find(r => r.id === routeId);
                                                        if (!route) return null;
                                                        return (
                                                            <button 
                                                                key={route.id}
                                                                onClick={() => {
                                                                    window.dispatchEvent(new CustomEvent('set-route', { detail: route.id }));
                                                                    window.dispatchEvent(new CustomEvent('set-view', { detail: 'routes' }));
                                                                }}
                                                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-all text-left group"
                                                            >
                                                                <span className={`w-10 h-10 flex items-center justify-center rounded-lg text-xs font-black text-white shadow-sm ${route.color}`}>
                                                                    {route.number}
                                                                </span>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{route.name}</p>
                                                                    <p className="text-xs text-slate-500">{route.defaultFrequency || route.frequency} freq</p>
                                                                </div>
                                                                <Icon name="chevron-right" size="text-xs" className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-center py-6 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                                    <Icon name="star" size="text-2xl" className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No favorite routes yet</p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Star routes to quickly access them here</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-blue-900 dark:bg-blue-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden transition-colors">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                            <h3 className="font-bold mb-2">{contextValue.t('need_help')}</h3>
                                            <p className="text-blue-100 text-sm mb-4">{contextValue.t('ai_help_desc')}</p>
                                            <button
                                                onClick={() => setIsAIChatOpen(true)}
                                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors font-bold rounded-lg text-sm shadow-md"
                                            >
                                                {contextValue.t('open_chat')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentView === 'routes' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in pt-12 lg:pt-20">
                                <div className="lg:col-span-4 xl:col-span-3">
                                    <RouteList
                                        routes={ROUTES}
                                        activeRouteId={activeRouteId}
                                        onSelectRoute={setActiveRouteId}
                                    />
                                </div>
                                <div className="lg:col-span-8 xl:col-span-9">
                                    <RouteDetail route={activeRoute} vehicles={vehicles} />
                                </div>
                            </div>
                        )}

                        {currentView === 'map' && (
                            <div className="animate-fade-in h-[600px] lg:h-[700px]">
                                <GoogleMap route={activeRoute} vehicles={vehicles} fullScreen={true} />
                            </div>
                        )}

                        {currentView === 'alerts' && (
                            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pt-12 lg:pt-20">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-white transition-colors">{contextValue.t('service_alerts')}</h2>
                                    <span className="badge bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 transition-colors">{ALERTS.length} {contextValue.t('operational')}</span>
                                </div>
                                {ALERTS.map(alert => (
                                    <div key={alert.id} className={`p-6 rounded-2xl border-2 shadow-sm flex gap-4 transition-all duration-300 ${alert.type === 'warning'
                                        ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30'
                                        : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30'
                                        }`}>
                                        <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${alert.type === 'warning'
                                            ? 'bg-amber-200 dark:bg-amber-800/40 text-amber-800 dark:text-amber-400'
                                            : 'bg-blue-200 dark:bg-blue-800/40 text-blue-800 dark:text-blue-400'
                                            }`}>
                                            <Icon name={alert.type === 'warning' ? 'triangle-alert' : 'info'} size="text-xl" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors">{alert.type === 'warning' ? 'Important Alert' : 'Service Notice'}</h4>
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">{alert.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentView === 'sustainability' && (
                            <SustainabilityView />
                        )}

                        {currentView === 'profile' && (
                            <ProfileView />
                        )}
                    </main>

                    <Footer />
                    <ToastContainer toasts={toasts} />
                    <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />

                    {/* Modals */}
                    {activeModal?.type === 'schedule' && (
                        <ScheduleModal route={activeModal.data.route} onClose={closeModal} />
                    )}
                    {activeModal?.type === 'search' && (
                        <SearchModal routes={ROUTES} vehicles={vehicles} onClose={closeModal} />
                    )}
                </div>
            </AccessGuard>
        </AppContext.Provider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);
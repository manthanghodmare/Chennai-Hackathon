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

    // Simulation Effect
    React.useEffect(() => {
        const interval = setInterval(() => {
            setVehicles(prev => simulateMovement(prev));
        }, 1000); // Update every second

        return () => clearInterval(interval);
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
        setView: setCurrentView
    };

    return (
        <AppContext.Provider value={contextValue}>
            <AccessGuard role="passenger" redirectUrl="index.html">
                <div className="min-h-screen flex flex-col bg-[var(--bg-light)] font-sans" data-name="app" data-file="tracker-app.js">
                    <Header />

                    {/* Hero Section */}
                    <div id="home" className="relative bg-slate-900 text-white overflow-hidden h-[400px] lg:h-[500px] group">
                        <div className="absolute inset-0">
                            <img
                                src={heroImage}
                                alt="City Transit Background"
                                className="w-full h-full object-cover opacity-40 transition-transform duration-[20s] ease-in-out transform scale-100 group-hover:scale-110"
                                style={{ animation: 'slowZoom 20s infinite alternate' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/40"></div>
                        </div>
                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center animate-fade-in z-10">
                            <div className="max-w-2xl">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-white">
                                    Smart Mobility for <br /> <span className="text-[#F59E0B]">Smart Cities</span>
                                </h1>
                                <p className="text-xl text-slate-300 max-w-lg mb-8">
                                    Real-time tracking, accurate ETAs, and live service alerts for your daily commute.
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={() => setCurrentView('map')} className="btn-primary">
                                        Start Tracking
                                        <Icon name="arrow-right" size="text-sm" />
                                    </button>
                                    <button onClick={() => openModal('search')} className="btn-outline bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20">
                                        <Icon name="search" size="text-sm" />
                                        Find Route
                                    </button>
                                </div>
                            </div>
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

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-8">
                                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 flex flex-col justify-center items-center text-center">
                                            <div className="w-16 h-16 bg-[#F59E0B]/10 text-[#F59E0B] rounded-2xl flex items-center justify-center mb-6">
                                                <Icon name="map-unfold" size="text-3xl" />
                                            </div>
                                            <h2 className="text-2xl font-black text-slate-800 mb-2">Ready to explore?</h2>
                                            <p className="text-slate-500 max-w-sm mb-6">Dive into the live interactive map to track any vehicle across the city.</p>
                                            <button onClick={() => setCurrentView('map')} className="btn-primary w-full sm:w-auto">Open Live Map</button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="card group cursor-pointer" onClick={() => setCurrentView('routes')}>
                                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                    <Icon name="route" />
                                                </div>
                                                <h3 className="font-bold text-slate-800 mb-1">Browse Routes</h3>
                                                <p className="text-slate-500 text-sm">Full schedules and stop timings for all lines.</p>
                                            </div>
                                            <div className="card group cursor-pointer" onClick={() => setCurrentView('alerts')}>
                                                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                                    <Icon name="bell" />
                                                </div>
                                                <h3 className="font-bold text-slate-800 mb-1">Service Alerts</h3>
                                                <p className="text-slate-500 text-sm">Stay updated on delays and roadworks.</p>
                                            </div>
                                        </div>

                                        {/* Live Activity Feed */}
                                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="font-black text-slate-800 flex items-center gap-2">
                                                    <span className="relative flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F59E0B]"></span>
                                                    </span>
                                                    Live Activity Feed
                                                </h3>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time</span>
                                            </div>
                                            <div className="space-y-4">
                                                {[
                                                    { id: 1, type: 'status', msg: 'Vehicle #402 just left Central Station', time: '1 min ago', icon: 'bus-front', color: 'text-[#3B82F6] bg-[#3B82F6]/10' },
                                                    { id: 2, type: 'delay', msg: 'Route 12B experiencing slight delays', time: '4 mins ago', icon: 'clock', color: 'text-[#F59E0B] bg-[#F59E0B]/10' },
                                                    { id: 3, type: 'success', msg: 'New schedule for Weekend transit published', time: '12 mins ago', icon: 'calendar-check', color: 'text-[#10B981] bg-[#10B981]/10' },
                                                    { id: 4, type: 'info', msg: 'High occupancy reported on Route 10A', time: '15 mins ago', icon: 'users', color: 'text-[#3B82F6] bg-[#3B82F6]/10' }
                                                ].map(item => (
                                                    <div key={item.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-default">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${item.color}`}>
                                                            <Icon name={item.icon} size="text-sm" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-base font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{item.msg}</p>
                                                            <p className="text-xs text-slate-400 font-medium mt-0.5">{item.time}</p>
                                                        </div>
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button className="p-1.5 hover:bg-white rounded-md border border-transparent hover:border-slate-200 shadow-sm transition-all" title="View Details">
                                                                <Icon name="chevron-right" size="text-xs" className="text-slate-400" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <EcoWidget />
                                        <div className="bg-[#1E3A8A] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                            <h3 className="font-bold mb-2">Need Help?</h3>
                                            <p className="text-blue-100 text-sm mb-4">Our AI assistant is ready to help you plan your commute.</p>
                                            <button className="w-full py-2 bg-[#3B82F6] text-white hover:bg-[#1E3A8A] transition-colors font-bold rounded-lg text-sm shadow-md">Open Chat</button>
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
                                <RouteDetail route={activeRoute} vehicles={vehicles} fullScreen={true} />
                            </div>
                        )}

                        {currentView === 'alerts' && (
                            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pt-12 lg:pt-20">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl font-black text-slate-800">Service Alerts</h2>
                                    <span className="badge bg-amber-100 text-amber-700">{ALERTS.length} Active</span>
                                </div>
                                {ALERTS.map(alert => (
                                    <div key={alert.id} className={`p-6 rounded-2xl border-2 shadow-sm flex gap-4 ${alert.type === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'
                                        }`}>
                                        <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${alert.type === 'warning' ? 'bg-amber-200 text-amber-800' : 'bg-blue-200 text-blue-800'
                                            }`}>
                                            <Icon name={alert.type === 'warning' ? 'triangle-alert' : 'info'} size="text-xl" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-1">{alert.type === 'warning' ? 'Important Alert' : 'Service Notice'}</h4>
                                            <p className="text-slate-600 leading-relaxed">{alert.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>

                    <Footer />
                    <ToastContainer toasts={toasts} />

                    {/* Modals */}
                    {activeModal?.type === 'schedule' && (
                        <ScheduleModal route={activeModal.data.route} onClose={closeModal} />
                    )}
                    {activeModal?.type === 'search' && (
                        <SearchModal routes={ROUTES} onClose={closeModal} />
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
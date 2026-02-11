function RouteList({ routes, activeRouteId, onSelectRoute }) {
    const busImage = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
    
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur sticky top-0 z-10">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Icon name="map" size="text-lg" className="text-[var(--primary)]" />
                    Available Routes
                </h3>
            </div>
            <div className="flex-1 p-3 space-y-3">
                {routes.map(route => {
                    const isActive = activeRouteId === route.id;
                    return (
                        <button
                            key={route.id}
                            onClick={() => onSelectRoute(route.id)}
                            className={`w-full text-left p-3 rounded-xl border transition-all duration-300 group relative overflow-hidden ${
                                isActive 
                                ? 'bg-slate-50 border-[var(--primary)] shadow-md ring-1 ring-[var(--primary)]/20' 
                                : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-md'
                            }`}
                        >
                            {/* Background Image Effect for Active State */}
                            {isActive && (
                                <div className="absolute top-0 right-0 w-24 h-full opacity-10 pointer-events-none">
                                    <img src={busImage} alt="" className="w-full h-full object-cover mask-image-linear-gradient opacity-20" />
                                </div>
                            )}

                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-sm ${route.color}`}>
                                            {route.number}
                                        </span>
                                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isActive ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-slate-100 text-slate-500'}`}>
                                            {route.type}
                                        </span>
                                    </div>
                                    <h4 className={`font-bold text-sm mb-1 ${isActive ? 'text-[var(--primary-dark)]' : 'text-slate-800 group-hover:text-[var(--primary)] transition-colors'}`}>
                                        {route.name}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                                        <span className="flex items-center gap-1">
                                            <Icon name="clock" size="text-[10px]" /> {route.frequency}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Icon name="signpost" size="text-[10px]" /> {route.stops.length} Stops
                                        </span>
                                    </div>
                                </div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-[var(--primary)] text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                                    <Icon name="chevron-right" size="text-sm" />
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
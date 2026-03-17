function RouteDetail({ route, vehicles, fullScreen }) {
    const { openModal, showToast, favorites, toggleFavorite } = useAppContext();
    const isFavorite = favorites?.includes(route?.id);

    if (!route) return (
        <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-white rounded-xl border border-slate-200 border-dashed animate-fade-in">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Icon name="map" className="text-slate-300" size="text-4xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">No Route Selected</h3>
            <p className="text-slate-500 font-medium max-w-xs text-center">Choose a route from the sidebar to view live tracking and arrival times.</p>
        </div>
    );

    // Filter vehicles for this route
    const activeVehicles = vehicles.filter(v => v.routeId === route.id);
    const now = new Date();

    // Helper to calculate ETA for a stop
    const getNextArrival = (stopIndex) => {
        const relevantVehicles = activeVehicles.filter(v =>
            v.currentStopIndex <= stopIndex
        );

        if (relevantVehicles.length === 0) return null;

        const vehiclesWithDist = relevantVehicles.map(v => {
            const distanceInStops = stopIndex - (v.currentStopIndex + v.progress);
            const minutesAway = Math.max(0, Math.round(distanceInStops * 5));
            return { ...v, minutesAway };
        });

        vehiclesWithDist.sort((a, b) => a.minutesAway - b.minutesAway);

        return vehiclesWithDist[0];
    };

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden flex flex-col h-full relative transition-colors duration-500 ${fullScreen ? 'min-h-[700px]' : 'min-h-[600px]'}`}>

            {/* Header Background Pattern */}
            <div className={`absolute top-0 left-0 right-0 h-32 opacity-10 dark:opacity-20 ${route.color}`}></div>

            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 transition-colors">
                <div className="mb-4 md:mb-0">
                    <div className="flex items-center gap-4 mb-2">
                        <span className={`px-4 py-1.5 rounded-lg text-lg font-black text-white shadow-lg shadow-black/10 ${route.color}`}>
                            {route.number}
                        </span>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">{route.name}</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md transition-colors">
                            <Icon name="bus" size="text-xs" />
                            {route.type}
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md transition-colors">
                            <Icon name="clock" size="text-xs" />
                            Every {route.frequency}
                        </span>
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800/30 transition-colors">
                            <Icon name="rss" size="text-xs" />
                            Live Updates
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('set-view', { detail: 'map' }))}
                        className="btn-primary text-sm bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                    >
                        <Icon name="map" size="text-sm" />
                        View on Real Map
                    </button>
                    <button
                        onClick={() => openModal('schedule', { route })}
                        className="btn-outline text-sm bg-white dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                    >
                        <Icon name="calendar-days" size="text-sm" />
                        Full Schedule
                    </button>
                    <button
                        onClick={() => toggleFavorite(route.id)}
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${isFavorite
                            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-500 shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-amber-400 hover:border-amber-200 bg-white dark:bg-slate-800'
                            }`}
                    >
                        <Icon name="star" size="text-lg" className={isFavorite ? 'fill-current' : ''} />
                    </button>
                </div>
            </div>

            {/* Live Visualization (Linear Map) */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 custom-scrollbar transition-colors">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-1">Live Status Timeline</h3>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">Tracking Live</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Current
                        </div>
                        <div className="w-px h-3 bg-slate-200 dark:bg-slate-700"></div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></span> Arriving
                        </div>
                    </div>
                </div>

                <div className="relative min-w-[300px] pl-6 pb-12 max-w-3xl mx-auto">
                    {/* The Line */}
                    <div className="absolute left-10 top-2 bottom-0 w-1.5 bg-slate-200 dark:bg-slate-800 rounded-full transition-colors"></div>

                    {/* Progress Bar (Visual only, illustrative) */}
                    <div className="absolute left-10 top-2 w-1.5 bg-gradient-to-b from-indigo-500 to-transparent rounded-full h-1/3 z-0 opacity-50"></div>

                    {/* Stops */}
                    <div className="space-y-12 relative z-10">
                        {route.stops.map((stop, index) => {
                            const vehiclesInSegment = activeVehicles.filter(v =>
                                v.currentStopIndex === index
                            );

                            const nextArrival = getNextArrival(index);
                            const isFirstOrLast = index === 0 || index === route.stops.length - 1;

                            return (
                                <div key={index} className="relative flex items-start gap-8 group">
                                    {/* Stop Dot */}
                                    <div className={`w-12 h-12 rounded-full border-[5px] border-white dark:border-slate-900 shadow-lg flex items-center justify-center z-10 shrink-0 transition-all duration-300 group-hover:scale-110 ${isFirstOrLast ? 'bg-indigo-600 dark:bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 ring-4 ring-slate-50 dark:ring-slate-950 text-slate-400'
                                        }`}>
                                        {isFirstOrLast ? (
                                            <Icon name="map-pin" size="text-sm" />
                                        ) : (
                                            <div className="w-3 h-3 bg-slate-200 dark:bg-slate-700 rounded-full group-hover:bg-indigo-500 dark:group-hover:bg-blue-400 transition-colors"></div>
                                        )}
                                    </div>

                                    {/* Stop Info */}
                                    <div className="mt-1 flex-1 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 group-hover:shadow-md dark:group-hover:shadow-black/50 group-hover:border-indigo-500/30 dark:group-hover:border-indigo-400/30 group-hover:translate-x-1 cursor-default">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className={`font-bold transition-colors ${isFirstOrLast ? 'text-slate-900 dark:text-white text-lg' : 'text-slate-700 dark:text-slate-200'}`}>
                                                        {stop.name}
                                                    </p>
                                                    {index === 2 && <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 rounded transition-colors uppercase tracking-wider border border-amber-200 dark:border-amber-800/50">Busy</span>}
                                                </div>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5 transition-colors">
                                                    STOP ID: {1000 + index + parseInt(route.id)}
                                                </p>
                                            </div>

                                            {/* Dynamic ETA Badge */}
                                            {nextArrival ? (
                                                <div className={`flex flex-col items-end`}>
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold border shadow-sm transition-all ${nextArrival.minutesAway <= 2 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 animate-pulse' :
                                                        nextArrival.minutesAway <= 10 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                                        }`}>
                                                        <Icon name="clock" size="text-xs" />
                                                        {nextArrival.minutesAway === 0 ? 'Arriving Now' : `${nextArrival.minutesAway} min`}
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium transition-colors">
                                                        Vehicle #{nextArrival.id}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-300 dark:text-slate-700 italic py-2 transition-colors">-- min</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Vehicle in Segment Animation */}
                                    {vehiclesInSegment.map(v => (
                                        <div
                                            key={v.id}
                                            className="absolute left-1.5 top-12 z-20 flex flex-col items-center pointer-events-none"
                                            style={{
                                                transform: `translateY(${v.progress * 60}px)`, // Adjusted spacing
                                                transition: 'transform 1s linear'
                                            }}
                                        >
                                            <div className="relative pointer-events-auto group/bus">
                                                <div
                                                    onClick={() => showToast(`Vehicle ${v.id} is ${v.status} and ${v.capacity.toLowerCase()} capacity`, 'info')}
                                                    className={`relative px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 text-white text-xs font-bold border-2 border-white dark:border-slate-700 ${route.color} transition-all hover:scale-110 cursor-pointer z-20`}
                                                >
                                                    <Icon name="bus" size="text-xs" />
                                                    <span>{v.id}</span>
                                                </div>
                                                {/* Tooltip */}
                                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-slate-900 dark:bg-slate-800 text-white text-xs p-3 rounded-xl opacity-0 group-hover/bus:opacity-100 transition-all duration-300 whitespace-nowrap z-30 shadow-2xl border border-white/10 dark:border-slate-700 scale-95 group-hover/bus:scale-100 origin-left">
                                                    <p className="font-bold mb-1 border-b border-white/10 pb-1 uppercase tracking-widest text-[10px]">Vehicle Status</p>
                                                    <div className="space-y-1 mt-2">
                                                        <p className="flex justify-between items-center gap-4">
                                                            <span className="text-slate-400">Occupancy:</span>
                                                            <span className="font-bold">{v.capacity}</span>
                                                        </p>
                                                        <p className="flex justify-between items-center gap-4">
                                                            <span className="text-slate-400">Status:</span>
                                                            <span className={`font-bold ${v.status === 'Delayed' ? 'text-red-400' : 'text-emerald-400'}`}>{v.status}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
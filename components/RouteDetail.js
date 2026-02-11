function RouteDetail({ route, vehicles, fullScreen }) {
    const { openModal, showToast } = useAppContext();
    const [isFavorite, setIsFavorite] = React.useState(false);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        showToast(!isFavorite ? 'Route added to favorites' : 'Route removed from favorites', 'success');
    };

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
        <div className={`bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col h-full relative ${fullScreen ? 'min-h-[700px]' : 'min-h-[600px]'}`}>

            {/* Header Background Pattern */}
            <div className={`absolute top-0 left-0 right-0 h-32 opacity-10 ${route.color}`}></div>

            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
                <div className="mb-4 md:mb-0">
                    <div className="flex items-center gap-4 mb-2">
                        <span className={`px-4 py-1.5 rounded-lg text-lg font-black text-white shadow-lg shadow-black/10 ${route.color}`}>
                            {route.number}
                        </span>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{route.name}</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                        <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                            <Icon name="bus" size="text-xs" />
                            {route.type}
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                            <Icon name="clock" size="text-xs" />
                            Every {route.frequency}
                        </span>
                        <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                            <Icon name="rss" size="text-xs" />
                            Live Updates
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => openModal('schedule', { route })}
                        className="btn-outline text-sm bg-white hover:bg-slate-50"
                    >
                        <Icon name="calendar-days" size="text-sm" />
                        Full Schedule
                    </button>
                    <button
                        onClick={toggleFavorite}
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${isFavorite
                            ? 'bg-amber-50 border-amber-200 text-amber-500 shadow-sm'
                            : 'border-slate-200 text-slate-400 hover:text-amber-400 hover:border-amber-200 bg-white'
                            }`}
                    >
                        <Icon name="star" size="text-lg" className={isFavorite ? 'fill-current' : ''} />
                    </button>
                </div>
            </div>

            {/* Live Visualization (Linear Map) */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-gradient-to-b from-white to-slate-50 custom-scrollbar">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-1">Route & Tracking</h3>
                        <p className="text-xs text-slate-400">Real-time positions updated every second</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span> Stop
                        </div>
                        <div className="w-px h-3 bg-slate-200"></div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Passed
                        </div>
                    </div>
                </div>

                <div className="relative min-w-[300px] pl-6 pb-12 max-w-3xl mx-auto">
                    {/* The Line */}
                    <div className="absolute left-10 top-2 bottom-0 w-1.5 bg-slate-200 rounded-full"></div>

                    {/* Progress Bar (Visual only, illustrative) */}
                    <div className="absolute left-10 top-2 w-1.5 bg-gradient-to-b from-[var(--primary)] to-transparent rounded-full h-1/3 z-0 opacity-50"></div>

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
                                    <div className={`w-12 h-12 rounded-full border-[5px] border-white shadow-md flex items-center justify-center z-10 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isFirstOrLast ? 'bg-slate-900 text-white' : 'bg-white border-slate-100 ring-4 ring-slate-50 text-slate-400'
                                        }`}>
                                        <div className={`w-4 h-4 rounded-full ${isFirstOrLast ? 'bg-white' : 'bg-slate-300 group-hover:bg-[var(--primary)] transition-colors'}`}></div>
                                    </div>

                                    {/* Stop Info */}
                                    <div className="mt-1 flex-1 bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-[var(--primary)]/30 group-hover:translate-x-1 cursor-default">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className={`font-bold ${isFirstOrLast ? 'text-slate-900 text-lg' : 'text-slate-700'}`}>
                                                        {stop.name}
                                                    </p>
                                                    {index === 2 && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 rounded">BUSY</span>}
                                                </div>
                                                <p className="text-xs text-slate-400 font-mono mt-0.5">
                                                    STOP ID: {1000 + index + parseInt(route.id)}
                                                </p>
                                            </div>

                                            {/* Dynamic ETA Badge */}
                                            {nextArrival ? (
                                                <div className={`flex flex-col items-end`}>
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold border shadow-sm ${nextArrival.minutesAway <= 2 ? 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse' :
                                                        nextArrival.minutesAway <= 10 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                                                        }`}>
                                                        <Icon name="clock" size="text-xs" />
                                                        {nextArrival.minutesAway === 0 ? 'Arriving Now' : `${nextArrival.minutesAway} min`}
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 mt-1 font-medium">
                                                        Vehicle #{nextArrival.id}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-300 italic py-2">-- min</span>
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
                                                    className={`relative px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 text-white text-xs font-bold border-2 border-white ${route.color} transition-all hover:scale-110 cursor-pointer z-20`}
                                                >
                                                    <Icon name="bus" size="text-xs" />
                                                    <span>{v.id}</span>
                                                </div>
                                                {/* Tooltip */}
                                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-slate-900 text-white text-xs p-2 rounded-lg opacity-0 group-hover/bus:opacity-100 transition-opacity whitespace-nowrap z-30 shadow-xl">
                                                    <p className="font-bold mb-1">Vehicle Status</p>
                                                    <p className="text-slate-300">Occupancy: {v.capacity}</p>
                                                    <p className={`${v.status === 'Delayed' ? 'text-red-400' : 'text-emerald-400'}`}>{v.status}</p>
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
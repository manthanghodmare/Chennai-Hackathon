function SustainabilityView() {
    const { t } = useAppContext();
    const [timeframe, setTimeframe] = React.useState('last_7_days');

    // Default static data map
    const [dataMap, setDataMap] = React.useState({
        'last_7_days': {
            stats: [
                { id: 1, label: t('co2_saved'), value: '1,240', unit: t('kg'), icon: 'leaf', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { id: 2, label: t('trees_equiv'), value: '56', unit: t('trees'), icon: 'tree-pine', color: 'text-green-600', bg: 'bg-green-50' },
                { id: 3, label: t('cars_removed'), value: '12', unit: t('cars'), icon: 'car-front', color: 'text-blue-600', bg: 'bg-blue-50' },
                { id: 4, label: t('eco_points'), value: '2,450', unit: t('pts'), icon: 'award', color: 'text-amber-600', bg: 'bg-amber-50' }
            ],
            chart: {
                labels: [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')],
                values: [40, 65, 45, 80, 55, 90, 70]
            }
        },
        'last_30_days': {
            stats: [
                { id: 1, label: t('co2_saved'), value: '5,890', unit: t('kg'), icon: 'leaf', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { id: 2, label: t('trees_equiv'), value: '265', unit: t('trees'), icon: 'tree-pine', color: 'text-green-600', bg: 'bg-green-50' },
                { id: 3, label: t('cars_removed'), value: '48', unit: t('cars'), icon: 'car-front', color: 'text-blue-600', bg: 'bg-blue-50' },
                { id: 4, label: t('eco_points'), value: '11,200', unit: t('pts'), icon: 'award', color: 'text-amber-600', bg: 'bg-amber-50' }
            ],
            chart: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], // Using simple strings here since there aren't translation keys for weeks yet
                values: [350, 420, 380, 510]
            }
        }
    });

    const [leaderboards, setLeaderboards] = React.useState([
        { id: '1', name: 'Downtown Loop (101)', impact: 'High', efficiency: 94, color: 'bg-blue-500' },
        { id: '2', name: 'Airport Shuttle (305)', impact: 'Medium', efficiency: 88, color: 'bg-purple-500' },
        { id: '3', name: 'Westside Express (202)', impact: 'Medium', efficiency: 82, color: 'bg-emerald-500' }
    ]);

    // Setup real-time listeners
    React.useEffect(() => {
        if (!window.firebaseApp || !window.firebaseApp.db) return;
        
        const db = window.firebaseApp.db;
        
        // Listen for stats map updates
        const unsubscribeStats = db.collection('sustainability_stats').onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
                const data = doc.data();
                setDataMap((prev) => ({
                    ...prev,
                    [doc.id]: {
                        ...prev[doc.id],
                        ...data,
                    }
                }));
            });
        });

        // Listen for eco leaderboard updates
        const unsubscribeLeaderboards = db.collection('eco_leaderboard').onSnapshot((snapshot) => {
            const newLeaderboards = [];
            snapshot.forEach((doc) => {
                newLeaderboards.push({ id: doc.id, ...doc.data() });
            });

            if (newLeaderboards.length > 0) {
                // Sort by efficiency descending
                newLeaderboards.sort((a, b) => b.efficiency - a.efficiency);
                setLeaderboards(newLeaderboards);
            }
        });

        return () => {
            unsubscribeStats();
            unsubscribeLeaderboards();
        };
    }, []);

    const currentData = dataMap[timeframe] || dataMap['last_7_days'];
    const maxChartValue = Math.max(...currentData.chart.values, 10);

    return (
        <div className="animate-fade-in space-y-8 pb-12 pt-8 sm:pt-12 lg:pt-20 px-2 sm:px-0">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-3 sm:mb-4 transition-colors">{t('sustainability_overview')}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg transition-colors">{t('sustainability_desc')}</p>
            </div>

            {/* Impact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {currentData.stats.map(stat => (
                    <div key={stat.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-black/50 hover:-translate-y-1 hover:shadow-xl transition-all cursor-default group flex items-start sm:block gap-4 sm:gap-0">
                        <div className={`w-12 h-12 flex-shrink-0 ${stat.bg} dark:bg-emerald-900/20 ${stat.color} dark:text-emerald-400 rounded-xl flex items-center justify-center sm:mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                            <Icon name={stat.icon} size="text-xl" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 transition-colors">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-white transition-colors">{stat.value}</h3>
                                <span className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 transition-colors">{stat.unit}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Efficiency Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
                        <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white transition-colors">{t('weekly_trend')}</h3>
                        <select 
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="w-full sm:w-auto bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold rounded-xl px-4 py-3 sm:py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer shadow-sm hover:shadow active:scale-[0.98] sm:active:scale-100"
                        >
                            <option value="last_7_days">{t('last_7_days')}</option>
                            <option value="last_30_days">{t('last_30_days')}</option>
                        </select>
                    </div>
                    {/* Visual Chart - Added internal scrolling for mobile so columns don't squish too much */}
                    <div className="overflow-x-auto pb-4 sm:pb-0 -mx-2 sm:mx-0 px-2 sm:px-0">
                        <div className="h-56 sm:h-64 md:h-72 min-w-[320px] flex items-end gap-1.5 sm:gap-2 md:gap-4 px-1 sm:px-2 pt-6">
                            {currentData.chart.values.map((val, i) => {
                                // Calculate percentage height relative to max value (leaving 10% headroom)
                                const heightPct = Math.max(10, (val / maxChartValue) * 90);
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 group relative h-full justify-end">
                                        {/* Custom Tooltip - Make it visible on touch/hover, remove hidden sm:block restriction */}
                                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 group-active:opacity-100 group-hover:-translate-y-2 group-active:-translate-y-2 transition-all duration-300 pointer-events-none bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-[10px] sm:text-xs font-bold py-1 sm:py-1.5 px-2 sm:px-3 rounded-lg shadow-xl whitespace-nowrap z-10 text-center">
                                            {val} <span className="hidden sm:inline">kg saved</span>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-white"></div>
                                        </div>

                                        <div
                                            className="w-full bg-emerald-100 dark:bg-emerald-900/30 rounded-t-lg sm:rounded-t-xl group-hover:bg-emerald-200 group-active:bg-emerald-200 dark:group-hover:bg-emerald-800/50 dark:group-active:bg-emerald-800/50 transition-colors relative flex items-end justify-center overflow-hidden"
                                            style={{ height: '100%' }}
                                        >
                                            <div
                                                className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 dark:from-emerald-700 dark:to-emerald-500 rounded-t-lg sm:rounded-t-xl shadow-[0_0_10px_rgba(52,211,153,0.3)] dark:shadow-[0_0_15px_rgba(4,120,87,0.4)] transition-all duration-700 ease-out group-hover:brightness-110 group-active:brightness-110"
                                                style={{ height: `${heightPct}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors mt-0.5 sm:mt-1 truncate max-w-full px-1">
                                            {currentData.chart.labels[i]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-5 sm:p-6 md:p-8 text-white shadow-2xl relative overflow-hidden transition-colors duration-500 flex flex-col h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <h3 className="text-lg sm:text-xl font-black mb-5 sm:mb-6 flex items-center gap-2">
                            <Icon name="trophy" className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] flex-shrink-0" />
                            {t('eco_leaderboard')}
                        </h3>
                        <div className="space-y-5 sm:space-y-6 flex-grow">
                            {leaderboards.map((r, i) => {
                                const efficiencyText = typeof r.efficiency === 'number' ? `${r.efficiency}%` : r.efficiency;
                                const isTop = i === 0;
                                
                                return (
                                    <div key={r.id} className="flex items-center gap-3 sm:gap-4 group cursor-default">
                                        <span className={`text-xl sm:text-2xl font-black w-5 sm:w-6 transition-colors ${isTop ? 'text-amber-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-slate-600'}`}>
                                            {i + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-xs sm:text-sm mb-1 text-slate-200 group-hover:text-white transition-colors truncate">{r.name}</p>
                                            <div className="w-full h-1.5 sm:h-2 bg-slate-800 dark:bg-slate-800/80 rounded-full overflow-hidden transition-colors">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${isTop ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-slate-600 dark:bg-slate-600 group-hover:bg-slate-500'}`}
                                                    style={{ width: efficiencyText }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0 pl-2">
                                            <p className={`text-[10px] sm:text-xs font-black ${isTop ? 'text-emerald-400' : 'text-slate-400'}`}>{efficiencyText}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button className="w-full mt-6 sm:mt-8 py-3 sm:py-3.5 bg-white/5 hover:bg-white/10 active:bg-white/5 active:scale-[0.98] border border-white/10 rounded-xl text-xs sm:text-sm font-bold transition-all uppercase tracking-widest shadow-lg shadow-black/20 group flex items-center justify-center gap-2">
                            {t('full_report')}
                            <Icon name="arrow-right" size="text-sm" className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Eco Tips */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 rounded-2xl p-5 sm:p-6 md:p-8 border border-indigo-100 dark:border-indigo-800/30 flex flex-col md:flex-row items-center gap-5 sm:gap-6 md:gap-8 transition-colors group hover:shadow-xl hover:shadow-indigo-500/5 duration-500">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-indigo-200/50 dark:shadow-black/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 transition-all group-hover:scale-110 group-hover:-rotate-6">
                    <Icon name="lightbulb" size="text-2xl sm:text-3xl" className="group-hover:text-amber-400 transition-colors duration-500" />
                </div>
                <div className="flex-1 text-center md:text-left w-full">
                    <h4 className="text-lg sm:text-xl font-bold text-indigo-900 dark:text-indigo-300 mb-1.5 sm:mb-2 transition-colors">{t('did_you_know')}</h4>
                    <p className="text-sm sm:text-base text-indigo-700/80 dark:text-indigo-400/80 leading-relaxed transition-colors">{t('eco_tip')}</p>
                </div>
                <button className="w-full md:w-auto btn-primary bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 whitespace-nowrap shadow-xl shadow-indigo-500/30 active:scale-95 transition-all text-xs sm:text-sm px-5 sm:px-6 py-3 sm:py-3.5 flex items-center justify-center gap-2 group/btn rounded-xl text-white font-bold">
                    {t('plan_green_route')}
                    <Icon name="map" size="text-sm" className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}

window.SustainabilityView = SustainabilityView;


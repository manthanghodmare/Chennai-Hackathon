function SustainabilityView() {
    const stats = [
        { id: 1, label: 'CO₂ Saved', value: '1,240', unit: 'kg', icon: 'leaf', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 2, label: 'Trees Equiv.', value: '56', unit: 'trees', icon: 'tree-pine', color: 'text-green-600', bg: 'bg-green-50' },
        { id: 3, label: 'Cars Removed', value: '12', unit: 'cars', icon: 'car-front', color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 4, label: 'Eco Points', value: '2,450', unit: 'pts', icon: 'award', color: 'text-amber-600', bg: 'bg-amber-50' }
    ];

    const leaderboards = [
        { id: 1, name: 'Downtown Loop (101)', impact: 'High', efficiency: '94%', color: 'bg-blue-500' },
        { id: 2, name: 'Airport Shuttle (305)', impact: 'Medium', efficiency: '88%', color: 'bg-purple-500' },
        { id: 3, name: 'Westside Express (202)', impact: 'Medium', efficiency: '82%', color: 'bg-emerald-500' }
    ];

    return (
        <div className="animate-fade-in space-y-8 pb-12 pt-12 lg:pt-20">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-4 transition-colors">Your Environmental Impact</h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg transition-colors">Every trip on Nexus Mobility contributes to a greener, cleaner city. Here's how our community is making a difference today.</p>
            </div>

            {/* Impact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => (
                    <div key={stat.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 hover:scale-105 transition-all cursor-default group">
                        <div className={`w-12 h-12 ${stat.bg} dark:bg-emerald-900/20 ${stat.color} dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-all`}>
                            <Icon name={stat.icon} size="text-xl" />
                        </div>
                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 transition-colors">{stat.label}</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-slate-800 dark:text-white transition-colors">{stat.value}</h3>
                            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 transition-colors">{stat.unit}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Efficiency Chart Placeholder */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 transition-colors">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white transition-colors">Weekly Savings Trend</h3>
                        <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500 transition-colors">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    {/* Visual Chart Mock */}
                    <div className="h-64 flex items-end gap-4 px-2">
                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className="w-full bg-emerald-500 dark:bg-emerald-600 rounded-t-lg transition-all hover:bg-emerald-600 dark:hover:bg-emerald-500 cursor-help"
                                    style={{ height: `${h}%` }}
                                    title={`${h}kg saved`}
                                ></div>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase transition-colors">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden transition-colors duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                            <Icon name="trophy" className="text-amber-400" />
                            Eco-Route Ranking
                        </h3>
                        <div className="space-y-6">
                            {leaderboards.map((r, i) => (
                                <div key={r.id} className="flex items-center gap-4">
                                    <span className="text-2xl font-black text-slate-700 dark:text-slate-800 w-6 transition-colors">{i + 1}</span>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm mb-1">{r.name}</p>
                                        <div className="w-full h-1.5 bg-slate-800 dark:bg-slate-900 rounded-full overflow-hidden transition-colors">
                                            <div
                                                className={`h-full ${r.id === 1 ? 'bg-emerald-500' : 'bg-slate-600 dark:bg-slate-700'}`}
                                                style={{ width: r.efficiency }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-emerald-400">{r.efficiency}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-bold transition-all uppercase tracking-widest shadow-lg shadow-black/20">
                            View Full Report
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Eco Tips */}
            <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-900/30 flex flex-col md:flex-row items-center gap-8 transition-colors">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 transition-colors">
                    <Icon name="lightbulb" size="text-3xl" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 mb-2 transition-colors">Did you know?</h4>
                    <p className="text-indigo-700 dark:text-indigo-400 transition-colors">Shifting just two car commutes per week to public transit can reduce your personal carbon footprint by over <span className="font-bold text-indigo-900 dark:text-indigo-200">1,000 kg</span> per year.</p>
                </div>
                <button className="btn-primary bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600 whitespace-nowrap shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">Plan Green Route</button>
            </div>
        </div>
    );
}

window.SustainabilityView = SustainabilityView;

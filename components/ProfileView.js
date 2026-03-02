function ProfileView() {
    const { user } = Auth.useAuth();

    const stats = [
        { label: 'Total Trips', value: '42', icon: 'map-pin', color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Eco Points', value: '2,450', icon: 'award', color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'CO₂ Saved', value: '128kg', icon: 'leaf', color: 'text-emerald-600', bg: 'bg-emerald-50' }
    ];

    const history = [
        { id: 1, route: '101', date: 'Today, 08:30 AM', spent: '₹20', impact: '2.4kg CO₂ saved', from: 'Central Station', to: 'Tech Park' },
        { id: 2, route: '305', date: 'Yesterday, 05:45 PM', spent: '₹40', impact: '4.8kg CO₂ saved', from: 'Airport T1', to: 'Central Station' },
        { id: 3, route: '202', date: 'Mar 1, 09:15 AM', spent: '₹15', impact: '1.2kg CO₂ saved', from: 'West Terminal', to: 'Shopping Mall' }
    ];

    const badges = [
        { id: 1, name: 'Eco Warrior', icon: 'leaf', unlocked: true, desc: 'Saved 100kg of CO₂ emissions' },
        { id: 2, name: 'Frequent Rider', icon: 'bus', unlocked: true, desc: 'Completed 25 trips this month' },
        { id: 3, name: 'Early Bird', icon: 'clock', unlocked: true, desc: 'Rode 5 times before 7:00 AM' },
        { id: 4, name: 'City Legend', icon: 'crown', unlocked: false, desc: 'Traveled to all 4 zones' }
    ];

    return (
        <div className="animate-fade-in space-y-8 pb-12 pt-12 lg:pt-20 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center text-[#1E3A8A]">
                        <Icon name="user" size="text-4xl" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-md">
                        <Icon name="check" size="text-[10px]" />
                    </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-black text-slate-900 mb-1">{user?.name || 'Passenger Name'}</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4">Silver Tier Member</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        {stats.map((stat, i) => (
                            <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-xl ${stat.bg} ${stat.color} border border-transparent hover:border-current/10 transition-colors`}>
                                <Icon name={stat.icon} size="text-sm" />
                                <span className="font-bold text-sm">{stat.value}</span>
                                <span className="text-[10px] opacity-70 uppercase tracking-tighter">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full md:w-auto text-center md:text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Next Level: Gold</p>
                    <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden mx-auto md:ml-auto">
                        <div className="h-full bg-amber-400 w-3/4 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 mt-2">550 pts until next reward</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Trip History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-800">Trip History</h3>
                        <button className="text-sm font-bold text-blue-600 hover:underline">Download CSV</button>
                    </div>
                    <div className="space-y-4">
                        {history.map(trip => (
                            <div key={trip.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group cursor-default">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500 font-bold">
                                            {trip.route}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{trip.date}</p>
                                            <p className="text-xs text-slate-500 font-medium">{trip.from} → {trip.to}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-slate-900">{trip.spent}</p>
                                        <p className="text-[10px] font-bold text-emerald-600">{trip.impact}</p>
                                    </div>
                                </div>
                                <div className="h-px bg-slate-50 w-full mb-3"></div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction ID: #TXN-{trip.id}829</span>
                                    <button className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                                        View Receipt <Icon name="chevron-right" size="text-[10px]" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rewards & Badges */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800">Badges & Rewards</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {badges.map(badge => (
                            <div key={badge.id} className={`bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center group cursor-help transition-all ${!badge.unlocked && 'opacity-50 grayscale'}`}>
                                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${badge.unlocked ? 'bg-amber-50 text-amber-600 shadow-inner' : 'bg-slate-50 text-slate-300'}`}>
                                    <Icon name={badge.icon} size="text-xl" />
                                </div>
                                <p className="font-bold text-xs text-slate-900 mb-1">{badge.name}</p>
                                <div className="hidden group-hover:block absolute z-50 bg-slate-900 text-white text-[10px] p-2 rounded-lg w-32 -mt-20 left-1/2 -translate-x-1/2 shadow-xl border border-white/10">
                                    {badge.desc}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="font-black text-lg mb-2">Redeem Points</h4>
                            <p className="text-indigo-100 text-sm mb-4">Exchange your points for free transit passes or nearby city discounts.</p>
                            <button className="w-full py-3 bg-white text-[#1E3A8A] font-black text-sm rounded-xl uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg">
                                Open Rewards Store
                            </button>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

window.ProfileView = ProfileView;

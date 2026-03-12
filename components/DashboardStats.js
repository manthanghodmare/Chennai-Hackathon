const AnimatedCounter = ({ value, duration = 1500 }) => {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        let start = 0;
        const end = parseInt(value);
        if (start === end) return;

        let totalMiliseconds = duration;
        let incrementTime = (totalMiliseconds / end);

        let timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{count}</span>;
};

function DashboardStats({ activeRoutes, vehiclesOnRoad, alertsCount }) {
    const { t } = useAppContext();
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in relative z-10">
            <div className="bg-[#0F172A]/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 shadow-2xl flex flex-col gap-6 transition-all hover:scale-[1.02] hover:border-blue-500/30 group cursor-default overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <Icon name="route" size="text-2xl" />
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-2">{t('network_scope')}</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-black text-white tracking-tighter">
                            <AnimatedCounter value={activeRoutes} />
                        </p>
                        <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">{t('active_lines')}</span>
                    </div>
                </div>
            </div>

            <div className="bg-[#0F172A]/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 shadow-2xl flex flex-col gap-6 transition-all hover:scale-[1.02] hover:border-emerald-500/30 group cursor-default overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shadow-lg group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 relative">
                    <Icon name="bus" size="text-2xl" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
                    </span>
                </div>
                <div className="relative">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-2">{t('fleet_online')}</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-black text-white tracking-tighter">
                            <AnimatedCounter value={vehiclesOnRoad} />
                        </p>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">{t('live_sync')}</span>
                    </div>
                </div>
            </div>

            <div className="bg-[#0F172A]/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 shadow-2xl flex flex-col gap-6 transition-all hover:scale-[1.02] hover:border-amber-500/30 group cursor-default overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="w-14 h-14 rounded-2xl bg-amber-600/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shadow-lg group-hover:bg-amber-600 group-hover:text-white transition-all duration-500">
                    <Icon name="triangle-alert" size="text-2xl" />
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-2">{t('safety_desk')}</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-black text-white tracking-tighter">
                            <AnimatedCounter value={alertsCount} />
                        </p>
                        <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">{t('service_alerts')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
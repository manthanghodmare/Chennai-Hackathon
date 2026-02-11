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
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl flex items-center gap-5 transition-all hover:scale-[1.02] hover:shadow-2xl group cursor-default">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon name="route" size="text-3xl" />
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Network Scope</p>
                    <p className="text-4xl font-black text-slate-900 mt-1">
                        <AnimatedCounter value={activeRoutes} />
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Active Lines</span>
                    </div>
                </div>
            </div>

            <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl flex items-center gap-5 transition-all hover:scale-[1.02] hover:shadow-2xl group cursor-default">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Icon name="bus" size="text-3xl" />
                </div>
                <div className="relative">
                    <div className="absolute -top-1 -right-2 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </div>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Fleet Online</p>
                    <p className="text-4xl font-black text-slate-900 mt-1">
                        <AnimatedCounter value={vehiclesOnRoad} />
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Live Tracking</span>
                    </div>
                </div>
            </div>

            <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl flex items-center gap-5 transition-all hover:scale-[1.02] hover:shadow-2xl group cursor-default text-amber-900">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Icon name="triangle-alert" size="text-3xl" />
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Safety Desk</p>
                    <p className="text-4xl font-black text-slate-900 mt-1">
                        <AnimatedCounter value={alertsCount} />
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Service Info</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
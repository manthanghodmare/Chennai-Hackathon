function EcoWidget() {
    const { setView } = useAppContext();
    const [savedCO2, setSavedCO2] = React.useState(1240); // kg

    // Simulate live counter
    React.useEffect(() => {
        const interval = setInterval(() => {
            setSavedCO2(prev => prev + 0.1);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            onClick={() => setView('sustainability')}
            className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-5 border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-between animate-fade-in shadow-sm cursor-pointer hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 transition-all group"
        >
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-100 dark:bg-emerald-800/30 text-emerald-700 dark:text-emerald-400 p-1.5 rounded-lg transition-colors">
                        <Icon name="leaf" size="text-sm" />
                    </span>
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm uppercase tracking-wide transition-colors">Eco Impact</h4>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-[200px] transition-colors">
                    By choosing public transit today, our community has saved:
                </p>
            </div>
            <div className="text-right">
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums transition-colors">
                    {savedCO2.toFixed(1)} <span className="text-sm font-bold">kg</span>
                </p>
                <p className="text-[10px] text-emerald-500 dark:text-emerald-600 font-bold uppercase transition-colors">CO₂ Emissions</p>
            </div>
        </div>
    );
}
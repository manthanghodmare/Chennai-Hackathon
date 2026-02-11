function EcoWidget() {
    const [savedCO2, setSavedCO2] = React.useState(1240); // kg
    
    // Simulate live counter
    React.useEffect(() => {
        const interval = setInterval(() => {
            setSavedCO2(prev => prev + 0.1);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 flex items-center justify-between animate-fade-in shadow-sm">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
                        <Icon name="leaf" size="text-sm" />
                    </span>
                    <h4 className="font-bold text-emerald-900 text-sm uppercase tracking-wide">Eco Impact</h4>
                </div>
                <p className="text-xs text-emerald-700 max-w-[200px]">
                    By choosing public transit today, our community has saved:
                </p>
            </div>
            <div className="text-right">
                <p className="text-2xl font-black text-emerald-600 tabular-nums">
                    {savedCO2.toFixed(1)} <span className="text-sm font-bold">kg</span>
                </p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase">CO₂ Emissions</p>
            </div>
        </div>
    );
}
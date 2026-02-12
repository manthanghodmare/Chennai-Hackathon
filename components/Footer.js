function Footer() {
    return (
        <footer className="bg-[#F9FAFB] border-t border-slate-200 mt-12 py-10 px-6">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
                <Logo size="sm" showText={false} className="opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                <div className="text-center text-[#111827]/40 text-xs font-bold uppercase tracking-widest">
                    <p>&copy; 2026 NEXUS Mobility Group • All Rights Reserved</p>
                </div>
                <div className="flex justify-center gap-8 flex-wrap">
                    <a href="#" className="text-slate-500 hover:text-[#1E3A8A] text-sm font-semibold transition-colors">Privacy</a>
                    <a href="#" className="text-slate-500 hover:text-[#1E3A8A] text-sm font-semibold transition-colors">Terms</a>
                    <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
                    <a href="admin.html" className="text-[#3B82F6] hover:text-[#1E3A8A] flex items-center gap-2 text-sm font-bold transition-all hover:scale-105">
                        <Icon name="lock" size="text-xs" />
                        Admin Access
                    </a>
                    <a href="driver.html" className="text-[#3B82F6] hover:text-[#1E3A8A] flex items-center gap-2 text-sm font-bold transition-all hover:scale-105">
                        <Icon name="bus" size="text-xs" />
                        Driver Portal
                    </a>
                </div>
            </div>
        </footer>
    );
}
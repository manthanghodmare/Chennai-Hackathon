function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 mt-12 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
                <p>&copy; 2026 CityTransit Authority. All rights reserved.</p>
                <div className="flex justify-center gap-6 mt-4 flex-wrap">
                    <a href="#" className="hover:text-slate-600">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-600">Terms of Service</a>
                    <span className="text-slate-300">|</span>
                    <a href="admin.html" className="hover:text-[var(--primary)] flex items-center gap-1 font-medium transition-colors">
                        <Icon name="lock" size="text-xs" />
                        Admin Portal
                    </a>
                    <a href="driver.html" className="hover:text-[var(--primary)] flex items-center gap-1 font-medium transition-colors">
                        <Icon name="bus" size="text-xs" />
                        Driver App
                    </a>
                </div>
            </div>
        </footer>
    );
}
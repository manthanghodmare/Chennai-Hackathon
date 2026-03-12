function Footer() {
    return (
        <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-12 py-12 px-6 transition-colors duration-500">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
                <Logo size="sm" showText={false} className="opacity-40 dark:opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer hover:opacity-100" />

                <div className="grid grid-cols-1 md:grid-cols-3 w-full items-center gap-8 pt-4">
                    <div className="text-center md:text-left text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] order-2 md:order-1">
                        <p>{window.t ? window.t('copyright_text') : '© 2024 NEXUS Mobility Group • All Rights Reserved'}</p>
                    </div>

                    <div className="flex justify-center gap-8 flex-wrap order-1 md:order-2">
                        <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold uppercase tracking-widest transition-colors">{window.t ? window.t('privacy') : 'Privacy'}</a>
                        <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold uppercase tracking-widest transition-colors">{window.t ? window.t('terms') : 'Terms'}</a>
                    </div>

                    <div className="flex justify-center md:justify-end gap-6 order-3">
                        <a href="admin.html" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all hover:scale-105">
                            <Icon name="lock" size="text-[10px]" />
                            {window.t ? window.t('admin') : 'Admin'}
                        </a>
                        <a href="driver.html" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all hover:scale-105">
                            <Icon name="bus" size="text-[10px]" />
                            {window.t ? window.t('portal') : 'Portal'}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
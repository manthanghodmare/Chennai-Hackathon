function ToastContainer({ toasts }) {
    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 rounded-lg shadow-xl shadow-slate-900/20 dark:shadow-black/40 flex items-center gap-3 animate-fade-in pointer-events-auto min-w-[300px] border-l-4 transition-colors ${toast.type === 'success' ? 'border-emerald-500' :
                            toast.type === 'error' ? 'border-red-500' : 'border-blue-500'
                        }`}
                >
                    <div className={`p-1 rounded-full ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                            toast.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                        <Icon name={toast.type === 'success' ? 'check' : toast.type === 'error' ? 'circle-alert' : 'info'} size="text-xs" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">{toast.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col animate-fade-in relative z-10 overflow-hidden transition-colors duration-500 border border-transparent dark:border-slate-800">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <Icon name="x" size="text-lg" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
}

function ScheduleModal({ route, onClose }) {
    return (
        <Modal isOpen={true} onClose={onClose} title={`Schedule: ${route.number} ${route.name}`}>
            <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl border border-blue-100 dark:border-blue-800/50 transition-colors">
                    <Icon name="info" />
                    <p className="text-sm">Buses run every <strong>{route.frequency}</strong> on weekdays.</p>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800 transition-colors">
                        <tr>
                            <th className="py-2 pl-2">Stop Name</th>
                            <th className="py-2">First Bus</th>
                            <th className="py-2">Last Bus</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {route.stops.map((stop, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <td className="py-3 pl-2 font-medium text-slate-700 dark:text-slate-300">{stop.name}</td>
                                <td className="py-3 text-slate-500 dark:text-slate-400">06:{15 + (i * 5)} AM</td>
                                <td className="py-3 text-slate-500 dark:text-slate-400">11:{30 + (i * 5)} PM</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="text-center">
                    <button className="text-[var(--primary)] font-bold text-sm hover:underline transition-all">Download PDF Schedule</button>
                </div>
            </div>
        </Modal>
    );
}

function SearchModal({ onClose, routes }) {
    const [query, setQuery] = React.useState('');

    const filteredRoutes = routes.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.number.includes(query)
    );

    return (
        <Modal isOpen={true} onClose={onClose} title="Search Transit">
            <div className="relative mb-6">
                <Icon name="search" className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
                <input
                    type="text"
                    autoFocus
                    placeholder="Search for route number or name..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Results</p>
                {filteredRoutes.length > 0 ? filteredRoutes.map(route => (
                    <button key={route.id} onClick={onClose} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 text-left active:scale-[0.98]">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-sm ${route.color}`}>{route.number}</span>
                        <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{route.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{route.type}</p>
                        </div>
                    </button>
                )) : (
                    <div className="text-center py-12 text-slate-400 dark:text-slate-600">
                        <Icon name="search-x" size="text-4xl" className="mx-auto mb-4 opacity-50" />
                        <p className="font-medium">No routes found matching "<span className="text-slate-900 dark:text-slate-200">{query}</span>"</p>
                    </div>
                )}
            </div>
        </Modal>
    );
}
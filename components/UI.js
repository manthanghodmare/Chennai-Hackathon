function ToastContainer({ toasts }) {
    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            {toasts.map(toast => (
                <div 
                    key={toast.id} 
                    className={`bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl shadow-slate-900/20 flex items-center gap-3 animate-fade-in pointer-events-auto min-w-[300px] border-l-4 ${
                        toast.type === 'success' ? 'border-emerald-500' : 
                        toast.type === 'error' ? 'border-red-500' : 'border-blue-500'
                    }`}
                >
                    <div className={`p-1 rounded-full ${
                        toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 
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
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col animate-fade-in relative z-10 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-lg text-slate-900">{title}</h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
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
                <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
                    <Icon name="info" />
                    <p className="text-sm">Buses run every <strong>{route.frequency}</strong> on weekdays.</p>
                </div>
                
                <table className="w-full text-sm text-left">
                    <thead className="text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="py-2 pl-2">Stop Name</th>
                            <th className="py-2">First Bus</th>
                            <th className="py-2">Last Bus</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {route.stops.map((stop, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                                <td className="py-3 pl-2 font-medium text-slate-700">{stop.name}</td>
                                <td className="py-3 text-slate-500">06:{15 + (i * 5)} AM</td>
                                <td className="py-3 text-slate-500">11:{30 + (i * 5)} PM</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <div className="text-center">
                     <button className="text-[var(--primary)] font-bold text-sm hover:underline">Download PDF Schedule</button>
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
                <Icon name="search" className="absolute left-3 top-3 text-slate-400" />
                <input 
                    type="text" 
                    autoFocus
                    placeholder="Search for route number or name..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            
            <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Results</p>
                {filteredRoutes.length > 0 ? filteredRoutes.map(route => (
                    <button key={route.id} onClick={onClose} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 text-left">
                        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${route.color}`}>{route.number}</span>
                        <div>
                            <p className="font-bold text-slate-800 text-sm">{route.name}</p>
                            <p className="text-xs text-slate-500">{route.type}</p>
                        </div>
                    </button>
                )) : (
                    <div className="text-center py-8 text-slate-400">
                        <Icon name="search-x" size="text-2xl" className="mx-auto mb-2 opacity-50" />
                        <p>No routes found matching "{query}"</p>
                    </div>
                )}
            </div>
        </Modal>
    );
}
function AdminAlerts({ alerts }) {
  const [newAlert, setNewAlert] = React.useState({ type: 'warning', target: 'All Passengers', message: '' });

  // Internal Categorization for Demo
  const categories = {
    delays: alerts.filter(a => a.message.toLowerCase().includes('delay') || a.type === 'warning'),
    stopped: alerts.filter(a => a.message.toLowerCase().includes('stopped') || a.message.toLowerCase().includes('traffic')),
    signal: alerts.filter(a => a.message.toLowerCase().includes('signal') || a.message.toLowerCase().includes('gps'))
  };

  const handleSend = () => {
    if (!newAlert.message) return;
    alert(`Broadcast Sent: ${newAlert.message}`);
    setNewAlert({ ...newAlert, message: '' });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight transition-colors">Fleet Alert Center</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Real-time incident management and broadcast portal</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 transition-colors">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest transition-colors">Server: Online</span>
          </div>
        </div>
      </div>

      {/* Main Categorized Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Column 1: Bus Delay Alerts */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-lg">
              <Icon name="clock-alert" size="text-sm" />
            </div>
            <h3 className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-xs transition-colors">Bus Delay Alerts</h3>
          </div>

          <div className="space-y-4">
            {categories.delays.map(alert => (
              <div key={alert.id} className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:border-orange-200 dark:hover:border-orange-500/50 border-l-4 border-l-orange-500">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black px-2 py-0.5 bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 rounded uppercase tracking-tighter transition-colors">Route {alert.routeId}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest transition-colors">Active</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-3 transition-colors">{alert.message}</p>
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg group-hover:bg-orange-50/50 dark:group-hover:bg-orange-900/20 transition-colors">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase transition-colors">Impact: Medium</span>
                  <button className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors">
                    <Icon name="trash-2" size="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Stopped/Stationary Warnings */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg">
              <Icon name="pause-circle" size="text-sm" />
            </div>
            <h3 className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-xs transition-colors">Stationary Warnings</h3>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:border-amber-200 dark:hover:border-amber-500/50 border-l-4 border-l-amber-500 group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black px-2 py-0.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded uppercase tracking-tighter transition-colors">Vehicle #V42</span>
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest animate-pulse">Stopped {'>'} 8m</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-3 transition-colors">Vehicle has been stationary for more than 5 minutes near Central Market.</p>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-amber-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 transition-all shadow-lg shadow-amber-500/20">Contact Driver</button>
                <button className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-lg border border-transparent dark:border-slate-700 transition-colors"><Icon name="search" size="text-xs" /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: GPS Signal Lost */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-slate-800 dark:bg-black text-slate-100 rounded-lg">
              <Icon name="wifi-off" size="text-sm" />
            </div>
            <h3 className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-xs transition-colors">GPS Signal Lost</h3>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 dark:bg-black border border-slate-800 dark:border-slate-800/50 shadow-xl border-l-4 border-l-red-500 group relative overflow-hidden transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-8 -mt-8"></div>
              <div className="flex justify-between items-start mb-2 relative z-10">
                <span className="text-[10px] font-black px-2 py-0.5 bg-red-500 text-white rounded uppercase tracking-tighter">Driver ID: D821</span>
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Signal Lost</span>
              </div>
              <p className="text-sm text-slate-300 font-medium leading-relaxed mb-4 relative z-10 transition-colors">Last known position: Route 202, Sector 4. Data feed interrupted.</p>
              <div className="flex gap-2 relative z-10">
                <button className="flex-1 py-2 bg-white text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-lg active:scale-95">Initiate Protocol</button>
                <button className="flex-1 py-2 bg-red-600/20 text-red-500 border border-red-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600/30 transition-all active:scale-95">Emergency Ping</button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Broadcast Central Section */}
      <div className="max-w-4xl mx-auto pt-8">
        <div className="card bg-[#1E3A8A] dark:bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden p-8 transition-colors duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-white/10 dark:bg-white/5 rounded-2xl flex items-center justify-center text-[#F59E0B] shadow-inner transition-colors">
              <Icon name="megaphone" size="text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Fleet Announcement System</h3>
              <p className="text-blue-200/60 dark:text-slate-400 text-xs font-medium uppercase tracking-widest transition-colors">Broadcast critical info to passengers and drivers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-blue-200/60 dark:text-slate-500 block mb-2 font-black uppercase tracking-widest transition-colors">Announcement Priority</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setNewAlert({ ...newAlert, type: 'warning' })}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${newAlert.type === 'warning' ? 'bg-[#F59E0B] text-[#1E3A8A] shadow-lg shadow-[#F59E0B]/20' : 'bg-white/5 dark:bg-white/5 text-blue-300 dark:text-slate-400 hover:bg-white/10'}`}
                    >
                      Critical
                    </button>
                    <button
                      onClick={() => setNewAlert({ ...newAlert, type: 'info' })}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${newAlert.type === 'info' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 dark:bg-white/5 text-blue-300 dark:text-slate-400 hover:bg-white/10'}`}
                    >
                      Institutional
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-blue-200/60 dark:text-slate-500 block mb-2 font-black uppercase tracking-widest transition-colors">Target Fleet / Audience</label>
                  <select
                    value={newAlert.target}
                    onChange={(e) => setNewAlert({ ...newAlert, target: e.target.value })}
                    className="w-full bg-white/10 dark:bg-slate-800/50 border-none rounded-xl p-4 text-sm text-white focus:ring-2 focus:ring-blue-400 outline-none appearance-none font-bold shadow-inner transition-colors"
                  >
                    <option className="bg-[#1E3A8A] dark:bg-slate-900">System Wide (All)</option>
                    <option className="bg-[#1E3A8A] dark:bg-slate-900">Western Sector (101)</option>
                    <option className="bg-[#1E3A8A] dark:bg-slate-900">Eastern Arterial (202)</option>
                    <option className="bg-[#1E3A8A] dark:bg-slate-900">Technical Staff (Drivers)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-blue-200/60 dark:text-slate-500 block mb-2 font-black uppercase tracking-widest transition-colors">Broadcast Message</label>
                <textarea
                  value={newAlert.message}
                  onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                  className="w-full bg-white/10 dark:bg-slate-800/50 border-none rounded-xl p-4 text-sm text-white h-32 placeholder:text-blue-300/30 dark:placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-400 font-medium shadow-inner resize-none transition-colors"
                  placeholder="Enter your announcement here..."
                ></textarea>
              </div>
              <button
                onClick={handleSend}
                className="w-full bg-white dark:bg-blue-600 text-[#1E3A8A] dark:text-white hover:bg-slate-100 dark:hover:bg-blue-700 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <Icon name="send" size="text-xs" />
                Initiate Broadcast
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIChat({ isOpen, onClose }) {
    const [messages, setMessages] = React.useState([
        { id: 1, text: "Hello! I'm your Nexus Mobility assistant. How can I help you today?\n\nYou can ask me:\n• 'Should I take Bus 12B or 27C?'\n• 'I lost my red tiffin box on Bus 12B'\n• Any route or schedule question!", sender: 'ai' }
    ]);
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const scrollRef = React.useRef(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // ---------- Smart Intent Detection ----------
    const detectIntent = (text) => {
        const t = text.toLowerCase();

        // Lost item — handle "lost" specifically for the demo
        if (t.includes('lost')) {
            return 'lost_item';
        }

        // Timing/Schedule — "when", "timing", "schedule", "time"
        const timingKeywords = ['when', 'timing', 'schedule', 'time', 'next bus'];
        if (timingKeywords.some(kw => t.includes(kw))) {
            return 'bus_timing';
        }

        // Route comparison — "should I", "or", "which bus", "better", "versus"
        const comparisonKeywords = ['should i', 'which bus', 'or bus', 'versus', 'vs', 'better', 'crowded', 'compare'];
        if (comparisonKeywords.some(kw => t.includes(kw))) {
            return 'route_comparison';
        }

        return 'general';
    };

    // ---------- Build Comparison Card Message ----------
    const buildComparisonMessage = () => {
        // Pull live data from ROUTES if available
        let busA = { name: '12B', dest: 'Tambaram', wait: 'Now', crowd: 38, crowdLabel: 'Crowded', crowdColor: 'text-red-400', crowdBg: 'bg-red-500/10 border-red-500/20' };
        let busB = { name: '27C', dest: 'Thiruvanmiyur', wait: '5 min', crowd: 8, crowdLabel: 'Comfortable ✅', crowdColor: 'text-emerald-400', crowdBg: 'bg-emerald-500/10 border-emerald-500/20' };

        if (typeof ROUTES !== 'undefined') {
            const r1 = ROUTES[0];
            const r2 = ROUTES[1];
            if (r1 && r1.stops.length > 0) {
                const avgCrowd1 = Math.round(r1.stops.reduce((s, x) => s + (x.waitingCount || 0), 0) / r1.stops.length);
                busA = { name: r1.number, dest: r1.name.split('–')[1]?.trim() || r1.name, wait: 'Now', crowd: avgCrowd1, crowdLabel: avgCrowd1 > 25 ? 'Crowded' : 'Comfortable ✅', crowdColor: avgCrowd1 > 25 ? 'text-red-400' : 'text-emerald-400', crowdBg: avgCrowd1 > 25 ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20' };
            }
            if (r2 && r2.stops.length > 0) {
                const avgCrowd2 = Math.round(r2.stops.reduce((s, x) => s + (x.waitingCount || 0), 0) / r2.stops.length);
                busB = { name: r2.number, dest: r2.name.split('–')[1]?.trim() || r2.name, wait: `${Math.floor(Math.random() * 4) + 3} min`, crowd: avgCrowd2, crowdLabel: avgCrowd2 > 25 ? 'Crowded' : 'Comfortable ✅', crowdColor: avgCrowd2 > 25 ? 'text-red-400' : 'text-emerald-400', crowdBg: avgCrowd2 > 25 ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20' };
            }
        }
        const recommended = busA.crowd <= busB.crowd ? busA : busB;
        return { type: 'comparison', busA, busB, recommended };
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        const inputSnapshot = input;
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const intent = detectIntent(inputSnapshot);

            if (intent === 'lost_item') {
                const isRed = inputSnapshot.toLowerCase().includes('red');
                const aiResponse = {
                    id: Date.now() + 1,
                    text: isRed 
                        ? "Checking Depot Vision Logs... \n\nMATCH FOUND! 🎯\nYour Red Tupperware Box was recovered on Bus 12B. \n\nStatus: Secured at Depot.\nPlease collect it using Reference ID: #RX-782."
                        : "I can help with that! Please describe the item and the bus route. \n\n(Demo Tip: Type 'I lost my red box' to see the AI Vision matching in action!)",
                    sender: 'ai'
                };
                setMessages(prev => [...prev, aiResponse]);

            } else if (intent === 'bus_timing') {
                const aiResponse = {
                    id: Date.now() + 1,
                    text: "Checking live schedules... 🕒\n\n• Bus 12B: 2 mins (Approaching Koyambedu)\n• Bus 27C: 8 mins (Scheduled)\n• Bus 47D: 15 mins (Delayed by traffic)\n\nIs there a specific route you'd like me to track?",
                    sender: 'ai'
                };
                setMessages(prev => [...prev, aiResponse]);

            } else if (intent === 'route_comparison') {
                const cardData = buildComparisonMessage();
                const aiResponse = {
                    id: Date.now() + 1,
                    type: 'comparison_card',
                    cardData,
                    sender: 'ai'
                };
                setMessages(prev => [...prev, aiResponse]);

            } else {
                const aiText = await window.callGemini(inputSnapshot, messages);
                setMessages(prev => [...prev, { id: Date.now() + 1, text: aiText, sender: 'ai' }]);
            }

        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: "Sorry, I'm having trouble connecting to the Nexus brain right now. Please check if the API key is configured.",
                sender: 'ai'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const ComparisonCard = ({ cardData }) => {
        const { busA, busB, recommended } = cardData;
        return (
            <div className="w-full mt-1">
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-3">🧠 Smart Route Analysis</p>

                {/* Bus A */}
                <div className={`p-3 rounded-xl border mb-2 ${busA.name === recommended.name ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-black rounded-full border border-blue-500/20">Bus {busA.name}</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{busA.dest}</span>
                        </div>
                        {busA.name === recommended.name && <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Recommended</span>}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <p className="text-[9px] text-slate-400 uppercase font-bold">Departs</p>
                            <p className="text-sm font-black text-white">{busA.wait}</p>
                        </div>
                        <div className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border ${busA.crowdBg}`}>
                            <span>👤</span>
                            <span className={`text-sm font-black ${busA.crowdColor}`}>{busA.crowd}</span>
                            <span className={`text-[10px] font-bold ${busA.crowdColor}`}>{busA.crowdLabel}</span>
                        </div>
                    </div>
                </div>

                {/* Bus B */}
                <div className={`p-3 rounded-xl border mb-3 ${busB.name === recommended.name ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] font-black rounded-full border border-purple-500/20">Bus {busB.name}</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{busB.dest}</span>
                        </div>
                        {busB.name === recommended.name && <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Recommended</span>}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <p className="text-[9px] text-slate-400 uppercase font-bold">Departs</p>
                            <p className="text-sm font-black text-white">{busB.wait}</p>
                        </div>
                        <div className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border ${busB.crowdBg}`}>
                            <span>👤</span>
                            <span className={`text-sm font-black ${busB.crowdColor}`}>{busB.crowd}</span>
                            <span className={`text-[10px] font-bold ${busB.crowdColor}`}>{busB.crowdLabel}</span>
                        </div>
                    </div>
                </div>

                {/* Decision */}
                <div className="p-3 bg-indigo-600/10 border border-indigo-500/30 rounded-xl">
                    <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">💡 Nexus Recommendation</p>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                        {recommended.name === busA.name
                            ? `Take Bus ${busA.name} — it's departing now and has a reasonable crowd.`
                            : `Wait ${busB.wait} for Bus ${busB.name}. You'll get a comfortable seat with far fewer people on board.`
                        }
                    </p>
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] w-[380px] h-[580px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-slide-up transition-colors duration-500">
            {/* Header */}
            <div className="bg-[#1E3A8A] dark:bg-blue-950 p-4 text-white flex items-center justify-between transition-colors shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Icon name="bot" size="text-xl" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Nexus Decision Assistant</h3>
                        <p className="text-[10px] text-blue-200 dark:text-blue-400 uppercase tracking-widest font-bold transition-colors">AI-Powered • Live Data</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Icon name="x" size="text-sm" />
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950 custom-scrollbar transition-colors">
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] p-3 rounded-2xl text-sm transition-all duration-300 ${m.sender === 'user'
                            ? 'bg-indigo-600 dark:bg-indigo-700 text-white rounded-br-none shadow-md shadow-indigo-500/10'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700 rounded-bl-none w-full'
                            }`}>
                            {m.type === 'comparison_card'
                                ? <ComparisonCard cardData={m.cardData} />
                                : <span style={{ whiteSpace: 'pre-line' }}>{m.text}</span>
                            }
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 rounded-bl-none transition-colors">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Prompts */}
            <div className="px-4 pt-2 pb-1 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto shrink-0 transition-colors">
                {['Which bus is less crowded?', 'Lost item help', 'Next bus timing'].map((prompt) => (
                    <button
                        key={prompt}
                        onClick={() => setInput(prompt)}
                        className="shrink-0 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[10px] font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
                    >
                        {prompt}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors shrink-0">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Which bus should I take?"
                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="w-10 h-10 bg-indigo-600 dark:bg-indigo-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-black/20 hover:bg-indigo-700 dark:hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-50"
                    >
                        <Icon name="send" size="text-sm" />
                    </button>
                </div>
            </div>
        </div>
    );
}

window.AIChat = AIChat;

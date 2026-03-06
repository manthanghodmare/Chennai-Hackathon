function AIChat({ isOpen, onClose }) {
    const [messages, setMessages] = React.useState([
        { id: 1, text: "Hello! I'm your Nexus Mobility assistant. How can I help you today?", sender: 'ai' }
    ]);
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const scrollRef = React.useRef(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Call the real Gemini API via our utility
            const aiText = await window.callGemini(input, messages);

            const aiResponse = {
                id: Date.now() + 1,
                text: aiText,
                sender: 'ai'
            };

            setMessages(prev => [...prev, aiResponse]);
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

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-[#1E3A8A] p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Icon name="bot" size="text-xl" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Nexus Assistant</h3>
                        <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">AI Powered</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Icon name="x" size="text-sm" />
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar">
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.sender === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'
                            }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 rounded-bl-none">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 bg-white">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about routes or schedules..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
                    >
                        <Icon name="send" size="text-sm" />
                    </button>
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-3">Nexus Assistant can help with navigation and transit info.</p>
            </div>
        </div>
    );
}

window.AIChat = AIChat;

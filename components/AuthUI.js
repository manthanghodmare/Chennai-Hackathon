function AccessGuard({ role, children, redirectUrl }) {
    const { user } = Auth.useAuth();

    React.useEffect(() => {
        if (!user || user.role !== role) {
            // Optional: redirect logic could go here, but we render the blocked UI instead
        }
    }, [user, role]);

    if (!user || user.role !== role) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Icon name="shield-alert" size="text-3xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Restricted</h1>
                    <p className="text-slate-500 mb-8">You need to be logged in as a <strong>{role}</strong> to view this portal.</p>
                    
                    <a 
                        href="index.html"
                        className="block w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all mb-3"
                    >
                        Go to Login Page
                    </a>
                    
                    <a href="index.html" className="text-slate-400 hover:text-slate-600 text-sm font-medium">
                        Return to Login
                    </a>
                </div>
            </div>
        );
    }

    return children;
}
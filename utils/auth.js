const Auth = {
    KEY: 'ct_auth_user',

    login: async (role, email, password) => {
        try {
            const { auth, isMockMode } = window.firebaseApp;
            let user;

            if (isMockMode) {
                console.log("Mock Login Success for:", email);
                user = {
                    role,
                    name: email.split('@')[0],
                    email: email,
                    id: 'mock-uid-' + Date.now()
                };
            } else {
                const result = await auth.signInWithEmailAndPassword(email, password);
                user = {
                    role,
                    name: result.user.displayName || email.split('@')[0],
                    email: result.user.email,
                    id: result.user.uid
                };
            }

            localStorage.setItem(Auth.KEY, JSON.stringify(user));
            window.dispatchEvent(new Event('auth-change'));
            return user;
        } catch (error) {
            console.error("Auth Error:", error);
            throw error;
        }
    },

    logout: async () => {
        try {
            const { auth } = window.firebaseApp;
            await auth.signOut();
            localStorage.removeItem(Auth.KEY);
            window.dispatchEvent(new Event('auth-change'));
        } catch (error) {
            console.error("Logout Error:", error);
        }
    },

    getUser: () => {
        try {
            return JSON.parse(localStorage.getItem(Auth.KEY));
        } catch (e) {
            return null;
        }
    },

    // React Hook for Auth
    useAuth: () => {
        const [user, setUser] = React.useState(Auth.getUser());

        React.useEffect(() => {
            const { auth } = window.firebaseApp;

            // Listen for Firebase Auth state changes
            const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
                if (!firebaseUser && !window.firebaseApp.isMockMode) {
                    localStorage.removeItem(Auth.KEY);
                    setUser(null);
                }
            });

            const handleAuthChange = () => setUser(Auth.getUser());
            window.addEventListener('auth-change', handleAuthChange);

            return () => {
                unsubscribe();
                window.removeEventListener('auth-change', handleAuthChange);
            };
        }, []);

        return { user, login: Auth.login, logout: Auth.logout };
    }
};
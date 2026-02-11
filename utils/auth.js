const Auth = {
    KEY: 'ct_auth_user',

    login: (role, name) => {
        const user = { role, name, id: Date.now() };
        localStorage.setItem(Auth.KEY, JSON.stringify(user));
        // Dispatch custom event for cross-component updates
        window.dispatchEvent(new Event('auth-change'));
        return user;
    },

    logout: () => {
        localStorage.removeItem(Auth.KEY);
        window.dispatchEvent(new Event('auth-change'));
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
            const handleAuthChange = () => setUser(Auth.getUser());
            window.addEventListener('auth-change', handleAuthChange);

            // Listen for changes in other tabs
            const handleStorageChange = (e) => {
                if (e.key === Auth.KEY) setUser(Auth.getUser());
            };
            window.addEventListener('storage', handleStorageChange);

            return () => {
                window.removeEventListener('auth-change', handleAuthChange);
                window.removeEventListener('storage', handleStorageChange);
            };
        }, []);

        return { user, login: Auth.login, logout: Auth.logout };
    }
};
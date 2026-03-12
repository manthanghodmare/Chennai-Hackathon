const AppContext = React.createContext();

const useAppContext = () => {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

// Simple translation helper
const t = (key, lang = 'en') => {
    return window.translations?.[lang]?.[key] || window.translations?.['en']?.[key] || key;
};

window.t = t;
// Firebase Configuration
// Replace these placeholders with your actual project credentials from the Firebase Console
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const isMockMode = firebaseConfig.apiKey === "YOUR_API_KEY" || !firebaseConfig.apiKey;

let auth, db;

if (!isMockMode) {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        auth = firebase.auth();
        db = firebase.firestore();
    } catch (e) {
        console.warn("Firebase Init failed, falling back to mock mode:", e);
        auth = {
            signInWithEmailAndPassword: async () => ({ user: { email: "demo@nexus.com", uid: "mock-uid" } }),
            signOut: async () => { },
            onAuthStateChanged: (cb) => { cb({ email: "demo@nexus.com" }); return () => { }; }
        };
        db = {
            collection: () => ({
                onSnapshot: (cb) => { cb({ docs: [] }); return () => { }; },
                add: async () => ({ id: 'mock-id' }),
                doc: () => ({ update: async () => { } })
            })
        };
    }
} else {
    console.log("NEXUS: Running in MOCK MODE (Placeholder API Keys detected)");

    // Reactive Mock DB using localStorage to sync across tabs
    const getMockData = (collection) => {
        const data = localStorage.getItem(`mock_db_${collection}`);
        return data ? JSON.parse(data) : (collection === 'vehicles' ? (window.VEHICLES || []) : []);
    };

    const saveMockData = (collection, data) => {
        localStorage.setItem(`mock_db_${collection}`, JSON.stringify(data));
        // Trigger a custom event for local reactivity
        window.dispatchEvent(new CustomEvent('mock-db-update', { detail: { collection } }));
    };

    auth = {
        signInWithEmailAndPassword: async () => ({ user: { email: "demo@nexus.com", uid: "mock-uid" } }),
        signOut: async () => { },
        onAuthStateChanged: (cb) => {
            const localUser = JSON.parse(localStorage.getItem('ct_auth_user'));
            cb(localUser ? { email: localUser.email, uid: localUser.id } : null);
            return () => { };
        }
    };

    db = {
        collection: (name) => ({
            onSnapshot: (cb) => {
                const handler = () => {
                    const data = getMockData(name);
                    cb({
                        docs: data.map(v => ({
                            id: v.id,
                            data: () => v
                        })),
                        forEach: (callback) => data.forEach(v => callback({ id: v.id, data: () => v }))
                    });
                };
                window.addEventListener('mock-db-update', (e) => {
                    if (e.detail.collection === name) handler();
                });
                // Also listen for storage events from other tabs
                window.addEventListener('storage', (e) => {
                    if (e.key === `mock_db_${name}`) handler();
                });
                handler(); // Initial call
                return () => {
                    window.removeEventListener('mock-db-update', handler);
                    window.removeEventListener('storage', handler);
                };
            },
            get: async () => {
                const data = getMockData(name);
                return {
                    docs: data.map(v => ({ id: v.id, data: () => v })),
                    forEach: (callback) => data.forEach(v => callback({ id: v.id, data: () => v }))
                };
            },
            add: async (data) => {
                const collection = getMockData(name);
                const newItem = { ...data, id: 'v' + (collection.length + 1) };
                saveMockData(name, [...collection, newItem]);
                return { id: newItem.id };
            },
            doc: (id) => ({
                set: async (data, options) => {
                    const collection = getMockData(name);
                    const index = collection.findIndex(item => item.id === id);
                    if (index > -1) {
                        if (options?.merge) {
                            collection[index] = { ...collection[index], ...data };
                        } else {
                            collection[index] = { ...data, id };
                        }
                    } else {
                        collection.push({ ...data, id });
                    }
                    saveMockData(name, collection);
                },
                update: async (data) => {
                    const collection = getMockData(name);
                    const index = collection.findIndex(item => item.id === id);
                    if (index > -1) {
                        collection[index] = { ...collection[index], ...data };
                        saveMockData(name, collection);
                    }
                },
                delete: async () => {
                    const collection = getMockData(name);
                    const newCollection = collection.filter(item => item.id !== id);
                    saveMockData(name, newCollection);
                },
                onSnapshot: (cb) => {
                    const handler = () => {
                        const collection = getMockData(name);
                        const item = collection.find(i => i.id === id);
                        cb({
                            exists: !!item,
                            data: () => item || {},
                            id: id
                        });
                    };
                    window.addEventListener('mock-db-update', (e) => {
                        if (e.detail.collection === name) handler();
                    });
                    window.addEventListener('storage', (e) => {
                        if (e.key === `mock_db_${name}`) handler();
                    });
                    handler();
                    return () => {
                        window.removeEventListener('mock-db-update', handler);
                        window.removeEventListener('storage', handler);
                    };
                }
            })
        }),
        FieldValue: { serverTimestamp: () => new Date() }
    };
}

// Export for use in other files
window.firebaseApp = { auth, db, isMockMode };

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
    auth = {
        signInWithEmailAndPassword: async () => ({ user: { email: "demo@nexus.com", uid: "mock-uid" } }),
        signOut: async () => { },
        onAuthStateChanged: (cb) => {
            // In mock mode, we'll simulate a logged-in user if they are in localStorage
            const localUser = JSON.parse(localStorage.getItem('ct_auth_user'));
            cb(localUser ? { email: localUser.email, uid: localUser.id } : null);
            return () => { };
        }
    };
    db = {
        collection: (name) => ({
            onSnapshot: (cb) => {
                const data = window.VEHICLES || [];
                cb({ docs: data.map(v => ({ id: v.id, data: () => v })) });
                return () => { };
            },
            add: async (data) => {
                console.log(`Mock DB Add (${name}):`, data);
                return { id: 'mock-' + Math.random().toString(36).substr(2, 9) };
            },
            doc: (id) => ({
                update: async (data) => console.log(`Mock DB Update (${name}/${id}):`, data),
                onSnapshot: (cb) => { cb({ data: () => ({}) }); return () => { }; }
            })
        }),
        FieldValue: { serverTimestamp: () => new Date() }
    };
}

// Export for use in other files
window.firebaseApp = { auth, db, isMockMode };

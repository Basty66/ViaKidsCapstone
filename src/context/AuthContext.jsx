import { createContext, useContext, useState, useEffect } from 'react';

const AUTH_VERSION = 'v3';
const TOKEN_KEY = `viakids_token_${AUTH_VERSION}`;
const ROLE_KEY = `viakids_role_${AUTH_VERSION}`;
const NAME_KEY = `viakids_name_${AUTH_VERSION}`;
const SPLASH_KEY = 'viakids_splash_seen';

const cleanOldStorage = () => {
    const oldKeys = ['token', 'userRole', 'userName', 'viakids_token_v2', 'viakids_role_v2', 'viakids_name_v2'];
    oldKeys.forEach(k => localStorage.removeItem(k));
};

const AuthContext = createContext(null);

export const getStorageKeys = () => ({ TOKEN_KEY, ROLE_KEY, NAME_KEY });

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cleanOldStorage();

        const token = localStorage.getItem(TOKEN_KEY);
        const role = localStorage.getItem(ROLE_KEY);
        const name = localStorage.getItem(NAME_KEY);

        if (token && role) {
            setUser({ token, role, name: name || role });
        } else {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(ROLE_KEY);
            localStorage.removeItem(NAME_KEY);
        }

        setLoading(false);
    }, []);

    const login = (userData) => {
        localStorage.setItem(TOKEN_KEY, userData.token);
        localStorage.setItem(ROLE_KEY, userData.role);
        if (userData.name) localStorage.setItem(NAME_KEY, userData.name);
        setUser({ token: userData.token, role: userData.role, name: userData.name || userData.role });
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROLE_KEY);
        localStorage.removeItem(NAME_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const hasSeenSplash = () => localStorage.getItem(SPLASH_KEY) === 'true';

export const markSplashSeen = () => localStorage.setItem(SPLASH_KEY, 'true');

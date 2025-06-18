// src/components/debug/AuthDebugWrapper.jsx - Solo para desarrollo
import React from 'react';
import { useApp } from '../../context/AppContext';

const AuthDebugWrapper = ({ children }) => {
    const { user, actions } = useApp();

    // Solo mostrar en desarrollo
    if (process.env.NODE_ENV !== 'development') {
        return children;
    }

    const debugInfo = {
        isAuthenticated: user.isAuthenticated,
        hasToken: !!localStorage.getItem('authToken'),
        hasRefreshToken: !!localStorage.getItem('refreshToken'),
        hasUserData: !!localStorage.getItem('userData'),
        userName: user.nombre,
        userEmail: user.email
    };

    const handleForceLogin = () => {
        // Simular login para debugging
        localStorage.setItem('authToken', 'debug-token-' + Date.now());
        localStorage.setItem('refreshToken', 'debug-refresh-' + Date.now());

        actions.setUser({
            id: 1,
            nombre: 'Usuario Debug',
            email: 'debug@cue.edu.co',
            rol: 'administrador'
        });
    };

    const handleForceLogout = () => {
        actions.logout();
    };

    return (
        <>
            {children}

            {/* Panel de debug flotante */}
            <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-lg text-xs z-50 max-w-xs">
                <div className="font-bold mb-2">🔧 Auth Debug</div>

                <div className="space-y-1">
                    <div>Auth: {debugInfo.isAuthenticated ? '✅' : '❌'}</div>
                    <div>Token: {debugInfo.hasToken ? '✅' : '❌'}</div>
                    <div>User: {debugInfo.userName || 'None'}</div>
                </div>

                <div className="mt-3 space-x-2">
                    <button
                        onClick={handleForceLogin}
                        className="bg-green-600 px-2 py-1 rounded text-xs"
                    >
                        Force Login
                    </button>
                    <button
                        onClick={handleForceLogout}
                        className="bg-red-600 px-2 py-1 rounded text-xs"
                    >
                        Force Logout
                    </button>
                </div>

                <div className="mt-2 text-xs opacity-75">
                    <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
            </div>
        </>
    );
};

export default AuthDebugWrapper;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useApp();
    const location = useLocation();

    // Debug en consola
    React.useEffect(() => {
        console.log('🛡️ ProtectedRoute Check:', {
            isAuthenticated: user.isAuthenticated,
            hasToken: !!localStorage.getItem('authToken'),
            currentPath: location.pathname,
            userState: user
        });
    }, [user, location]);

    // Debug visual solo en desarrollo
    if (process.env.NODE_ENV === 'development') {
        const isAuth = user.isAuthenticated;
        const hasToken = !!localStorage.getItem('authToken');

        return (
            <div>
                {/* Panel de debug en la parte superior */}
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    background: isAuth ? 'green' : 'red',
                    color: 'white',
                    padding: '5px 10px',
                    zIndex: 9999,
                    fontSize: '12px',
                    textAlign: 'center'
                }}>
                    🛡️ ProtectedRoute: Auth={isAuth ? 'YES' : 'NO'} | Token={hasToken ? 'YES' : 'NO'} | Path={location.pathname}
                </div>

                {/* Contenido con padding para el debug */}
                <div style={{ paddingTop: '30px' }}>
                    {!isAuth ? (
                        <Navigate to="/login" state={{ from: location }} replace />
                    ) : (
                        children
                    )}
                </div>
            </div>
        );
    }

    // Versión de producción
    if (!user.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
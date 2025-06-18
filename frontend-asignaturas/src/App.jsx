import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Toaster } from 'react-hot-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Contextos
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';

// Componentes principales
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/validacion/ErrorBoundary';

// Páginas (lazy loading)
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Asignaturas = React.lazy(() => import('./pages/Asignaturas'));
const Pensum = React.lazy(() => import('./pages/Pensum'));
const Horarios = React.lazy(() => import('./pages/Horarios'));
const Configuracion = React.lazy(() => import('./pages/Configuracion'));
const Login = React.lazy(() => import('./pages/Login'));

// Configuración de React Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
            staleTime: 5 * 60 * 1000, // 5 minutos
            cacheTime: 10 * 60 * 1000, // 10 minutos
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 1,
        },
    },
});

// Componente de carga para Suspense
const SuspenseLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="lg" />
    </div>
);

function App() {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <AppProvider>
                        <DndProvider backend={HTML5Backend}>
                            <Router>
                                <div className="App min-h-screen bg-gray-50">
                                    <Suspense fallback={<SuspenseLoader />}>
                                        <Routes>
                                            {/* Ruta de login */}
                                            <Route path="/login" element={<Login />} />

                                            {/* Rutas protegidas */}
                                            <Route path="/*" element={
                                                <ProtectedRoute>
                                                    <Layout>
                                                        <Routes>
                                                            {/* Ruta principal - Dashboard */}
                                                            <Route path="/" element={<Dashboard />} />

                                                            {/* Módulo de Asignaturas */}
                                                            <Route path="/asignaturas/*" element={<Asignaturas />} />

                                                            {/* Módulo de Pensum */}
                                                            <Route path="/pensum/*" element={<Pensum />} />

                                                            {/* Módulo de Horarios */}
                                                            <Route path="/horarios/*" element={<Horarios />} />

                                                            {/* Configuración */}
                                                            <Route path="/configuracion" element={<Configuracion />} />

                                                            {/* Redirección para rutas no encontradas */}
                                                            <Route path="*" element={<Navigate to="/" replace />} />
                                                        </Routes>
                                                    </Layout>
                                                </ProtectedRoute>
                                            } />
                                        </Routes>
                                    </Suspense>

                                    {/* Notificaciones Toast */}
                                    <Toaster
                                        position="top-right"
                                        toastOptions={{
                                            duration: 4000,
                                            style: {
                                                background: '#363636',
                                                color: '#fff',
                                            },
                                            success: {
                                                duration: 3000,
                                                iconTheme: {
                                                    primary: '#22c55e',
                                                    secondary: '#fff',
                                                },
                                            },
                                            error: {
                                                duration: 5000,
                                                iconTheme: {
                                                    primary: '#ef4444',
                                                    secondary: '#fff',
                                                },
                                            },
                                        }}
                                    />

                                    {/* React Query DevTools en desarrollo */}
                                    {process.env.NODE_ENV === 'development' && (
                                        <ReactQueryDevtools initialIsOpen={false} />
                                    )}
                                </div>
                            </Router>
                        </DndProvider>
                    </AppProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    );
}

export default App;
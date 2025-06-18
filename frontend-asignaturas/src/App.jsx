import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
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
            retry: 2,
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
        },
    },
});

// Loading component
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
                                            {/* Login route */}
                                            <Route path="/login" element={<Login />} />

                                            {/* Protected routes */}
                                            <Route path="/*" element={
                                                <ProtectedRoute>
                                                    <Layout>
                                                        <Routes>
                                                            <Route path="/" element={<Dashboard />} />
                                                            <Route path="/asignaturas/*" element={<Asignaturas />} />
                                                            <Route path="/pensum/*" element={<Pensum />} />
                                                            <Route path="/horarios/*" element={<Horarios />} />
                                                            <Route path="/configuracion" element={<Configuracion />} />
                                                            <Route path="*" element={<Navigate to="/" replace />} />
                                                        </Routes>
                                                    </Layout>
                                                </ProtectedRoute>
                                            } />
                                        </Routes>
                                    </Suspense>

                                    {/* Toast notifications */}
                                    <Toaster
                                        position="top-right"
                                        toastOptions={{
                                            duration: 4000,
                                            style: {
                                                background: '#363636',
                                                color: '#fff',
                                            },
                                        }}
                                    />
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
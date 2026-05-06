import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/templates/AuthLayout';
import { LoginForm } from '../components/organisms/LoginForm';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (loading) return;
        if (user && !hasRedirected.current) {
            hasRedirected.current = true;
            const routes = {
                admin: '/admin',
                parent: '/parent',
                driver: '/driver',
            };
            navigate(routes[user.role] || '/', { replace: true });
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-300 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Cargando ViaKids...</p>
                </div>
            </div>
        );
    }

    if (user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-300 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Redirigiendo a tu panel...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthLayout
            title="Bienvenido de vuelta"
            subtitle="Inicia sesión para acceder a tu panel"
        >
            <LoginForm />
        </AuthLayout>
    );
};
